import { VideoIcon } from "lucide-react";

function CallButton({ onClick }) {
  return (
    <button 
      onClick={onClick} // ✅ Fix: use onClick
      className="btn btn-circle btn-primary shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 group"
      title="Start Video Call"
    >
      <VideoIcon className="size-5 group-hover:scale-110 transition-transform duration-200" />
    </button>
  );
}

export default CallButton;
