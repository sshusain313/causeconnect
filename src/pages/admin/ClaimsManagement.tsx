
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Search, CheckCircle, XCircle, Eye, ArrowUpDown, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

// Define the Claim interface
interface Claim {
  _id: string;
  causeId: string;
  causeTitle: string;
  fullName: string;
  email: string;
  phone: string;
  purpose: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  status: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  shippingDate?: string;
  deliveryDate?: string;
}

const ClaimsManagement = () => {
  const { toast } = useToast();
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'name'>('date');
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Fetch claims from the API
  useEffect(() => {
    const fetchClaims = async () => {
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await axios.get('/api/claims', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('Claims data:', response.data);
        
        // Handle different response formats
        if (response.data.claims) {
          setClaims(response.data.claims);
        } else if (Array.isArray(response.data)) {
          setClaims(response.data);
        } else {
          console.error('Unexpected claims data format:', response.data);
          setError('Invalid data format received from server');
        }
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching claims:', err);
        setError(err.response?.data?.message || 'Failed to load claims');
        setLoading(false);
      }
    };
    
    fetchClaims();
  }, [token]);

  const handleApprove = async (claimId: string) => {
    try {
      const response = await axios.patch(`/api/claims/${claimId}/status`, 
        { status: 'verified' },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      // Update local state
      setClaims(prev => prev.map(claim => 
        claim._id === claimId ? { ...claim, status: 'verified' } : claim
      ));
      
      toast({
        title: 'Claim Approved',
        description: 'The claim has been verified and approved for shipping.'
      });
    } catch (err: any) {
      console.error('Error approving claim:', err);
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to approve claim',
        variant: 'destructive'
      });
    }
  };

  const handleReject = async (claimId: string) => {
    try {
      const response = await axios.patch(`/api/claims/${claimId}/status`, 
        { status: 'cancelled' },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      // Update local state
      setClaims(prev => prev.map(claim => 
        claim._id === claimId ? { ...claim, status: 'cancelled' } : claim
      ));
      
      toast({
        title: 'Claim Rejected',
        description: 'The claim has been rejected.',
        variant: 'destructive'
      });
    } catch (err: any) {
      console.error('Error rejecting claim:', err);
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to reject claim',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-green-100 text-green-800',
      shipped: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
  };

  const filteredClaims = claims.filter(claim =>
    claim.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.causeTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort claims based on the selected sort criteria
  const sortedClaims = [...filteredClaims].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === 'status') {
      return a.status.localeCompare(b.status);
    } else { // name
      return a.fullName.localeCompare(b.fullName);
    }
  });

  return (
    <AdminLayout title="Claims Management" subtitle="Review and manage all tote bag claims">
      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search claims..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <ArrowUpDown className="h-4 w-4" />
            Sort by {sortBy}
          </Button>
          <Button variant="outline">Export Claims</Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading claims...</span>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Claims</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedClaims.map((claim) => (
            <Card key={claim._id}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{claim.fullName}</h3>
                      <Badge 
                        variant="outline" 
                        className={getStatusBadge(claim.status)}
                      >
                        {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-4">Cause: {claim.causeTitle}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{claim.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{claim.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email Verified</p>
                        <p className="font-medium">{claim.emailVerified ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Claim Date</p>
                        <p className="font-medium">{new Date(claim.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Shipping Address</p>
                      <p className="font-medium">{claim.address}, {claim.city}, {claim.state} {claim.zipCode}</p>
                    </div>
                  </div>
                <div className="flex flex-row lg:flex-col gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 flex items-center gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                  {claim.status === 'pending' && (
                    <>
                      <Button 
                        onClick={() => handleApprove(claim._id)}
                        className="flex-1 flex items-center gap-1"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button 
                        onClick={() => handleReject(claim._id)}
                        variant="outline"
                        className="flex-1 flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          ))}
          
          {sortedClaims.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No claims found</h3>
              <p className="text-gray-500">Try changing your search criteria</p>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default ClaimsManagement;
