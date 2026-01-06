import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userService from "@/services/user.service";

interface Community {
  _id: string;
  communityName: string;
  communityIcon?: string;
  membersCount: number;
}

const savedPosts = [
  {
    id: 1,
    title: "How to ace technical interviews",
    community: "Career Advice",
    upvotes: 342,
  },
  {
    id: 2,
    title: "Best online courses for data science",
    community: "Computer Science",
    upvotes: 567,
  },
  {
    id: 3,
    title: "Time management techniques that actually work",
    community: "Study Tips",
    upvotes: 891,
  },
];

const trendingTopics = [
  { id: 1, name: "AI & Machine Learning", posts: "1.2k posts today" },
  { id: 2, name: "Remote Internships", posts: "856 posts today" },
  { id: 3, name: "Study Abroad", posts: "643 posts today" },
  { id: 4, name: "Interview Prep", posts: "521 posts today" },
];

export function QuickAccessPanel({
  selectedQuickAccessTab,
}: {
  selectedQuickAccessTab: "communities" | "saved" | "trending" | null;
}) {
  const [myCommunities, setMyCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedQuickAccessTab === "communities") {
      fetchUserCommunities();
    }
  }, [selectedQuickAccessTab]);

  const fetchUserCommunities = async () => {
    try {
      setLoading(true);
      const communities = await userService.getUserCommunities();
      setMyCommunities(communities);
    } catch (error) {
      console.error("Failed to fetch user communities:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatMemberCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };
  return (
    <div className="my-4 rounded-lg border border-border bg-card shadow-sm">
      {/* Content */}
      <div className="p-4">
        {selectedQuickAccessTab === "communities" && (
          <div className="space-y-2 overflow-y-auto max-h-80">
            <p className="font-semibold text-foreground">My Communities</p>
            {loading ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Loading communities...
              </p>
            ) : myCommunities.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No communities yet. Join or create one to get started!
              </p>
            ) : (
              myCommunities.map((community) => (
                <button
                  key={community._id}
                  onClick={() => navigate(`/community-page/${community._id}`)}
                  className="flex w-full items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent text-xl overflow-hidden">
                    {community.communityIcon ? (
                      <img
                        src={community.communityIcon}
                        alt={community.communityName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>🏘️</span>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground">
                      c/{community.communityName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatMemberCount(community.membersCount)} members
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {selectedQuickAccessTab === "saved" && (
          <div className="space-y-2 overflow-y-auto max-h-80">
            {" "}
            <p className="font-semibold text-foreground">Saved Posts</p>
            {savedPosts.map((post) => (
              <button
                key={post.id}
                className="flex w-full flex-col gap-1 rounded-lg p-3 text-left transition-colors hover:bg-accent"
              >
                <p className="line-clamp-2 text-sm font-medium text-foreground">
                  {post.title}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>c/{post.community}</span>
                  <span>•</span>
                  <span>{post.upvotes} upvotes</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {selectedQuickAccessTab === "trending" && (
          <div className="space-y-2 overflow-y-auto max-h-80">
            {" "}
            <p className="font-semibold text-foreground">Trending</p>
            {trendingTopics.map((topic) => (
              <button
                key={topic.id}
                className="flex w-full items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">{topic.name}</p>
                  <p className="text-xs text-muted-foreground">{topic.posts}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
