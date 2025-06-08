import { Card, CardContent } from "@/components/ui/card";
import { DeleteMenu } from "../../Dropdown/threedotsDropdown";
import axios from "axios";
import { toast } from "sonner";

export type Task = {
  _id: string;
  title: string;
  priority:number;
}

async function handleDelete(id:string) {
  try{
    const res= await axios.delete(`/api/subtasks/${id}`)
    if (res.status!=200){
      throw new Error("Delete failed");
    }

    toast.success("item deleted successfully")
  }catch(error){
    toast.error("Something went wrong while deleting.");
    console.log(error)
  }
}

export default function Taskcard({ task }: { task: Task }) {
  return (
    <Card className="bg-zinc-900 border-none transition-transform duration-200 hover:scale-[1.01]">
      <CardContent className="p-4 text-sm text-white flex justify-between">
        <div className="font-semibold">{task.title}</div>
        <div className="text-xs text-zinc-400 mt-1">
          Priority: {task.priority}
        </div>

        <DeleteMenu  id={task._id} onDelete={handleDelete} />

      </CardContent>
    </Card>
  );
}