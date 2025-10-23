import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface AddCardFormProps {
  onAdd: (title: string, description?: string) => void;
}

export function AddCardForm({ onAdd }: AddCardFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), description.trim() || undefined);
      setTitle('');
      setDescription('');
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        className="w-full justify-start text-muted-foreground hover:bg-background/50"
        onClick={() => setIsOpen(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add a card
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 animate-fade-in">
      <Input
        placeholder="Card title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
        className="bg-card"
      />
      <Textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="bg-card min-h-[60px]"
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90">
          Add Card
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setIsOpen(false);
            setTitle('');
            setDescription('');
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
