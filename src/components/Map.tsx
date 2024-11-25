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

    new maptilersdk.Marker({ color: "#FF0000" })
      .setLngLat([139.7525, 35.6846])
      .addTo(map.current);

    new maptilersdk.Marker({ color: "#FF0000" })
      .setLngLat([139.8525, 35.5846])
      .addTo(map.current);
  }, [tokyo.lng, tokyo.lat, zoom]);

  return (
    <div className="relative w-full h-[calc(100vh-77px)]">
      <div ref={mapContainer} className="absolute w-full h-full" />
    </div>
  );
}
