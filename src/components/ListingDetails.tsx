import { useNavigate } from "react-router-dom";
import { Listing } from "../types/Listing";

interface ListingDetailsProps {
  listing: Listing | null; // Use the Listing interface
  onClose: () => void;
}

// Function to get the display name of the listing
function getListingName(listing: Listing) {
  if (listing.type === "private") {
    // return `${listing.owner.firstName} ${listing.owner.lastName.slice(0, 1)}.`;
    return `Private User ${listing.id}`;
  } else {
    return listing.name;
  }
}

const findExistingChat = async (userID: string, listingID: string) => {
  const chatFiles = ["/data/chats/chat123.json", "/data/chats/chat456.json"]; // Replace with dynamic generation or an automated list

  try {
    // Fetch and check each chat file
    for (const file of chatFiles) {
      const response = await fetch(file);
      if (!response.ok) continue; // Skip if fetch fails

      const chat = await response.json();

      // Match chat by participants and listingID
      if (chat.listingID === listingID && chat.participants.includes(userID)) {
        return chat; // Return the matching chat
      }
    }
    return null; // No matching chat found
  } catch (error) {
    console.error("Error finding existing chat:", error);
    return null;
  }
};

const createNewChat = async (userID: string, listingID: string) => {
  const newChat = {
    id: `chat${Date.now()}`, // Generate a unique chat ID
    listingID,
    participants: [userID, listingID], // Include the listingID for context
    lastMessage: "",
    lastUpdated: new Date().toISOString(),
  };

  try {
    // Simulate saving the chat (local storage workaround for local dev)
    await fetch(`/data/chats/${newChat.id}.json`, {
      method: "POST", // Or a mock server handling POST
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newChat),
    });

    return newChat;
  } catch (error) {
    console.error("Error creating new chat:", error);
    throw error;
  }
};

export default function ListingDetails({
  listing,
  onClose,
}: ListingDetailsProps) {
  const navigate = useNavigate();

  // Handle the close action for the details panel
  const handleClose = () => {
    onClose(); // Clear the selected listing
    navigate("/"); // Change the route
  };

  // Render a placeholder if no listing is selected
  if (!listing) {
    return (
      <div
        className="hidden md:flex bg-gray-50 p-4 rounded-xl 
          md:static md:w-96 md:h-full md:overflow-y-auto items-center justify-center"
      >
        <div className="text-center text-gray-500">
          <h2 className="text-lg font-semibold">Select a listing on the map</h2>
          <p className="mt-2">The profile will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-slate-100 p-4
        fixed top-0 left-0 w-full pb-16 md:pb-0 md:static md:w-96 md:rounded-xl h-full overflow-y-auto"
    >
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute p-4 top-2 right-2 text-gray-500 hover:text-black"
      >
        Close
      </button>

      {/* Listing Name */}
      <h2 className="text-2xl font-bold">{getListingName(listing)}</h2>

      {/* Location Name */}
      <p className="text-gray-700">{listing.locationName}</p>

      {/* Last Active */}
      <p className="text-gray-700">{listing.lastActive}</p>

      {/* About Section */}
      <h3 className="text-xl font-semibold mb-2 mt-4">About</h3>
      <p className="text-gray-700 mb-4">{listing.details}</p>

      {/* Contact Button */}
      <div className="bg-white p-4 flex rounded-2xl">
        <button
          onClick={async () => {
            try {
              // Check if a chat already exists
              const existingChat = await findExistingChat(
                "user000",
                listing.id
              ); // Replace "user000" with the logged-in user ID
              if (existingChat) {
                navigate(`/chat/${existingChat.id}`);
              } else {
                // Create a new chat
                const newChat = await createNewChat("user000", listing.id); // Replace "user000" with the logged-in user ID
                navigate(`/chat/${newChat.id}`);
              }
            } catch (error) {
              console.error("Failed to navigate to chat:", error);
            }
          }}
          className="px-4 py-2 bg-green-500 text-white rounded-lg"
        >
          Contact {getListingName(listing)}
        </button>
      </div>

      {/* Accepted Items */}
      <div>
        <h3 className="text-xl font-semibold mb-2 mt-4">Accepted Items</h3>
        <ul className="list-disc marker:text-green-500 list-inside text-gray-700 mb-4 divide-y">
          {listing.accepted.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Not Accepted Items */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Not Accepted Items</h3>
        <ul className="list-disc marker:text-red-500 list-inside text-gray-700 divide-y">
          {listing.notAccepted.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
