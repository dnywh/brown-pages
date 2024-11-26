import { useNavigate, useParams } from "react-router-dom";
import { useRef, useEffect } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { Listing } from "../types/Listing";

interface MapProps {
  onSelectListing: (listing: Listing) => void;
  centerOnListing?: Listing | null;
  listings: Listing[];
}

export default function Map({
  onSelectListing,
  centerOnListing,
  listings,
}: MapProps): JSX.Element {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const markers = useRef<maptilersdk.Marker[]>([]);
  const lastCenteredListingRef = useRef<Listing | null>(null);
  const defaultCenter = { lng: 139.753, lat: 35.6844 };
  const defaultZoom = 11;

  maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY as string;

  const selectedListing = id
    ? listings.find((listing) => listing.id === id) || null
    : null;

  const handlePinClick = (listing: Listing) => {
    if (id !== listing.id) {
      console.log("Navigating to:", listing.id); // Log the listing ID being navigated to
      navigate(`/listing/${listing.id}`); // Prevent duplicate navigation
    }
    onSelectListing(listing);
  };

  useEffect(() => {
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

    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    listings.forEach((listing) => {
      const marker = new maptilersdk.Marker({ color: "#451900" })
        .setLngLat([listing.longitude, listing.latitude])
        .addTo(map.current!);

      marker.getElement().addEventListener("click", () => {
        handlePinClick(listing);
      });

      markers.current.push(marker);
    });
  }, [listings]);

  useEffect(() => {
    const targetListing = selectedListing || centerOnListing;

    if (targetListing && map.current) {
      console.log("Centering on listing:", targetListing.id); // Log the target listing
      if (
        !lastCenteredListingRef.current ||
        lastCenteredListingRef.current.id !== targetListing.id
      ) {
        lastCenteredListingRef.current = targetListing;
        map.current.flyTo({
          center: [targetListing.longitude, targetListing.latitude],
          zoom: 14,
          speed: 1.5,
        });
      }
    }
  }, [selectedListing, centerOnListing]);

  return (
    <div className="relative w-full h-full md:rounded-xl overflow-hidden">
      <div ref={mapContainer} className="absolute w-full h-full" />
    </div>
  );
}
