import { Header } from "@/components/MainFeed/Header";
import { Sidebar } from "@/components/MainFeed/Sidebar";
import { FeedCard } from "@/components/MainFeed/FeedCard";
import { TrendingCommunities } from "@/components/MainFeed/TrendingCommunities";
import TrendingPostMarquee from "@/components/MainFeed/TrendingPostMarquee";
import communityService from "@/services/community.service";
import { useEffect, useState } from "react";

// Sample data for posts
const posts = [
  {
    id: 1,
    community: "Computer Science",
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
    community: "Business Students",
    communityIcon: "📊",
    author: "mike_mba",
    timeAgo: "5h ago",
    title: "Best resources for learning financial modeling?",
    content:
      "I'm preparing for investment banking interviews and need to brush up on my Excel skills. What courses or resources would you recommend?",
    upvotes: 128,
    comments: 34,
    tags: ["Finance", "Resources"],
  },
  {
    id: 3,
    community: "Study Tips",
    communityIcon: "📚",
    author: "alex_scholar",
    timeAgo: "7h ago",
    title: "How I maintain a 4.0 GPA while working part-time",
    content:
      "Time management is everything. Here are the strategies that work for me...",
    upvotes: 891,
    comments: 156,
    tags: ["Productivity", "Study"],
  },
  {
    id: 4,
    community: "Engineering",
    communityIcon: "⚙️",
    author: "jenny_eng",
    timeAgo: "9h ago",
    title: "Senior design project ideas for mechanical engineering?",
    content:
      "Looking for innovative project ideas that could also look good on a resume. What did you work on?",
    upvotes: 67,
    comments: 23,
    tags: ["Projects", "Mechanical"],
  },
  {
    id: 5,
    community: "Career Advice",
    communityIcon: "💼",
    author: "david_career",
    timeAgo: "12h ago",
    title: "Should I accept a lower salary for better work-life balance?",
    content:
      "I have two offers - one pays 20% more but requires 60+ hour weeks. The other has great culture and flexibility. Thoughts?",
    upvotes: 234,
    comments: 89,
    tags: ["Career", "Advice"],
  },
];

export default function Home() {
  const [communities, setCommunities] = useState([]);

  const getAllCommunities = async () => {
    try {
      const communities = await communityService.getAllCommunities();
      setCommunities(communities);
    } catch (error: any) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    getAllCommunities();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Sidebar - Hidden on mobile */}
          <aside className="hidden lg:col-span-3 lg:block">
            <Sidebar communities={communities} />
          </aside>

          {/* Main Feed */}
          <main className="lg:col-span-6">
            {/* <div className="mb-4 flex items-center justify-between">
              <select className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground">
                <option>Hot</option>
                <option>New</option>
                <option>Top</option>
              </select>
            </div> */}
            <TrendingPostMarquee />
            <div className="space-y-4">
              {posts.map((post) => (
                <FeedCard key={post.id} post={post} />
              ))}
            </div>
          </main>

          {/* Right Sidebar - Hidden on mobile and tablet */}
          <aside className="hidden xl:col-span-3 xl:block">
            <TrendingCommunities />
          </aside>
        </div>
      </div>
    </div>
  );
}
