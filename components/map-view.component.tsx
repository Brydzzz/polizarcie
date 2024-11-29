"use client";
import { defaults as defaultControls } from "ol/control";
import { Point } from "ol/geom";
import { Feature, Map, View } from "ol/index.js";
import { Tile as TileLayer } from "ol/layer.js";
import VectorLayer from "ol/layer/Vector";
import "ol/ol.css";
import { useGeographic } from "ol/proj.js";
import { OSM } from "ol/source.js";
import VectorSource from "ol/source/Vector";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import { useEffect, useRef } from "react";
import styles from "./map-view.module.scss";

type Props = {
  X_coord: number;
  Y_coord: number;
};

const MapView = ({ X_coord, Y_coord }: Props) => {
  useGeographic();
  const mapRef = useRef<HTMLDivElement | null>(null);

  const place = [X_coord, Y_coord];
  const point = new Point(place);
  const marker = new Feature({ geometry: point });
  marker.setStyle(
    new Style({
      image: new CircleStyle({
        radius: 10,
        fill: new Fill({
          color: "rgba(255, 0, 0, 0.5)",
        }),
        stroke: new Stroke({
          color: "red",
          width: 4,
        }),
      }),
    })
  );

  useEffect(() => {
    if (!mapRef.current) return;

    const mapObj = new Map({
      view: new View({
        center: place,
        zoom: 18,
      }),
      layers: [
        new TileLayer({ source: new OSM() }),
        new VectorLayer({
          source: new VectorSource({
            features: [marker],
          }),
        }),
      ],
      controls: defaultControls({
        zoom: true, // Enable zoom controls
        attribution: true, // Disable attribution control
        rotate: true, // Enable rotation control
      }),
    });

    mapObj.setTarget(mapRef.current);

    return () => mapObj.setTarget("");
  });

  return <div className={styles.map} ref={mapRef} />;
};

export default MapView;
