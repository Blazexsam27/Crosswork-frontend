"use client";

import { useState, useEffect } from "react";
import {
  User,
  Clock,
  BookOpen,
  Calendar,
  Camera,
  Edit3,
  Save,
  X,
  Users,
} from "lucide-react";
import type { Room, UserProfile } from "@/types/profile/profileTypes";
import { getFromLocalStorage } from "@/utils/webstorage.utls";
import userService from "@/services/user.service";
import { getUser } from "@/features/user/userSlice";
import { useAppDispatch } from "@/hooks/hooks";
import notificationService from "@/services/notification.service";
import { Button } from "@/components/ui/button";
import connectService from "@/services/connect.service";
const mockRooms: Room[] = [
  {
    id: "1",
    title: "Advanced Calculus Study Session",
    subject: "Mathematics",
    date: "2024-01-15",
    duration: "2 hours",
    participants: 5,
    status: "completed",
  },
  {
    id: "2",
    title: "React Hooks Deep Dive",
    subject: "Computer Science",
    date: "2024-01-10",
    duration: "3 hours",
    participants: 8,
    status: "completed",
  },
  {
    id: "3",
    title: "Physics Problem Solving",
    subject: "Physics",
    date: "2024-01-08",
    duration: "1.5 hours",
    participants: 4,
    status: "cancelled",
  },
];

