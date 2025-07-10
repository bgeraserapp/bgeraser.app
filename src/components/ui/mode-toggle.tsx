'use client';

import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ModeToggleProps {
  multipleMode: boolean;
  onToggleMode: () => void;
}

export function ModeToggle({ multipleMode, onToggleMode }: ModeToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant={!multipleMode ? 'default' : 'outline'}
          size="sm"
          onClick={() => !multipleMode || onToggleMode()}
        >
          Single Image
        </Button>
        <Button
          variant={multipleMode ? 'default' : 'outline'}
          size="sm"
          onClick={() => multipleMode || onToggleMode()}
        >
          <Plus className="h-4 w-4 mr-2" />
          Multiple Images
        </Button>
      </div>
      <div className="text-sm text-muted-foreground">
        {multipleMode ? 'Upload up to 10 images' : 'Upload one image'}
      </div>
    </div>
  );
}
