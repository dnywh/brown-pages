import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ChatPreview {
  id: string; // Chat ID
  listingName: string; // Listing name
  lastMessage: string; // Latest message
  timestamp: string; // Timestamp of the latest message
}

export default function Chats() {
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        // Fetch listings data
        const listingsResponse = await fetch("/data/listings.json");
        if (!listingsResponse.ok) {
          throw new Error(
            `Failed to fetch listings.json: ${listingsResponse.status}`
          );
        }
        const listings = await listingsResponse.json();

        // Filter and enrich chats with messages
        const chatPreviews: ChatPreview[] = [];

        for (const listing of listings) {
          try {
            // Attempt to fetch the chat file for this listing
            const chatResponse = await fetch(`/data/chats/${listing.id}.json`);
            if (!chatResponse.ok) continue; // Skip if no chat exists for this listing

            const chatMessages = await chatResponse.json();

            // Use the latest message from the chat
            const latestMessage = chatMessages[chatMessages.length - 1];

            if (latestMessage) {
              chatPreviews.push({
                id: listing.id,
                listingName: listing.name,
                lastMessage: latestMessage.text,
                timestamp: latestMessage.timestamp,
              });
            }
          } catch (err) {
            console.warn(
              `No chat file found for listing ID: ${listing.id}`,
              err
            );
          }
        }

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
              <small className="text-gray-400">{chat.timestamp}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
