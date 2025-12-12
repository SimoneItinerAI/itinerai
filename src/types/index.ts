export interface User {
  id: string;
  email: string;
  name: string;
  preferences?: UserPreferences;
  created_at: string;
  last_login?: string;
}

export interface UserPreferences {
  travel_styles: Record<string, unknown>;
  interests: string[];
  budget_ranges: Record<string, unknown>;
  has_kids: boolean;
  reduced_mobility: boolean;
}

export interface Itinerary {
  id: string;
  user_id: string;
  destination: string;
  start_date: string;
  end_date: string;
  travelers_count: number;
  travelers_type: string;
  budget: 'economico' | 'medio' | 'comfort';
  pace: 'tranquillo' | 'equilibrato' | 'intenso';
  interests: string[];
  constraints: Record<string, unknown>;
  itinerary_data: ItineraryData;
  status: 'draft' | 'generating' | 'generated' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface ItineraryData {
  proposals: ItineraryProposal[];
  confidence_score: number;
  generation_time: number;
}

export interface ItineraryProposal {
  id: string;
  title: string;
  description: string;
  compatibility_score: number;
  estimated_budget: number;
  duration: number;
  days: ItineraryDay[];
}

export interface ItineraryDay {
  day: number;
  date: string;
  activities: Activity[];
  restaurants: Restaurant[];
  accommodation?: Accommodation;
  notes: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  start_time: string;
  end_time: string;
  location: Location;
  category: string;
  price?: number;
  booking_url?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner';
  time: string;
  location: Location;
  price_range: string;
  booking_url?: string;
}

export interface Accommodation {
  id: string;
  name: string;
  type: string;
  location: Location;
  price_per_night: number;
  booking_url: string;
}

export interface Location {
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface TravelPreferences {
  destination: string;
  startDate: string;
  endDate: string;
  travelersCount: number;
  travelersType: string;
  budget: 'economico' | 'medio' | 'comfort';
  pace: 'tranquillo' | 'equilibrato' | 'intenso';
  interests: string[];
  hasKids: boolean;
  reducedMobility: boolean;
  existingAccommodation?: string;
  existingTransport?: string;
  notes?: string;
}
