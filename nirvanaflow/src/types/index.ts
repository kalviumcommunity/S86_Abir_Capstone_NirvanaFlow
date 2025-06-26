export interface ISubtask {
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'doing' | 'done';
  priority: 'high' | 'medium' | 'low';
  eventId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IEvent {
  _id: string;
  title: string;
  description?: string;
  deadline?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type Task = ISubtask;

export type Board = {
  name: string;
  tasks: Task[];
};