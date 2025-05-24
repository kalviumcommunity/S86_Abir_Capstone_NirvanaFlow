import EventArea from "../Components/Event_area/eventArea";

export default function dashboard(){
     return (
    <div className="bg-black text-white min-h-screen flex flex-row-reverse font-sans">
      {/* Sidebar */}
      <EventArea />
    </div>
  );


}