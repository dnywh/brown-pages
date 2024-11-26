import { useNavigate } from "react-router-dom";
import { Host } from "../types/Host";

interface HostDetailsProps {
  host: Host | null; // Use the Host interface
  onClose: () => void;
}

export default function HostDetails({ host, onClose }: HostDetailsProps) {
  const navigate = useNavigate();

  const handleClose = () => {
    onClose(); // Clear the selected host
    navigate("/"); // Change the route
  };

  // Hide content when no host is selected
  if (!host) {
    return (
      <div
        className="hidden md:flex bg-gray-50 p-4 rounded-xl 
          md:static md:w-96 md:h-full md:overflow-y-auto items-center justify-center"
      >
        <div className="text-center text-gray-500">
          <h2 className="text-lg font-semibold">Select a host on the map</h2>
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
      <button
        onClick={handleClose}
        className="absolute p-4 top-2 right-2 text-gray-500 hover:text-black"
      >
        Close
      </button>
      <h2 className="text-2xl font-bold">{host.name}</h2>
      <p className="text-gray-700">{host.locationName}</p>
      <p className="text-gray-700">{host.lastActive}</p>

      <h3 className="text-xl font-semibold mb-2 mt-4">About</h3>
      <p className="text-gray-700 mb-4">{host.details}</p>

      <div className="bg-white p-4 flex rounded-2xl">
        <button
          onClick={() => navigate(`/chat/${host.id}`)} // Navigate to the chat view
          className="px-4 py-2 bg-green-500 text-white rounded-lg"
        >
          Contact {host.name}
        </button>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2 mt-4">Accepted Items</h3>
        <ul className="list-disc marker:text-green-500 list-inside text-gray-700 mb-4 divide-y">
          {host.accepted.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Not Accepted Items</h3>
        <ul className="list-disc marker:text-red-500 list-inside text-gray-700 divide-y">
          {host.notAccepted.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
