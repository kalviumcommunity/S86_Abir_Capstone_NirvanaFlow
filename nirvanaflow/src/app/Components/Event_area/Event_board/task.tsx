import { useDraggable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import { AlertCircle, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";

import { Task } from "@/types";
import { DeleteMenu } from "../../Dropdown/threedotsDropdown"; 

type TaskCardProps = {
  task: Task;
  onTaskDeleted?: (id: string) => void;
  isDragging?: boolean;
};

async function handleDelete(id: string, onTaskDeleted?: (id: string) => void) {
  try {
    const res = await axios.delete(`/api/subtasks/${id}`);
    if (res.status !== 200) {
      throw new Error("Delete failed");
    }
    
    toast.success("Task deleted successfully", {
      description: "The task has been removed from your board.",
    });
    
    if (onTaskDeleted) {
      onTaskDeleted(id);
    }
  } catch (error) {
    toast.error("Failed to delete task", {
      description: "Something went wrong. Please try again.",
    });
    console.error(error);
  }
}

export default function TaskCard({ task, onTaskDeleted, isDragging = false }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task._id,
  });

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "high":
        return {
          icon: <AlertCircle className="w-3 h-3" />,
          textColor: "text-red-400",
          bgColor: "bg-red-500/10",
          borderColor: "border-red-500/30",
          dotColor: "bg-red-500",
        };
      case "medium":
        return {
          icon: <Clock className="w-3 h-3" />,
          textColor: "text-yellow-400",
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-500/30",
          dotColor: "bg-yellow-500",
        };
      case "low":
        return {
          icon: <CheckCircle className="w-3 h-3" />,
          textColor: "text-green-400",
          bgColor: "bg-green-500/10",
          borderColor: "border-green-500/30",
          dotColor: "bg-green-500",
        };
      default:
        return {
          icon: <Clock className="w-3 h-3" />,
          textColor: "text-zinc-400",
          bgColor: "bg-zinc-500/10",
          borderColor: "border-zinc-500/30",
          dotColor: "bg-zinc-500",
        };
    }
  };

  const priorityConfig = getPriorityConfig(task.priority);

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const handleDeleteTask = (id: string) => {
    handleDelete(id, onTaskDeleted);
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`
        group cursor-grab active:cursor-grabbing
        ${isDragging ? 'opacity-50 rotate-3 scale-105' : ''}
      `}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      layout
    >
      <Card className="bg-zinc-800/50 backdrop-blur-sm border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-zinc-900/20">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            {/* Main content area - draggable */}
            <div 
              className="flex-1 min-w-0"
              {...attributes}
              {...listeners}
            >
              <h4 className="font-medium text-white text-sm leading-relaxed mb-3 group-hover:text-zinc-100 transition-colors">
                {task.title}
              </h4>
              
              {/* Priority badge */}
              <motion.div 
                className={`
                  inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium
                  ${priorityConfig.textColor}  
                `}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div className={`w-2 h-2 rounded-full ${priorityConfig.dotColor}`} />
                <span className="capitalize">{task.priority}</span>
              </motion.div>
            </div>

            {/* Delete menu - not draggable */}
            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <DeleteMenu 
                id={task._id} 
                onDelete={handleDeleteTask}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}