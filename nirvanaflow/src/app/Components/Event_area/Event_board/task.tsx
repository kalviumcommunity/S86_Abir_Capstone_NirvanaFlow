import { Card, CardContent } from "@/components/ui/card";
import { DeleteMenu } from "../../Dropdown/threedotsDropdown";
import axios from "axios";
import { toast } from "sonner";
import { useDraggable } from "@dnd-kit/core";
import { motion } from "motion/react";

export type Task = {
  _id: string;
  title: string;
  priority: "high" | "medium" | "low"; // Make this more type-safe
};

async function handleDelete(id: string) {
  try {
    const res = await axios.delete(`/api/subtasks/${id}`);
    if (res.status != 200) {
      throw new Error("Delete failed");
    }
    
    toast.success("item deleted successfully");
  } catch (error) {
    toast.error("Something went wrong while deleting.");
    console.log(error);
  }
}

export default function Taskcard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: task._id,
  });
  
  // Use complete class names instead of dynamic construction
  const priorityStyles = {
    high: {
      textColor: "text-red-300/80",
      bgColor: "bg-red-300/80"
    },
    medium: {
      textColor: "text-yellow-300/80", 
      bgColor: "bg-yellow-300/80"
    },
    low: {
      textColor: "text-green-300/80",
      bgColor: "bg-green-300/80"
    }
  }[task.priority];
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <Card className={`bg-zinc-900 border-none transition-transform duration-200 cursor-grab active:cursor-grabbing`}>
        <CardContent className="p-4 text-sm text-white flex justify-between">
          <div className="font-semibold">{task.title}</div>
          <div className={`text-xs ${priorityStyles.textColor} mt-1 flex items-center gap-1`}>
            <div className={`w-2 h-2 rounded-full ${priorityStyles.bgColor}`}></div>
            {task.priority}
          </div>
          <DeleteMenu id={task._id} onDelete={handleDelete} />
        </CardContent>
      </Card>
    </motion.div>
  );
}