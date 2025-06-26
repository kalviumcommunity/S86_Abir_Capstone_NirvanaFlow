import { useDroppable } from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";
import { Circle, PlayCircle, CheckCircle2, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

import TaskCard from "./task";
import { Task, Board } from "@/types";

type SingleBoardProps = {
  board: Board;
  onTaskDeleted?: (taskId: string, boardName: string) => void;
  onTasksUpdate?: (boardName: string, updatedTasks: Task[]) => void;
  isLoading?: boolean;
};

export default function SingleBoard({ 
  board, 
  onTaskDeleted, 
  onTasksUpdate,
  isLoading = false
}: SingleBoardProps) {
  const { name: boardName, tasks } = board;
  const { setNodeRef, isOver } = useDroppable({
    id: board.name,
  });

  const handleTaskDeleted = (deletedTaskId: string) => {
    const updatedTasks = tasks.filter(task => task._id !== deletedTaskId);
    
    if (onTaskDeleted) {
      onTaskDeleted(deletedTaskId, boardName);
    }
    
    if (onTasksUpdate) {
      onTasksUpdate(boardName, updatedTasks);
    }
  };

  const getBoardConfig = (name: string) => {
    switch (name.toLowerCase()) {
      case "todo":
        return {
          icon: <Circle className="w-5 h-5" />,
          color: "text-blue-400",
          bgColor: "bg-blue-500/10",
          borderColor: "border-blue-500/20",
          hoverBg: "hover:bg-blue-500/20",
        };
      case "doing":
        return {
          icon: <PlayCircle className="w-5 h-5" />,
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-500/20",
          hoverBg: "hover:bg-yellow-500/20",
        };
      case "done":
        return {
          icon: <CheckCircle2 className="w-5 h-5" />,
          color: "text-green-400",
          bgColor: "bg-green-500/10",
          borderColor: "border-green-500/20",
          hoverBg: "hover:bg-green-500/20",
        };
      default:
        return {
          icon: <Circle className="w-5 h-5" />,
          color: "text-zinc-400",
          bgColor: "bg-zinc-500/10",
          borderColor: "border-zinc-500/20",
          hoverBg: "hover:bg-zinc-500/20",
        };
    }
  };

  const config = getBoardConfig(boardName);

  return (
    <motion.div 
      className={`
        relative transition-all duration-300
        ${isOver 
          ? `  shadow-lg shadow-${config.color.split('-')[1]}-500/20` 
          : 'border-zinc-800/50 hover:border-zinc-700/50'
        }
      `}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Board Header */}
      <div className="p-4 border-b border-zinc-800/50">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            
            <h3 className="text-lg font-semibold text-white capitalize">
              {boardName}
            </h3>
          </motion.div>
          
          <motion.div 
            className={`
              px-2.5 py-1  text-xs font-medium
            `}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
          >
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </motion.div>
        </div>
      </div>

      {/* Tasks Container */}
      <div className="p-4">
        <ScrollArea
          ref={setNodeRef}
          className="h-[600px] pr-2"
        >
          <div className="space-y-3">
            {isLoading ? (
              // Loading skeleton
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="h-20 bg-zinc-800/30 rounded-lg animate-pulse"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  />
                ))}
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {tasks.map((task, index) => (
                  <motion.div
                    key={task._id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{ 
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 300,
                      damping: 25
                    }}
                    layout
                  >
                    <TaskCard 
                      task={task} 
                      onTaskDeleted={handleTaskDeleted}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

            {/* Empty state */}
            {!isLoading && tasks.length === 0 && (
              <motion.div
                className={`
                  flex flex-col items-center justify-center py-12 px-4 rounded-lg border-2 border-dashed
                  ${config.borderColor} ${config.bgColor} transition-all duration-300 ${config.hoverBg}
                `}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Plus className={`w-8 h-8 ${config.color} mb-2`} />
                <p className="text-zinc-400 text-sm text-center">
                  No tasks in {boardName.toLowerCase()}
                </p>
                <p className="text-zinc-500 text-xs text-center mt-1">
                  Drag tasks here or create new ones
                </p>
              </motion.div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Drop indicator overlay */}
      <AnimatePresence>
        {isOver && (
          <motion.div
            className={`
              absolute inset-0 rounded-xl border-2 border-dashed pointer-events-none
              ${config.borderColor} ${config.bgColor}
            `}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}