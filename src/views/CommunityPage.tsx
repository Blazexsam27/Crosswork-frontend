"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Users,
  Eye,
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
import { getFromLocalStorage } from "@/utils/webstorage.utls";

// Mock community data
const communityData = {
  id: "computer-science",
  name: "Computer Science Hub",
  icon: "💻",
  coverImage: "/abstract-tech-pattern.png",
  description:
    "A community for computer science students to share knowledge, projects, and career advice",
  members: 45200,
  online: 1234,
  createdDate: "Jan 2023",
  category: "Technology",
  isJoined: false,
  rules: [
    {
      title: "Be respectful",
      description:
        "Treat all members with respect. No harassment, hate speech, or personal attacks.",
    },
    {
      title: "Stay on topic",
      description:
        "Keep posts relevant to computer science, programming, and related fields.",
    },
    {
      title: "No spam",
      description:
        "Don't post promotional content, advertisements, or repetitive posts.",
    },
    {
      title: "Help others learn",
      description:
        "When answering questions, be patient and provide helpful explanations.",
    },
  ],
  moderators: [
    { name: "sarah_dev", avatar: "👩‍💻" },
    { name: "mike_code", avatar: "👨‍💻" },
    { name: "alex_tech", avatar: "🧑‍💻" },
  ],
};

// Mock posts data
const communityPosts = [
  {
    id: 1,
    community: "Computer Science Hub",
    communityIcon: "💻",
    author: "sarah_dev",
    timeAgo: "3h ago",
    title:
      "Just landed my first internship at a FAANG company! Here's what helped me",
    content:
      "After months of preparation and countless applications, I finally got an offer. Happy to share my journey and answer any questions!",
    upvotes: 342,
    comments: 67,
    tags: ["Career", "Internship"],
  },
  {
    id: 2,
    community: "Computer Science Hub",
    communityIcon: "💻",
    author: "john_student",
    timeAgo: "5h ago",
    title: "Best data structures and algorithms resources for beginners?",
    content:
      "I'm struggling with DSA concepts and need some good resources. What helped you master these topics?",
    upvotes: 156,
    comments: 43,
    tags: ["Learning", "DSA"],
  },
  {
    id: 3,
    community: "Computer Science Hub",
    communityIcon: "💻",
    author: "emma_coder",
    timeAgo: "8h ago",
    title: "Built my first full-stack app! Feedback appreciated",
    content:
      "Spent the last 3 months building a task management app with React and Node.js. Would love to hear your thoughts!",
    upvotes: 289,
    comments: 52,
    tags: ["Project", "Web Dev"],
  },
];

export default function CommunityPage() {
  const [isJoined, setIsJoined] = useState(communityData.isJoined);
  const [isNotified, setIsNotified] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "about">("posts");
  const [sortBy, setSortBy] = useState("hot");

  const { id } = useParams();
  const userData = getFromLocalStorage("user");

  const [comm, setComm] = useState(null);

  const getCommunityById = async () => {
    if (!id) return;

    try {
      const comm = await communityService.getCommunityById(id);
      console.log("co", comm);
      setComm(comm);
    } catch (error) {
      console.error("Error while getting community details", error);
    }
  };

  useEffect(() => {
    getCommunityById();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Image */}
      <div className="relative h-32 w-full bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 sm:h-48">
        <div className="absolute inset-0 bg-[url('/abstract-tech-pattern.png')] bg-cover bg-center opacity-50" />
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
                {communityData.icon}
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
                  <div className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4" />
                    <span className="font-medium">{comm?.online}</span>
                    <span>online</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Created {new Date(comm?.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setIsJoined(!isJoined)}
                className={
                  userData?.communities?.includes(id)
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    : ""
                }
              >
                {userData?.communities?.includes(id)
                  ? "Joined"
                  : "Join Community"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsNotified(!isNotified)}
                className={isNotified ? "bg-accent" : ""}
              >
                {isNotified ? (
                  <Bell className="h-4 w-4" />
                ) : (
                  <BellOff className="h-4 w-4" />
                )}
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
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
                      👤
                    </div>
                    <button className="flex-1 rounded-full border border-border bg-muted/50 px-4 py-2.5 text-left text-sm text-muted-foreground hover:bg-muted transition-colors">
                      Create a post...
                    </button>
                    <Button size="icon" className="rounded-full">
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
                  {communityPosts.map((post) => (
                    <FeedCard key={post.id} post={post} />
                  ))}
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
                        <span className="text-2xl">{mod.avatar}</span>
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
                      {comm?.members}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Online</span>
                    <span className="font-semibold text-chart-2">
                      {comm?.online}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Created</span>
                    <span className="font-semibold text-foreground">
                      {new Date(comm?.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <Button className="mt-4 w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Post
                </Button>
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
                      <span className="text-lg">{mod.avatar}</span>
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
    </div>
  );
}
