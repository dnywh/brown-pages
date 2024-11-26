import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ChatPreview {
  id: string; // Chat ID
  hostName: string; // Host name
  lastMessage: string; // Latest message
  timestamp: string; // Timestamp of the latest message
}

export default function Chats() {
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        // Fetch hosts data
        const hostsResponse = await fetch("/data/hosts.json");
        if (!hostsResponse.ok) {
          throw new Error(
            `Failed to fetch hosts.json: ${hostsResponse.status}`
          );
        }
        const hosts = await hostsResponse.json();

        // Filter and enrich chats with messages
        const chatPreviews: ChatPreview[] = [];

        for (const host of hosts) {
          try {
            // Attempt to fetch the chat file for this host
            const chatResponse = await fetch(`/data/chats/${host.id}.json`);
            if (!chatResponse.ok) continue; // Skip if no chat exists for this host

            const chatMessages = await chatResponse.json();

            // Use the latest message from the chat
            const latestMessage = chatMessages[chatMessages.length - 1];

            if (latestMessage) {
              chatPreviews.push({
                id: host.id,
                hostName: host.name,
                lastMessage: latestMessage.text,
                timestamp: latestMessage.timestamp,
              });
            }
          } catch (err) {
            console.warn(`No chat file found for host ID: ${host.id}`, err);
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
        <p>No chats yet. Start connecting with hosts!</p>
      ) : (
        <ul>
          {chats.map((chat) => (
            <li
              key={chat.id}
              className="border-b p-4 cursor-pointer hover:bg-gray-100"
              onClick={() => navigate(`/chat/${chat.id}`)} // Navigate to the chat view
            >
              <h3 className="font-semibold">{chat.hostName}</h3>
              <p className="text-gray-500 truncate">{chat.lastMessage}</p>
              <small className="text-gray-400">{chat.timestamp}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
