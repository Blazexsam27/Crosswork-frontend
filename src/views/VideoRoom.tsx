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
import {
  getFromLocalStorage,
  getFromSessionStorage,
} from "@/utils/webstorage.utls";
import ParticipantVideo from "@/components/widgets/PatricipantVideo";
import { initSocket } from "@/features/socket/socketSlice";
import { useDispatch } from "react-redux";
import Sidebar from "@/components/VideoRoom/Sidebar";
import BottomControl from "@/components/VideoRoom/BottomControl";
import roomService from "@/services/room.service";

export default function VideoChatRoom() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
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
  const dispatch = useDispatch();
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: user._id,
      userName: user.name,
      message: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "message",
    };

    setChatMessages((prev) => [...prev, message]);
    setNewMessage("");

    socket?.emit("sendMessage", {
      roomId: roomId,
      message,
    });
  };

  // update user audio and mic preference
  const updateUserAudioOrMicPref = async (
    newMutedState: boolean,
    newVideoOnState: boolean,
    socketEvent: string
  ) => {
    try {
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === user._id
            ? { ...p, isMuted: newMutedState, isVideoOn: newVideoOnState }
            : p
        )
      );

      // Get new media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: newVideoOnState,
        audio: newMutedState, // Use the new state
      });

      localStream.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Emit to other participants (via WebSocket or similar)
      socket?.emit(socketEvent, {
        userId: user._id,
        isMuted: newMutedState,
        isVideoOn: newVideoOnState,
      });
    } catch (error) {
      console.error("Error updating audio or mic preference:", error);
    }
  };

  const toggleMute = async () => {
    try {
      // Stop existing tracks to avoid memory leaks
      if (localStream.current) {
        localStream.current.getAudioTracks().forEach((track) => track.stop());
      }

      const newMutedState = !isMuted;
      setIsMuted(newMutedState);

      updateUserAudioOrMicPref(newMutedState, isVideoOn, "audio-toggle");
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

      updateUserAudioOrMicPref(isMuted, newVideoState, "video-toggle");
    } catch (error) {
      console.error("Error toggling video:", error);
    }
  };

  const toggleHandRaise = () => {
    setIsHandRaised(!isHandRaised);
  };

  const copyRoomLink = () => {
    navigator.clipboard.writeText(
      `http://localhost:5173/waiting-lobby/${roomId}`
    );
    // You could add a toast notification here
  };

  const getAllParticipants = async () => {
    try {
      const response = await roomService.getAllParticipants(roomId);
      console.log("partici", response);
      setParticipants(response.participants);
    } catch (error) {
      console.error("Error while getting participants", error);
    }
  };

  useEffect(() => {
    dispatch(initSocket());
    if (!socket || !isConnected) return;

    // get all participants of the room
    getAllParticipants();

    const initLocalStream = async () => {
      const { userName, muted, videoOn, user } =
        getFromSessionStorage("user_video_room");

      console.log("--adding new user", user);
      // Skip if user already in participants
      if (participants.find((p) => p.id === user._id)) return;

      setParticipants((prev) => [
        ...prev,
        {
          id: user._id,
          name: userName,
          avatar: "/your-avatar.png",
          isMuted: muted,
          isVideoOn: videoOn,
          isHost: true,
          connectionQuality: "excellent",
          isPresenting: false,
        },
      ]);

      //  the value of videoOn and muted is coming from waiting lobby selection
      setIsVideoOn(videoOn);
      setIsMuted(muted);
      // Get media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoOn,
        audio: muted,
      });
      localStream.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Rejoin room on reconnect
      const handleReconnect = () => {
        socket.emit("join-room", {
          roomId,
          name: user.name,
          email: user.email,
          isVideoOn,
          isMuted,
        });
      };

      // Add event listeners
      socket.on("reconnect", handleReconnect);

      // Initial join
      socket.emit("join-room", {
        roomId,
        name: user.name,
        email: user.email,
        isVideoOn,
        isMuted,
      });

      // WebRTC Handlers
      socket.on("user-joined", async ({ userId }) => {
        const peer = createPeerConnection(socket, userId, handleTrack);
        localStream.current?.getTracks().forEach((track) => {
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
        localStream.current?.getTracks().forEach((track) => {
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

      // listen for chat messages
      socket.on("receive-message", ({ message }: { message: ChatMessage }) => {
        setChatMessages((prev) => [...prev, { ...message }]);
      });

      // Handle page refresh/disconnect
      const handleBeforeUnload = () => {
        socket.emit("user-disconnecting", { roomId, userId: user._id });
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      // Cleanup function
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        socket.off("reconnect", handleReconnect);

        // Only clean local resources, don't emit leave-room
        cleanupAllPeers(peers, setPeers);
        if (localStream.current) {
          localStream.current.getTracks().forEach((track) => track.stop());
          localStream.current = null;
        }

        // Clean socket listeners
        socket.off("user-joined");
        socket.off("offer");
        socket.off("answer");
        socket.off("ice-candidate");
      };
    };

    const handleTrack = (event: RTCTrackEvent) => {
      const stream = event.streams[0];
      const remoteVideo = document.getElementById(
        `video-${stream.id}`
      ) as HTMLVideoElement;

      if (!remoteVideo) {
        const newVideo = document.createElement("video");
        newVideo.id = `video-${stream.id}`;
        newVideo.autoplay = true;
        newVideo.playsInline = true;
        newVideo.srcObject = stream;
        document.getElementById("remote-videos")?.appendChild(newVideo);
      } else {
        remoteVideo.srcObject = stream;
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

      window.location.href = "/";
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
            </div>
          )}
        </div>

        {/* Sidebar */}
        <Sidebar
          setIsParticipantsOpen={setIsParticipantsOpen}
          isParticipantsOpen={isParticipantsOpen}
          setIsChatOpen={setIsChatOpen}
          isChatOpen={isChatOpen}
          participants={participants}
          chatMessages={chatMessages}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
        />
      </div>

      {/* Bottom Controls */}
      <BottomControl
        toggleMute={toggleMute}
        isMuted={isMuted}
        toggleVideo={toggleVideo}
        isVideoOn={isVideoOn}
        toggleHandRaise={toggleHandRaise}
        isHandRaised={isHandRaised}
        setViewMode={setViewMode}
        viewMode={viewMode}
        setIsRecording={setIsRecording}
        isRecording={isRecording}
        setIsParticipantsOpen={setIsParticipantsOpen}
        setIsChatOpen={setIsChatOpen}
        isChatOpen={isChatOpen}
        isParticipantsOpen={isParticipantsOpen}
        leaveRoom={leaveRoom}
      />
    </div>
  );
}
