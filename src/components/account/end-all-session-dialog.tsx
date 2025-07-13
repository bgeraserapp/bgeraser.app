import { Trash2 } from 'lucide-react';

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
import { useRevokeAllSessionsMutation } from '@/hooks/use-auth-queries';
const EndAllSessionDialog = () => {
  const revokeAllSessionsMutation = useRevokeAllSessionsMutation();

  const handleRevokeAllSessions = () => {
    revokeAllSessionsMutation.mutate();
  };

  return (
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
            This will log you out from all devices including this one. You will need to sign in
            again.
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
  );
};

export default EndAllSessionDialog;
