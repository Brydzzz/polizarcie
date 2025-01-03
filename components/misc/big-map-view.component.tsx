"use client";
import { RestaurantFull } from "@/lib/db/restaurants";
import { defaults as defaultControls } from "ol/control";
import Point from "ol/geom/Point";
import { Feature, Map, View } from "ol/index.js";
import { Tile as TileLayer } from "ol/layer.js";
import VectorLayer from "ol/layer/Vector";
import "ol/ol.css";
import { useGeographic } from "ol/proj.js";
import { OSM } from "ol/source.js";
import VectorSource from "ol/source/Vector";
import { Icon, Style } from "ol/style";
import { useEffect, useRef } from "react";
import styles from "./big-map-view.module.scss";

type Props = {
  data: RestaurantFull[];
};

const BigMapView = ({ data }: Props) => {
  useGeographic();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<Map | null>(null);
  const vectorSource = useRef(new VectorSource());

  const iconSVG = `<svg width="60pt" aspect-ratio="1" fill="rgb(198, 41, 41)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M384 192c0 87.4-117 243-168.3 307.2c-12.3 15.3-35.1 15.3-47.4 0C117 435 0 279.4 0 192C0 86 86 0 192 0S384 86 384 192z"/></svg>`;
  const defaultCenter = [21.009993, 52.220656]; // Fallback coordinates
  const center = data[0]?.address
    ? [Number(data[0].address.xCoords), Number(data[0].address.yCoords)]
    : defaultCenter;

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstance.current) {
      mapInstance.current = new Map({
        view: new View({
          center: center,
          zoom: 16,
          rotation: 0,
        }),
        layers: [
          new TileLayer({ source: new OSM() }),
          new VectorLayer({ source: vectorSource.current }),
        ],
        controls: defaultControls({
          zoom: true,
          attribution: true,
          rotate: false,
        }),
      });

      mapInstance.current.setTarget(mapRef.current);
    }
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;

    vectorSource.current.clear();

    const markers: Feature<Point>[] = [];
    data.forEach((restaurant) => {
      if (restaurant.address) {
        const place = [
          Number(restaurant.address?.xCoords),
          Number(restaurant.address?.yCoords),
        ];
        const point = new Point(place);
        const marker = new Feature({ geometry: point });
        marker.setStyle(
          new Style({
            image: new Icon({
              src: "data:image/svg+xml;utf8," + iconSVG,
              scale: 0.35,
            }),
          })
        );
        markers.push(marker);
      }
    });
    vectorSource.current.addFeatures(markers);
    const view = mapInstance.current.getView();
    view.setCenter(center);
    view.setZoom(16);
  }),
    [data];

  return <div className={styles.map} ref={mapRef} />;
};

export default BigMapView;
