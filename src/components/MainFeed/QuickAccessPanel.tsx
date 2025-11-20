import { TrendingUp } from "lucide-react";

const myCommunities = [
  { id: 1, name: "Computer Science", icon: "💻", members: "45.2k" },
  { id: 2, name: "Business Students", icon: "📊", members: "32.1k" },
  { id: 3, name: "Study Tips", icon: "📚", members: "78.9k" },
  { id: 4, name: "Engineering", icon: "⚙️", members: "56.3k" },
];

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
  return (
    <div className="my-4 rounded-lg border border-border bg-card shadow-sm">
      {/* Content */}
      <div className="p-4">
        {selectedQuickAccessTab === "communities" && (
          <div className="space-y-2 overflow-y-auto max-h-80">
            <p className="font-semibold text-foreground">My Communities</p>
            {myCommunities.map((community) => (
              <button
                key={community.id}
                className="flex w-full items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent text-xl">
                  {community.icon}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">
                    c/{community.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {community.members} members
                  </p>
                </div>
              </button>
            ))}
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
