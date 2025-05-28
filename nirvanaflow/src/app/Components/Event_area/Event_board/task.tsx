import { Card, CardContent } from "@/components/ui/card";

export type Task = {
  title: string;
  priority:number;
}

export default function Taskcard({ task }: { task: Task }) {
  return (
    <Card className="bg-zinc-900 border-none transition-transform duration-200 hover:scale-[1.01]">
      <CardContent className="p-4 text-sm text-white">
        <div className="font-semibold">{task.title}</div>
        <div className="text-xs text-zinc-400 mt-1">
          Priority: {task.priority}
        </div>
      </CardContent>
    </Card>
  );
}