import EventArea from "../Components/Event_area/eventArea";
import { Sidebar } from "../Components/Sidebar/sidebar";
import { EventFilterProvider } from "@/lib/context/EventFilterContext";

export default function dashboard() {
  return (
    <div className="bg-black text-white min-h-screen flex flex-row-reverse font-sans ">
      <EventFilterProvider>
        <Sidebar />
        <EventArea />
      </EventFilterProvider>
    </div>
  );
}
