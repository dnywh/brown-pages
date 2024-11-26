import { useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { Listing } from "../types/Listing";

interface MapProps {
  onSelectListing: (listing: Listing) => void; // Callback to update the selected listing
  centerOnListing?: Listing | null; // Optional listing to center the map on
  listings: Listing[]; // Array of listings passed from the parent
}

export default function Map({
  onSelectListing,
  centerOnListing,
  listings,
}: MapProps): JSX.Element {
  const navigate = useNavigate(); // React Router navigation hook
  const mapContainer = useRef<HTMLDivElement | null>(null); // Map container ref
  const map = useRef<maptilersdk.Map | null>(null); // Map instance ref
  const markers = useRef<maptilersdk.Marker[]>([]); // Keep track of markers
  const lastCenteredListingRef = useRef<Listing | null>(null); // Store the last centered listing
  const defaultCenter = { lng: 139.753, lat: 35.6844 }; // Default map center
  const defaultZoom = 11; // Default zoom level

  // Configure MapTiler API key
  maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY as string;

  // Function to handle pin clicks
  const handlePinClick = (listing: Listing) => {
    navigate(`/listing/${listing.id}`); // Update the URL
    onSelectListing(listing); // Notify parent component of the selected listing
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

    // Add markers for listings
    listings.forEach((listing) => {
      const marker = new maptilersdk.Marker({ color: "#451900" })
        .setLngLat([listing.longitude, listing.latitude])
        .addTo(map.current!);

      // Attach click event listener to the marker's DOM element
      marker.getElement().addEventListener("click", () => {
        handlePinClick(listing); // Trigger pin click handling logic
      });

      markers.current.push(marker); // Store the marker reference
    });
  }, [listings]);

  useEffect(() => {
    if (centerOnListing && map.current) {
      // Only center if it's a new listing
      if (
        !lastCenteredListingRef.current ||
        lastCenteredListingRef.current.id !== centerOnListing.id
      ) {
        lastCenteredListingRef.current = centerOnListing; // Update the last centered listing
        map.current.flyTo({
          center: [centerOnListing.longitude, centerOnListing.latitude],
          zoom: 14, // Adjust zoom level if needed
          speed: 1.5, // Animation speed
        });
      }
    }
  }, [centerOnListing]);

  return (
    <div className="relative w-full h-full md:rounded-xl overflow-hidden">
      <div ref={mapContainer} className="absolute w-full h-full" />
    </div>
  );
}
