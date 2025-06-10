import type { Participant } from "@/types/videoroom/videoRoomTypes";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import React from "react";
import { getConnectionQualityColor } from "./utils";

// generate interface for the props
interface SidebarProps {
  setIsParticipantsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isParticipantsOpen: boolean;
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isChatOpen: boolean;
  participants: Participant[];
  chatMessages: any[];
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: React.FormEventHandler<HTMLFormElement>;
}

function Sidebar({
  setIsParticipantsOpen,
  isParticipantsOpen,
  setIsChatOpen,
  isChatOpen,
  participants,
  chatMessages,
  handleSendMessage,
  newMessage,
  setNewMessage,
}: SidebarProps) {
  return (
    <div
      className={`bg-gray-800 border-l border-gray-700 transition-all duration-300 ${
        isChatOpen || isParticipantsOpen ? "w-80" : "w-0"
      } overflow-hidden`}
    >
      {/* Sidebar Header */}
      <div className="border-b border-gray-700 p-4">
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setIsParticipantsOpen(true);
              setIsChatOpen(false);
            }}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              isParticipantsOpen
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            Participants ({participants.length})
          </button>
          <button
            onClick={() => {
              setIsChatOpen(true);
              setIsParticipantsOpen(false);
            }}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              isChatOpen
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            Chat
          </button>
        </div>
      </div>

      {/* Participants Panel */}
      {isParticipantsOpen && (
        <div className="p-4 space-y-3">
          {participants.map((participant) => (
            <div
              key={participant.userId}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <img
                src={participant.avatar || "/placeholder.svg"}
                alt={participant.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-white text-sm font-medium">
                    {participant.name}
                  </span>
                  {participant.isHost && (
                    <span className="text-yellow-400 text-xs">Host</span>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <div
                    className={`w-2 h-2 rounded-full ${getConnectionQualityColor(
                      participant.connectionQuality
                    )}`}
                  ></div>
                  <span className="text-gray-400 text-xs capitalize">
                    {participant.connectionQuality}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {participant.isMuted ? (
                  <MicOff className="w-4 h-4 text-red-400" />
                ) : (
                  <Mic className="w-4 h-4 text-green-400" />
                )}
                {participant.isVideoOn ? (
                  <Video className="w-4 h-4 text-green-400" />
                ) : (
                  <VideoOff className="w-4 h-4 text-red-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chat Panel */}
      {isChatOpen && (
        <div className="flex flex-col h-full">
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`${message.type === "system" ? "text-center" : ""}`}
              >
                {message.type === "system" ? (
                  <span className="text-gray-400 text-xs">
                    {message.message}
                  </span>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-400 text-sm font-medium">
                        {message.userName}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {message.timestamp}
                      </span>
                    </div>
                    <p className="text-gray-200 text-sm">{message.message}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-700">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-700 transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
