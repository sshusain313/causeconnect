import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import OnboardingWizard from './OnboardingWizard';
import SponsorBenefits from './SponsorBenefits';
import axios from 'axios';
import config from '@/config';

interface SponsorFormContainerProps {
  causeId: string | null;
}

const SponsorFormContainer: React.FC<SponsorFormContainerProps> = ({ causeId }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmitComplete = async (formData: any) => {
    setIsLoading(true);
    
    try {
      // Log the form data to verify tote quantity and pricing information is correct
      console.log('Submitting sponsorship with tote quantity:', formData.toteQuantity);
      console.log('Unit price:', formData.unitPrice);
      console.log('Total amount:', formData.totalAmount);
      
      // Create a copy of the data without the large logo URL to reduce payload size
      const logoUrl = formData.logoUrl;
      const submissionData = { ...formData };
      
      // Store just a reference to having a logo, not the full data URL
      if (logoUrl && logoUrl.startsWith('data:')) {
        // Replace the data URL with a flag indicating we have a logo
        submissionData.logoUrl = 'logo_uploaded_client_side';
        console.log('Removed large logo data URL from submission payload');
      }
      
      console.log('Submitting data with size:', JSON.stringify(submissionData).length, 'bytes');
      
      // Send data to the server using the correct API URL with /api prefix
      // Use the base domain directly to avoid URL formation issues
      const apiEndpoint = config.isProduction ? 'https://api.changebag.org/api/sponsorships' : 'http://localhost:5000/api/sponsorships';
      console.log('Sending sponsorship to endpoint:', apiEndpoint);
      
      const response = await axios.post(apiEndpoint, {
        ...submissionData,
        cause: causeId
      });
      
      console.log('Sponsorship created successfully with ID:', response.data._id);
      console.log('Server response:', response.data);
      
      toast({
        title: "Sponsorship Request Submitted",
        description: "Thank you for your sponsorship! We'll review your request and get back to you soon.",
      });
      
      // Navigate to a confirmation page instead of dashboard
      navigate('/sponsorship/confirmation', { 
        state: { sponsorshipId: response.data._id } 
      });
    } catch (error: any) {
      console.error('Error submitting sponsorship:', error);
      toast({
        title: "Submission Error",
        description: error.response?.data?.message || "There was a problem submitting your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <OnboardingWizard 
                initialCauseId={causeId} 
                onComplete={handleSubmitComplete}
                isSubmitting={isLoading}
              />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <SponsorBenefits />
        </div>
      </div>
    </div>
  );
};

export default SponsorFormContainer;
