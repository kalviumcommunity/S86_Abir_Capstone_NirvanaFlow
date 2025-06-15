import Taskcard, { Task } from "./task";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDroppable } from "@dnd-kit/core";
import { AnimatePresence } from "motion/react";

export type Board = {
  name: string;
  tasks: Task[];
};

type SingleBoardProps = {
  board: Board;
  onTaskDeleted?: (taskId: string, boardName: string) => void;
  onTasksUpdate?: (boardName: string, updatedTasks: Task[]) => void;
};

export default function SingleBoard({ 
  board, 
  onTaskDeleted, 
  onTasksUpdate 
}: SingleBoardProps) {
  const { name: boardname, tasks } = board;
  const { setNodeRef, isOver } = useDroppable({
    id: board.name, // 'Todo', 'Doing', 'Done'
  });

  const handleTaskDeleted = (deletedTaskId: string) => {
    
    const updatedTasks = tasks.filter(task => task._id !== deletedTaskId);
    
    
    if (onTaskDeleted) {
      onTaskDeleted(deletedTaskId, boardname);
    }
    
    if (onTasksUpdate) {
      onTasksUpdate(boardname, updatedTasks);
    }
  };

  return (
    <div className="w-full h-full p-4 ">
      <div className="flex justify-between p-4 items-center">
        <span className="text-lg font-medium mb-2 capitalize text-zinc-300">
          {boardname}
        </span>
        <span className="text-sm text-zinc-500">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      <ScrollArea
        ref={setNodeRef}
        className={`h-113 p-2  ${isOver ? "ring-2 ring-white/30" : ""}`}
      >
        <div className="space-y-2 p-2">
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
              <Taskcard 
                key={task._id} 
                task={task} 
                onTaskDeleted={handleTaskDeleted}
              />
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}