import { Button } from "@/components/ui/button"
import SingleBoard,{Board} from "./Event_board/singleBoards"

export default function EventArea(){
    const boards:Board[]=[
        {name:'Todo',tasks:[]},
        {name:'Doing',tasks:[]},
        {name:'Done',tasks:[]}
    ]

    return(
        <main className="flex-1 p-8">
        <div className="text-3xl font-semibold mb-2">Tuesday, April 23</div>
        <div className="text-sm text-zinc-400 mb-6">
          {/* You have {tasks.todo.length + tasks.inProgress.length + tasks.done.length} tasks today. */}
        </div>
        {/* Main boards */}
        <div className="flex gap-4">
            {boards.map((board,i)=>(
                <SingleBoard  board={board} key={i}/>
            ))}
        </div>
        
        <div className="mt-6">
          <Button variant="ghost" className="text-zinc-400 hover:text-white" >
            + Add Task
          </Button>
        </div>
      </main>
    )
}