import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TabBar from "./components/TabBar";
import Chats from "./components/Chats";
import Account from "./components/Account";
import MapLayout from "./components/MapLayout";
import "./App.css";

function App() {
  return (
    <Router>
      <main className="md:p-4 flex gap-4 w-dvw h-dvh">
        {/* Shared header */}
        <TabBar context="md" onCloseHostDetails={() => null} />
        {/* Tab content */}
        <div className="grow">
          <Routes>
            {/* Map-related routes */}
            <Route path="/" element={<MapLayout />} />
            <Route path="/host/:id" element={<MapLayout />} />
            {/* Other routes */}
            <Route path="/chats" element={<Chats />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </div>
      </main>

      <TabBar context="sm" onCloseHostDetails={() => null} />
    </Router>
  );
}

export default App;
