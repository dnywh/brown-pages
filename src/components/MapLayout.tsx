import { useEffect } from "react";
import Map from "./Map";
import HostDetails from "./HostDetails";
import { useState } from "react";
import { Host } from "../types/Host";

interface MapLayoutProps {
  hostId?: string; // Optional host ID for /host/:id
}

export default function MapLayout({ hostId }: MapLayoutProps) {
  const [selectedHost, setSelectedHost] = useState<Host | null>(null);

  useEffect(() => {
    if (hostId) {
      // Fetch or find the host data by `hostId`
      fetch(`/data/hosts.json`)
        .then((response) => response.json())
        .then((hosts: Host[]) => {
          const foundHost = hosts.find((host) => host.id === hostId);
          if (foundHost) {
            setSelectedHost(foundHost);
          }
        })
        .catch((err) => console.error("Failed to load hosts.json:", err));
    }
  }, [hostId]); // Run this effect when `hostId` changes

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
