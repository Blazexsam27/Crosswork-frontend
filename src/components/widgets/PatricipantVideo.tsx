import type { Participant } from "@/types/videoroom/videoRoomTypes";
import { Hand, MicOff, Monitor, MoreVertical } from "lucide-react";

export default function ParticipantVideo({
  participant,
  isMain = false,
  videoRef,
}: {
  participant: Participant;
  isMain?: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}) {
  return (
    <div
      className={`relative bg-gray-900 rounded-xl overflow-hidden ${
        isMain ? "aspect-video" : "aspect-square"
      } group`}
    >
      {participant.isVideoOn ? (
        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <img
            src={participant.avatar || "/placeholder.svg"}
            alt={participant.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
          <div className="text-center">
            <img
              src={participant.avatar || "/placeholder.svg"}
              alt={participant.name}
              className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
            />
            <p className="text-white text-sm">{participant.name}</p>
          </div>
        </div>
      )}

      {/* Participant Info Overlay */}
      <div className="absolute bottom-2 left-2 flex items-center space-x-2">
        <div className="flex items-center space-x-1 bg-black bg-opacity-50 rounded-full px-2 py-1">
          <div className={`w-2 h-2 rounded-full `}></div>
          <span className="text-white text-xs font-medium">
            {participant.name}
          </span>
          {participant.isHost && (
            <span className="text-yellow-400 text-xs">👑</span>
          )}
        </div>
      </div>

      {/* Status Icons */}
      <div className="absolute top-2 right-2 flex space-x-1">
        {participant.isMuted && (
          <div className="bg-red-500 rounded-full p-1">
            <MicOff className="w-3 h-3 text-white" />
          </div>
        )}
        {participant.isPresenting && (
          <div className="bg-blue-500 rounded-full p-1">
            <Monitor className="w-3 h-3 text-white" />
          </div>
        )}
        {/* {isHandRaised && participant.id === "1" && (
          <div className="bg-yellow-500 rounded-full p-1">
            <Hand className="w-3 h-3 text-white" />
          </div>
        )} */}
      </div>

      {/* Hover Controls */}
      <div className="absolute inset-0 bg-black 0 transition-all duration-200 flex flex-col items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-full rounded-xl border"
        />
        <button className="bg-white bg-opacity-20 rounded-full p-2 text-white hover:bg-opacity-30 transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
