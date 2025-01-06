"use client";
import { RestaurantFull } from "@/lib/db/restaurants";
import { Restaurant } from "@prisma/client";
import Link from "next/link";
import { defaults as defaultControls } from "ol/control";
import { primaryAction, touchOnly } from "ol/events/condition";
import Point from "ol/geom/Point";
import { Feature, Map, MapBrowserEvent, Overlay, View } from "ol/index.js";
import { Tile as TileLayer } from "ol/layer.js";
import VectorLayer from "ol/layer/Vector";
import "ol/ol.css";
import { useGeographic } from "ol/proj.js";
import { Cluster, OSM } from "ol/source.js";
import VectorSource from "ol/source/Vector";
import { Fill, Icon, Stroke, Style, Text } from "ol/style";
import CircleStyle from "ol/style/Circle";
import { useEffect, useRef, useState } from "react";
import StarInput from "../inputs/star-input.component";
import styles from "./big-map-view.module.scss";

type Props = {
  data: RestaurantFull[];
};

const BigMapView = ({ data }: Props) => {
  useGeographic();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<Map | null>(null);
  const vectorSource = useRef(new VectorSource());
  const popupOverlayRef = useRef<Overlay | null>(null);
  const [popupContent, setPopupContent] = useState<RestaurantFull | null>(null);

  const defaultCenter = [21.009993, 52.220656]; // Fallback coordinates - Gmach Główny PW
  const markerStyle = new Style({
    image: new Icon({
      src: "location-pin-icon.svg",
      scale: 0.35,
      anchor: [0, 0],
    }),
  });

  const getNewCenter = () => {
    return data[0]?.address
      ? [Number(data[0].address.xCoords), Number(data[0].address.yCoords)]
      : defaultCenter;
  };

  const redirectToRestaurant = (slug: Restaurant["slug"]) => {
    window.location.href = `/restaurant/${slug}`;
  };

  const displayPopup = (
    restaurant: RestaurantFull,
    event: MapBrowserEvent<any>
  ) => {
    setPopupContent(restaurant);
    const coordinate = event.coordinate;
    popupOverlayRef.current?.setPosition(coordinate);
    if (popupRef.current) popupRef.current.style.display = "block";
  };

  const hidePopup = () => {
    setPopupContent(null);
    popupOverlayRef.current?.setPosition(undefined);
    if (popupRef.current) popupRef.current.style.display = "none";
  };

  const styleFunction = (feature: any) => {
    const size = feature.get("features").length as number;
    if (size === 1) {
      return markerStyle;
    }

    return new Style({
      image: new CircleStyle({
        radius: Math.min(size * 5, 20),
        fill: new Fill({
          color: "rgba(198, 41, 41, 0.95)",
        }),
        stroke: new Stroke({
          color: "rgba(215, 19, 19, 0.5)",
          width: 6,
        }),
      }),
      text: new Text({
        text: size.toString(),
        font: "12px Chivo",
        fill: new Fill({ color: "#fff" }),
        stroke: new Stroke({ color: "#000", width: 1 }),
      }),
    });
  };

  const handlePointerMove = (event: MapBrowserEvent<any>) => {
    if (touchOnly(event)) return;

    const feature = mapInstance.current?.forEachFeatureAtPixel(
      event.pixel,
      (feature) => feature
    );
    if (feature) {
      const features = feature.get("features");
      if (features && features.length === 1) {
        const restaurant = features[0].get("restaurant");
        if (restaurant) {
          displayPopup(restaurant, event);
        }
      }
    } else {
      hidePopup();
    }
  };

  const handleSingleClick = (event: MapBrowserEvent<any>) => {
    if (!primaryAction(event)) return;

    const feature = mapInstance.current?.forEachFeatureAtPixel(
      event.pixel,
      (feature) => feature
    );
    if (feature) {
      const features = feature.get("features");
      if (features.length === 1) {
        const restaurant = features[0].get("restaurant");
        touchOnly(event)
          ? displayPopup(restaurant, event)
          : redirectToRestaurant(restaurant.slug);
      } else {
        const view = mapInstance.current?.getView();
        const featurePoint = feature.getGeometry() as Point;
        view?.animate({
          center: featurePoint.getCoordinates(),
          zoom: view.getZoom()! + 1,
          duration: 250,
        });
      }
    } else {
      hidePopup();
    }
  };

  const handleDblClick = (event: MapBrowserEvent<any>) => {
    if (!touchOnly(event)) return;

    const feature = mapInstance.current?.forEachFeatureAtPixel(
      event.pixel,
      (feature) => feature
    );
    if (feature) {
      const features = feature.get("features");
      if (features.length === 1) {
        const restaurant = features[0].get("restaurant");
        redirectToRestaurant(restaurant.slug);
      }
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstance.current) {
      const clusterSource = new Cluster({
        distance: 30,
        source: vectorSource.current,
      });

      mapInstance.current = new Map({
        view: new View({
          center: getNewCenter(),
          zoom: 16,
          rotation: 0,
        }),
        layers: [
          new TileLayer({ source: new OSM() }),
          new VectorLayer({ source: clusterSource, style: styleFunction }),
        ],
        controls: defaultControls({
          zoom: true,
          attribution: true,
          rotate: false,
        }),
      });
      const popupOverlay = new Overlay({
        element: popupRef.current!,
        offset: [5, 10],
      });
      mapInstance.current.addOverlay(popupOverlay);
      popupOverlayRef.current = popupOverlay;
      mapInstance.current.setTarget(mapRef.current);
    }

    mapInstance.current.on("pointermove", handlePointerMove);
    mapInstance.current.on("singleclick", handleSingleClick);
    mapInstance.current.on("dblclick", handleDblClick);

    return () => {
      if (!mapInstance.current) return;
      mapInstance.current?.un("pointermove", handlePointerMove);
      mapInstance.current?.un("singleclick", handleSingleClick);
      mapInstance.current?.un("dblclick", handleDblClick);
      mapInstance.current.dispose();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;
    vectorSource.current.clear();

    // Add new restaurant markers
    const markers: Feature<Point>[] = [];
    data.forEach((restaurant) => {
      if (restaurant.address) {
        const place = [
          Number(restaurant.address?.xCoords),
          Number(restaurant.address?.yCoords),
        ];
        const point = new Point(place);
        const marker = new Feature({ geometry: point });
        marker.setStyle(markerStyle);
        marker.set("restaurant", restaurant);
        markers.push(marker);
      }
    });
    vectorSource.current.addFeatures(markers);

    // Adjust the map view
    const view = mapInstance.current.getView();
    view.setCenter(getNewCenter());
    view.setZoom(16);
  }, [data]);

  return (
    <div className={styles.container}>
      <div className={styles.map} ref={mapRef} />
      <div ref={popupRef} className={styles.popup} style={{ display: "none" }}>
        {popupContent && (
          <Link href={`/restaurant/${popupContent.slug}`}>
            <div className={`${styles.container}`}>
              <h3 className={styles.name}>{popupContent.name}</h3>
              {popupContent.averageStars && (
                <div className={styles.stars}>
                  <StarInput
                    max={5}
                    value={popupContent.averageStars}
                    starSize="12pt"
                    disabled
                  />
                </div>
              )}
              <span className={styles.address}>
                {popupContent.address?.name}
              </span>
              {popupContent.averageAmountSpent && (
                <span className={styles.price}>
                  Średnia cena:{" "}
                  <b>
                    {popupContent.averageAmountSpent.toFixed(2)}
                    &nbsp;zł
                  </b>
                </span>
              )}
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default BigMapView;
