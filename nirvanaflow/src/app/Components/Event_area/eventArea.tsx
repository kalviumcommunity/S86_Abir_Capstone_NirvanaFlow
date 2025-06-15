"use client";

import SingleBoard, { Board } from "./Event_board/singleBoards";
import { useEffect, useState } from "react";
import axios from "axios";
import { ISubtask } from "@/models/Subtask";
import AddEventForm from "./Event_board/addEventForm";
import { DndContext, DragEndEvent, DragOverlay } from "@dnd-kit/core";
import Taskcard, { Task } from './Event_board/task';

export default function EventArea() {
  const [boards, setBoards] = useState<Board[]>([
    { name: "Todo", tasks: [] },
    { name: "Doing", tasks: [] },
    { name: "Done", tasks: [] },
  ]);

  async function fetchSubtasks(id?: string) {
    try {
      let res;
      if (!id) {
        res = await axios.get("/api/subtasks");
      } else {
        res = await axios.get(`/api/subtasks/events/${id}`);
      }

      const subtasks = res.data;
      console.log(res.data);

      const grouped = {
        Todo: subtasks.filter((task: ISubtask) => task.status === "todo"),
        Doing: subtasks.filter((task: ISubtask) => task.status === "doing"),
        Done: subtasks.filter((task: ISubtask) => task.status === "done"),
      };

      setBoards([
        { name: "Todo", tasks: grouped.Todo },
        { name: "Doing", tasks: grouped.Doing },
        { name: "Done", tasks: grouped.Done },
      ]);
    } catch (error) {
      console.error("Failed to fetch subtasks:", error);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatusRaw = over.id;
    if (typeof newStatusRaw !== "string") return;

    const newStatus = newStatusRaw.toLowerCase();

    setBoards((prevBoards) => {
      const task = prevBoards
        .flatMap((b) => b.tasks)
        .find((t) => t._id === taskId);
      if (!task) return prevBoards;

      const updated = prevBoards.map((board) => {
        const filtered = board.tasks.filter((t) => t._id !== taskId);

        return {
          ...board,
          tasks:
            board.name.toLowerCase() === newStatus
              ? [...filtered, { ...task, status: newStatus }]
              : filtered,
        };
      });

      return updated;
    });

    try {
      await axios.put(`/api/subtasks/${taskId}`, {
        status: newStatus,
      });
    } catch (error) {
      console.error("Failed to update subtask:", error);
    }
  }



  
  const handleTasksUpdate = (boardName: string, updatedTasks: Task[]) => {
    setBoards(prevBoards => 
      prevBoards.map(board => 
        board.name === boardName 
          ? { ...board, tasks: updatedTasks }
          : board
      )
    );
  };

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchSubtasks();
  }, []);

  
  const totalTasks = boards.reduce((sum, b) => sum + b.tasks.length, 0);

  return (
    <main className="flex-1 p-8">
      <div className="text-3xl font-semibold mb-2">Tuesday, April 23</div>
      <div className="text-sm text-zinc-400 mb-6">
        Total tasks: {totalTasks} | 
        Todo: {boards.find(b => b.name === "Todo")?.tasks.length || 0} | 
        Doing: {boards.find(b => b.name === "Doing")?.tasks.length || 0} | 
        Done: {boards.find(b => b.name === "Done")?.tasks.length || 0}
      </div>

      <DndContext
        onDragStart={(event) => {
          const taskId = event.active.id;
          const found = boards.flatMap((b) => b.tasks).find((t) => t._id === taskId);
          setActiveTask(found || null);
        }}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveTask(null)}
      >
        <div className="flex gap-4">
          {boards.map((board) => (
            <SingleBoard 
              key={board.name} 
              board={board} 
              onTasksUpdate={handleTasksUpdate}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeTask ? <Taskcard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      <div className="mt-6">
        <AddEventForm onSuccess={fetchSubtasks} />
      </div>
    </main>
  );
}