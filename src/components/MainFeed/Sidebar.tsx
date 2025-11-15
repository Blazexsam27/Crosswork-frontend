import { Home, TrendingUp, Users, Bookmark, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

export function Sidebar({ communities }) {
  return (
    <div className="sticky top-20 space-y-4">
      {/* Navigation */}
      <div className="rounded-lg border border-border bg-card p-4">
        <nav className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 bg-accent text-accent-foreground"
          >
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <TrendingUp className="h-5 w-5" />
            <span>Trending</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Users className="h-5 w-5" />
            <span>My Communities</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Bookmark className="h-5 w-5" />
            <span>Saved</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
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
          {communities.map((community) => (
            <NavLink
              to={"/community-page/" + community._id}
              key={community.communityName}
              className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-accent"
            >
              <span className="text-2xl">{community.icon}</span>
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
