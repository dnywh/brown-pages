import { useParams } from "react-router-dom";

export default function Chat() {
  const { id } = useParams(); // Get host ID from the route

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Chat with Host {id}</h1>
      {/* Implement your chat UI here */}
    </div>
  );
}
