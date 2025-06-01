import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PendingCauses from './PendingCauses';
import PendingSponsorships from './PendingSponsorships';
import RecentClaims from './RecentClaims';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import config from '@/config';

// Data types
interface PendingCause {
  _id: string;
  title: string;
  description: string;
  creator: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  category: string;
  imageUrl: string;
  targetAmount: number;
  currentAmount: number;
  location: string;
  status: string;
}

interface PendingSponsorship {
  _id: string;
  organizationName: string;
  contactName: string;
  email: string;
  toteQuantity: number;
  distributionStartDate: string;
  distributionEndDate: string;
  distributionDate?: string; // Keeping for backward compatibility
  createdAt: string;
}

interface Claim {
  _id: string;
  causeId: string;
  causeTitle: string;
  fullName: string;
  email: string;
  phone: string;
  purpose: string;
  status: 'pending' | 'verified' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

const DashboardTabs = () => {
  const { toast } = useToast();
  const { token } = useAuth();
  const [pendingCauses, setPendingCauses] = useState<PendingCause[]>([]);
  const [pendingSponsorships, setPendingSponsorships] = useState<PendingSponsorship[]>([]);
  const [recentClaims, setRecentClaims] = useState<Claim[]>([]);
  const [loadingCauses, setLoadingCauses] = useState(true);
  const [loadingSponsorships, setLoadingSponsorships] = useState(true);
  const [loadingClaims, setLoadingClaims] = useState(true);
  const [errorCauses, setErrorCauses] = useState('');
  const [errorSponsorships, setErrorSponsorships] = useState('');
  const [errorClaims, setErrorClaims] = useState('');
  
  // Configure axios with authentication
  const authAxios = axios.create({
    baseURL: config.apiUrl.replace('/api', ''), // Remove /api suffix as endpoints already include it
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  // Log the configuration for debugging
  console.log('API Configuration:', {
    configApiUrl: config.apiUrl,
    baseURL: authAxios.defaults.baseURL,
    isProduction: config.isProduction,
    hostname: window.location.hostname
  });
  
  // Fetch pending causes from the API
  useEffect(() => {
    const fetchPendingCauses = async () => {
      try {
        setLoadingCauses(true);
        const response = await authAxios.get('/api/causes', {
          params: { status: 'pending' }
        });
        setPendingCauses(response.data);
      } catch (err: any) {
        console.error('Error fetching pending causes:', err.response?.data || err.message);
        setErrorCauses('Failed to load pending causes');
      } finally {
        setLoadingCauses(false);
      }
    };
    
    if (token) {
      fetchPendingCauses();
    }
  }, [token]);

  // Fetch pending sponsorships from the API
  useEffect(() => {
    const fetchPendingSponsorships = async () => {
      if (!token) {
        console.warn('No auth token available');
        return;
      }

      try {
        setLoadingSponsorships(true);
        console.log('Fetching pending sponsorships with token:', token);
        
        const response = await authAxios.get('/api/sponsorships/pending');
        console.log('Pending sponsorships response:', response.data);
        
        setPendingSponsorships(response.data);
      } catch (err: any) {
        console.error('Error fetching pending sponsorships:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message
        });
        setErrorSponsorships(
          err.response?.data?.message || 
          'Failed to load pending sponsorships. Please check your permissions.'
        );
      } finally {
        setLoadingSponsorships(false);
      }
    };
    
    fetchPendingSponsorships();
  }, [token]);
  
  // Fetch recent claims from the API
  useEffect(() => {
    const fetchRecentClaims = async () => {
      if (!token) {
        console.warn('No auth token available');
        return;
      }

      try {
        setLoadingClaims(true);
        const response = await authAxios.get('/api/claims', {
          params: { limit: 5 } // Only get 5 most recent claims for dashboard
        });
        console.log('Recent claims response:', response.data);
        
        // Check if the response has the expected structure
        if (response.data.claims) {
          setRecentClaims(response.data.claims);
        } else if (Array.isArray(response.data)) {
          setRecentClaims(response.data);
        } else {
          console.error('Unexpected claims data format:', response.data);
          setErrorClaims('Invalid data format received from server');
        }
      } catch (err: any) {
        console.error('Error fetching recent claims:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message
        });
        setErrorClaims(
          err.response?.data?.message || 
          'Failed to load recent claims. Please check your permissions.'
        );
      } finally {
        setLoadingClaims(false);
      }
    };
    
    fetchRecentClaims();
  }, [token]);

  const handleApproveSponsorship = async (id: string) => {
    try {
      await authAxios.patch(`/api/sponsorships/${id}/approve`);
      setPendingSponsorships(prev => prev.filter(s => s._id !== id));
      toast({
        title: "Sponsorship Approved",
        description: "The sponsorship has been successfully approved.",
      });
    } catch (err: any) {
      console.error('Error approving sponsorship:', err.response?.data || err.message);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to approve sponsorship. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRejectSponsorship = async (id: string) => {
    try {
      await authAxios.patch(`/api/sponsorships/${id}/reject`);
      setPendingSponsorships(prev => prev.filter(s => s._id !== id));
      toast({
        title: "Sponsorship Rejected",
        description: "The sponsorship has been rejected.",
      });
    } catch (err: any) {
      console.error('Error rejecting sponsorship:', err.response?.data || err.message);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to reject sponsorship. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewSponsorshipDetails = (id: string) => {
    // TODO: Implement view details functionality
    console.log('View sponsorship details:', id);
  };
  
  // Claims data is now fetched from the API

  return (
    <Tabs defaultValue="pending-causes">
      <TabsList className="mb-6">
        <TabsTrigger value="pending-causes">Pending Causes</TabsTrigger>
        <TabsTrigger value="pending-sponsorships">Pending Sponsorships</TabsTrigger>
        <TabsTrigger value="recent-claims">Recent Claims</TabsTrigger>
      </TabsList>
      
      <TabsContent value="pending-causes">
        <PendingCauses 
          pendingCauses={pendingCauses} 
          loading={loadingCauses} 
          error={errorCauses} 
        />
      </TabsContent>
      
      <TabsContent value="pending-sponsorships">
        {loadingSponsorships ? (
          <div className="text-center py-8">Loading pending sponsorships...</div>
        ) : errorSponsorships ? (
          <div className="text-center py-8 text-red-500">{errorSponsorships}</div>
        ) : (
          <PendingSponsorships
            sponsorships={pendingSponsorships}
            onApprove={handleApproveSponsorship}
            onReject={handleRejectSponsorship}
            onViewDetails={handleViewSponsorshipDetails}
          />
        )}
      </TabsContent>
      
      <TabsContent value="recent-claims">
        <RecentClaims 
          claims={recentClaims} 
          isLoading={loadingClaims} 
          error={errorClaims} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
