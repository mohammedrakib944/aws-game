import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css"; // OpenLayers styles
import "ol-geocoder/dist/ol-geocoder.min.css"; // Geocoder styles
import { Map, View } from "ol";
import { Tile as TileLayer } from "ol/layer";
import { OSM } from "ol/source";
import Geocoder from "ol-geocoder";
import { fromLonLat, toLonLat } from "ol/proj";
import { Overlay } from "ol";
import { useGameContext } from "../context/game-context";

function MapView() {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const { setLocation, setLoadingLocation } = useGameContext();

  useEffect(() => {
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([0, 0]), // Center of the map [longitude, latitude]
        zoom: 2,
      }),
    });

    // Create a marker element
    const marker = document.createElement("div");
    marker.className = "marker";
    markerRef.current = new Overlay({
      element: marker,
      positioning: "center-center",
    });
    map.addOverlay(markerRef.current);

    // Add the geocoder
    const geocoder = new Geocoder("nominatim", {
      provider: "osm",
      lang: "en",
      placeholder: "Search for a place...",
      limit: 5,
      debug: false,
      autoComplete: true,
      keepOpen: true,
    });
    map.addControl(geocoder);

    // Handle geocoder search results
    geocoder.on("addresschosen", (event) => {
      const { coordinate, address } = event;
      map.getView().animate({ center: coordinate, zoom: 10 });
      markerRef.current.setPosition(coordinate);

      // Set the location name in state
      setLocation(address.details.name || address.formatted);
    });

    map.on("singleclick", async (event) => {
      setLoadingLocation(true); // Start loading
      const coordinates = toLonLat(event.coordinate); // Convert map projection to lon/lat
      const [lon, lat] = coordinates;

      // Reverse Geocoding API Call
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lon=${lon}&lat=${lat}`
        );
        const data = await response.json();

        // Extract and display location name
        if (data && data.display_name) {
          setLocation(data.display_name);
          markerRef.current.setPosition(event.coordinate);
        }
      } catch (error) {
        console.error("Error fetching location:", error);
        setLocation("Failed to fetch location");
      } finally {
        setLoadingLocation(false);
      }
    });

    return () => {
      map.setTarget(null);
    };
    console.log("HI");
  }, []);

  return (
    <div>
      <div
        ref={mapRef}
        style={{
          width: "100vw",
          height: "70vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: "0",
        }}
      ></div>

      <style>{`
        .marker {
          width: 12px;
          height: 12px;
          background-color: red;
          border-radius: 50%;
          border: 2px solid white;
        }
      `}</style>
    </div>
  );
}

export default MapView;
