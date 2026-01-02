import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Users,
  Calendar,
  Plus,
  Share2,
  MoreHorizontal,
  Bell,
  BellOff,
} from "lucide-react";
import { NavLink, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FeedCard } from "@/components/MainFeed/FeedCard";
import communityService from "@/services/community.service";
import {
  getFromLocalStorage,
  setInLocalStorage,
} from "@/utils/webstorage.utls";
import type { CommunityType } from "@/types/community/communityTypes";
import postsService from "@/services/posts.service";
import type { PostType } from "@/types/post/post.types";
import userService from "@/services/user.service";
import CreatePostForm from "@/components/CommunityPage/CreatePostForm";
import CommunitySettings from "@/components/CommunityPage/CommunitySettings";
import { useToast } from "@/hooks/use-toast";

export default function CommunityPage() {
  const [isNotified, setIsNotified] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "about">("posts");
  const [sortBy, setSortBy] = useState("hot");
  const [communityPosts, setCommunityPosts] = useState<PostType[]>([]);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [userData, setUserData] = useState(getFromLocalStorage("user"));

  const { id } = useParams();
  const { toast } = useToast();

  const [comm, setComm] = useState<CommunityType | null>(null);

  const isJoined = userData?.communities?.includes(id);
  const isModerator = comm?.moderators?.some(
    (mod: any) => mod._id === userData?._id || mod === userData?._id
  );

  const getCommunityById = async () => {
    if (!id) return;

    try {
      const comm = await communityService.getCommunityById(id);
      setComm(comm);
    } catch (error) {
      console.error("Error while getting community details", error);
      toast({
        title: "Error",
        description: "Failed to load community details",
        variant: "destructive",
      });
    }
  };

  const getCommunityPosts = async () => {
    if (!id) return;

    try {
      const posts = await postsService.getPostsByCommunityId(id);
      console.log("Posts", posts);
      setCommunityPosts(posts);
    } catch (error) {
      console.error("Error while getting community posts", error);
    }
  };

  const handleJoinLeave = async () => {
    if (!id) return;

    try {
      if (isJoined) {
        const updatedUser = await userService.leaveCommunity(id);
        setUserData(updatedUser);
        setInLocalStorage("user", updatedUser);
        toast({
          title: "Left community",
          description: `You have left ${comm?.communityName}`,
        });
      } else {
        const updatedUser = await userService.joinCommunity(id);
        setUserData(updatedUser);
        setInLocalStorage("user", updatedUser);
        toast({
          title: "Joined community",
          description: `You have joined ${comm?.communityName}`,
        });
      }
      // Refresh community data to update member count
      getCommunityById();
    } catch (error) {
      console.error("Error while joining/leaving community", error);
      toast({
        title: "Error",
        description: "Failed to update community membership",
        variant: "destructive",
      });
    }
  };

  const handlePostCreated = () => {
    getCommunityPosts();
    setCreatePostOpen(false);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied",
      description: "Community link copied to clipboard",
    });
  };

  const handleSettingsSave = async (formData: FormData) => {
    if (!id) return;

    try {
      await communityService.updateCommunity(id, formData);
      toast({
        title: "Success",
        description: "Community settings updated successfully",
      });
      // Refresh community data
      getCommunityById();
    } catch (error) {
      console.error("Error updating community:", error);
      toast({
        title: "Error",
        description: "Failed to update community settings",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    getCommunityById();
    getCommunityPosts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Image */}
      <div
        className="relative h-32 w-full sm:h-48"
        style={{
          background: comm?.communityCoverImage
            ? getCoverGradient(comm.communityCoverImage)
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-50" />
      </div>

      {/* Community Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4">
          {/* Back Button */}
          <div className="my-12">
            <NavLink
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </NavLink>
          </div>

          {/* Community Info */}
          <div className="flex flex-col gap-4 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex gap-4">
              {/* Community Icon */}
              <div className="-mt-8 flex h-20 w-20 items-center justify-center rounded-full border-4 border-card bg-gradient-to-br from-primary/20 to-accent/20 text-4xl shadow-lg sm:h-24 sm:w-24 sm:text-5xl">
                <img src={comm?.communityIcon} alt="" />
              </div>

              {/* Name and Stats */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground sm:text-3xl capitalize">
                  {comm?.communityName}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">{comm?.membersCount}</span>
                    <span>members</span>
                  </div>
                  <span>•</span>
                  {/* <div className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4" />
                    <span className="font-medium">{comm?.online}</span>
                    <span>online</span>
                  </div> */}
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Created{" "}
                      {comm && new Date(comm?.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleJoinLeave}
                className={
                  isJoined
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    : ""
                }
              >
                {isJoined ? "Joined" : "Join Community"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsNotified(!isNotified)}
                className={isNotified ? "bg-accent" : ""}
                title={
                  isNotified ? "Disable notifications" : "Enable notifications"
                }
              >
                {isNotified ? (
                  <Bell className="h-4 w-4" />
                ) : (
                  <BellOff className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                title="Share community"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              {isModerator && (
                <Button
                  variant="outline"
                  onClick={() => setSettingsOpen(true)}
                  title="Community settings"
                >
                  Settings
                </Button>
              )}
              <Button variant="outline" size="icon" title="More options">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab("posts")}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "posts"
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "about"
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              About
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Main Feed */}
          <main className="lg:col-span-8">
            {activeTab === "posts" && (
              <>
                {/* Create Post */}
                <div className="mb-4 rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-xl">
                      {userData?.profilePic ? (
                        <img
                          src={userData.profilePic}
                          alt={userData.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        "👤"
                      )}
                    </div>
                    <button
                      onClick={() => setCreatePostOpen(true)}
                      className="flex-1 rounded-full border border-border bg-muted/50 px-4 py-2.5 text-left text-sm text-muted-foreground hover:bg-muted transition-colors"
                    >
                      Create a post...
                    </button>
                    <Button
                      size="icon"
                      className="rounded-full"
                      onClick={() => setCreatePostOpen(true)}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Sort Options */}
                <div className="mb-4 flex items-center justify-between">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="hot">Hot</option>
                    <option value="new">New</option>
                    <option value="top">Top</option>
                    <option value="rising">Rising</option>
                  </select>
                </div>

                {/* Posts Feed */}
                <div className="space-y-4">
                  {communityPosts.length > 0 ? (
                    communityPosts.map((post: PostType) => (
                      <FeedCard key={post._id} post={post} />
                    ))
                  ) : (
                    <div className="rounded-lg border border-border bg-card p-8 text-center">
                      <p className="text-muted-foreground">
                        No posts yet. Be the first to post!
                      </p>
                      <Button
                        className="mt-4"
                        onClick={() => setCreatePostOpen(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Post
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === "about" && (
              <div className="space-y-6">
                {/* Description */}
                <div className="rounded-lg border border-border bg-card p-6">
                  <h2 className="mb-3 text-lg font-semibold text-foreground">
                    About Community
                  </h2>
                  <p className="leading-relaxed text-muted-foreground">
                    {comm?.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                      {comm?.category}
                    </span>
                  </div>
                </div>

                {/* Rules */}
                <div className="rounded-lg border border-border bg-card p-6">
                  <h2 className="mb-4 text-lg font-semibold text-foreground">
                    Community Rules
                  </h2>
                  <div className="space-y-4">
                    {comm?.rules.map((rule, index) => (
                      <div
                        key={index}
                        className="border-l-2 border-primary pl-4"
                      >
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                            {index + 1}
                          </span>
                          <h3 className="font-medium text-foreground">
                            {rule.title}
                          </h3>
                        </div>
                        {/* <p className="mt-2 text-sm text-muted-foreground">
                          {rule.description}
                        </p> */}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Moderators */}
                <div className="rounded-lg border border-border bg-card p-6">
                  <h2 className="mb-4 text-lg font-semibold text-foreground">
                    Moderators
                  </h2>
                  <div className="space-y-3">
                    {comm?.moderators.map((mod) => (
                      <div key={mod.name} className="flex items-center gap-3">
                        <div className="-mt-8 flex h-20 w-20 items-center justify-center rounded-full border-4 border-card bg-gradient-to-br from-primary/20 to-accent/20 text-4xl shadow-lg sm:h-24 sm:w-24 sm:text-5xl">
                          <img src={mod.profilePic} alt="" />
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          u/{mod.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-20 space-y-4">
              {/* Community Info Card */}
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="mb-3 font-semibold text-foreground">About</h3>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  {comm?.description}
                </p>

                <div className="space-y-3 border-t border-border pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Members</span>
                    <span className="font-semibold text-foreground">
                      {comm?.membersCount}
                    </span>
                  </div>
                  {/* <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Online</span>
                    <span className="font-semibold text-chart-2">
                      {comm?.online}
                    </span>
                  </div> */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Created</span>
                    <span className="font-semibold text-foreground">
                      {comm && new Date(comm.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rules Card */}
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="mb-3 font-semibold text-foreground">
                  Community Rules
                </h3>
                <div className="space-y-2">
                  {comm?.rules.slice(0, 3).map((rule, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium text-foreground">
                        {index + 1}. {rule.title}
                      </span>
                    </div>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  className="mt-3 w-full text-sm"
                  onClick={() => setActiveTab("about")}
                >
                  View All Rules
                </Button>
              </div>

              {/* Moderators Card */}
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="mb-3 font-semibold text-foreground">
                  Moderators
                </h3>
                <div className="space-y-2">
                  {comm?.moderators.map((mod) => (
                    <div
                      key={mod.name}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className=" flex h-8 w-8 items-center justify-center rounded-full border-4 border-card bg-gradient-to-br from-primary/20 to-accent/20 text-4xl shadow-lg sm:h-10 sm:w-10 sm:text-5xl">
                        <img src={mod.profilePic} alt="" />
                      </div>
                      <span className="text-foreground">u/{mod.name}</span>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="mt-3 w-full text-sm">
                  Message Mods
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Create Post Dialog */}
      {comm && (
        <CreatePostForm
          communityName={comm?.communityName}
          communityId={comm?._id}
          open={createPostOpen}
          onOpenChange={setCreatePostOpen}
          onPostCreated={handlePostCreated}
        />
      )}

      {/* Community Settings Dialog */}
      {comm && isModerator && (
        <CommunitySettings
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          community={comm}
          onSave={handleSettingsSave}
        />
      )}
    </div>
  );
}

// Helper function to get gradient by ID
const getCoverGradient = (id: string) => {
  const gradients: Record<string, string> = {
    sunset: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    ocean: "linear-gradient(135deg, #2E3192 0%, #1BFFFF 100%)",
    fire: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    forest: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    candy: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    aurora: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    emerald: "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)",
    royal: "linear-gradient(135deg, #667eea 0%, #f093fb 100%)",
  };
  return gradients[id] || gradients.sunset;
};
