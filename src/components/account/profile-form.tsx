'use client';

import { SaveIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/providers/auth-provider';

export function ProfileForm() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    updateUser.mutate({
      name: formData.name,
      // Note: Email updates might require verification
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">Please sign in</h3>
        <p className="text-muted-foreground">You need to be signed in to view your profile.</p>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Info */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.image || ''} alt={user.name || 'User'} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">{user.name || 'User'}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <h4 className="text-base font-semibold text-foreground">Personal Information</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email"
              disabled
              className="bg-muted"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={updateUser.isLoading}>
            {updateUser.isLoading ? (
              <>
                <svg
                  className="w-4 h-4 mr-2 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Updating...
              </>
            ) : (
              <>
                <SaveIcon className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
