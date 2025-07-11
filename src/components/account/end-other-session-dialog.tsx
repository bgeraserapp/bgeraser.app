import { LogOut } from 'lucide-react';

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
import { Button } from '@/components/ui/button';
import { useRevokeOtherSessionsMutation } from '@/hooks/use-auth-queries';
const EndOtherSessionDialog = () => {
  const revokeOtherSessionsMutation = useRevokeOtherSessionsMutation();

  const handleRevokeOtherSessions = () => {
    revokeOtherSessionsMutation.mutate();
  };
  return (
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
            This will log you out from all other devices and browsers. Your current session will
            remain active.
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
  );
};

export default EndOtherSessionDialog;
