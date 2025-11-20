import { TrendingUp, Users, Bookmark, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router-dom";

export function Sidebar({
  communities,
  setSelectedQuickAccessTab,
}: {
  communities: any;
  setSelectedQuickAccessTab: Function;
}) {
  const navigate = useNavigate();
  return (
    <div className="sticky top-20 space-y-4">
      {/* Navigation */}
      <div className="rounded-lg border border-border bg-card p-4">
        <nav className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            onClick={() => setSelectedQuickAccessTab("trending")}
          >
            <TrendingUp className="h-5 w-5" />
            <span>Trending</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            onClick={() => setSelectedQuickAccessTab("communities")}
          >
            <Users className="h-5 w-5" />
            <span>My Communities</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            onClick={() => setSelectedQuickAccessTab("saved")}
          >
            <Bookmark className="h-5 w-5" />
            <span>Saved Posts</span>
          </Button>
          <Button
            onClick={() => navigate("/profile")}
            variant="ghost"
            className="w-full justify-start gap-3"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Button>
        </nav>
      </div>

      {/* Popular Communities */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-3 font-semibold text-foreground">
          Popular Communities
        </h3>
        <div className="space-y-3">
          {communities.map((community: any) => (
            <NavLink
              to={"/community-page/" + community._id}
              key={community.communityName}
              className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-accent"
            >
              <span className="text-2xl">
                <img src={community.communityIcon} alt="" className="w-8 h-8" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {community.communityName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {community.membersCount} members
                </p>
              </div>
            </NavLink>
          ))}
        </div>
        <Button variant="outline" className="mt-4 w-full bg-transparent">
          View All
        </Button>
      </div>
    </div>
  );
}
