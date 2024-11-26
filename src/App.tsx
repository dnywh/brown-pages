import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import TabBar from "./components/TabBar";
import Chats from "./components/Chats";
import Account from "./components/Account";
import MapLayout from "./components/MapLayout";

function App() {
  return (
    <Router>
      <main className="p-4 flex gap-4 w-dvw h-dvh">
        {/* Shared header */}
        <header>
          <h1 className="font-bold">BP</h1>
          <TabBar onCloseHostDetails={() => null} />
        </header>
        {/* Tab content */}
        <div className="grow">
          <Routes>
            {/* Map-related routes */}
            <Route path="/" element={<MapLayout />} />
            <Route path="/host/:id" element={<MapRoute />} />
            {/* Other routes */}
            <Route path="/chats" element={<Chats />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </div>
      </main>
    </Router>
  );
}

// Wrapper component to extract `hostId` from the URL
function MapRoute() {
  const { id: hostId } = useParams();
  return <MapLayout hostId={hostId} />;
}

export default App;
