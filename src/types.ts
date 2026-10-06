export type ServiceId = 
  | 'bike' 
  | 'auto' 
  | 'cab' 
  | 'parcel' 
  | 'rent_car' 
  | 'hire_driver';

export interface ServiceItem {
  id: ServiceId;
  name: string;
  nameHindi: string;
  subtitle: string;
  subtitleHindi: string;
  icon: string;
  badge?: string;
  baseFare: string;
  tag: string;
}

export interface BookingState {
  serviceId: ServiceId | null;
  pickup: string;
  dropoff: string;
  vehicleType?: string;
  fare: number;
  status: 'idle' | 'searching' | 'confirmed' | 'in_trip' | 'completed';
  captainName?: string;
  captainPhone?: string;
  vehiclePlate?: string;
  otp?: string;
  eta?: string;
}

export interface AdminMetrics {
  totalUsers: number;
  activeCaptains: number;
  totalRides: number;
  totalEarnings: number; // in INR Lakhs/Crores
  pendingKyc: number;
  sosAlerts: number;
}

export interface CaptainRequest {
  id: string;
  name: string;
  city: string;
  service: string;
  vehicleModel: string;
  dlNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}
