import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

interface Message {
  id: string;
  sender: string; // User or listing ID
  text: string;
  timestamp: string;
}

interface Chat {
  id: string;
  listingID: string;
  participants: string[];
}

interface User {
  id: string;
  name: {
    firstName: string;
    lastName: string;
  };
}

interface Listing {
  id: string;
  name: string;
}

export default function Chat() {
  const { id } = useParams(); // Extract chat ID from the route
  const [messages, setMessages] = useState<Message[]>([]);
  const [users] = useState<{ [key: string]: User }>({});
  const [listing] = useState<Listing | null>(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        // Fetch messages
        const messagesResponse = await fetch(`/data/chats/${id}/messages.json`);
        console.log("Messages Response:", messagesResponse); // Log response
        if (!messagesResponse.ok) {
          throw new Error(`HTTP error! status: ${messagesResponse.status}`);
        }
        const contentType = messagesResponse.headers.get("Content-Type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(`Expected JSON but got ${contentType}`);
        }

        const messagesData: Message[] = await messagesResponse.json();
        console.log("Fetched Messages Data:", messagesData); // Debugging
        setMessages(messagesData);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchChatData();
  }, [id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const newMsg: Message = {
      id: `msg${Date.now()}`,
      sender: "user000", // Replace with the logged-in user's ID
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    // Optimistically update the UI
    setMessages((prevMessages) => [...prevMessages, newMsg]);
    setNewMessage("");

    try {
      // Append the new message to the messages.json file
      await fetch(`/data/chats/${id}/messages.json`, {
        method: "POST", // Use a mock or adapt for local development
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMsg),
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        Chat with {listing?.name || "Unknown Listing"}
      </h2>
      <div className="flex flex-col h-full">
        {/* Message List */}
        <div className="flex-1 overflow-y-auto border p-4 rounded-lg mb-4">
          {messages.length === 0 ? (
            <p>No messages yet. Start the conversation!</p>
          ) : (
            messages.map((msg) => {
              const senderName =
                users[msg.sender]?.name?.firstName || "Unknown";
              return (
                <div
                  key={msg.id}
                  className={`mb-2 p-2 rounded-lg ${
                    msg.sender === "user000" // Replace with the logged-in user's ID
                      ? "bg-blue-100 self-end text-right"
                      : "bg-gray-100 self-start text-left"
                  }`}
                >
                  <p>
                    <strong>{senderName}</strong>: {msg.text}
                  </p>
                  <small className="text-gray-500 text-xs">
                    {msg.timestamp}
                  </small>
                </div>
              );
            })
          )}
        </div>

        {/* Message Composer */}
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg"
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
