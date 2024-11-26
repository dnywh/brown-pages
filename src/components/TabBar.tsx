import { NavLink, useLocation } from "react-router-dom";

interface TabBarProps {
  onCloseHostDetails: () => void; // Callback to close host details
}

export default function TabBar({ onCloseHostDetails }: TabBarProps) {
  const location = useLocation();

  return (
    <nav>
      <NavLink
        to="/"
        className={() =>
          `flex flex-col ${
            location.pathname === "/" || location.pathname.startsWith("/host/")
              ? "font-bold text-black"
              : ""
          }`
        }
        onClick={onCloseHostDetails} // Close host details when 'Map' is clicked
      >
        <span className="text-xs">Map</span>
      </NavLink>
      <NavLink
        to="/chats"
        className={({ isActive }) =>
          `flex flex-col ${isActive ? "font-bold text-black" : ""}`
        }
      >
        <span className="text-xs">Chats</span>
      </NavLink>
      <NavLink
        to="/account"
        className={({ isActive }) =>
          `flex flex-col ${isActive ? "font-bold text-black" : ""}`
        }
      >
        <span className="text-xs">Account</span>
      </NavLink>
    </nav>
  );
}
