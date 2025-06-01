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
  
  // Log configuration details for debugging
  useEffect(() => {
    console.log('Admin Dashboard Config:', {
      apiUrl: config.apiUrl,
      isProduction: config.isProduction,
      token: token ? 'Token exists' : 'No token',
      tokenLength: token?.length
    });
  }, [token]);
  
  // Configure axios with authentication
  const authAxios = axios.create({
    baseURL: config.apiUrl,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    withCredentials: true // Add withCredentials to handle CORS properly
  });
  
  // Fetch pending causes from the API
  useEffect(() => {
    const fetchPendingCauses = async () => {
      if (!token) {
        console.warn('No auth token available for fetching causes');
        setErrorCauses('Authentication required');
        setLoadingCauses(false);
        return;
      }

      try {
        setLoadingCauses(true);
        console.log('Fetching pending causes with URL:', `${config.apiUrl}/causes?status=pending`);
        
        // Log the request headers for debugging
        console.log('Request headers:', {
          Authorization: `Bearer ${token.substring(0, 10)}...`, // Only log part of the token for security
          'Content-Type': 'application/json'
        });
        
        const response = await authAxios.get('/causes', {
          params: { status: 'pending' }
        });
        
        console.log('Pending causes response:', {
          status: response.status,
          dataCount: Array.isArray(response.data) ? response.data.length : 'not an array',
          data: response.data
        });
        
        setPendingCauses(response.data);
      } catch (err: any) {
        console.error('Error fetching pending causes:', {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          message: err.message
        });
        
        // More descriptive error message based on the error type
        if (err.response?.status === 401) {
          setErrorCauses('Authentication failed. Please log in again.');
        } else if (err.response?.status === 403) {
          setErrorCauses('You do not have permission to view pending causes.');
        } else if (err.response?.status === 404) {
          setErrorCauses('The causes endpoint could not be found. Please check API configuration.');
        } else {
          setErrorCauses(`Failed to load pending causes: ${err.response?.data?.message || err.message}`);
        }
      } finally {
        setLoadingCauses(false);
      }
    };
    
    fetchPendingCauses();
  }, [token, config.apiUrl, authAxios]);

  // Fetch pending sponsorships from the API
  useEffect(() => {
    const fetchPendingSponsorships = async () => {
      if (!token) {
        console.warn('No auth token available for fetching sponsorships');
        setErrorSponsorships('Authentication required');
        setLoadingSponsorships(false);
        return;
      }

      try {
        setLoadingSponsorships(true);
        console.log('Fetching pending sponsorships with URL:', `${config.apiUrl}/sponsorships/pending`);
        
        // Log the request headers for debugging
        console.log('Request headers for sponsorships:', {
          Authorization: `Bearer ${token.substring(0, 10)}...`, // Only log part of the token for security
          'Content-Type': 'application/json'
        });
        
        // Try the standard endpoint first
        try {
          const response = await authAxios.get('/sponsorships/pending');
          console.log('Pending sponsorships response:', {
            status: response.status,
            dataCount: Array.isArray(response.data) ? response.data.length : 'not an array',
            data: response.data
          });
          
          setPendingSponsorships(response.data);
        } catch (endpointError: any) {
          // If we get a 404, try an alternative endpoint format
          if (endpointError.response?.status === 404) {
            console.log('Sponsorships pending endpoint not found, trying alternative...');
            
            // Try with a different endpoint format
            const altResponse = await authAxios.get('/sponsorships', {
              params: { status: 'pending' }
            });
            
            console.log('Alternative sponsorships response:', {
              status: altResponse.status,
              dataCount: Array.isArray(altResponse.data) ? altResponse.data.length : 'not an array',
              data: altResponse.data
            });
            
            setPendingSponsorships(altResponse.data);
          } else {
            // Re-throw the error if it's not a 404
            throw endpointError;
          }
        }
      } catch (err: any) {
        console.error('Error fetching pending sponsorships:', {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          message: err.message
        });
        
        // More descriptive error message based on the error type
        if (err.response?.status === 401) {
          setErrorSponsorships('Authentication failed. Please log in again.');
        } else if (err.response?.status === 403) {
          setErrorSponsorships('You do not have permission to view pending sponsorships.');
        } else if (err.response?.status === 404) {
          setErrorSponsorships('The sponsorships endpoint could not be found. Please check API configuration.');
        } else {
          setErrorSponsorships(`Failed to load pending sponsorships: ${err.response?.data?.message || err.message}`);
        }
      } finally {
        setLoadingSponsorships(false);
      }
    };
    
    fetchPendingSponsorships();
  }, [token, config.apiUrl, authAxios]);
  
  // Fetch recent claims from the API
  useEffect(() => {
    const fetchRecentClaims = async () => {
      if (!token) {
        console.warn('No auth token available');
        return;
      }

      try {
        setLoadingClaims(true);
        const response = await authAxios.get('/claims', {
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
      console.log(`Approving sponsorship with ID: ${id}`);
      console.log(`Using API URL: ${config.apiUrl}/sponsorships/${id}/approve`);
      
      // Make the API call with explicit configuration
      const response = await authAxios.patch(`/sponsorships/${id}/approve`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      console.log('Sponsorship approval response:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data
      });
      
      setPendingSponsorships(prev => prev.filter(s => s._id !== id));
      toast({
        title: "Sponsorship Approved",
        description: "The sponsorship has been successfully approved.",
      });
    } catch (err: any) {
      console.error('Error approving sponsorship:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        headers: err.response?.headers
      });
      
      // Provide more specific error messages based on the error type
      if (err.message.includes('Network Error') || err.message.includes('CORS')) {
        toast({
          title: "CORS Error",
          description: "There was a cross-origin request issue. Please check server CORS configuration.",
          variant: "destructive",
        });
      } else if (err.response?.status === 401) {
        toast({
          title: "Authentication Error",
          description: "Your session may have expired. Please log in again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: err.response?.data?.message || "Failed to approve sponsorship. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleRejectSponsorship = async (id: string) => {
    try {
      console.log(`Rejecting sponsorship with ID: ${id}`);
      console.log(`Using API URL: ${config.apiUrl}/sponsorships/${id}/reject`);
      
      // Make the API call with explicit configuration
      const response = await authAxios.patch(`/sponsorships/${id}/reject`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      console.log('Sponsorship rejection response:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data
      });
      
      setPendingSponsorships(prev => prev.filter(s => s._id !== id));
      toast({
        title: "Sponsorship Rejected",
        description: "The sponsorship has been rejected.",
      });
    } catch (err: any) {
      console.error('Error rejecting sponsorship:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        headers: err.response?.headers
      });
      
      // Provide more specific error messages based on the error type
      if (err.message.includes('Network Error') || err.message.includes('CORS')) {
        toast({
          title: "CORS Error",
          description: "There was a cross-origin request issue. Please check server CORS configuration.",
          variant: "destructive",
        });
      } else if (err.response?.status === 401) {
        toast({
          title: "Authentication Error",
          description: "Your session may have expired. Please log in again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: err.response?.data?.message || "Failed to reject sponsorship. Please try again.",
          variant: "destructive",
        });
      }
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
