import { useRef, useEffect } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { Host } from "../types/Host";

interface MapProps {
  onSelectHost: (host: Host) => void;
}

export default function Map({ onSelectHost }: MapProps): JSX.Element {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const tokyo = { lng: 139.753, lat: 35.6844 };
  const zoom = 11;

  maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY as string;

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [tokyo.lng, tokyo.lat],
      zoom: zoom,
    });

    // Fetch host data and add markers
    fetch("/data/hosts.json")
      .then((response) => response.json())
      .then((hosts: Host[]) => {
        hosts.forEach((host) => {
          const marker = new maptilersdk.Marker({ color: "#FF0000" })
            .setLngLat([host.longitude, host.latitude])
            .addTo(map.current!);

          // Attach click event listener to the marker's DOM element
          marker.getElement().addEventListener("click", () => {
            console.log("Marker clicked:", host);
            onSelectHost(host);
          });
        });
      })
      .catch((err) => console.error("Failed to load hosts.json:", err));
  }, [tokyo.lng, tokyo.lat, zoom, onSelectHost]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <div ref={mapContainer} className="absolute w-full h-full" />
    </div>
  );
}
