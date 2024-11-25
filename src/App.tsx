import Map from "./components/Map.tsx";
import HostDetails from "./components/HostDetails.tsx";
import { Host } from "./types/Host";
import { useState } from "react";
import "./App.css";

function App() {
  const [selectedHost, setSelectedHost] = useState<Host | null>(null); // Explicitly type it as Host | null

  return (
    <>
      <h1 className="text-6xl font-bold underline bg-sky-200">Brown Pages</h1>
      <Map onSelectHost={setSelectedHost} />
      {selectedHost && (
        <HostDetails
          host={selectedHost}
          onClose={() => setSelectedHost(null)}
        />
      )}
    </>
  );
}

export default App;
