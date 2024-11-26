import { NavLink, useLocation } from "react-router-dom";

interface TabBarProps {
  context: string;
  onCloseListingDetails: () => void; // Callback to close listing details
}

export default function TabBar({
  context,
  onCloseListingDetails,
}: TabBarProps) {
  const location = useLocation();

  if (context === "md") {
    return (
      <header className="hidden md:block">
        <nav className="flex flex-col">
          <h1 className="font-bold">BP</h1>
          <NavLink
            to="/"
            className={() =>
              `flex flex-col ${
                location.pathname === "/" ||
                location.pathname.startsWith("/listing/")
                  ? "font-bold text-black"
                  : ""
              }`
            }
            onClick={onCloseListingDetails} // Close listing details when 'Map' is clicked
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
      </header>
    );
  }

  return (
    <nav className="md:hidden fixed bottom-0 w-dvw h-16 bg-white/50 backdrop-blur-md z-10 flex">
      <NavLink
        to="/"
        className={() =>
          `flex grow flex-col ${
            location.pathname === "/" ||
            location.pathname.startsWith("/listing/")
              ? "font-bold text-black"
              : ""
          }`
        }
        onClick={onCloseListingDetails} // Close listing details when 'Map' is clicked
      >
        <span className="text-xs">Map</span>
      </NavLink>
      <NavLink
        to="/chats"
        className={({ isActive }) =>
          `flex grow flex-col ${isActive ? "font-bold text-black" : ""}`
        }
      >
        <span className="text-xs">Chats</span>
      </NavLink>
      <NavLink
        to="/account"
        className={({ isActive }) =>
          `flex grow flex-col ${isActive ? "font-bold text-black" : ""}`
        }
      >
        <span className="text-xs">Account</span>
      </NavLink>
    </nav>
  );
}
