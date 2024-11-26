import { useEffect, useRef, useState } from "react";
import Map from "./Map";
import HostDetails from "./HostDetails";
import { Host } from "../types/Host";

interface MapLayoutProps {
  hostId?: string; // Optional host ID for /host/:id
}

export default function MapLayout({ hostId }: MapLayoutProps) {
  const [selectedHost, setSelectedHost] = useState<Host | null>(null);
  const [hosts, setHosts] = useState<Host[]>([]);
  const hostsRef = useRef<Host[]>([]); // Persist hosts across re-renders

  useEffect(() => {
    // Fetch hosts only once
    if (hostsRef.current.length === 0) {
      fetch("/data/hosts.json")
        .then((response) => response.json())
        .then((data: Host[]) => {
          hostsRef.current = data; // Cache the hosts
          setHosts(data);
          if (hostId) {
            const foundHost = data.find((host) => host.id === hostId);
            setSelectedHost(foundHost || null);
          }
        })
        .catch((err) => console.error("Failed to load hosts.json:", err));
    } else if (hostId) {
      const foundHost = hostsRef.current.find((host) => host.id === hostId);
      setSelectedHost(foundHost || null);
    }
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
          onClose={() => {
            setSelectedHost(null); // Clear selectedHost
          }}
        />
      </div>
    </div>
  );
}