export default function ProfileView() {
  const dispatch = useAppDispatch();
  const [activeSection, setActiveSection] = useState("details");
  const [invites, setInvites] = useState<UserProfile[]>([
    {
      name: "",
      email: "",
      profilePic: "",
      interests: [],
      subjects: [],
      availability: [],
      languages: [],
      bio: "",
    },
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    profilePic: "",
    interests: [],
    subjects: [],
    availability: [],
    languages: [],
    bio: "",
  });
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
  const userData = getFromLocalStorage("user");
  const navigationItems = [
    { id: "details", label: "Profile Details", icon: User },
    { id: "history", label: "Room History", icon: Clock },
    { id: "notifications", label: "Notifications", icon: BookOpen },
    { id: "other", label: "Other Settings", icon: BookOpen },
  ];

  const initUserData = () => {
    setProfile(userData);
    getPendingInvitesOfUser();
  };

  const getPendingInvitesOfUser = async () => {
    try {
      const response = await notificationService.getPendingInvitesOfUser(
        userData._id
      );
      setInvites(response);
    } catch (error) {
      console.error("Error while getting invites:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(profile);
  };

  // handle the updates
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await userService.updateUser(editedProfile);

      // get the new user data.
      dispatch(getUser());
      initUserData();
    } catch (error) {
      console.error("Error while saving profile:", error);
    }
    setProfile(editedProfile);
    setIsEditing(false);
  };

  // const handleAcceptConnection = async () => {
  //   try {
  //     await connectService.acceptRequest(editedProfile._id, userData._id);
  //     getPendingInvitesOfUser();
  //   } catch (error) {
  //     console.error("Error while accepting connection:", error);
  //   }
  // }

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addInterest = (interest: string) => {
    if (interest.trim() && !editedProfile.interests.includes(interest.trim())) {
      handleInputChange("interests", [
        ...editedProfile.interests,
        interest.trim(),
      ]);
    }
  };

  const removeInterest = (index: number) => {
    const newInterests = editedProfile.interests.filter((_, i) => i !== index);
    handleInputChange("interests", newInterests);
  };

  const addLanguage = (language: string) => {
    if (language.trim() && !editedProfile.languages.includes(language.trim())) {
      handleInputChange("languages", [
        ...editedProfile.languages,
        language.trim(),
      ]);
    }
  };

  const removeLanguage = (index: number) => {
    const newlanguages = editedProfile.languages.filter((_, i) => i !== index);
    handleInputChange("languages", newlanguages);
  };

  const addSubject = (subject: string) => {
    if (subject.trim() && !editedProfile.subjects.includes(subject.trim())) {
      handleInputChange("subjects", [
        ...editedProfile.subjects,
        subject.trim(),
      ]);
    }
  };

  const removeSubject = (index: number) => {
    const newSubjects = editedProfile.subjects.filter((_, i) => i !== index);
    handleInputChange("subjects", newSubjects);
  };

  const renderDetailsSection = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Profile Details</h2>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={isEditing ? editedProfile.profilePic : profile.profilePic}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
            />
            {isEditing && (
              <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {profile.name}
            </h3>
            <p className="text-gray-600">{profile.email}</p>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editedProfile.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <p className="px-4 py-3 bg-gray-50 rounded-md text-gray-900">
              {profile.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          {isEditing ? (
            <input
              type="email"
              value={editedProfile.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <p className="px-4 py-3 bg-gray-50 rounded-md text-gray-900">
              {profile.email}
            </p>
          )}
        </div>

        {/* bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          {isEditing ? (
            <textarea
              value={editedProfile.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <p className="px-4 py-3 bg-gray-50 rounded-md text-gray-900">
              {profile.bio}
            </p>
          )}
        </div>
        {/*  Languages*/}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language (s)
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {(isEditing ? editedProfile.languages : profile.languages).map(
              (language, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {language}
                  {isEditing && (
                    <button
                      onClick={() => removeLanguage(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              )
            )}
          </div>
          {isEditing && (
            <input
              type="text"
              placeholder="Add new interest (press Enter)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  addLanguage(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
            />
          )}
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interests
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {(isEditing ? editedProfile.interests : profile.interests).map(
              (interest, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {interest}
                  {isEditing && (
                    <button
                      onClick={() => removeInterest(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              )
            )}
          </div>
          {isEditing && (
            <input
              type="text"
              placeholder="Add new interest (press Enter)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  addInterest(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
            />
          )}
        </div>

        {/* Subjects */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subjects
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {(isEditing ? editedProfile.subjects : profile.subjects).map(
              (subject, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                >
                  {subject}
                  {isEditing && (
                    <button
                      onClick={() => removeSubject(index)}
                      className="ml-2 text-purple-600 hover:text-purple-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              )
            )}
          </div>
          {isEditing && (
            <input
              type="text"
              placeholder="Add new subject (press Enter)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  addSubject(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
            />
          )}
        </div>

        {/* Availability */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Availability
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Available Days</p>
              <div className="space-y-1">
                {(isEditing
                  ? editedProfile.availability.days
                  : profile.availability.days
                ).map((day, index) => (
                  <span
                    key={index}
                    className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm mr-2 mb-1"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Time Slots</p>
              <div className="space-y-1">
                {(isEditing
                  ? editedProfile.availability.timeSlots
                  : profile.availability.timeSlots
                ).map((slot, index) => (
                  <span
                    key={index}
                    className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm mr-2 mb-1"
                  >
                    {slot}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );

  const renderHistorySection = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Room History</h2>
      <div className="space-y-4">
        {mockRooms.map((room) => (
          <div
            key={room.id}
            className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {room.title}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    {room.subject}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(room.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {room.duration}
                  </span>
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {room.participants} participants
                  </span>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  room.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {room.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOtherSection = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Settings</h2>
      <div className="space-y-6">
        <div className="border border-gray-200 rounded-md p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Notification Preferences
          </h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                defaultChecked
              />
              <span className="ml-2 text-gray-700">
                Email notifications for new room invitations
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                defaultChecked
              />
              <span className="ml-2 text-gray-700">
                SMS notifications for upcoming sessions
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Weekly summary emails</span>
            </label>
          </div>
        </div>

        <div className="border border-gray-200 rounded-md p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Privacy Settings
          </h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                defaultChecked
              />
              <span className="ml-2 text-gray-700">
                Make profile visible to other students
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                defaultChecked
              />
              <span className="ml-2 text-gray-700">
                Allow direct messages from other users
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Show online status</span>
            </label>
          </div>
        </div>

        <div className="border border-red-200 rounded-md p-4">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Danger Zone
          </h3>
          <p className="text-gray-600 mb-4">These actions cannot be undone.</p>
          <div className="space-y-2">
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSection = () => {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h2>
        {invites.length > 0 ? (
          <div className="space-y-4">
            {invites.map((invite) => (
              <div
                key={invite._id}
                className="border border-gray-200 rounded-md p-4"
              >
                <p>
                  You got a connection request from: <b>{invite.name}</b>
                </p>
                <div className="flex justify-end items-center gap-2">
                  <Button variant={"gradient"}>Accept</Button>
                  <Button className="bg-red-700">Decline</Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            You don&apos;t have any notifications yet.
          </p>
        )}
      </div>
    );
  };

  useEffect(() => {
    initUserData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Profile Menu
              </h2>
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-left transition-all duration-200 ${
                        activeSection === item.id
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-3">
            {activeSection === "details" && renderDetailsSection()}
            {activeSection === "history" && renderHistorySection()}
            {activeSection === "other" && renderOtherSection()}
            {activeSection === "notifications" && renderNotificationSection()}
          </div>
        </div>
      </div>
    </div>
  );
}
