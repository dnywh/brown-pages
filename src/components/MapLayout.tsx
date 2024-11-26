import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Map from "./Map";
import ListingDetails from "./ListingDetails";
import { Listing } from "../types/Listing";

export default function MapLayout() {
  const { id: listingId } = useParams(); // Extract the listingId from the route
  const navigate = useNavigate(); // Navigate to different routes
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null); // Track selected listing
  const [listings, setlistings] = useState<Listing[]>([]); // Store list of listings
  const listingsRef = useRef<Listing[]>([]); // Persist listings across re-renders

  // Fetch listings only once and update selectedListing based on listingId
  useEffect(() => {
    if (listingsRef.current.length === 0) {
      fetch("/data/listings.json")
        .then((response) => response.json())
        .then((data: Listing[]) => {
          listingsRef.current = data; // Cache listings
          setlistings(data);
          if (listingId) {
            const foundListing = data.find(
              (listing) => listing.id === listingId
            );
            setSelectedListing(foundListing || null);
          }
        })
        .catch((err) => console.error("Failed to load listings.json:", err));
    } else if (listingId) {
      const foundListing = listingsRef.current.find(
        (listing) => listing.id === listingId
      );
      setSelectedListing(foundListing || null);
    }
  }, [listingId]);

  // Handle closing of ListingDetails
  const handleCloseListingDetails = () => {
    setSelectedListing(null); // Deselect the listing
    navigate("/"); // Update the URL to root without affecting map position
  };

  return (
    <div className="flex gap-4 h-full">
      {/* Map Section */}
      <div className="grow">
        <Map
          onSelectListing={(listing) => {
            setSelectedListing(listing);
            navigate(`/listing/${listing.id}`); // Update the URL when a listing is selected
          }}
          centerOnListing={selectedListing}
          listings={listings} // Pass listings to the Map component
        />
      </div>

      {/* ListingDetails Section */}

      <ListingDetails
        listing={selectedListing}
        onClose={handleCloseListingDetails} // Close the listing details and reset the URL
      />
    </div>
  );
}
