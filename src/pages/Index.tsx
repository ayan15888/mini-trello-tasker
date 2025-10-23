import { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { BoardList } from '@/components/BoardList';
import { AddListForm } from '@/components/AddListForm';
import { Card, CardData } from '@/components/Card';
import { LayoutGrid } from 'lucide-react';

interface List {
  id: string;
  title: string;
  cards: CardData[];
}

const STORAGE_KEY = 'taskflow-board-data';

const Index = () => {
  const [lists, setLists] = useState<List[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {
        id: 'list-1',
        title: 'To Do',
        cards: [
          { id: 'card-1', title: 'Design new landing page', description: 'Create mockups and wireframes' },
          { id: 'card-2', title: 'Review pull requests', description: 'Check team submissions' },
        ],
      },
      {
        id: 'list-2',
        title: 'In Progress',
        cards: [
          { id: 'card-3', title: 'Implement authentication', description: 'Add login and signup flows' },
        ],
      },
      {
        id: 'list-3',
        title: 'Done',
        cards: [
          { id: 'card-4', title: 'Project setup', description: 'Initialize repository and dependencies' },
        ],
      },
    ];
  });

  const [activeCard, setActiveCard] = useState<CardData | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  }, [lists]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeList = lists.find((list) =>
      list.cards.some((card) => card.id === active.id)
    );
    const card = activeList?.cards.find((card) => card.id === active.id);
    if (card) {
      setActiveCard(card);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeList = lists.find((list) =>
      list.cards.some((card) => card.id === activeId)
    );
    const overList = lists.find(
      (list) => list.id === overId || list.cards.some((card) => card.id === overId)
    );

    if (!activeList || !overList) return;

    if (activeList.id !== overList.id) {
      setLists((lists) => {
        const activeCards = activeList.cards;
        const overCards = overList.cards;
        const activeIndex = activeCards.findIndex((card) => card.id === activeId);
        const overIndex = overCards.findIndex((card) => card.id === overId);

        const [movedCard] = activeCards.splice(activeIndex, 1);
        
        if (overList.id === overId) {
          overCards.push(movedCard);
        } else {
          overCards.splice(overIndex, 0, movedCard);
        }

        return lists.map((list) => {
          if (list.id === activeList.id) {
            return { ...list, cards: activeCards };
          }
          if (list.id === overList.id) {
            return { ...list, cards: overCards };
          }
          return list;
        });
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeList = lists.find((list) =>
      list.cards.some((card) => card.id === activeId)
    );

    if (!activeList) return;

    const activeIndex = activeList.cards.findIndex((card) => card.id === activeId);
    const overIndex = activeList.cards.findIndex((card) => card.id === overId);

    if (activeIndex !== overIndex && overIndex !== -1) {
      setLists((lists) =>
        lists.map((list) => {
          if (list.id === activeList.id) {
            return {
              ...list,
              cards: arrayMove(list.cards, activeIndex, overIndex),
            };
          }
          return list;
        })
      );
    }
  };

  const handleAddCard = (listId: string, title: string, description?: string) => {
    const newCard: CardData = {
      id: `card-${Date.now()}`,
      title,
      description,
    };

    setLists((lists) =>
      lists.map((list) =>
        list.id === listId
          ? { ...list, cards: [...list.cards, newCard] }
          : list
      )
    );
  };

  const handleDeleteCard = (cardId: string) => {
    setLists((lists) =>
      lists.map((list) => ({
        ...list,
        cards: list.cards.filter((card) => card.id !== cardId),
      }))
    );
  };

  const handleAddList = (title: string) => {
    const newList: List = {
      id: `list-${Date.now()}`,
      title,
      cards: [],
    };
    setLists([...lists, newList]);
  };

  const handleDeleteList = (listId: string) => {
    setLists((lists) => lists.filter((list) => list.id !== listId));
  };

  return (
    <div className="min-h-screen bg-[image:var(--gradient-primary)] p-6">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-background/20 backdrop-blur-sm rounded-lg">
            <LayoutGrid className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white">TaskFlow</h1>
        </div>
        <p className="text-white/80 text-lg">Organize your work with ease</p>
      </header>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-6">
          {lists.map((list) => (
            <BoardList
              key={list.id}
              id={list.id}
              title={list.title}
              cards={list.cards}
              onAddCard={handleAddCard}
              onDeleteCard={handleDeleteCard}
              onDeleteList={handleDeleteList}
            />
          ))}
          <AddListForm onAdd={handleAddList} />
        </div>

        <DragOverlay>
          {activeCard ? (
            <div className="bg-card rounded-lg p-4 shadow-[var(--shadow-card-hover)] rotate-3">
              <h3 className="font-semibold text-card-foreground mb-1">
                {activeCard.title}
              </h3>
              {activeCard.description && (
                <p className="text-sm text-muted-foreground">
                  {activeCard.description}
                </p>
              )}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default Index;
