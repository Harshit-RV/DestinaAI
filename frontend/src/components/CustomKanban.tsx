import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { v4 as uuidv4 } from 'uuid';

interface KanbanItem {
  id: string;
  content: string;
  color: string;
  description?: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  items: KanbanItem[];
  maxActivities: number;
  color: string;
}



export const CustomKanban = ({ initialData, setActivities } : { initialData: KanbanColumn[], setActivities: Dispatch<SetStateAction<KanbanColumn[]>> }) => {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialData);
  const [showAddForm, setShowAddForm] = useState<string | null>(null);
  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [newActivityDescription, setNewActivityDescription] = useState('');

  // Sync columns state when initialData changes
  useEffect(() => {
    setColumns(initialData);
  }, [initialData]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // Moving within the same column
    if (source.droppableId === destination.droppableId) {
      const column = columns.find(col => col.id === source.droppableId);
      if (!column) return;

      const newItems = Array.from(column.items);
      const [reorderedItem] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, reorderedItem);

      const newColumns = columns.map(col =>
        col.id === source.droppableId
          ? { ...col, items: newItems }
          : col
      );

      setColumns(newColumns);
      setActivities(newColumns)
    } else {
      // Moving between different columns
      const sourceColumn = columns.find(col => col.id === source.droppableId);
      const destColumn = columns.find(col => col.id === destination.droppableId);

      if (!sourceColumn || !destColumn) return;

      const sourceItems = Array.from(sourceColumn.items);
      const destItems = Array.from(destColumn.items);
      const [movedItem] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, movedItem);

      const newColumns = columns.map(col => {
        if (col.id === source.droppableId) {
          return { ...col, items: sourceItems };
        } else if (col.id === destination.droppableId) {
          return { ...col, items: destItems };
        }
        return col;
      });

      setColumns(newColumns);
      setActivities(newColumns);
    }
  };

  const addActivity = (columnId: string) => {
    if (!newActivityTitle.trim()) return;

    const newActivity: KanbanItem = {
      id: uuidv4(),
      content: newActivityTitle,
      color: '#3B82F6', // Default blue color
      description: newActivityDescription || undefined
    };

    const newColumns = columns.map(col =>
      col.id === columnId
        ? { ...col, items: [...col.items, newActivity] }
        : col
    );

    setColumns(newColumns);
    setActivities(newColumns);
    setNewActivityTitle('');
    setNewActivityDescription('');
    setShowAddForm(null);
  };

  const removeActivity = (columnId: string, activityId: string) => {
    const newColumns = columns.map(col =>
      col.id === columnId
        ? { ...col, items: col.items.filter(item => item.id !== activityId) }
        : col
    );

    setColumns(newColumns);
    setActivities(newColumns);
  };

  const handleAddFormSubmit = (e: React.FormEvent, columnId: string) => {
    e.preventDefault();
    addActivity(columnId);
  };

  return (
    <div className="w-full h-[600px] rounded-lg">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-5 gap-3 h-full">
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex flex-col bg-[#F0F0F0] rounded-lg shadow-sm border border-gray-200"
              // style={{ backgroundColor: column.color }}
            >
              {/* Column Header */}
              <div className="p-3 border-b border-gray-200/50">
                <h3 className="font-semibold text-sm text-gray-800 text-center">
                  {column.title}
                </h3>
                <div className="text-xs text-gray-500 text-center mt-1">
                  {column.items.length} item{column.items.length !== 1 ? 's' : ''}
                </div>
                <Button
                  onClick={() => setShowAddForm(column.id)}
                  className="w-full mt-2 h-7 text-xs"
                  variant="outline"
                >
                  + Add Activity
                </Button>
              </div>

              {/* Droppable Area */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex-1 p-2 transition-colors duration-200 ${
                      snapshot.isDraggingOver 
                        ? 'bg-blue-50 bg-opacity-50' 
                        : 'transparent'
                    }`}
                  >
                    {column.items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                          
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`mb-2 bg-white rounded-md shadow-sm cursor-grab active:cursor-grabbing transition-all duration-200 ${
                              snapshot.isDragging 
                                ? 'shadow-lg rotate-2 scale-105' 
                                : 'hover:shadow-md'
                            }`}
                            // style={{ backgroundColor: item.color }}
                          >
                            <div className=' p-3  rounded-md relative group' 
                              // style={{ border: `2px solid ${item.color}` }}
                            >
                            <div className="flex gap-2 items-center text-sm font-medium text-gray-800 mb-1">
                              <div className='h-3 w-3 rounded-full' style={{ backgroundColor: item.color }}></div>
                              <div className="flex-1">{item.content}</div>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeActivity(column.id, item.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 h-5 w-5 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 transition-all"
                                variant="ghost"
                                size="sm"
                              >
                                ×
                              </Button>
                            </div>
                            {item.description && (
                              <div className="text-xs text-gray-500">
                                {item.description}
                              </div>
                            )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    {/* Add Activity Form */}
                    {showAddForm === column.id && (
                      <form onSubmit={(e) => handleAddFormSubmit(e, column.id)} className="mb-2 p-2 bg-white rounded-md border-2 border-blue-200">
                        <Input
                          type="text"
                          placeholder="Activity title"
                          value={newActivityTitle}
                          onChange={(e) => setNewActivityTitle(e.target.value)}
                          className="mb-2 h-8 text-xs"
                          autoFocus
                        />
                        <Input
                          type="text"
                          placeholder="Description (optional)"
                          value={newActivityDescription}
                          onChange={(e) => setNewActivityDescription(e.target.value)}
                          className="mb-2 h-8 text-xs"
                        />
                        <div className="flex gap-1">
                          <Button type="submit" className="flex-1 h-6 text-xs" size="sm">
                            Add
                          </Button>
                          <Button
                            type="button"
                            onClick={() => {
                              setShowAddForm(null);
                              setNewActivityTitle('');
                              setNewActivityDescription('');
                            }}
                            variant="outline"
                            className="flex-1 h-6 text-xs"
                            size="sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    )}
                    
                    {/* Empty State */}
                    {column.items.length === 0 && showAddForm !== column.id && (
                      <div className="text-xs text-gray-400 text-center py-8 border-2 border-dashed border-gray-200 rounded-md">
                        Drop items here
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default CustomKanban; 