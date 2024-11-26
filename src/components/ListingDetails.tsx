import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Listing } from "../types/Listing";

interface ListingDetailsProps {
  listing: Listing | null;
  onClose: () => void;
}

// function getListingName(listing: Listing) {
//   if (listing.type === "private") {
//     return `${listing.owner.firstName} ${listing.owner.lastName.slice(0, 1)}`;
//   }
//   return listing.name;
// }

export default function ListingDetails({
  listing,
  onClose,
}: ListingDetailsProps) {
  const navigate = useNavigate();
  const [ownerName, setOwnerName] = useState<string>("");

  useEffect(() => {
    if (listing?.owner) {
      fetch(`/data/users/${listing.owner}.json`)
        .then((response) => response.json())
        .then((user) =>
          setOwnerName(`${user.name.firstName} ${user.name.lastName}`)
        )
        .catch((err) => console.error("Failed to load owner data:", err));
    }
  }, [listing]);

  if (!listing) {
    return (
      <div className="hidden md:flex bg-gray-50 p-4 rounded-xl items-center justify-center">
        <div className="text-center text-gray-500">
          <h2 className="text-lg font-semibold">Select a listing on the map</h2>
          <p className="mt-2">The profile will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 p-4 fixed top-0 left-0 w-full h-full overflow-y-auto">
      <button
        onClick={onClose}
        className="absolute p-4 top-2 right-2 text-gray-500 hover:text-black"
      >
        Close
      </button>
      {/* <h2 className="text-2xl font-bold">{getListingName(listing)}</h2> */}
      <h2 className="text-2xl font-bold">Listing name</h2>
      <p className="text-gray-700">{listing.locationName}</p>
      <p className="text-gray-700">{ownerName}</p>
      <p className="text-gray-700">{listing.lastActive}</p>

      <h3 className="text-xl font-semibold mb-2 mt-4">About</h3>
      <p className="text-gray-700 mb-4">{listing.details}</p>

      <button
        onClick={() => navigate(`/chat/${listing.id}`)}
        className="px-4 py-2 bg-green-500 text-white rounded-lg"
      >
        Contact
      </button>
    </div>
  );
}
