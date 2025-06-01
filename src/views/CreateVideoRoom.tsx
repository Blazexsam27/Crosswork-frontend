"use client";

import type React from "react";

import { useState } from "react";
import { Users, Clock, Lock, Globe, Copy, Check, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import roomService from "@/services/room.service";
import {
  getFromLocalStorage,
  setInSessionStorage,
} from "@/utils/webstorage.utls";

interface RoomSettings {
  name: string;
  host: string;
  description: string;
  maxParticipants: number;
  isPrivate: boolean;
  requireApproval: boolean;
  allowRecording: boolean;
  scheduledTime: string;
  duration: number;
}

export default function CreateRoom() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [roomCreated, setRoomCreated] = useState(false);
  const [generatedRoomId, setGeneratedRoomId] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [settings, setSettings] = useState<RoomSettings>({
    name: "",
    host: "",
    description: "",
    maxParticipants: 10,
    isPrivate: false,
    requireApproval: false,
    allowRecording: true,
    scheduledTime: "",
    duration: 60,
  });
  const user = getFromLocalStorage("user");

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      settings.host = user.name;
      const response = await roomService.createRoom({
        ...settings,
      });
      setInSessionStorage("latestRoom", {
        roomId: response._id,
        roomName: response.name,
        host: user.name,
      });
      navigate("/waiting-lobby/" + response._id);
    } catch (error) {
      console.error("Error while creating room:", error);
    }
  };

  const copyRoomLink = () => {
    const roomUrl = `${window.location.origin}/video-chat/lobby/${generatedRoomId}`;
    navigator.clipboard.writeText(roomUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleJoinRoom = () => {
    navigate(`/videoroom/waiting-lobby/${generatedRoomId}`);
  };

  const handleInputChange = (field: keyof RoomSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (roomCreated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Room Created Successfully!
            </h1>
            <p className="text-gray-600 mb-8">
              Your video chat room is ready. Share the link with participants.
            </p>

            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {settings.name}
                  </h3>
                  {settings.description && (
                    <p className="text-gray-600 text-sm">
                      {settings.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">
                      Max {settings.maxParticipants} participants
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">
                      {settings.duration} minutes
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {settings.isPrivate ? (
                      <Lock className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Globe className="w-4 h-4 text-gray-500" />
                    )}
                    <span className="text-gray-700">
                      {settings.isPrivate ? "Private" : "Public"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Video className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">
                      Recording{" "}
                      {settings.allowRecording ? "enabled" : "disabled"}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Room ID</p>
                      <p className="font-mono text-lg font-semibold text-gray-900">
                        {generatedRoomId}
                      </p>
                    </div>
                    <button
                      onClick={copyRoomLink}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      {linkCopied ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm font-medium mb-2">
                    Room URL:
                  </p>
                  <p className="text-blue-700 text-sm font-mono break-all">
                    {typeof window !== "undefined" &&
                      `${window.location.origin}/video-chat/lobby/${generatedRoomId}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleJoinRoom}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                Join Room Now
              </button>
              <button
                onClick={() => {
                  setRoomCreated(false);
                  setSettings({
                    name: "",
                    host: "",
                    description: "",
                    maxParticipants: 10,
                    isPrivate: false,
                    requireApproval: false,
                    allowRecording: true,
                    scheduledTime: "",
                    duration: 60,
                  });
                }}
                className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Create Another Room
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Create Video Chat Room
          </h1>
          <p className="text-gray-600">
            Set up your study session or meeting room
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleCreateRoom} className="space-y-6">
            {/* Room Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Advanced Calculus Study Group"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={settings.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Brief description of the session..."
              />
            </div>

            {/* Room Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Max Participants */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Participants
                </label>
                <select
                  value={settings.maxParticipants}
                  onChange={(e) =>
                    handleInputChange(
                      "maxParticipants",
                      Number.parseInt(e.target.value)
                    )
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>5 participants</option>
                  <option value={10}>10 participants</option>
                  <option value={25}>25 participants</option>
                  <option value={50}>50 participants</option>
                  <option value={100}>100 participants</option>
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Duration
                </label>
                <select
                  value={settings.duration}
                  onChange={(e) =>
                    handleInputChange(
                      "duration",
                      Number.parseInt(e.target.value)
                    )
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                  <option value={180}>3 hours</option>
                </select>
              </div>
            </div>

            {/* Scheduled Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule for Later (Optional)
              </label>
              <input
                type="datetime-local"
                value={settings.scheduledTime}
                onChange={(e) =>
                  handleInputChange("scheduledTime", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={new Date().toISOString().slice(0, 16)}
              />
              <p className="text-sm text-gray-500 mt-1">
                Leave empty to start immediately
              </p>
            </div>

            {/* Room Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Room Settings
              </h3>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.isPrivate}
                    onChange={(e) =>
                      handleInputChange("isPrivate", e.target.checked)
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-700">
                    <span className="font-medium">Private Room</span>
                    <span className="block text-sm text-gray-500">
                      Only people with the link can join
                    </span>
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.requireApproval}
                    onChange={(e) =>
                      handleInputChange("requireApproval", e.target.checked)
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-700">
                    <span className="font-medium">Require Host Approval</span>
                    <span className="block text-sm text-gray-500">
                      Participants wait in lobby for approval
                    </span>
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.allowRecording}
                    onChange={(e) =>
                      handleInputChange("allowRecording", e.target.checked)
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-700">
                    <span className="font-medium">Allow Recording</span>
                    <span className="block text-sm text-gray-500">
                      Enable session recording functionality
                    </span>
                  </span>
                </label>
              </div>
            </div>

            {/* Create Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isCreating || !settings.name.trim()}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isCreating ? (
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
                    Creating Room...
                  </span>
                ) : (
                  "Create Room"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
