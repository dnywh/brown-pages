export interface Host {
  id: string;
  name: string;
  lastActive: string;
  locationName: string;
  latitude: number; // Use optional fields where not always required
  longitude: number;
  details: string;
  accepted: string[]; // Array of accepted items
  notAccepted: string[]; // Array of not accepted items
}
