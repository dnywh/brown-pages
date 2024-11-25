export interface Host {
  id: string;
  name: string;
  latitude?: number; // Use optional fields where not always required
  longitude?: number;
  details: string;
}
