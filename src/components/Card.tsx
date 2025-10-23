import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface CardData {
  id: string;
  title: string;
  description?: string;
}

interface CardProps {
  card: CardData;
  onDelete: (id: string) => void;
  onComplete?: (id: string) => void;
  showCompleteButton?: boolean;
}

export function Card({ card, onDelete, onComplete, showCompleteButton = false }: CardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group bg-card rounded-lg p-4 mb-3 cursor-grab active:cursor-grabbing transition-all hover:shadow-[var(--shadow-card-hover)] shadow-[var(--shadow-card)]"
    >
      <div className="flex items-start gap-2">
        <div
          {...attributes}
          {...listeners}
          className="mt-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-card-foreground mb-1 break-words">
            {card.title}
          </h3>
          {card.description && (
            <p className="text-sm text-muted-foreground break-words">
              {card.description}
            </p>
          )}
        </div>
        <div className="flex gap-1">
          {showCompleteButton && onComplete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-accent"
              onClick={() => onComplete(card.id)}
              title="Mark as complete"
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(card.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
