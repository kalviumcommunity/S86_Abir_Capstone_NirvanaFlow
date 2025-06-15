import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { MoreVertical, Trash2, AlertTriangle } from "lucide-react";
import { useState } from "react";

type DeleteMenuProps = {
  id: string;
  onDelete: (id: string) => void;
};

export function DeleteMenu({ id, onDelete }: DeleteMenuProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(false);
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(id);
    setIsAlertOpen(false);
  };

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <button 
            className="p-2 hover:bg-zinc-800 rounded-md transition-colors duration-200 opacity-60 hover:opacity-100"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end"
          className="bg-zinc-900 border-zinc-700 shadow-xl"
        >
          <DropdownMenuItem
            onClick={handleDeleteClick}
            onMouseDown={(e) => e.stopPropagation()}
            className="text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer focus:bg-red-500/10 focus:text-red-300"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-700 shadow-2xl max-w-md">
          <AlertDialogHeader className="space-y-4">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-500/10 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <AlertDialogTitle className="text-center text-xl font-semibold text-white">
              Delete Task
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-zinc-400 leading-relaxed">
              This action cannot be undone. The task will be permanently removed from your board.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-3 mt-6">
            <AlertDialogCancel 
              onClick={() => setIsAlertOpen(false)}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 border-zinc-600 text-zinc-300 hover:text-white transition-colors"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}