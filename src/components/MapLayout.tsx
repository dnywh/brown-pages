import { useEffect, useState } from "react";
import Map from "./Map";
import HostDetails from "./HostDetails";
import { Host } from "../types/Host";

interface MapLayoutProps {
  hostId?: string; // Optional host ID for /host/:id
}

export default function MapLayout({ hostId }: MapLayoutProps) {
  const [selectedHost, setSelectedHost] = useState<Host | null>(null);
  const [hosts, setHosts] = useState<Host[]>([]);

  useEffect(() => {
    // Fetch host data once
    fetch("/data/hosts.json")
      .then((response) => response.json())
      .then((data: Host[]) => {
        setHosts(data);
        if (hostId) {
          const foundHost = data.find((host) => host.id === hostId);
          setSelectedHost(foundHost || null);
        }
      })
      .catch((err) => console.error("Failed to load hosts.json:", err));
  }, [hostId]);

  return (
    <div className="flex gap-4 h-full">
      {/* Map takes up remaining space */}
      <div className="grow">
        <Map
          onSelectHost={(host) => setSelectedHost(host)}
          centerOnHost={selectedHost}
          hosts={hosts} // Pass hosts data to Map component
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
