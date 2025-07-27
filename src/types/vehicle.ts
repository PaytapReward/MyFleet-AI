export interface Vehicle {
  id: string;
  number: string;
  model: string;
  payTapBalance: number;
  fastTagLinked: boolean;
  driver: string | null;
  lastService: string;
  gpsLinked: boolean;
  challans: number;
  documents: {
    pollution: { status: 'uploaded' | 'missing' | 'expired', expiryDate?: string };
    registration: { status: 'uploaded' | 'missing' | 'expired', expiryDate?: string };
    insurance: { status: 'uploaded' | 'missing' | 'expired', expiryDate?: string };
    license: { status: 'uploaded' | 'missing' | 'expired', expiryDate?: string };
  };
  userId: string;
}

export interface AddVehicleFormData {
  number: string;
  model: string;
  payTapActivationCode: string;
}