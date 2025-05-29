"use client";

import type React from "react";

import { useState } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Users,
  MessageCircle,
  Settings,
  Monitor,
  MoreVertical,
  Copy,
  Hand,
  Grid3X3,
  Presentation,
} from "lucide-react";

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isMuted: boolean;
  isVideoOn: boolean;
  isPresenting: boolean;
  isHost: boolean;
  connectionQuality: "excellent" | "good" | "poor";
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
  type: "message" | "system";
}

const mockParticipants: Participant[] = [
  {
    id: "1",
    name: "You",
    avatar: "/placeholder.svg?height=40&width=40",
    isMuted: false,
    isVideoOn: true,
    isPresenting: false,
    isHost: true,
    connectionQuality: "excellent",
  },
  {
    id: "2",
    name: "Sarah Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    isMuted: false,
    isVideoOn: true,
    isPresenting: false,
    isHost: false,
    connectionQuality: "good",
  },
  {
    id: "3",
    name: "Marcus Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    isMuted: true,
    isVideoOn: false,
    isPresenting: false,
    isHost: false,
    connectionQuality: "excellent",
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    isMuted: false,
    isVideoOn: true,
    isPresenting: true,
    isHost: false,
    connectionQuality: "good",
  },
];

const mockChatMessages: ChatMessage[] = [
  {
    id: "1",
    userId: "2",
    userName: "Sarah Chen",
    message: "Hey everyone! Ready to start our study session?",
    timestamp: "10:30 AM",
    type: "message",
  },
  {
    id: "2",
    userId: "system",
    userName: "System",
    message: "Marcus Johnson joined the room",
    timestamp: "10:31 AM",
    type: "system",
  },
  {
    id: "3",
    userId: "3",
    userName: "Marcus Johnson",
    message: "Sorry I'm late! Had some connection issues",
    timestamp: "10:32 AM",
    type: "message",
  },
  {
    id: "4",
    userId: "4",
    userName: "Emily Rodriguez",
    message: "No worries! I'll share my screen to show the presentation",
    timestamp: "10:33 AM",
    type: "message",
  },
];

export default function VideoChatRoom() {
  const [participants, setParticipants] =
    useState<Participant[]>(mockParticipants);
  const [chatMessages, setChatMessages] =
    useState<ChatMessage[]>(mockChatMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "speaker">("grid");
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [roomId] = useState("room-abc-123");
  const [isRecording, setIsRecording] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: "1",
      userName: "You",
      message: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "message",
    };

    setChatMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setParticipants((prev) =>
      prev.map((p) => (p.id === "1" ? { ...p, isMuted: !isMuted } : p))
    );
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    setParticipants((prev) =>
      prev.map((p) => (p.id === "1" ? { ...p, isVideoOn: !isVideoOn } : p))
    );
  };

  const toggleHandRaise = () => {
    setIsHandRaised(!isHandRaised);
  };

  const copyRoomLink = () => {
    navigator.clipboard.writeText(`https://crosswork.com/room/${roomId}`);
    // You could add a toast notification here
  };

  const getConnectionQualityColor = (quality: string) => {
    switch (quality) {
      case "excellent":
        return "bg-green-500";
      case "good":
        return "bg-yellow-500";
      case "poor":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const ParticipantVideo = ({
    participant,
    isMain = false,
  }: {
    participant: Participant;
    isMain?: boolean;
  }) => (
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
          <div
            className={`w-2 h-2 rounded-full ${getConnectionQualityColor(
              participant.connectionQuality
            )}`}
          ></div>
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
        {isHandRaised && participant.id === "1" && (
          <div className="bg-yellow-500 rounded-full p-1">
            <Hand className="w-3 h-3 text-white" />
          </div>
        )}
      </div>

      {/* Hover Controls */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <button className="bg-white bg-opacity-20 rounded-full p-2 text-white hover:bg-opacity-30 transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-white text-lg font-semibold">
              Advanced Calculus Study Group
            </h1>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-300 text-sm">Live</span>
              {isRecording && (
                <div className="flex items-center space-x-1 bg-red-600 rounded-full px-2 py-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-white text-xs">REC</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-gray-300 text-sm">Room ID: {roomId}</span>
            <button
              onClick={copyRoomLink}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              title="Copy room link"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 p-4">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 h-full">
              {participants.map((participant) => (
                <ParticipantVideo
                  key={participant.id}
                  participant={participant}
                />
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col space-y-4">
              {/* Main Speaker */}
              <div className="flex-1">
                <ParticipantVideo
                  participant={
                    participants.find((p) => p.isPresenting) || participants[0]
                  }
                  isMain={true}
                />
              </div>
              {/* Thumbnail Strip */}
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {participants
                  .filter((p) => !p.isPresenting)
                  .map((participant) => (
                    <div key={participant.id} className="flex-shrink-0 w-24">
                      <ParticipantVideo participant={participant} />
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
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
                  key={participant.id}
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
                    className={`${
                      message.type === "system" ? "text-center" : ""
                    }`}
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
                        <p className="text-gray-200 text-sm">
                          {message.message}
                        </p>
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
      </div>

      {/* Bottom Controls */}
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
              <PhoneOff className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
