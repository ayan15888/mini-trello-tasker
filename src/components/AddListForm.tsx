import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddListFormProps {
  onAdd: (title: string) => void;
}

export function AddListForm({ onAdd }: AddListFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
      setTitle('');
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="secondary"
        className="min-w-[280px] h-auto py-3 bg-background/30 hover:bg-background/50 backdrop-blur-sm"
        onClick={() => setIsOpen(true)}
      >
        <Plus className="h-5 w-5 mr-2" />
        Add a list
      </Button>
    );
  }

  return (
    <div className="bg-secondary/30 backdrop-blur-sm rounded-xl p-4 min-w-[280px] animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          placeholder="List title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          className="bg-card"
        />
        <div className="flex gap-2">
          <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90">
            Add List
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsOpen(false);
              setTitle('');
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
