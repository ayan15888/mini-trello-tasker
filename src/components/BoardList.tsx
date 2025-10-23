import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Card, CardData } from './Card';
import { AddCardForm } from './AddCardForm';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BoardListProps {
  id: string;
  title: string;
  cards: CardData[];
  onAddCard: (listId: string, title: string, description?: string) => void;
  onDeleteCard: (cardId: string) => void;
  onDeleteList: (listId: string) => void;
  onCompleteCard?: (cardId: string) => void;
  isDoneList?: boolean;
}

export function BoardList({
  id,
  title,
  cards,
  onAddCard,
  onDeleteCard,
  onDeleteList,
  onCompleteCard,
  isDoneList = false,
}: BoardListProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 min-w-[320px] max-w-[320px] flex flex-col shadow-[var(--shadow-list)] animate-slide-in">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50 group">
        <h2 className="font-bold text-lg text-foreground tracking-tight">{title}</h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDeleteList(id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <div
        ref={setNodeRef}
        className="flex-1 overflow-y-auto space-y-2 min-h-[100px] mb-4"
      >
        <SortableContext
          items={cards.map((card) => card.id)}
          strategy={verticalListSortingStrategy}
        >
          {cards.map((card) => (
            <Card 
              key={card.id} 
              card={card} 
              onDelete={onDeleteCard}
              onComplete={onCompleteCard}
              showCompleteButton={!isDoneList}
            />
          ))}
        </SortableContext>
      </div>

      <AddCardForm
        onAdd={(title, description) => onAddCard(id, title, description)}
      />
    </div>
  );
}
