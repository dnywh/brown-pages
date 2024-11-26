import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Map from "./Map";
import HostDetails from "./HostDetails";
import { Host } from "../types/Host";

export default function MapLayout() {
  const { id: hostId } = useParams(); // Extract the hostId from the route
  const navigate = useNavigate(); // Navigate to different routes
  const [selectedHost, setSelectedHost] = useState<Host | null>(null); // Track selected host
  const [hosts, setHosts] = useState<Host[]>([]); // Store list of hosts
  const hostsRef = useRef<Host[]>([]); // Persist hosts across re-renders

  // Fetch hosts only once and update selectedHost based on hostId
  useEffect(() => {
    if (hostsRef.current.length === 0) {
      fetch("/data/hosts.json")
        .then((response) => response.json())
        .then((data: Host[]) => {
          hostsRef.current = data; // Cache hosts
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

  // Handle closing of HostDetails
  const handleCloseHostDetails = () => {
    setSelectedHost(null); // Deselect the host
    navigate("/"); // Update the URL to root without affecting map position
  };

  return (
    <div className="flex gap-4 h-full">
      {/* Map Section */}
      <div className="grow">
        <Map
          onSelectHost={(host) => {
            setSelectedHost(host);
            navigate(`/host/${host.id}`); // Update the URL when a host is selected
          }}
          centerOnHost={selectedHost}
          hosts={hosts} // Pass hosts to the Map component
        />
      </div>

      {/* HostDetails Section */}
      <div className="w-96">
        <HostDetails
          host={selectedHost}
          onClose={handleCloseHostDetails} // Close the host details and reset the URL
        />
      </div>
    </div>
  );
}
