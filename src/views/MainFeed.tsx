import { Header } from "@/components/MainFeed/Header";
import { Sidebar } from "@/components/MainFeed/Sidebar";
import { FeedCard } from "@/components/MainFeed/FeedCard";
import { TrendingCommunities } from "@/components/MainFeed/TrendingCommunities";
import TrendingPostMarquee from "@/components/MainFeed/TrendingPostMarquee";
import communityService from "@/services/community.service";
import { useEffect, useState } from "react";
import CreatePostForm from "@/components/CommunityPage/CreatePostForm";
import { QuickAccessPanel } from "@/components/MainFeed/QuickAccessPanel";
import type { PostType } from "@/types/post/post.types";
import postsService from "@/services/posts.service";
// Sample data for posts

export default function Home() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [communities, setCommunities] = useState([]);
  const [showPostPopup, setShowPostPopup] = useState(false);
  const [selectedQuickAccessTab, setSelectedQuickAccessTab] = useState<
    "communities" | "saved" | "trending"
  >("communities");

  const getAllCommunities = async () => {
    try {
      const communities = await communityService.getAllCommunities();
      setCommunities(communities);
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const getAllPosts = async () => {
    try {
      const response = await postsService.getAllPosts();

      setPosts(response);
    } catch (error) {
      console.error("Error while getting posts", error);
    }
  };

  useEffect(() => {
    getAllCommunities();
    getAllPosts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header setShowPostPopup={setShowPostPopup} />

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Sidebar - Hidden on mobile */}
          <aside className="hidden lg:col-span-3 lg:block">
            <Sidebar
              communities={communities}
              setSelectedQuickAccessTab={setSelectedQuickAccessTab}
            />
          </aside>

          <CreatePostForm
            open={showPostPopup}
            onOpenChange={(value) => setShowPostPopup(value)}
          />
          {/* Main Feed */}
          <main className="lg:col-span-6">
            {/* <div className="mb-4 flex items-center justify-between">
              <select className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground">
                <option>Hot</option>
                <option>New</option>
                <option>Top</option>
              </select>
            </div> */}

            <QuickAccessPanel selectedQuickAccessTab={selectedQuickAccessTab} />
            <TrendingPostMarquee />
            <div className="space-y-4">
              {posts.map((post) => (
                <FeedCard key={post._id} post={post} />
              ))}
            </div>
          </main>

          {/* Right Sidebar - Hidden on mobile and tablet */}
          <aside className="hidden xl:col-span-3 xl:block">
            <TrendingCommunities
              communities={communities}
              setShowPostPopup={setShowPostPopup}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
