
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import MetricsCards from '@/components/admin/dashboard/MetricsCards';
import DashboardTabs from '@/components/admin/dashboard/DashboardTabs';

const AdminDashboard = () => {
  return (
    <AdminLayout 
      title="Admin Dashboard" 
      subtitle="Manage campaigns, claims, and system analytics"
    >
      <MetricsCards />
      <DashboardTabs />
    </AdminLayout>
  );
};

export default AdminDashboard;
