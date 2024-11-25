import { Host } from "../types/Host";

interface HostDetailsProps {
  host: Host; // Use the Host interface
  onClose: () => void;
}

export default function HostDetails({ host, onClose }: HostDetailsProps) {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg p-4 border-t">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-black"
      >
        Close
      </button>
      <h2 className="text-2xl font-bold">{host.name}</h2>
      <p className="text-gray-700">{host.details}</p>
    </div>
  );
}
