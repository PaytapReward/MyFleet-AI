export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  dateOfBirth: string;
  phone?: string;
  address?: string;
  userId: string;
  createdAt: string;
  assignedVehicles: string[];
}

export interface AddDriverFormData {
  name: string;
  licenseNumber: string;
  dateOfBirth: string;
  phone?: string;
}