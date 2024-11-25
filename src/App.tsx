import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import Map from "./components/Map";
import HostDetails from "./components/HostDetails";
import { Host } from "./types/Host";
import { useState, useEffect } from "react";

function App() {
  const [selectedHost, setSelectedHost] = useState<Host | null>(null);

  // Fetch host by ID when the URL changes
  const handleRouteChange = async (id: string | undefined) => {
    if (!id) {
      setSelectedHost(null);
      return;
    }

    const response = await fetch(`/data/hosts.json`);
    const hosts: Host[] = await response.json();
    const host = hosts.find((h) => h.id === id); // Assume hosts have unique `id` properties
    setSelectedHost(host || null);
  };

  return (
    <Router>
      <main className="p-4 flex gap-4 w-dvw h-dvh">
        <header>
          <h1 className="font-bold">BP</h1>
        </header>
        <div className="grow">
          {/* Always render the map */}
          <Routes>
            <Route
              path="/*"
              element={
                <Map
                  onSelectHost={(host) => {
                    setSelectedHost(host);
                  }}
                  centerOnHost={selectedHost}
                />
              }
            />
          </Routes>
        </div>
        {/* Host details panel */}
        <Routes>
          <Route
            path="/host/:id"
            element={<HostPage onRouteChange={handleRouteChange} />}
          />
        </Routes>
        <HostDetails
          host={selectedHost}
          onClose={() => setSelectedHost(null)}
        />
      </main>
    </Router>
  );
}

function HostPage({ onRouteChange }: { onRouteChange: (id: string) => void }) {
  const { id } = useParams();

  useEffect(() => {
    onRouteChange(id); // Fetch and update the selected host
  }, [id]);

  return null; // This component doesn't render UI
}

export default App;
