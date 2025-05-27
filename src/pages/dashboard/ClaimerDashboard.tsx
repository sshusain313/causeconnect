
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const ClaimerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Mock data for claimed causes
  const claimedCauses = [
    {
      id: '1',
      title: 'Clean Water Initiative',
      description: 'Providing clean drinking water to communities in need.',
      imageUrl: 'https://images.unsplash.com/photo-1541252260730-0412e8e2d5d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      currentAmount: 5000,
      targetAmount: 25000,
      status: 'active',
      sponsors: 1
    }
  ];
  
  // Mock data for totes claimed
  const totesData = [
    {
      id: '1',
      cause: 'Clean Water Initiative',
      sponsor: 'EcoSolutions Inc.',
      status: 'shipped',
      trackingNumber: 'TRK12345678',
      shippingDate: '2025-03-20'
    }
  ];

  return (
    <DashboardLayout 
      title="Claimer Dashboard" 
      subtitle={`Welcome back, ${user?.name}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Active Causes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Raised
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$5,000</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Totes Claimed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="causes">
        <TabsList className="mb-6">
          <TabsTrigger value="causes">My Causes</TabsTrigger>
          <TabsTrigger value="totes">Claimed Totes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="causes">
          <div className="space-y-6">
            {claimedCauses.map((cause) => (
              <Card key={cause.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/4">
                      <img 
                        src={cause.imageUrl} 
                        alt={cause.title} 
                        className="w-full h-32 object-cover rounded-md" 
                      />
                    </div>
                    <div className="md:w-3/4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold">{cause.title}</h3>
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                          Active
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-4">{cause.description}</p>
                      
                      <div className="mb-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-primary-600 h-2.5 rounded-full" 
                            style={{ width: `${(cause.currentAmount / cause.targetAmount) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-2">
                          <span className="text-sm text-gray-500">
                            ${cause.currentAmount.toLocaleString()} raised
                          </span>
                          <span className="text-sm text-gray-500">
                            ${cause.targetAmount.toLocaleString()} goal
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-6 items-center">
                        <div>
                          <p className="text-sm text-gray-500">Sponsors</p>
                          <p className="font-semibold">{cause.sponsors}</p>
                        </div>
                        <div className="flex-grow"></div>
                        <Button 
                          onClick={() => navigate(`/cause/${cause.id}`)}
                        >
                          Manage Cause
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="text-center pt-6">
              <Button onClick={() => navigate('/create-cause')}>
                Create New Cause
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="totes">
          {totesData.length > 0 ? (
            <div className="space-y-6">
              {totesData.map((tote) => (
                <Card key={tote.id}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle>{tote.cause} Tote</CardTitle>
                      <Badge className={
                        tote.status === 'shipped' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                        tote.status === 'delivered' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                        'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                      }>
                        {tote.status === 'shipped' ? 'Shipped' : 
                         tote.status === 'delivered' ? 'Delivered' : 'Processing'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      Sponsored by {tote.sponsor}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Tracking Number</p>
                        <p className="font-medium">{tote.trackingNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Shipping Date</p>
                        <p className="font-medium">{new Date(tote.shippingDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Track Shipment
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No totes claimed yet</h3>
              <p className="text-gray-500 mb-6">Totes can be claimed once your cause receives sponsorship.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default ClaimerDashboard;
