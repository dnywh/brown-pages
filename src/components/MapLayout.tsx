import Map from "./Map";
import HostDetails from "./HostDetails";
import { useState } from "react";
import { Host } from "../types/Host";

interface MapLayoutProps {
  hostId?: string; // Optional host ID for /host/:id
}

export default function MapLayout({ hostId }: MapLayoutProps) {
  const [selectedHost, setSelectedHost] = useState<Host | null>(null);

  // Optionally handle logic for `hostId` (e.g., pre-selecting a host based on URL)
  if (hostId && !selectedHost) {
    // Fetch or select the host by `hostId` (mock implementation)
    console.log(`Fetch or select host with ID: ${hostId}`);
    // setSelectedHost(...); // Uncomment if necessary
  }

  return (
    <div className="flex gap-4 h-full">
      {/* Map takes up remaining space */}
      <div className="grow">
        <Map
          onSelectHost={(host) => setSelectedHost(host)}
          centerOnHost={selectedHost}
        />
      </div>
      {/* HostDetails pane aligned to the right */}
      <div className="w-96">
        <HostDetails
          host={selectedHost}
          onClose={() => setSelectedHost(null)}
        />
      </div>
    </div>
  );
}
