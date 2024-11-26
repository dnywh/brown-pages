import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ChatPreview {
  id: string;
  listingName: string;
  lastMessage: string;
  lastUpdated: string;
  participantName: string; // Name of the other participant
}

export default function Chats() {
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        // Get all chat files (for now, list them manually or mock fetching them)
        const chatIDs = ["chat123", "chat456"]; // Replace with dynamic file list later
        const chatPromises = chatIDs.map((chatID) =>
          fetch(`/data/chats/${chatID}.json`).then((res) => res.json())
        );

        const rawChats = await Promise.all(chatPromises);

        // Fetch user and listing data
        const userPromises = new Set<string>();
        const listingPromises = new Set<string>();

        rawChats.forEach((chat) => {
          chat.participants.forEach((participant) =>
            userPromises.add(participant)
          );
          if (chat.listingID) listingPromises.add(chat.listingID);
        });

        const usersData = await Promise.all(
          Array.from(userPromises).map((userID) =>
            fetch(`/data/users/${userID}.json`).then((res) => res.json())
          )
        );

        const listingsData = await Promise.all(
          Array.from(listingPromises).map((listingID) =>
            fetch(`/data/listings/${listingID}.json`).then((res) => res.json())
          )
        );

        const usersByID = Object.fromEntries(
          usersData.map((user) => [user.id, user])
        );
        const listingsByID = Object.fromEntries(
          listingsData.map((listing) => [listing.id, listing])
        );

        // Map raw chat data to ChatPreview objects
        const chatPreviews = rawChats.map((chat) => {
          const listing = listingsByID[chat.listingID];
          const otherParticipantID = chat.participants.find(
            (id) => id !== "user000"
          ); // Replace with current user ID
          const otherParticipant = usersByID[otherParticipantID];

          return {
            id: chat.id,
            listingName: listing?.name || "Unknown Listing",
            lastMessage: chat.lastMessage,
            lastUpdated: chat.lastUpdated,
            participantName:
              otherParticipant?.name?.firstName || "Unknown User",
          };
        });

        setChats(chatPreviews);
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      }
    };

    fetchChats();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Chats</h2>
      {chats.length === 0 ? (
        <p>No chats yet. Start connecting with listings!</p>
      ) : (
        <ul>
          {chats.map((chat) => (
            <li
              key={chat.id}
              className="border-b p-4 cursor-pointer hover:bg-gray-100"
              onClick={() => navigate(`/chat/${chat.id}`)} // Navigate to the chat view
            >
              <h3 className="font-semibold">{chat.listingName}</h3>
              <p className="text-gray-500 truncate">{chat.lastMessage}</p>
              <small className="text-gray-400">
                {chat.participantName} · {chat.lastUpdated}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
