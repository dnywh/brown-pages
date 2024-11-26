import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import TabBar from "./components/TabBar";
import Map from "./components/Map";
import Chats from "./components/Chats";
import Account from "./components/Account";
import HostDetails from "./components/HostDetails";
import { Host } from "./types/Host";
import { useState, useEffect } from "react";

function App() {
  const [selectedHost, setSelectedHost] = useState<Host | null>(null);

  return (
    <Router>
      <main className="p-4 flex gap-4 w-dvw h-dvh">
        <header>
          <h1 className="font-bold">BP</h1>
          <TabBar
            onCloseHostDetails={() => setSelectedHost(null)} // Clear the selected host
          />
        </header>
        {/* Page-specific content */}
        <div className="grow flex gap-4">
          <Routes>
            {/* Map-related routes */}
            <Route
              path="/"
              element={
                <>
                  {/* Map takes up remaining space */}
                  <div className="flex-grow">
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
                </>
              }
            />
            <Route
              path="/host/:id"
              element={
                <>
                  {/* Map takes up remaining space */}
                  <div className="flex-grow">
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
                </>
              }
            />
            {/* Other routes */}
            <Route path="/chats" element={<Chats />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </div>
      </main>
    </Router>
  );
}

export default App;
