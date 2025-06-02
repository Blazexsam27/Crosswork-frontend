"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  // Settings,
  Users,
  Clock,
  Copy,
  Check,
} from "lucide-react";
import {
  getFromLocalStorage,
  getFromSessionStorage,
  setInSessionStorage,
} from "@/utils/webstorage.utls";
import roomService from "@/services/room.service";

export default function WaitingLobby() {
  const navigate = useNavigate();
  const [muted, setMuted] = useState(true);
  const [videoOn, setVideoOn] = useState(false);
  const [userName, setUserName] = useState("John Doe");
  const [isJoining, setIsJoining] = useState(false);
  const [waitingTime, setWaitingTime] = useState(0);
  const [linkCopied, setLinkCopied] = useState(false);
  const [participantCount] = useState(4);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const user = getFromLocalStorage("user");

  const [room, setRoom] = useState({
    roomId: "",
    roomName: "",
    host: "",
  });

  // const { roomId, roomName, host } = getFromSessionStorage("latestRoom");
  // if user came using room link then set the data accordingly
  const roomIdFromUrl = window.location.pathname.split("/")[2];

  const getRoom = async () => {
    const room = await roomService.getRoomById(roomIdFromUrl);
    setRoom({
      roomId: room._id,
      roomName: room.name,
      host: room.host,
    });
    setInSessionStorage("latestRoom", {
      roomId: room._id,
      roomName: room.name,
      host: room.host,
    });
  };

  useEffect(() => {
    // get the room by id
    getRoom();
  }, []);

  // Update preview video element when mediaStream changes
  useEffect(() => {
    if (videoRef.current) {
      if (mediaStream) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [mediaStream]);

  // Request media devices and start preview on Join
  const handleJoinRoom = async () => {
    setIsJoining(true);
    try {
      if (!muted || videoOn) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: muted,
          video: videoOn,
        });
        setMediaStream(stream);
      }

      setInSessionStorage("user_video_room", {
        userName,
        muted,
        videoOn,
        user,
      });
      navigate(`/videoroom/${room.roomId}`);
    } catch (err) {
      alert(
        "Unable to access camera/microphone. Please check permissions and try again."
      );
      console.error("error", err);
      setIsJoining(false);
    }
  };

  const copyRoomLink = () => {
    navigator.clipboard.writeText(
      `http://localhost:5173/waiting-lobby/${room.roomId}`
    );
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Video Preview */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Camera Preview
              </h3>

              {/* Video Preview Area */}
              <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video mb-4">
                {videoOn && mediaStream ? (
                  <video
                    ref={videoRef}
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white text-2xl font-bold">
                          {userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <p className="text-white font-medium">{userName}</p>
                    </div>
                  </div>
                )}

                {!videoOn && (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <VideoOff className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400 absolute bottom-4">
                      Camera is off
                    </p>
                  </div>
                )}

                {/* Status Indicators */}
                <div className="absolute bottom-4 left-4 flex space-x-2">
                  {muted && (
                    <div className="bg-red-500 rounded-full p-2">
                      <MicOff className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setMuted(!muted)}
                  className={`p-3 rounded-full transition-colors ${
                    muted
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  title={muted ? "Unmute" : "Mute"}
                >
                  {muted ? (
                    <MicOff className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </button>

                <button
                  onClick={() => setVideoOn(!videoOn)}
                  className={`p-3 rounded-full transition-colors ${
                    !videoOn
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  title={videoOn ? "Turn off camera" : "Turn on camera"}
                >
                  {videoOn ? (
                    <Video className="w-5 h-5" />
                  ) : (
                    <VideoOff className="w-5 h-5" />
                  )}
                </button>

                {/* <button
                  className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  title="Settings"
                >
                  <Settings className="w-5 h-5" />
                </button> */}
              </div>

              {/* Name Input */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>
            </div>
          </div>

          {/* Room Info & Join */}
          <div className="order-1 lg:order-2">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Ready to join?
              </h1>

              <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {room.roomName}
                    </h2>
                    <p className="text-gray-600">Hosted by {room.host}</p>
                  </div>

                  <div className="flex items-center justify-between py-3 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700">
                        {participantCount} participants
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700">
                        Waiting {formatTime(waitingTime)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-t border-gray-200">
                    <div>
                      <p className="text-sm text-gray-600">Room ID</p>
                      <p className="font-mono text-gray-900">{room.roomId}</p>
                    </div>
                    <button
                      onClick={copyRoomLink}
                      className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      {linkCopied ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span className="text-sm">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-sm">Copy link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Join Button */}
              <button
                onClick={handleJoinRoom}
                disabled={isJoining || !userName.trim()}
                className="w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isJoining ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Joining room...
                  </span>
                ) : (
                  "Join now"
                )}
              </button>

              {!userName.trim() && (
                <p className="text-sm text-gray-500 mt-2">
                  Please enter your name to join
                </p>
              )}

              {/* Additional Info */}
              <div className="mt-6 text-sm text-gray-600">
                <p>
                  By joining, you agree to our{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
