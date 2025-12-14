export type BudgetLevel = 'low' | 'medium' | 'high';
export type Pace = 'relaxed' | 'balanced' | 'intense';
export type TravelersType = 'solo' | 'couple' | 'family' | 'friends' | 'other';

export type ItineraryItemType =
  | 'activity'
  | 'meal'
  | 'tour'
  | 'experience'
  | 'flight'
  | 'transfer'
  | 'accommodation'
  | 'free_time';

export type ItemSourceType =
  | 'internal_poi'
  | 'external_activity'
  | 'external_flight'
  | 'external_stay'
  | 'custom';

export interface Itinerary {
  id: string;
  userId: string;
  destination: string;
  destinationRegion?: string;
  startDate: string;
  endDate: string;
  travelers: number;
  travelersType: TravelersType;
  budgetLevel: BudgetLevel;
  pace: Pace;
  interests: string[];
  notes?: string;
  createdAt: string;
}

export interface ItineraryDay {
  id: string;
  itineraryId: string;
  date: string;
  label?: string;
  order: number;
}

export interface ItineraryItem {
  id: string;
  dayId: string;
  type: ItineraryItemType;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  sourceType: ItemSourceType;
  sourceId?: string;
  externalProvider?: string;
  externalProductId?: string;
  locationName?: string;
  address?: string;
  lat?: number;
  lng?: number;
  estimatedCost?: number;
  currency?: string;
  transportMode?: 'walk' | 'public' | 'car' | 'other';
  order: number;
}
