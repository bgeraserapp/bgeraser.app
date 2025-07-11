import { IconUserCog } from '@tabler/icons-react';
import { Link2, Shield } from 'lucide-react';

import { ConnectedAccounts } from '@/components/account/connected-accounts';
import { ProfileForm } from '@/components/account/profile-form';
import { SessionList } from '@/components/account/session-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AccountPage() {
  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="space-y-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="inline-flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <IconUserCog />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Profile Settings</h1>
              </div>
            </CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm />
          </CardContent>
        </Card>

        {/* Connected Accounts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="inline-flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Link2 />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Connected Accounts</h1>
              </div>
            </CardTitle>
            <CardDescription>
              Link your social accounts for easier sign-in and enhanced features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ConnectedAccounts />
          </CardContent>
        </Card>

        {/* Session Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="inline-flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Shield />
                </div>
                <h1 className="text-2xl font-bold text-foreground"> Session Management</h1>
              </div>
            </CardTitle>
            <CardDescription>
              Monitor and control your active sessions across all devices for enhanced security.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SessionList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
