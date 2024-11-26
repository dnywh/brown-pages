import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

interface Message {
  id: string; // Unique message ID
  sender: string; // "user" or "host"
  text: string;
  timestamp: string;
}

interface Host {
  id: string;
  name: string;
}

export default function Chat() {
  const { id } = useParams(); // Chat ID from the route
  const [messages, setMessages] = useState<Message[]>([]); // Chat history
  const [recipientName, setRecipientName] = useState<string>(""); // Host's name
  const [newMessage, setNewMessage] = useState(""); // Message composer

  useEffect(() => {
    // Fetch the recipient's name from hosts.json
    const fetchRecipientName = async () => {
      try {
        const response = await fetch("/data/hosts.json");
        if (!response.ok) {
          throw new Error("Failed to fetch hosts.json");
        }
        const hosts: Host[] = await response.json();
        const recipient = hosts.find((host) => host.id === id);
        if (recipient) {
          setRecipientName(recipient.name);
        } else {
          setRecipientName("Unknown Host");
        }
      } catch (error) {
        console.error("Error fetching recipient name:", error);
        setRecipientName("Error");
      }
    };

    fetchRecipientName();
  }, [id]);

  useEffect(() => {
    // Fetch chat messages for this conversation
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/data/chats/${id}.json`);
        if (!response.ok) {
          throw new Error(`Failed to fetch messages for chat ID: ${id}`);
        }
        const chatHistory = await response.json();
        setMessages(chatHistory);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [id]);

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: newMessage,
      timestamp: new Date().toLocaleString(),
    };

    // Optimistically update the chat history
    setMessages((prevMessages) => [...prevMessages, message]);
    setNewMessage("");

    // Simulate saving to the backend
    fetch(`/data/chats/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    }).catch((err) => console.error("Failed to send message:", err));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Chat with {recipientName}</h2>
      <div className="flex flex-col h-full">
        {/* Message list */}
        <div className="flex-1 overflow-y-auto border p-4 rounded-lg mb-4">
          {messages.length === 0 ? (
            <p>No messages yet. Start the conversation!</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-2 p-2 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-blue-100 self-end text-right"
                    : "bg-gray-100 self-start text-left"
                }`}
              >
                <p>{msg.text}</p>
                <small className="text-gray-500 text-xs">{msg.timestamp}</small>
              </div>
            ))
          )}
        </div>

        {/* Message composer */}
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
