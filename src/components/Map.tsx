import { useRef, useEffect } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
// import "./map.css";

export default function Map(): JSX.Element {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const tokyo = { lng: 139.753, lat: 35.6844 };
  const zoom = 11;
  maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY as string;

  useEffect(() => {
    if (map.current || !mapContainer.current) return; // stops map from intializing more than once

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      // geolocate: maptilersdk.GeolocationType.POINT,
      center: [tokyo.lng, tokyo.lat],
      zoom: zoom,
    });

    // Fetch host data and add markers
    fetch("/data/hosts.json")
      .then((response) => response.json())
      .then((hosts) => {
        hosts.forEach(
          (host: {
            id: string;
            name: string;
            latitude: number;
            longitude: number;
            details: string;
          }) => {
            new maptilersdk.Marker({ color: "#FF0000" })
              .setLngLat([host.longitude, host.latitude])
              .setPopup(
                new maptilersdk.Popup().setHTML(
                  `<b>${host.name}</b><br>${host.details}`
                )
              ) // Add a popup for more details
              .addTo(map.current!);
          }
        );
      })
      .catch((err) => console.error("Failed to load hosts.json:", err));
  }, [tokyo.lng, tokyo.lat, zoom]);

  return (
    <div className="relative w-full h-[calc(100vh-77px)]">
      <div ref={mapContainer} className="absolute w-full h-full" />
    </div>
  );
}
