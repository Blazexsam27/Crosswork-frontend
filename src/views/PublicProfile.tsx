import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  Calendar,
  Mail,
  Globe,
  Users,
  BookOpen,
  MessageCircle,
  UserPlus,
  UserCheck,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import userService from "@/services/user.service";
import connectService from "@/services/connect.service";
import { getFromLocalStorage } from "@/utils/webstorage.utls";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  profilePic?: string;
  bio?: string;
  interests?: string[];
  subjects?: string[];
  university?: string[];
  languages?: string[];
  availability?: string[];
  experience?: string[];
  connections?: string[];
  createdAt?: string;
}

export default function PublicProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "none" | "pending" | "connected"
  >("none");
  const currentUser = getFromLocalStorage("user");

  useEffect(() => {
    if (userId) {
      fetchUserProfile(userId);
      checkConnectionStatus(userId);
    }
  }, [userId]);

  const fetchUserProfile = async (id: string) => {
    try {
      setLoading(true);
      // Check if viewing own profile
      if (currentUser && currentUser._id === id) {
        setIsOwnProfile(true);
        setProfile(currentUser);
      } else {
        // Fetch specific user's profile by ID
        const targetUser = await userService.getUserById(id);
        setProfile(targetUser);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast({
        title: "User not found",
        description: "The requested user profile does not exist.",
        variant: "destructive",
      });
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const checkConnectionStatus = async (targetUserId: string) => {
    try {
      if (!currentUser || currentUser._id === targetUserId) return;

      // Check if already connected
      if (currentUser.connections?.includes(targetUserId)) {
        setConnectionStatus("connected");
        return;
      }

      // Check if pending request sent
      if (currentUser.sentRequests?.includes(targetUserId)) {
        setConnectionStatus("pending");
        return;
      }

      setConnectionStatus("none");
    } catch (error) {
      console.error("Error checking connection status:", error);
    }
  };

  const handleConnect = async () => {
    if (!profile || !currentUser) return;

    try {
      await connectService.sendConnectRequest(profile._id, currentUser._id);
      setConnectionStatus("pending");
      toast({
        title: "Connection request sent",
        description: `Your connection request has been sent to ${profile.name}.`,
      });
    } catch (error) {
      console.error("Error sending connection request:", error);
      toast({
        title: "Error",
        description: "Failed to send connection request.",
        variant: "destructive",
      });
    }
  };

  const handleMessage = () => {
    // Navigate to chat with this user
    toast({
      title: "Coming soon",
      description: "Direct messaging feature is under development.",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">User not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
            {/* Profile Picture */}
            <div className="relative">
              {profile.profilePic ? (
                <img
                  src={profile.profilePic}
                  alt={profile.name}
                  className="h-32 w-32 rounded-full border-4 border-background object-cover shadow-lg"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-background bg-gradient-to-br from-primary/20 to-accent shadow-lg">
                  <User className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">
                {profile.name}
              </h1>
              {profile.bio && (
                <p className="mt-2 text-muted-foreground">{profile.bio}</p>
              )}

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                {profile.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{profile.email}</span>
                  </div>
                )}
                {profile.university && profile.university.length > 0 && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{profile.university.join(", ")}</span>
                  </div>
                )}
                {profile.createdAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Joined {new Date(profile.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {!isOwnProfile && (
                <div className="mt-6 flex gap-3">
                  {connectionStatus === "none" && (
                    <Button onClick={handleConnect}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Connect
                    </Button>
                  )}
                  {connectionStatus === "pending" && (
                    <Button disabled variant="secondary">
                      <UserCheck className="mr-2 h-4 w-4" />
                      Request Sent
                    </Button>
                  )}
                  {connectionStatus === "connected" && (
                    <Button variant="secondary" disabled>
                      <Users className="mr-2 h-4 w-4" />
                      Connected
                    </Button>
                  )}
                  <Button variant="outline" onClick={handleMessage}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                </div>
              )}

              {isOwnProfile && (
                <div className="mt-6">
                  <Button onClick={() => navigate("/profile")}>
                    Edit Profile
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Interests */}
          {profile.interests && profile.interests.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
                <Globe className="h-5 w-5" />
                Interests
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Subjects */}
          {profile.subjects && profile.subjects.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
                <BookOpen className="h-5 w-5" />
                Subjects
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.subjects.map((subject, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {profile.languages && profile.languages.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
                <Globe className="h-5 w-5" />
                Languages
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.languages.map((language, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-accent px-3 py-1 text-sm text-accent-foreground"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Availability */}
          {profile.availability && profile.availability.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
                <Calendar className="h-5 w-5" />
                Availability
              </h2>
              <div className="space-y-2">
                {profile.availability.map((slot, index) => (
                  <div
                    key={index}
                    className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground"
                  >
                    {slot}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {profile.experience && profile.experience.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-6 md:col-span-2">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
                <User className="h-5 w-5" />
                Experience
              </h2>
              <div className="space-y-2">
                {profile.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="rounded-md border border-border bg-background p-3 text-sm text-foreground"
                  >
                    {exp}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
