"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
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
import type {
  ChatMessage,
  Participant,
} from "@/types/videoroom/videoRoomTypes";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { cleanupAllPeers, createPeerConnection } from "@/config/peerConnection";
import { useLocation } from "react-router-dom";
import {
  getFromLocalStorage,
  getFromSessionStorage,
} from "@/utils/webstorage.utls";
import ParticipantVideo from "@/components/widgets/PatricipantVideo";

export default function VideoChatRoom() {
  const location = useLocation();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  // const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "speaker">("grid");
  const [isHandRaised, setIsHandRaised] = useState(false);
  const { roomId } = getFromSessionStorage("latestRoom");
  const [isRecording, setIsRecording] = useState(false);
  const user = getFromLocalStorage("user");

  // socket and webrtc states

  const { socket, isConnected } = useSelector(
    (state: RootState) => state.socket
  );
  const [peers, setPeers] = useState<Record<string, RTCPeerConnection>>({});
  const localStream = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

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

  const toggleMute = async () => {
    try {
      // Stop existing tracks to avoid memory leaks
      if (localStream.current) {
        localStream.current.getAudioTracks().forEach((track) => track.stop());
      }

      const newMutedState = !isMuted;
      setIsMuted(newMutedState);

      // Update local state
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === user._id ? { ...p, isMuted: newMutedState } : p
        )
      );

      // Get new media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoOn,
        audio: !newMutedState, // Use the new state
      });

      localStream.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Emit to other participants (via WebSocket or similar)
      socket?.emit("audio-toggle", {
        userId: user._id,
        isMuted: newMutedState,
      });
    } catch (error) {
      console.error("Error toggling audio:", error);
    }
  };

  const toggleVideo = async () => {
    try {
      // Stop existing tracks
      if (localStream.current) {
        localStream.current.getVideoTracks().forEach((track) => track.stop());
      }

      const newVideoState = !isVideoOn;
      setIsVideoOn(newVideoState);

      setParticipants((prev) =>
        prev.map((p) =>
          p.id === user._id ? { ...p, isVideoOn: newVideoState } : p
        )
      );

      const stream = await navigator.mediaDevices.getUserMedia({
        video: newVideoState, // Use the new state
        audio: !isMuted,
      });

      localStream.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Emit to other participants
      socket?.emit("video-toggle", {
        userId: user._id,
        isVideoOn: newVideoState,
      });
    } catch (error) {
      console.error("Error toggling video:", error);
    }
  };

  const toggleHandRaise = () => {
    setIsHandRaised(!isHandRaised);
  };

  const copyRoomLink = () => {
    navigator.clipboard.writeText(`http://localhost:5173/videoroom/${roomId}`);
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

  useEffect(() => {
    if (!socket || !isConnected) return;

    const initLocalStream = async () => {
      const { userName, isMuted, isVideoOn, user } = location.state;
      // if user already in participants state then simply return;
      if (participants.find((p) => p.id === user._id)) return;

      setParticipants((prev) => [
        ...prev,
        {
          id: user._id,
          name: userName,
          avatar: "/your-avatar.png",
          isMuted,
          isVideoOn,
          isHost: true, // if applicable
          connectionQuality: "excellent",
          isPresenting: false,
        },
      ]);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStream.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      socket.emit("join-room", { roomId, user });

      socket.on("user-joined", async ({ userId }: { userId: string }) => {
        const peer = createPeerConnection(socket, userId, handleTrack);
        localStream.current!.getTracks().forEach((track) => {
          peer.addTrack(track, localStream.current!);
        });

        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);

        socket.emit("offer", {
          to: userId,
          offer,
        });

        setPeers((prev) => ({ ...prev, [userId]: peer }));
      });

      socket.on("offer", async ({ from, offer }) => {
        const peer = createPeerConnection(socket, from, handleTrack);
        localStream.current!.getTracks().forEach((track) => {
          peer.addTrack(track, localStream.current!);
        });

        await peer.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);

        socket.emit("answer", {
          to: from,
          answer,
        });

        setPeers((prev) => ({ ...prev, [from]: peer }));
      });

      socket.on("answer", async ({ from, answer }) => {
        await peers[from]?.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      });

      socket.on("ice-candidate", async ({ from, candidate }) => {
        if (peers[from]) {
          await peers[from].addIceCandidate(new RTCIceCandidate(candidate));
        }
      });
    };

    const handleTrack = (event: RTCTrackEvent) => {
      const remoteVideo = document.getElementById(
        `video-${event.track.id}`
      ) as HTMLVideoElement;
      if (remoteVideo) {
        remoteVideo.srcObject = event.streams[0];
      } else {
        const newVideo = document.createElement("video");
        newVideo.id = `video-${event.track.id}`;
        newVideo.autoplay = true;
        newVideo.srcObject = event.streams[0];
        document.getElementById("remote-videos")?.appendChild(newVideo);
      }
    };

    initLocalStream();

    return () => {
      socket.emit("leave-room", { roomId });
      Object.values(peers).forEach((peer) => peer.close());
    };
  }, [socket, isConnected]);

  function leaveRoom(): void {
    try {
      // 1. Clean up all peer connections
      cleanupAllPeers(peers, setPeers);

      // 2. Clean up media streams
      if (localStream.current) {
        localStream.current.getTracks().forEach((track) => track.stop());
        localStream.current = null;
      }

      // 3. Remove video elements
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.innerHTML = "";
      }

      // 4. Notify server and other participants
      socket?.emit("leave-room", { roomId });

      // 5. Update local state
      setParticipants([]);
    } catch (error) {
      console.error("Error leaving room:", error);
    }
  }

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
                  videoRef={localVideoRef}
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
                  videoRef={remoteVideoRef}
                  isMain={true}
                />
              </div>
              {/* Thumbnail Strip */}
              {/*    <div className="flex space-x-2 overflow-x-auto pb-2">
                {participants
                  .filter((p) => !p.isPresenting)
                  .map((participant) => (
                    <div key={participant.id} className="flex-shrink-0 w-24">
                      <ParticipantVideo participant={participant} />
                    </div>
                  ))}
              </div> */}
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
              <PhoneOff
                className="w-5 h-5 text-white"
                onClick={() => leaveRoom()}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
