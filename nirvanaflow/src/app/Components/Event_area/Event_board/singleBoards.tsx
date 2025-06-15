import Taskcard, { Task } from "./task";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDroppable } from "@dnd-kit/core";
import { AnimatePresence } from "motion/react";

export type Board = {
  name: string;
  tasks: Task[];
};

export default function SingleBoard({ board }: { board: Board }) {
  const { name: boardname, tasks } = board;
  const { setNodeRef, isOver } = useDroppable({
    id: board.name, // 'Todo', 'Doing', 'Done'
  });

  return (
    <div className="w-full h-full p-4 ">
      <div className="flex justify-between p-4 items-center">
        <span className="text-lg font-medium mb-2 capitalize text-zinc-300">
          {boardname}
        </span>
      </div>

      <ScrollArea
        ref={setNodeRef}
        className={`h-113 p-2  ${isOver ? "ring-2 ring-white/30" : ""}`}
      >
        <div className="space-y-2 p-2">
          <AnimatePresence>
            {tasks.map((task, i) => (
              <Taskcard key={i} task={task} />
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}
