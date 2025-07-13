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
    <Card className="p-1 bg-card/80 backdrop-blur-sm border shadow-lg">
      <div className="flex items-center gap-1">
        <Button variant={!multipleMode ? 'default' : 'ghost'} size="lg" onClick={onToggleMode}>
          <ImageIcon className="w-3 h-3 mr-1" />
          Single
          {!multipleMode && (
            <Badge
              variant="secondary"
              className="ml-1 bg-primary-foreground/20 text-primary-foreground border-0 text-xs"
            >
              ●
            </Badge>
          )}
        </Button>

        <Button variant={multipleMode ? 'default' : 'ghost'} size="lg" onClick={onToggleMode}>
          <Images className="w-3 h-3 mr-1" />
          Multiple
          {multipleMode && (
            <Badge
              variant="secondary"
              className="ml-1 bg-primary-foreground/20 text-primary-foreground border-0 text-xs"
            >
              ●
            </Badge>
          )}
        </Button>
      </div>
    </Card>
  );
}
