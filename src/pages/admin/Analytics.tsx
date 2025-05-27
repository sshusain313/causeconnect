
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Package, Download, Calendar } from 'lucide-react';

// Mock analytics data
const monthlyData = [
  { month: 'Jan', campaigns: 12, donations: 45000, claims: 230 },
  { month: 'Feb', campaigns: 15, donations: 52000, claims: 280 },
  { month: 'Mar', campaigns: 18, donations: 68000, claims: 350 },
];

const categoryData = [
  { name: 'Environment', value: 35, color: '#10B981' },
  { name: 'Education', value: 28, color: '#3B82F6' },
  { name: 'Healthcare', value: 20, color: '#8B5CF6' },
  { name: 'Technology', value: 17, color: '#F59E0B' },
];

const topCampaigns = [
  { name: 'Clean Water Initiative', currentAmount: 25000, claims: 450, status: 'active' },
  { name: 'Education for All', currentAmount: 18000, claims: 320, status: 'active' },
  { name: 'Healthcare Access', currentAmount: 15000, claims: 280, status: 'completed' },
  { name: 'Tech for Good', currentAmount: 12000, claims: 200, status: 'active' },
];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('3months');

  return (
    <AdminLayout title="Analytics Dashboard" subtitle="View comprehensive analytics and insights">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Custom Range
          </Button>
          <Button variant="outline" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Campaigns</p>
                <p className="text-3xl font-bold">45</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% from last month
                </p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Donations</p>
                <p className="text-3xl font-bold">$165K</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +18% from last month
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Claims</p>
                <p className="text-3xl font-bold">860</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +25% from last month
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-3xl font-bold">1,234</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8% from last month
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="donations" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="claims" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCampaigns.map((campaign, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{campaign.name}</h3>
                    <Badge 
                      variant="outline" 
                      className={campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-8 text-sm">
                  <div className="text-center">
                    <p className="text-gray-500">Raised</p>
                    <p className="font-semibold">${campaign.currentAmount.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500">Claims</p>
                    <p className="font-semibold">{campaign.claims}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default Analytics;
