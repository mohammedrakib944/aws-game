import { Map, Overlay, View } from "ol";
import Geocoder from "ol-geocoder";
import "ol-geocoder/dist/ol-geocoder.min.css";
import { Tile as TileLayer } from "ol/layer";
import "ol/ol.css";
import { fromLonLat, toLonLat } from "ol/proj";
import { OSM } from "ol/source";
import { useEffect, useRef } from "react";
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
        center: fromLonLat([0, 0]),
        zoom: 2,
      }),
    });

    const marker = document.createElement("div");
    marker.className = "marker";
    markerRef.current = new Overlay({
      element: marker,
      positioning: "center-center",
    });
    map.addOverlay(markerRef.current);

    const geocoder = new Geocoder("nominatim", {
      provider: "osm",
      lang: "en",
      placeholder: "Search for a country...",
      limit: 5,
      debug: false,
      autoComplete: true,
      keepOpen: true,
    });
    map.addControl(geocoder);

    // Handle geocoder results for countries only
    geocoder.on("addresschosen", (event) => {
      const { coordinate, address } = event;

      // Check if the result is a country
      if (address.details && address.details.type === "country") {
        map.getView().animate({ center: coordinate, zoom: 5 });
        markerRef.current.setPosition(coordinate);
        setLocation(address.formatted); // Set country name in state
      } else {
        alert("Please select a valid country.");
      }
    });

    // Handle map click for reverse geocoding
    map.on("singleclick", async (event) => {
      setLoadingLocation(true);
      const coordinates = toLonLat(event.coordinate);
      const [lon, lat] = coordinates;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lon=${lon}&lat=${lat}`
        );
        const data = await response.json();

        if (data && data.address && data.address.country) {
          const country = data.address.country;
          setLocation(country);
          markerRef.current.setPosition(event.coordinate);
        } else {
          alert("Please click within a valid country.");
        }
      } catch (error) {
        console.error("Error fetching country data:", error);
        setLocation("Failed to fetch country");
      } finally {
        setLoadingLocation(false);
      }
    });

    return () => {
      map.setTarget(null);
    };
  }, []);

  return (
    <>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          borderRadius: "10px",
          padding: "10px",
          overflow: "hidden",
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
    </>
  );
}

export default MapView;
