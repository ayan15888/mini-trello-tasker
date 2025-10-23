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
        variant="outline"
        className="min-w-[280px] h-auto py-3 bg-card/50 hover:bg-card backdrop-blur-sm border-dashed border-2 hover:border-primary/50 transition-all"
        onClick={() => setIsOpen(true)}
      >
        <Plus className="h-5 w-5 mr-2" />
        Add a list
      </Button>
    );
  }

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 min-w-[280px] animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          placeholder="Enter list title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          className="bg-background"
        />
        <div className="flex gap-2">
          <Button type="submit" size="sm" className="flex-1">
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
