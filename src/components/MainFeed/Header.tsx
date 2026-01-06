import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomDock from "../widgets/CustomDock";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getFromLocalStorage } from "@/utils/webstorage.utls";
import communityService from "@/services/community.service";
import userService from "@/services/user.service";
import postsService from "@/services/posts.service";

interface Community {
  _id: string;
  communityName: string;
  description?: string;
  membersCount: number;
  communityIcon?: string;
  category?: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  profilePic?: string;
  bio?: string;
  university?: string[];
}

interface Post {
  _id: string;
  title: string;
  body?: string;
  postType: string;
  tags?: string[];
  score: number;
  commentCount: number;
  createdAt: string;
  author: {
    _id: string;
    name: string;
    profilePic?: string;
  };
  community: {
    _id: string;
    communityName: string;
    communityIcon?: string;
  };
}

export function Header({ setShowPostPopup }: { setShowPostPopup: Function }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    communities: Community[];
    users: User[];
    posts: Post[];
  }>({ communities: [], users: [], posts: [] });
  const [activeTab, setActiveTab] = useState<
    "communities" | "people" | "posts"
  >("communities");
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getFromLocalStorage("authToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery);
      } else {
        setSearchResults({ communities: [], users: [], posts: [] });
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const performSearch = async (query: string) => {
    try {
      setIsSearching(true);
      const [communities, users, posts] = await Promise.all([
        communityService.searchCommunities(query),
        userService.searchUsers(query),
        postsService.searchPosts(query),
      ]);
      setSearchResults({ communities, users, posts });
      setShowResults(true);

      // Auto-switch to posts tab if query starts with #
      if (query.startsWith("#") && posts.length > 0) {
        setActiveTab("posts");
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCommunityClick = (communityId: string) => {
    navigate(`/community-page/${communityId}`);
    setSearchQuery("");
    setShowResults(false);
  };

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
    setSearchQuery("");
    setShowResults(false);
  };

  const handlePostClick = (postId: string) => {
    navigate(`/post/${postId}`);
    setSearchQuery("");
    setShowResults(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults({ communities: [], users: [], posts: [] });
    setShowResults(false);
  };

  return (
    <header className="sticky top-[4rem] z-[9] border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo and Search */}
        <div className="flex flex-1 items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
              FN
            </div>
            <span className="hidden font-bold text-foreground sm:inline-block">
              FeedNet
            </span>
          </div>

          <div className="hidden flex-1 max-w-xl md:block" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowResults(true)}
                placeholder="Search communities, posts, or people..."
                className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* Search Results Dropdown */}
              {showResults &&
                (searchResults.communities.length > 0 ||
                  searchResults.users.length > 0 ||
                  searchResults.posts.length > 0) && (
                  <div className="absolute top-full mt-2 w-full rounded-lg border border-border bg-card shadow-lg z-50">
                    {/* Tabs */}
                    <div className="flex border-b border-border">
                      <button
                        onClick={() => setActiveTab("communities")}
                        className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                          activeTab === "communities"
                            ? "border-b-2 border-primary text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Communities ({searchResults.communities.length})
                      </button>
                      <button
                        onClick={() => setActiveTab("posts")}
                        className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                          activeTab === "posts"
                            ? "border-b-2 border-primary text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Posts ({searchResults.posts.length})
                      </button>
                      <button
                        onClick={() => setActiveTab("people")}
                        className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                          activeTab === "people"
                            ? "border-b-2 border-primary text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        People ({searchResults.users.length})
                      </button>
                    </div>

                    {/* Results */}
                    <div className="max-h-96 overflow-y-auto">
                      {activeTab === "communities" && (
                        <div className="p-2">
                          {searchResults.communities.length === 0 ? (
                            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                              No communities found
                            </p>
                          ) : (
                            searchResults.communities.map((community) => (
                              <button
                                key={community._id}
                                onClick={() =>
                                  handleCommunityClick(community._id)
                                }
                                className="flex w-full items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent"
                              >
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent overflow-hidden">
                                  {community.communityIcon ? (
                                    <img
                                      src={community.communityIcon}
                                      alt={community.communityName}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-xl">🏘️</span>
                                  )}
                                </div>
                                <div className="flex-1 text-left">
                                  <p className="font-medium text-foreground">
                                    c/{community.communityName}
                                  </p>
                                  <p className="text-xs text-muted-foreground line-clamp-1">
                                    {community.description ||
                                      `${community.membersCount.toLocaleString()} members`}
                                  </p>
                                </div>
                              </button>
                            ))
                          )}
                        </div>
                      )}

                      {activeTab === "posts" && (
                        <div className="p-2">
                          {searchResults.posts.length === 0 ? (
                            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                              No posts found
                            </p>
                          ) : (
                            searchResults.posts.map((post) => (
                              <button
                                key={post._id}
                                onClick={() => handlePostClick(post._id)}
                                className="flex w-full flex-col gap-2 rounded-lg p-3 text-left transition-colors hover:bg-accent"
                              >
                                <p className="font-medium text-foreground line-clamp-2">
                                  {post.title}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>c/{post.community.communityName}</span>
                                  <span>•</span>
                                  <span>by {post.author.name}</span>
                                  <span>•</span>
                                  <span>{post.score} points</span>
                                  <span>•</span>
                                  <span>{post.commentCount} comments</span>
                                </div>
                                {post.tags && post.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {post.tags.slice(0, 3).map((tag, index) => (
                                      <span
                                        key={index}
                                        className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                                      >
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </button>
                            ))
                          )}
                        </div>
                      )}

                      {activeTab === "people" && (
                        <div className="p-2">
                          {searchResults.users.length === 0 ? (
                            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                              No people found
                            </p>
                          ) : (
                            searchResults.users.map((user) => (
                              <button
                                key={user._id}
                                onClick={() => handleUserClick(user._id)}
                                className="flex w-full items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent"
                              >
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent overflow-hidden">
                                  {user.profilePic ? (
                                    <img
                                      src={user.profilePic}
                                      alt={user.name}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-sm font-medium">
                                      {user.name.charAt(0).toUpperCase()}
                                    </span>
                                  )}
                                </div>
                                <div className="flex-1 text-left">
                                  <p className="font-medium text-foreground">
                                    {user.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground line-clamp-1">
                                    {user.bio ||
                                      user.university?.[0] ||
                                      user.email}
                                  </p>
                                </div>
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

              {/* Loading State */}
              {isSearching && showResults && (
                <div className="absolute top-full mt-2 w-full rounded-lg border border-border bg-card shadow-lg z-50 p-8">
                  <p className="text-center text-sm text-muted-foreground">
                    Searching...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        {isAuthenticated && (
          <div className="flex items-center gap-2">
            <CustomDock setShowPostPopup={setShowPostPopup} />
          </div>
        )}
      </div>
    </header>
  );
}
