import Map from "./components/Map.tsx";
import HostDetails from "./components/HostDetails.tsx";
import { Host } from "./types/Host";
import { useState } from "react";
import "./App.css";

function App() {
  const [selectedHost, setSelectedHost] = useState<Host | null>(null); // Explicitly type it as Host | null

  return (
    <>
      <main className="p-4 flex gap-4 w-dvw h-dvh">
        <header>
          <h1 className="font-bold">BP</h1>
        </header>

        <div className="grow">
          <Map onSelectHost={setSelectedHost} />
        </div>
        <div className="min-w-80">Host details show here</div>
        {selectedHost && (
          <HostDetails
            host={selectedHost}
            onClose={() => setSelectedHost(null)}
          />
        )}
      </main>
    </>
  );
}

export default App;
