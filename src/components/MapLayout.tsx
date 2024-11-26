import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Map from "./Map";
import ListingDetails from "./ListingDetails";
import { Listing } from "../types/Listing";

export default function MapLayout() {
  const { id } = useParams(); // Extract `id` to match the route parameter
  const navigate = useNavigate();
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const listingsRef = useRef<Listing[]>([]);

  // Fetch an individual listing
  const loadListing = async (listingId: string) => {
    try {
      const response = await fetch(`/data/listings/${listingId}.json`);
      if (!response.ok) throw new Error("Failed to fetch listing data.");
      const listing: Listing = await response.json();
      return listing;
    } catch (error) {
      console.error("Error loading listing:", error);
      return null;
    }
  };

  useEffect(() => {
    const loadAllListings = async () => {
      try {
        // Hardcoded listing IDs for local development
        const listingIDs = ["listing123", "listing456", "listing321"];

        // Fetch all listings
        const listingPromises = listingIDs.map(loadListing);
        const loadedListings = await Promise.all(listingPromises);

        // Filter out null values (failed fetches)
        listingsRef.current = loadedListings.filter(
          (listing): listing is Listing => listing !== null
        );
        setListings(listingsRef.current);

        // If a specific listing ID is in the route, set it as the selected listing
        if (id) {
          console.log("Listing ID from route:", id);
          const foundListing = listingsRef.current.find(
            (listing) => listing.id === id
          );
          setSelectedListing(foundListing || null);
        }
      } catch (error) {
        console.error("Error loading all listings:", error);
      }
    };

    loadAllListings();
  }, [id]);

  const handleCloseListingDetails = () => {
    setSelectedListing(null);
    navigate("/");
  };

  return (
    <div className="flex gap-4 h-full">
      {/* Map Section */}
      <div className="grow">
        <Map
          onSelectListing={(listing) => {
            setSelectedListing(listing);
            navigate(`/listing/${listing.id}`);
          }}
          centerOnListing={selectedListing}
          listings={listings} // Pass listings to the Map component
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
