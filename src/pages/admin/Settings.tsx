
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Save, AlertTriangle, Mail, Shield, Globe } from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    siteName: 'Tote Bag Platform',
    siteDescription: 'A platform for cause-based tote bag distribution',
    supportEmail: 'support@totebag.com',
    maxCampaignsPerUser: 5,
    autoApprovalEnabled: false,
    emailNotificationsEnabled: true,
    maintenanceMode: false,
    requireApprovalForClaims: true,
    maxClaimsPerCampaign: 1000,
    shippingFee: 0,
    privacyPolicyUrl: 'https://example.com/privacy',
    termsOfServiceUrl: 'https://example.com/terms'
  });

  const handleSave = () => {
    toast({
      title: 'Settings Saved',
      description: 'All settings have been successfully updated.'
    });
  };

  const handleInputChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <AdminLayout title="System Settings" subtitle="Configure platform settings and preferences">
      <div className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => handleInputChange('siteName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Campaign Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maxCampaigns">Max Campaigns Per User</Label>
                <Input
                  id="maxCampaigns"
                  type="number"
                  value={settings.maxCampaignsPerUser}
                  onChange={(e) => handleInputChange('maxCampaignsPerUser', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="maxClaims">Max Claims Per Campaign</Label>
                <Input
                  id="maxClaims"
                  type="number"
                  value={settings.maxClaimsPerCampaign}
                  onChange={(e) => handleInputChange('maxClaimsPerCampaign', parseInt(e.target.value))}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoApproval">Auto-approve Campaigns</Label>
                <p className="text-sm text-gray-500">Automatically approve new campaign submissions</p>
              </div>
              <Switch
                id="autoApproval"
                checked={settings.autoApprovalEnabled}
                onCheckedChange={(checked) => handleInputChange('autoApprovalEnabled', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="requireClaimApproval">Require Approval for Claims</Label>
                <p className="text-sm text-gray-500">Manually review all tote bag claims</p>
              </div>
              <Switch
                id="requireClaimApproval"
                checked={settings.requireApprovalForClaims}
                onCheckedChange={(checked) => handleInputChange('requireApprovalForClaims', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <p className="text-sm text-gray-500">Send email notifications for important events</p>
              </div>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotificationsEnabled}
                onCheckedChange={(checked) => handleInputChange('emailNotificationsEnabled', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="privacyPolicy">Privacy Policy URL</Label>
                <Input
                  id="privacyPolicy"
                  value={settings.privacyPolicyUrl}
                  onChange={(e) => handleInputChange('privacyPolicyUrl', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="termsOfService">Terms of Service URL</Label>
                <Input
                  id="termsOfService"
                  value={settings.termsOfServiceUrl}
                  onChange={(e) => handleInputChange('termsOfServiceUrl', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              System Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                <p className="text-sm text-gray-500">Put the site in maintenance mode</p>
              </div>
              <Switch
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked)}
              />
            </div>
            <div>
              <Label htmlFor="shippingFee">Shipping Fee ($)</Label>
              <Input
                id="shippingFee"
                type="number"
                step="0.01"
                value={settings.shippingFee}
                onChange={(e) => handleInputChange('shippingFee', parseFloat(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save All Settings
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
