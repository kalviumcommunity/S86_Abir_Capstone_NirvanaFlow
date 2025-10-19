"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  Circle,
  PlayCircle,
  AlertTriangle,
  X,
  Calendar,
} from "lucide-react";
import api from "@/lib/api-config";
import { AxiosError } from "axios";

import SingleBoard from "./Event_board/singleBoards";
import TaskCard from "./Event_board/task";
import AddEventForm from "./Event_board/addEventForm";
import { Task, Board } from "@/types";
import { useEventFilter } from "@/lib/context/EventFilterContext";

interface OverdueEvent {
  _id: string;
  title: string;
  deadline: string;
  priority: string;
  description?: string;
}

interface DeadlineNotification {
  id: string;
  event: OverdueEvent;
  timestamp: string;
}

export default function EventArea() {
  const { selectedEventId, refreshTrigger } = useEventFilter();

  const [boards, setBoards] = useState<Board[]>([
    { name: "Todo", tasks: [] },
    { name: "Doing", tasks: [] },
    { name: "Done", tasks: [] },
  ]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<DeadlineNotification[]>(
    []
  );
  const [isExtending, setIsExtending] = useState<string | null>(null);

  async function fetchSubtasks(id?: string) {
    setIsLoading(true);
    try {
      let res;
      if (!id) {
        res = await api.get("/api/subtasks");
      } else {
        res = await api.get(`/api/subtasks/events/${id}`);
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
      console.log("Updating subtask:", { taskId, newStatus }); // Debug log
      const response = await api.put(`/api/subtasks/${taskId}`, {
        status: newStatus,
      });
      console.log("Update successful:", response.data);
    } catch (error) {
      console.error("Failed to update subtask:", error);
      if (error instanceof AxiosError) {
        console.error("Response data:", error.response?.data);
        console.error("Status code:", error.response?.status);
      }
      // Revert optimistic update on error
      fetchSubtasks(selectedEventId || undefined);
    }
  }

  function handleDragStart(event: DragStartEvent) {
    const taskId = event.active.id;
    const found = boards.flatMap((b) => b.tasks).find((t) => t._id === taskId);
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

  const handleExtendDeadline = async (eventId: string) => {
    setIsExtending(eventId);
    try {
      // Calculate new deadline (24 hours from now)
      const newDeadline = new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ).toISOString();

      await api.put(`/api/events/${eventId}/extend`, {
        deadline: newDeadline,
      });

      // Remove notification
      setNotifications((prev) =>
        prev.filter((notif) => notif.event._id !== eventId)
      );
    } catch (error) {
      console.error("Failed to extend deadline:", error);
    } finally {
      setIsExtending(null);
    }
  };

  const handleMarkComplete = async (eventId: string) => {
    try {
      await api.put(`/api/events/${eventId}`, {
        completedAt: new Date(),
      });

      // Remove notification
      setNotifications((prev) =>
        prev.filter((notif) => notif.event._id !== eventId)
      );
    } catch (error) {
      console.error("Failed to mark event complete:", error);
    }
  };

  const dismissNotification = (eventId: string) => {
    setNotifications((prev) =>
      prev.filter((notif) => notif.event._id !== eventId)
    );
  };

  // SSE Integration
  useEffect(() => {
    const evtSource = new EventSource("/api/sse");

    evtSource.onmessage = (event) => {
      console.log("SSE raw event:", event);
    };

    evtSource.addEventListener("deadline-missed", (event) => {
      const data = JSON.parse(event.data);
      console.log("Deadline missed:", data);

      if (data.events && data.events.length > 0) {
        const newNotifications = data.events.map(
          (overdueEvent: OverdueEvent) => ({
            id: `${overdueEvent._id}-${Date.now()}`,
            event: overdueEvent,
            timestamp: new Date().toISOString(),
          })
        );

        setNotifications((prev) => {
          // Avoid duplicates
          const existingIds = new Set(prev.map((n) => n.event._id));
          const uniqueNotifications = newNotifications.filter(
            (n: DeadlineNotification) => !existingIds.has(n.event._id)
          );
          return [...prev, ...uniqueNotifications];
        });
      }
    });

    evtSource.addEventListener("connected", (event) => {
      console.log("SSE connected:", event.data);
    });

    evtSource.addEventListener("error", (event) => {
      console.error("SSE error event:", event);
    });

    evtSource.onerror = (err) => {
      console.error("SSE connection error:", err);
    };

    return () => {
      evtSource.close();
    };
  }, []);

  // Fetch subtasks when selectedEventId changes
  useEffect(() => {
    fetchSubtasks(selectedEventId || undefined);
  }, [selectedEventId]);

  // Refresh subtasks when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchSubtasks(selectedEventId || undefined);
    }
  }, [refreshTrigger, selectedEventId]);

  const totalTasks = boards.reduce((sum, b) => sum + b.tasks.length, 0);
  const todoCount = boards.find((b) => b.name === "Todo")?.tasks.length || 0;
  const doingCount = boards.find((b) => b.name === "Doing")?.tasks.length || 0;
  const doneCount = boards.find((b) => b.name === "Done")?.tasks.length || 0;

  const completionRate =
    totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;

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
      className="flex-1 p-6 bg-gradient-to-bl from-black via-zinc-900 to-black min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Deadline Notifications */}
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            className="fixed top-4 right-4 z-50 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-lg p-4 backdrop-blur-sm shadow-xl max-w-md"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-300 mb-1">
                  Deadline Missed!
                </h4>
                <p className="text-sm text-zinc-300 mb-2">
                  {notification.event.title}
                </p>
                <p className="text-xs text-zinc-400 mb-3">
                  Was due:{" "}
                  {new Date(notification.event.deadline).toLocaleDateString()}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleExtendDeadline(notification.event._id)}
                    disabled={isExtending === notification.event._id}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 rounded-md text-xs text-blue-300 transition-colors disabled:opacity-50"
                  >
                    <Calendar className="w-3 h-3" />
                    {isExtending === notification.event._id
                      ? "Extending..."
                      : "Extend +24h"}
                  </button>

                  <button
                    onClick={() => handleMarkComplete(notification.event._id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 rounded-md text-xs text-green-300 transition-colors"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Complete
                  </button>
                </div>
              </div>

              <button
                onClick={() => dismissNotification(notification.event._id)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Header Section */}
      <motion.div
        className="mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
            Tuesday, April 23
          </h1>
          {notifications.length > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-full"
            >
              <AlertTriangle className="w-3 h-3 text-red-400" />
              <span className="text-xs text-red-300">
                {notifications.length} overdue
              </span>
            </motion.div>
          )}
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
                className={`flex items-center gap-2 px-2 py-1 rounded-md`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {getBoardIcon(stat.name)}
                <span className={`${stat.color} font-medium`}>
                  {stat.count}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="ml-auto px-3 py-1.5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full border border-green-500/20"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-green-400 font-medium">
              {completionRate}% Complete
            </span>
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
