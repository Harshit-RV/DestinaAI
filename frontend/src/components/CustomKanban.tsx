import React, { Dispatch, SetStateAction, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

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
                            <div className=' p-3  rounded-md' 
                              // style={{ border: `2px solid ${item.color}` }}
                            >
                            <div className="flex gap-2 items-center text-sm font-medium text-gray-800 mb-1">
                              <div className='h-3 w-3 rounded-full' style={{ backgroundColor: item.color }}></div>
                              <div>{item.content}</div>
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
                    
                    {/* Empty State */}
                    {column.items.length === 0 && (
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