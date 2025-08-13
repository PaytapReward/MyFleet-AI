// Vehicle API service for fetching vehicle details
export interface VehicleApiResponse {
  number: string;
  model: string;
  make?: string;
  year?: string;
  fuelType?: string;
  registrationDate?: string;
  success: boolean;
  error?: string;
}

export const fetchVehicleDetails = async (vehicleNumber: string): Promise<VehicleApiResponse> => {
  try {
    // For now, simulate API call with mock data
    // In production, replace this with actual API endpoint
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    
    // Mock successful response
    const mockResponse: VehicleApiResponse = {
      number: vehicleNumber,
      model: "Maruti Suzuki Swift",
      make: "Maruti Suzuki",
      year: "2021",
      fuelType: "Petrol",
      registrationDate: "2021-03-15",
      success: true
    };
    
    return mockResponse;
    
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/vehicle-details/${vehicleNumber}`, {
    //   method: 'GET',
    //   headers: {
    //     'Authorization': `Bearer ${API_TOKEN}`,
    //     'Content-Type': 'application/json'
    //   }
    // });
    
    // if (!response.ok) {
    //   throw new Error(`API Error: ${response.status}`);
    // }
    
    // const data = await response.json();
    // return data;
    
  } catch (error) {
    return {
      number: vehicleNumber,
      model: '',
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch vehicle details'
    };
  }
};