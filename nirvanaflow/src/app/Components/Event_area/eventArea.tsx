"use client";

import { useEffect, useState } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, CheckCircle2, Circle, PlayCircle } from "lucide-react";
import axios from "axios";

import SingleBoard from "./Event_board/singleBoards";
import TaskCard from "./Event_board/task";
import AddEventForm from "./Event_board/addEventForm";
import { Task, Board } from "@/types";
import { useEventFilter } from "@/lib/context/EventFilterContext";

export default function EventArea() {
  const { selectedEventId, refreshTrigger } = useEventFilter();
  
  const [boards, setBoards] = useState<Board[]>([
    { name: "Todo", tasks: [] },
    { name: "Doing", tasks: [] },
    { name: "Done", tasks: [] },
  ]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchSubtasks(id?: string) {
    setIsLoading(true);
    try {
      let res;
      if (!id) {
        res = await axios.get("/api/subtasks");
      } else {
        res = await axios.get(`/api/subtasks/events/${id}`);
      }

      const subtasks = res.data;

      const grouped = {
        Todo: subtasks.filter((task: Task) => task.status === "todo"),
        Doing: subtasks.filter((task: Task) => task.status === "doing"),
        Done: subtasks.filter((task: Task) => task.status === "done"),
      };

      setBoards([
        { name: "Todo", tasks: grouped.Todo },
        { name: "Doing", tasks: grouped.Doing },
        { name: "Done", tasks: grouped.Done },
      ]);
    } catch (error) {
      console.error("Failed to fetch subtasks:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatusRaw = over.id;
    if (typeof newStatusRaw !== "string") return;

    const newStatus = newStatusRaw.toLowerCase() as "todo" | "doing" | "done";

    // Optimistic update
    setBoards((prevBoards) => {
      const task = prevBoards
        .flatMap((b) => b.tasks)
        .find((t) => t._id === taskId);
      if (!task) return prevBoards;

      return prevBoards.map((board) => {
        const filtered = board.tasks.filter((t) => t._id !== taskId);
        return {
          ...board,
          tasks:
            board.name.toLowerCase() === newStatus
              ? [...filtered, { ...task, status: newStatus }]
              : filtered,
        };
      });
    });

    try {
      await axios.put(`/api/subtasks/${taskId}`, { status: newStatus });
    } catch (error) {
      console.error("Failed to update subtask:", error);
      // Revert on error
      fetchSubtasks(selectedEventId);
    }
  }

  function handleDragStart(event: DragStartEvent) {
    const taskId = event.active.id;
    const found = boards
      .flatMap((b) => b.tasks)
      .find((t) => t._id === taskId);
    setActiveTask(found || null);
  }

  function handleDragCancel() {
    setActiveTask(null);
  }

  const handleTasksUpdate = (boardName: string, updatedTasks: Task[]) => {
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.name === boardName ? { ...board, tasks: updatedTasks } : board
      )
    );
  };

  // Fetch subtasks when selectedEventId changes
  useEffect(() => {
    fetchSubtasks(selectedEventId);
  }, [selectedEventId]);

  // Refresh subtasks when refreshTrigger changes (when events are added/deleted)
  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchSubtasks(selectedEventId);
    }
  }, [refreshTrigger, selectedEventId]);

  const totalTasks = boards.reduce((sum, b) => sum + b.tasks.length, 0);
  const todoCount = boards.find((b) => b.name === "Todo")?.tasks.length || 0;
  const doingCount = boards.find((b) => b.name === "Doing")?.tasks.length || 0;
  const doneCount = boards.find((b) => b.name === "Done")?.tasks.length || 0;

  const completionRate = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;

  const getBoardIcon = (boardName: string) => {
    switch (boardName.toLowerCase()) {
      case "todo":
        return <Circle className="w-4 h-4" />;
      case "doing":
        return <PlayCircle className="w-4 h-4" />;
      case "done":
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  return (
    <motion.main 
      className="flex-1 p-6 bg-gradient-to-br from-black via-zinc-900 to-black min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <motion.div 
        className="mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <Calendar className="w-8 h-8 text-zinc-400" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
            Tuesday, April 23
          </h1>
        </div>
        
        <div className="flex items-center gap-6 text-sm">
          <motion.div 
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 rounded-full border border-zinc-700/50"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Clock className="w-4 h-4 text-zinc-400" />
            <span className="text-zinc-300">Total: {totalTasks}</span>
          </motion.div>
          
          <div className="flex items-center gap-4">
            {[
              { name: "Todo", count: todoCount, color: "text-zinc-500" },
              { name: "Doing", count: doingCount, color: "text-zinc-400" },
              { name: "Done", count: doneCount, color: "text-zinc-300" },
            ].map((stat) => (
              <motion.div
                key={stat.name}
                className={`flex items-center gap-2 px-2 py-1 rounded-md ${stat.bg}`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {getBoardIcon(stat.name)}
                <span className={`${stat.color} font-medium`}>{stat.count}</span>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="ml-auto px-3 py-1.5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full border border-green-500/20"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-green-400 font-medium">{completionRate}% Complete</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Kanban Board */}
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <AnimatePresence>
            {boards.map((board, index) => (
              <motion.div
                key={board.name}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
              >
                <SingleBoard
                  board={board}
                  onTasksUpdate={handleTasksUpdate}
                  isLoading={isLoading}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <DragOverlay dropAnimation={null}>
          {activeTask ? (
            <motion.div
              initial={{ scale: 1.05, rotate: 5 }}
              animate={{ scale: 1.1, rotate: 8 }}
              className="opacity-90"
            >
              <TaskCard task={activeTask} isDragging />
            </motion.div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Add Event Form */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <AddEventForm />
      </motion.div>
    </motion.main>
  );
}