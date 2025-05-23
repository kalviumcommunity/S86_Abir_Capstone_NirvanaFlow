import Taskcard,{Task} from "./task"


export type Board={
    name:string,
    tasks:Task[]
}

export default function SingleBoard({board}:{board:Board}){
    const {name:boardname,tasks}=board
    

    return(
        <div className="w-full h-full p-4 ">
            <div className="flex justify-between p-4 items-center">
                <span className="text-lg font-medium mb-2 capitalize text-zinc-300">{boardname}</span>
            </div>
            <div className="space-y-2">
                {tasks.map((task,i)=>(
                    <Taskcard key={i} task={task}/>    
                ))}

            </div>
        </div>
        

    )
}