"use client";

import { useState, useEffect } from "react";
import { User, Clock, BookOpen, Calendar, Users } from "lucide-react";
import type { Room, UserProfile } from "@/types/profile/profileTypes";
import { getFromLocalStorage } from "@/utils/webstorage.utls";
import userService from "@/services/user.service";
import { getUser } from "@/features/user/userSlice";
import { useAppDispatch } from "@/hooks/hooks";
import notificationService from "@/services/notification.service";
import { Button } from "@/components/ui/button";
import connectService from "@/services/connect.service";
import { useToast } from "@/hooks/use-toast";
import DetailsSection from "@/components/UserProfile/DetailsSection";
import OtherSection from "@/components/UserProfile/OtherSection";
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
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("details");
  const [invites, setInvites] = useState<UserProfile[]>([
    {
      _id: "",
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
    _id: "",
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

  const renderHistorySection = () => (
    <div className="bg-card rounded-2xl shadow-lg p-6 border border-border">
      <h2 className="text-2xl font-bold text-foreground mb-6">Room History</h2>
      <div className="space-y-4">
        {mockRooms.map((room) => (
          <div
            key={room.id}
            className="border border-border rounded-lg p-4 hover:shadow-md transition-all bg-card"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {room.title}
                </h3>
                <div className="flex items-center flex-wrap gap-4 text-sm text-muted-foreground">
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
                className={`px-3 py-1 rounded-sm text-xs font-medium ${
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

  const renderNotificationSection = () => {
    async function handleAcceptInvite(_id: string): Promise<void> {
      // Handle accept invite
      try {
        const response = await connectService.acceptRequest(_id, userData._id);
        if (response) {
          toast({
            title: "Success",
            description: "Invitation accepted!",
          });
          getPendingInvitesOfUser();
        }
      } catch (error) {
        console.error("Error while accepting invite:", error);
        toast({
          title: "Error",
          description: "Failed to accept invitation",
          variant: "destructive",
        });
      }
    }

    async function handleDeclineInvite(_id: string): Promise<void> {
      try {
        const response = await connectService.declineRequest(_id, userData._id);
        if (response) {
          toast({
            title: "Success",
            description: "Invitation declined",
          });
          getPendingInvitesOfUser();
        }
      } catch (error) {
        console.error("Error while declining invite:", error);
        toast({
          title: "Error",
          description: "Failed to decline invitation",
          variant: "destructive",
        });
      }
    }

    return (
      <div className="bg-card rounded-2xl shadow-lg p-6 border border-border">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Notifications
        </h2>
        {invites.length > 0 ? (
          <div className="space-y-4">
            {invites.map((invite) => (
              <div
                key={invite._id}
                className="border border-border rounded-lg p-4 bg-card hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      {invite.profilePic ? (
                        <img
                          src={invite.profilePic}
                          alt={invite.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xl">
                          {invite.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-foreground font-medium">
                        <b>{invite.name}</b> sent you a connection request
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {invite.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleAcceptInvite(invite._id)}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeclineInvite(invite._id)}
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              You don&apos;t have any notifications yet.
            </p>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    initUserData();
  }, []);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl shadow-lg p-6 sticky top-24 border border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Profile Menu
              </h2>
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        activeSection === item.id
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "text-foreground hover:bg-accent"
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
            {activeSection === "details" && (
              <DetailsSection
                isEditing={isEditing}
                handleEdit={handleEdit}
                handleSave={handleSave}
                handleCancel={handleCancel}
                profile={profile}
                handleInputChange={handleInputChange}
                editedProfile={editedProfile}
                addLanguage={addLanguage}
                removeLanguage={removeLanguage}
                addSubject={addSubject}
                removeSubject={removeSubject}
                addInterest={addInterest}
                removeInterest={removeInterest}
              />
            )}
            {activeSection === "history" && renderHistorySection()}
            {activeSection === "other" && <OtherSection />}
            {activeSection === "notifications" && renderNotificationSection()}
          </div>
        </div>
      </div>
    </div>
  );
}
