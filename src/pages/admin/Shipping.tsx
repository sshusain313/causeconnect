
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Search, Package, Truck, CheckCircle } from 'lucide-react';

// Mock shipping data
const mockShipments = [
  {
    _id: '1',
    claimerName: 'Sarah Johnson',
    campaignTitle: 'Clean Water Initiative',
    address: '123 Main St, Anytown, USA 12345',
    trackingNumber: 'TRK001234567',
    status: 'preparing',
    shippingDate: null,
    carrier: 'FedEx',
    estimatedDelivery: new Date('2025-03-28')
  },
  {
    _id: '2',
    claimerName: 'Michael Chen',
    campaignTitle: 'Education for All',
    address: '456 Oak Ave, Another City, USA 54321',
    trackingNumber: 'TRK009876543',
    status: 'shipped',
    shippingDate: new Date('2025-03-22'),
    carrier: 'UPS',
    estimatedDelivery: new Date('2025-03-26')
  },
  {
    _id: '3',
    claimerName: 'Emily Rodriguez',
    campaignTitle: 'Food Security Project',
    address: '789 Pine Rd, Different Town, USA 98765',
    trackingNumber: 'TRK005554433',
    status: 'delivered',
    shippingDate: new Date('2025-03-20'),
    carrier: 'USPS',
    estimatedDelivery: new Date('2025-03-24')
  }
];

const Shipping = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [shipments, setShipments] = useState(mockShipments);

  const handleMarkShipped = (shipmentId: string) => {
    setShipments(prev => prev.map(shipment => 
      shipment._id === shipmentId 
        ? { ...shipment, status: 'shipped', shippingDate: new Date() }
        : shipment
    ));
    toast({
      title: 'Marked as Shipped',
      description: 'The shipment has been marked as shipped and tracking information is now available.'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      preparing: 'bg-yellow-100 text-yellow-800',
      shipped: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800'
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'preparing':
        return <Package className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const filteredShipments = shipments.filter(shipment =>
    shipment.claimerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.campaignTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Shipping Management" subtitle="Track and manage all tote bag shipments">
      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search shipments..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">Bulk Ship</Button>
          <Button variant="outline">Export Report</Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredShipments.map((shipment) => (
          <Card key={shipment._id}>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center flex-wrap gap-2 mb-2">
                    <h3 className="text-xl font-semibold">{shipment.claimerName}</h3>
                    <Badge 
                      variant="outline" 
                      className={getStatusBadge(shipment.status)}
                    >
                      {getStatusIcon(shipment.status)}
                      <span className="ml-1">{shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}</span>
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-4">Campaign: {shipment.campaignTitle}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Tracking Number</p>
                      <p className="font-medium font-mono">{shipment.trackingNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Carrier</p>
                      <p className="font-medium">{shipment.carrier}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Estimated Delivery</p>
                      <p className="font-medium">{shipment.estimatedDelivery.toLocaleDateString()}</p>
                    </div>
                    {shipment.shippingDate && (
                      <div>
                        <p className="text-sm text-gray-500">Shipped Date</p>
                        <p className="font-medium">{shipment.shippingDate.toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Shipping Address</p>
                    <p className="font-medium">{shipment.address}</p>
                  </div>
                </div>
                <div className="flex flex-row lg:flex-col gap-2">
                  <Button variant="outline" className="flex-1">
                    Track Package
                  </Button>
                  {shipment.status === 'preparing' && (
                    <Button 
                      onClick={() => handleMarkShipped(shipment._id)}
                      className="flex-1 flex items-center gap-1"
                    >
                      <Truck className="h-4 w-4" />
                      Mark Shipped
                    </Button>
                  )}
                  <Button variant="outline" className="flex-1">
                    Print Label
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredShipments.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No shipments found</h3>
            <p className="text-gray-500">Try changing your search criteria</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Shipping;
