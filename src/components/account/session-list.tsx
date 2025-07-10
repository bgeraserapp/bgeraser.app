'use client';

import { formatDistanceToNow } from 'date-fns';
import {
  Chrome,
  Clock,
  Globe,
  LogOut,
  MapPin,
  Monitor,
  Shield,
  Smartphone,
  Tablet,
  Trash2,
} from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  useRevokeAllSessionsMutation,
  useRevokeOtherSessionsMutation,
  useRevokeSessionMutation,
  useSessionsQuery,
} from '@/hooks/use-auth-queries';

interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
}

// Device detection utility
function getDeviceInfo(userAgent: string = '') {
  const ua = userAgent.toLowerCase();

  // Device type detection
  let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop';
  let deviceIcon = Monitor;

  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    deviceType = 'mobile';
    deviceIcon = Smartphone;
  } else if (/tablet|ipad/i.test(ua)) {
    deviceType = 'tablet';
    deviceIcon = Tablet;
  }

  // Browser detection
  let browserName = 'Unknown';
  let browserIcon = Globe;

  if (ua.includes('chrome') && !ua.includes('edg')) {
    browserName = 'Chrome';
    browserIcon = Chrome;
  } else if (ua.includes('firefox')) {
    browserName = 'Firefox';
    browserIcon = Globe;
  } else if (ua.includes('safari') && !ua.includes('chrome')) {
    browserName = 'Safari';
    browserIcon = Globe;
  } else if (ua.includes('edg')) {
    browserName = 'Edge';
    browserIcon = Globe;
  }

  // OS detection
  let osName = 'Unknown';
  if (ua.includes('windows')) osName = 'Windows';
  else if (ua.includes('mac')) osName = 'macOS';
  else if (ua.includes('linux')) osName = 'Linux';
  else if (ua.includes('android')) osName = 'Android';
  else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) osName = 'iOS';

  return {
    deviceType,
    deviceIcon,
    browserName,
    browserIcon,
    osName,
    deviceName: `${browserName} on ${osName}`,
  };
}

export function SessionList() {
  const { data: sessions = [], isLoading: sessionsLoading } = useSessionsQuery();
  const revokeSessionMutation = useRevokeSessionMutation();
  const revokeOtherSessionsMutation = useRevokeOtherSessionsMutation();
  const revokeAllSessionsMutation = useRevokeAllSessionsMutation();

  const handleRevokeSession = (session: Session) => {
    revokeSessionMutation.mutate({ token: session.id });
  };

  const handleRevokeOtherSessions = () => {
    revokeOtherSessionsMutation.mutate();
  };

  const handleRevokeAllSessions = () => {
    revokeAllSessionsMutation.mutate();
  };

  if (sessionsLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Active Sessions</h3>
          <div className="w-32 h-8 bg-muted rounded animate-pulse" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
              <div>
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                <div className="h-3 w-24 bg-muted rounded animate-pulse mt-1" />
              </div>
            </div>
            <div className="w-20 h-8 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  // Get current session (the one being used)
  const currentSession =
    sessions.find((session: Session) => {
      // This is a simplified check - in real implementation, you'd compare with current session token
      return (
        new Date(session.expiresAt) > new Date() &&
        Math.abs(new Date(session.createdAt).getTime() - Date.now()) < 30 * 60 * 1000
      ); // Within last 30 minutes
    }) || sessions[0]; // Fallback to first session

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Active Sessions</h3>
          <p className="text-sm text-muted-foreground">
            Manage your active sessions across all devices
          </p>
        </div>
        <div className="flex space-x-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                End other sessions
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>End all other sessions?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will log you out from all other devices and browsers. Your current session
                  will remain active.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRevokeOtherSessions}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  End other sessions
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                End all sessions
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>End all sessions?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will log you out from all devices including this one. You will need to sign
                  in again.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRevokeAllSessions}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  End all sessions
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="space-y-3">
        {sessions.map((session: Session) => {
          const deviceInfo = getDeviceInfo(session.userAgent || undefined);
          const DeviceIcon = deviceInfo.deviceIcon;
          const BrowserIcon = deviceInfo.browserIcon;
          const isCurrentSession = session.id === currentSession?.id;
          const isExpired = new Date(session.expiresAt) < new Date();

          return (
            <div
              key={session.id}
              className={`flex items-center justify-between p-4 border rounded-lg ${
                isCurrentSession ? 'bg-primary/5 border-primary/20' : ''
              } ${isExpired ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <DeviceIcon className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-background border-2 border-background rounded-full flex items-center justify-center">
                    <BrowserIcon className="w-3 h-3 text-muted-foreground" />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{deviceInfo.deviceName}</h4>
                    {isCurrentSession && (
                      <Badge variant="secondary" className="text-xs">
                        <Shield className="w-3 h-3 mr-1" />
                        Current session
                      </Badge>
                    )}
                    {isExpired && (
                      <Badge variant="destructive" className="text-xs">
                        Expired
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                    {session.ipAddress && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{session.ipAddress}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        {isCurrentSession
                          ? 'Active now'
                          : `Last active ${formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}`}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground mt-1">
                    Expires {formatDistanceToNow(new Date(session.expiresAt), { addSuffix: true })}
                  </div>
                </div>
              </div>

              {!isCurrentSession && !isExpired && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={revokeSessionMutation.isPending}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      End session
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>End this session?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will log out the device using {deviceInfo.deviceName} at{' '}
                        {session.ipAddress}. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleRevokeSession(session)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        End session
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          );
        })}
      </div>

      {sessions.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No active sessions found</p>
        </div>
      )}

      <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-100">Security tip</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Regularly review your active sessions and end any you don&apos;t recognize. If you see
              suspicious activity, end all sessions and change your password.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
