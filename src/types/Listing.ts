export interface Listing {
  id: string;
  type: "private" | "public" | "business"; // Adjust based on your category names
  name: string; // For public/business listings
  owner: string;
  latitude: number;
  longitude: number;
  locationName: string;
  lastActive: string;
  details: string;
  accepted: string[];
  notAccepted: string[];
}
