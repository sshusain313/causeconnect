
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import CauseSelectionStep from './wizard/CauseSelectionStep';
// import ToteQuantityStep from './wizard/ToteQuantityStep';
import LogoUploadStep from './wizard/LogoUploadStep';
import DistributionInfoStep from './wizard/DistributionInfoStep';
import ConfirmationStep from './wizard/ConfirmationStep';
import axios from 'axios';

interface OnboardingWizardProps {
  initialCauseId?: string | null;
  onComplete: (formData: any) => void;
  isSubmitting: boolean;
}

const OnboardingWizard = ({ 
  initialCauseId, 
  onComplete,
  isSubmitting
}: OnboardingWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [causeData, setCauseData] = useState<any>(null);
  const [claimedTotes, setClaimedTotes] = useState(0);
  const [formData, setFormData] = useState({
    organizationName: '',
    contactName: '',
    email: '',
    phone: '',
    selectedCause: initialCauseId || '',
    toteQuantity: 50,
    distributionType: 'online' as 'online' | 'physical', // Default to online distribution
    numberOfTotes: 50,
    logoUrl: '',
    message: '',
    distributionPoints: [],
    distributionStartDate: new Date(),
    distributionEndDate: new Date(new Date().setDate(new Date().getDate() + 30)), // Default to 30 days from now
    distributionDate: undefined,
    // Add fields for physical distribution
    distributionPointName: '',
    distributionPointAddress: '',
    distributionPointContact: '',
    distributionPointPhone: '',
    distributionPointLocation: '',
    // Add fields for physical distribution locations
    selectedMalls: [] as string[],
    selectedMetroStations: [] as string[],
    selectedAirports: [] as string[],
    selectedSchools: [] as string[],
    shippingAddress: '',
    shippingContactName: '',
    shippingPhone: '',
    shippingInstructions: '',
    demographics: {
      ageGroups: [],
      income: '',
      education: '',
      other: '',
    },
  });

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
    
    // If the cause selection changes, fetch the new cause data
    if (data.selectedCause && data.selectedCause !== formData.selectedCause) {
      fetchCauseData(data.selectedCause);
    }
  };
  
  // Fetch cause data to get claimed totes information
  const fetchCauseData = async (causeId: string) => {
    if (!causeId) return;
    
    try {
      const response = await axios.get(`/api/causes/${causeId}`);
      setCauseData(response.data);
      setClaimedTotes(response.data.claimedTotes || 0);
    } catch (error) {
      console.error('Error fetching cause data:', error);
    }
  };
  
  // Fetch initial cause data if initialCauseId is provided
  useEffect(() => {
    if (initialCauseId) {
      fetchCauseData(initialCauseId);
    }
  }, [initialCauseId]);
  
  /**
   * Calculate total totes based on distribution type and settings
   * 
   * For online distribution: Uses the numberOfTotes field or defaults to 50
   * For physical distribution: Calculates based on selected distribution points
   *   - Schools: 400 totes per location
   *   - Malls: 800 totes per location
   *   - Metro Stations: 800 totes per location
   *   - Airports: 1000 totes per location
   *   - Custom locations: 10 totes per location
   * 
   * @returns {number} The calculated total number of totes
   */
  const calculateTotalTotes = () => {
    // For online distribution, use the specified number or default to 50
    if (formData.distributionType === 'online') {
      return formData.numberOfTotes || 50;
    } 
    // For physical distribution, calculate based on selected locations
    else if (formData.distributionType === 'physical') {
      // Helper function to get tote count based on location type
      const getToteCount = (location: string): number => {
        const schools = [
          "Hyderabad Public School",
          "Delhi Public School Hyderabad",
          "Oakridge International School",
          "Chirec International School",
          "Johnson Grammar School",
          "Meridian School",
          "Silver Oaks International School",
          "Glendale Academy",
          "Sreenidhi International School",
          "Indus International School"
        ];
        
        const malls = [
          "GVK One Mall",
          "Inorbit Mall Hyderabad",
          "Hyderabad Central",
          "Forum Sujana Mall",
          "Manjeera Mall",
          "City Center Mall",
          "Sarath City Capital Mall",
          "Nexus Hyderabad",
          "GSM Mall",
          "Hyderabad Next Galleria Mall"
        ];
        
        const metroStations = [
          "Ameerpet",
          "Miyapur",
          "LB Nagar",
          "MGBS",
          "Secunderabad East",
          "Parade Ground",
          "Nagole",
          "Hitech City",
          "Jubilee Hills",
          "Begumpet"
        ];
        
        const airports = [
          "Rajiv Gandhi International Airport",
          "Begumpet Airport"
        ];
        
        // Return tote count based on location type
        if (schools.includes(location)) return 400;
        if (malls.includes(location)) return 800;
        if (metroStations.includes(location)) return 800;
        if (airports.includes(location)) return 1000;
        return 10; // Default for custom locations
      };
      
      // Calculate total totes by summing up the count for each distribution point
      const calculatedTotal = formData.distributionPoints.reduce((total, point) => {
        return total + getToteCount(point);
      }, 0);
      
      // If no distribution points are selected, default to 50
      return calculatedTotal || 50;
    }
    
    // Default fallback value if no distribution type is selected
    return 50;
  };

  const totalSteps = 4; // Increased from 4 to 5
  const progressPercentage = (currentStep / totalSteps) * 100;

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  // Calculate the unit price and total amount
  const calculatePricing = () => {
    const unitPrice = 10; // $10 per tote
    const toteQuantity = calculateTotalTotes();
    const totalAmount = unitPrice * toteQuantity;
    
    return {
      unitPrice,
      totalAmount,
      toteQuantity
    };
  };

  const handleSubmit = () => {
    // Calculate pricing information
    const { unitPrice, totalAmount, toteQuantity } = calculatePricing();
    
    // Use the calculated values in the form submission
    onComplete({
      ...formData,
      toteQuantity,
      unitPrice,
      totalAmount
    });
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium mb-2">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round(progressPercentage)}% Complete</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {currentStep === 1 && (
        <CauseSelectionStep 
          formData={formData} 
          updateFormData={updateFormData} 
        />
      )}

      {/* {currentStep === 2 && (
        <ToteQuantityStep
          formData={formData}
          updateFormData={updateFormData}
        />
      )} */}

      {currentStep === 2 && (
        <LogoUploadStep
          formData={formData}
          updateFormData={updateFormData}
        />
      )}

      {currentStep === 3 && (
        <DistributionInfoStep
          formData={formData}
          updateFormData={updateFormData}
        />
      )}

      {currentStep === 4 && (
        <ConfirmationStep
          formData={{
            ...formData,
            ...calculatePricing(),
            availableTotes: Math.max(0, calculateTotalTotes() - claimedTotes),
            claimedTotes: claimedTotes
          }}
        />
      )}

      <div className="flex justify-between mt-8 pt-4 border-t">
        <Button 
          variant="outline" 
          onClick={prevStep}
          disabled={currentStep === 1 || isSubmitting}
        >
          Back
        </Button>

        {currentStep < totalSteps ? (
          <Button onClick={nextStep}>
            Continue
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Complete Sponsorship'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default OnboardingWizard;
