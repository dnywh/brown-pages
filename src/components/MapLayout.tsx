import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Map from "./Map";
import ListingDetails from "./ListingDetails";
import { Listing } from "../types/Listing";

export default function MapLayout() {
  const { id } = useParams(); // Extract listing ID from the URL
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const listingsRef = useRef<Listing[]>([]);

  useEffect(() => {
    const loadAllListings = async () => {
      try {
        const listingIDs = ["listing123", "listing456", "listing321"]; // Replace with dynamic IDs

        const listingPromises = listingIDs.map((listingId) =>
          fetch(`/data/listings/${listingId}.json`).then((res) =>
            res.ok ? res.json() : null
          )
        );
        const loadedListings = (await Promise.all(listingPromises)).filter(
          (listing): listing is Listing => listing !== null
        );

        listingsRef.current = loadedListings;
        setListings(loadedListings);
      } catch (error) {
        console.error("Error loading listings:", error);
      }
    };

    loadAllListings();
  }, []);

  const selectedListing = id
    ? listingsRef.current.find((listing) => listing.id === id) || null
    : null;

  const handleSelectListing = (listing: Listing) => {
    navigate(`/listing/${listing.id}`); // Update the route when selecting a listing
  };

  const handleCloseListingDetails = () => {
    navigate("/"); // Navigate back to the default map view
  };

  return (
    <div className="flex gap-4 h-full">
      {/* Map Section */}
      <div className="grow">
        <Map
          onSelectListing={handleSelectListing} // Update URL when a listing is selected
          centerOnListing={selectedListing} // Center map on the selected listing
          listings={listings}
        />
      </div>

      {/* ListingDetails Section */}
      <ListingDetails
        listing={selectedListing}
        onClose={handleCloseListingDetails}
      />
    </div>
  );
}
