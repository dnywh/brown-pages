import { useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { Host } from "../types/Host";

interface MapProps {
  onSelectHost: (host: Host) => void; // Callback to update the selected host
  centerOnHost?: Host | null; // Optional host to center the map on
  hosts: Host[]; // Array of hosts passed from the parent
}

export default function Map({
  onSelectHost,
  centerOnHost,
  hosts,
}: MapProps): JSX.Element {
  const navigate = useNavigate(); // React Router navigation hook
  const mapContainer = useRef<HTMLDivElement | null>(null); // Map container ref
  const map = useRef<maptilersdk.Map | null>(null); // Map instance ref
  const markers = useRef<maptilersdk.Marker[]>([]); // Keep track of markers
  const defaultCenter = { lng: 139.753, lat: 35.6844 }; // Default map center
  const defaultZoom = 11; // Default zoom level

  // Configure MapTiler API key
  maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY as string;

  // Function to handle pin clicks
  const handlePinClick = (host: Host) => {
    navigate(`/host/${host.id}`); // Update the URL
    onSelectHost(host); // Notify parent component of the selected host
  };

  useEffect(() => {
    // Initialize the map if it hasn't been already
    if (map.current || !mapContainer.current) return;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [defaultCenter.lng, defaultCenter.lat],
      zoom: defaultZoom,
    });
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Add markers for hosts
    hosts.forEach((host) => {
      const marker = new maptilersdk.Marker({ color: "#451900" })
        .setLngLat([host.longitude, host.latitude])
        .addTo(map.current!);

      // Attach click event listener to the marker's DOM element
      marker.getElement().addEventListener("click", () => {
        handlePinClick(host); // Trigger pin click handling logic
      });

      markers.current.push(marker); // Store the marker reference
    });
  }, [hosts]);

  // Center the map on the selected host when `centerOnHost` changes
  useEffect(() => {
    if (centerOnHost && map.current) {
      map.current.flyTo({
        center: [centerOnHost.longitude, centerOnHost.latitude],
        zoom: 14, // Adjust zoom level if needed
        speed: 1.5, // Animation speed
      });
    }
  }, [centerOnHost]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <div ref={mapContainer} className="absolute w-full h-full" />
    </div>
  );
}
