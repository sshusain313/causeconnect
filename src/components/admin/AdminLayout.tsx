
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Files, 
  CheckCircle, 
  Image, 
  Package, 
  Truck, 
  BarChart2, 
  Settings, 
  LogOut
} from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  loading?: boolean;
}

const AdminLayout = ({ children, title, subtitle, loading = false }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/admin' },
    { icon: Files, label: 'Causes Management', path: '/admin/causes' },
    { icon: CheckCircle, label: 'Campaign Approvals', path: '/admin/approvals' },
    { icon: Image, label: 'Logo Review', path: '/admin/logos' },
    { icon: Package, label: 'Claims Management', path: '/admin/claims' },
    { icon: Truck, label: 'Shipping', path: '/admin/shipping' },
    { icon: BarChart2, label: 'Analytics', path: '/admin/analytics' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center px-2">
              <h2 className="text-lg font-bold">Admin Portal</h2>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton 
                        onClick={() => navigate(item.path)} 
                        tooltip={item.label}
                        isActive={location.pathname === item.path}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset className="flex flex-col overflow-auto">
          <header className="sticky top-0 z-10 bg-background border-b p-4 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold">{title}</h1>
                  {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 mr-2">
                {user?.name} (Admin)
              </span>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Spinner className="h-8 w-8" />
                <span className="ml-2">Loading...</span>
              </div>
            ) : (
              children
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
