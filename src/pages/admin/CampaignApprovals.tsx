
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Search, CheckCircle, XCircle, Clock } from 'lucide-react';

// Mock pending campaigns data
const mockPendingCampaigns = [
  {
    _id: '1',
    title: 'Tech for Good Initiative',
    description: 'Providing technology solutions for non-profit organizations.',
    category: 'Technology',
    targetAmount: 10000,
    submittedBy: 'TechCorp Inc.',
    submittedAt: new Date('2025-03-20'),
    status: 'pending',
    documents: ['business-plan.pdf', 'financial-overview.xlsx']
  },
  {
    _id: '2',
    title: 'Green Energy Project',
    description: 'Installing solar panels in rural communities.',
    category: 'Environment',
    targetAmount: 15000,
    submittedBy: 'GreenFuture Ltd.',
    submittedAt: new Date('2025-03-18'),
    status: 'under_review',
    documents: ['project-proposal.pdf', 'environmental-impact.pdf']
  }
];

const CampaignApprovals = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [campaigns, setCampaigns] = useState(mockPendingCampaigns);

  const handleApprove = (campaignId: string) => {
    setCampaigns(prev => prev.filter(c => c._id !== campaignId));
    toast({
      title: 'Campaign Approved',
      description: 'The campaign has been approved and is now live.'
    });
  };

  const handleReject = (campaignId: string) => {
    setCampaigns(prev => prev.filter(c => c._id !== campaignId));
    toast({
      title: 'Campaign Rejected',
      description: 'The campaign has been rejected and the submitter will be notified.',
      variant: 'destructive'
    });
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.submittedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Campaign Approvals" subtitle="Review and approve new campaign submissions">
      <div className="mb-6">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search campaigns..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign._id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{campaign.title}</CardTitle>
                  <p className="text-gray-600 mt-1">Submitted by {campaign.submittedBy}</p>
                </div>
                <Badge 
                  variant="outline" 
                  className={
                    campaign.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }
                >
                  <Clock className="w-3 h-3 mr-1" />
                  {campaign.status === 'pending' ? 'Pending Review' : 'Under Review'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{campaign.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{campaign.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Goal Amount</p>
                  <p className="font-medium">${campaign.targetAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Submitted</p>
                  <p className="font-medium">{campaign.submittedAt.toLocaleDateString()}</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Documents</p>
                <div className="flex flex-wrap gap-2">
                  {campaign.documents.map((doc, index) => (
                    <Badge key={index} variant="secondary">{doc}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleApprove(campaign._id)}
                  className="flex items-center gap-1"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </Button>
                <Button 
                  onClick={() => handleReject(campaign._id)}
                  variant="outline"
                  className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </Button>
                <Button variant="outline">Review Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No pending campaigns</h3>
            <p className="text-gray-500">All campaigns have been reviewed</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CampaignApprovals;
