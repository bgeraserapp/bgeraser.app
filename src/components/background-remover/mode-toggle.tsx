'use client';

import { ImageIcon, Images } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ModeToggleProps {
  multipleMode: boolean;
  onToggleMode: () => void;
}

export function ModeToggle({ multipleMode, onToggleMode }: ModeToggleProps) {
  return (
    <Card className="p-2 bg-card/80 backdrop-blur-sm border shadow-lg">
      <div className="flex items-center gap-2">
        <Button variant={!multipleMode ? 'default' : 'ghost'} size="lg" onClick={onToggleMode}>
          <ImageIcon className="w-4 h-4 mr-2" />
          Single Image
          {!multipleMode && (
            <Badge
              variant="secondary"
              className="ml-2 bg-primary-foreground/20 text-primary-foreground border-0"
            >
              Active
            </Badge>
          )}
        </Button>

        <Button variant={multipleMode ? 'default' : 'ghost'} size="lg" onClick={onToggleMode}>
          <Images className="w-4 h-4 mr-2" />
          Multiple Images
          {multipleMode && (
            <Badge
              variant="secondary"
              className="ml-2 bg-primary-foreground/20 text-primary-foreground border-0"
            >
              Active
            </Badge>
          )}
        </Button>
      </div>
    </Card>
  );
}
