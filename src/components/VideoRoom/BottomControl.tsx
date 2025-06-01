import {
  Grid3X3,
  Hand,
  MessageCircle,
  Mic,
  MicOff,
  Monitor,
  PhoneOff,
  Presentation,
  Settings,
  Users,
  Video,
  VideoOff,
} from "lucide-react";
import { type SetStateAction, type Dispatch } from "react";

// generate interface for the component props
interface BottomControlProps {
  toggleMute: () => void;
  isMuted: boolean;
  toggleVideo: () => void;
  isVideoOn: boolean;
  toggleHandRaise: () => void;
  isHandRaised: boolean;
  setViewMode: Dispatch<SetStateAction<"grid" | "speaker">>;
  viewMode: string;
  setIsRecording: Dispatch<SetStateAction<boolean>>;
  isRecording: boolean;
  setIsParticipantsOpen: Dispatch<SetStateAction<boolean>>;
  setIsChatOpen: Dispatch<SetStateAction<boolean>>;
  isChatOpen: boolean;
  isParticipantsOpen: boolean;
  leaveRoom: () => void;
}

function BottomControl({
  toggleMute,
  isMuted,
  toggleVideo,
  isVideoOn,
  toggleHandRaise,
  isHandRaised,
  setViewMode,
  viewMode,
  setIsRecording,
  isRecording,
  setIsChatOpen,
  setIsParticipantsOpen,
  isChatOpen,
  isParticipantsOpen,
  leaveRoom,
}: BottomControlProps) {
  return (
    <div className="bg-gray-800 border-t border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleMute}
            className={`p-3 rounded-full transition-colors ${
              isMuted
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {isMuted ? (
              <MicOff className="w-5 h-5 text-white" />
            ) : (
              <Mic className="w-5 h-5 text-white" />
            )}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full transition-colors ${
              !isVideoOn
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {isVideoOn ? (
              <Video className="w-5 h-5 text-white" />
            ) : (
              <VideoOff className="w-5 h-5 text-white" />
            )}
          </button>

          <button
            onClick={toggleHandRaise}
            className={`p-3 rounded-full transition-colors ${
              isHandRaised
                ? "bg-yellow-600 hover:bg-yellow-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            <Hand className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Center Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() =>
              setViewMode(viewMode === "grid" ? "speaker" : "grid")
            }
            className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
            title={
              viewMode === "grid"
                ? "Switch to speaker view"
                : "Switch to grid view"
            }
          >
            {viewMode === "grid" ? (
              <Presentation className="w-5 h-5 text-white" />
            ) : (
              <Grid3X3 className="w-5 h-5 text-white" />
            )}
          </button>

          <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors">
            <Monitor className="w-5 h-5 text-white" />
          </button>

          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`p-3 rounded-full transition-colors ${
              isRecording
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            <div className="w-5 h-5 bg-white rounded-full"></div>
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setIsParticipantsOpen(!isParticipantsOpen);
              setIsChatOpen(false);
            }}
            className={`p-3 rounded-full transition-colors ${
              isParticipantsOpen
                ? "bg-blue-600"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            <Users className="w-5 h-5 text-white" />
          </button>

          <button
            onClick={() => {
              setIsChatOpen(!isChatOpen);
              setIsParticipantsOpen(false);
            }}
            className={`p-3 rounded-full transition-colors ${
              isChatOpen ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            <MessageCircle className="w-5 h-5 text-white" />
          </button>

          <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors">
            <Settings className="w-5 h-5 text-white" />
          </button>

          <button className="p-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors">
            <PhoneOff
              className="w-5 h-5 text-white"
              onClick={() => leaveRoom()}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default BottomControl;
