
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  TrendingUp, 
  Clock,
  AlertCircle
} from 'lucide-react';

const MetricsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Total Causes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">6</div>
            <BarChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="text-xs text-green-600 mt-1 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>+2 this week</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Total Sponsors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">2</div>
            <BarChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            No change this week
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Total Raised
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">$14,500</div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-xs text-green-600 mt-1 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>+$3,500 this week</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Pending Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">6</div>
            <Clock className="h-5 w-5 text-amber-500" />
          </div>
          <div className="text-xs text-amber-600 mt-1 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            <span>3 require immediate review</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsCards;
