import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

export function TrendingCommunities({
  communities,
  setShowPostPopup,
}: {
  communities: any;
  setShowPostPopup: Function;
}) {
  return (
    <div className="sticky top-20 space-y-4">
      {/* Trending */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-foreground" />
          <h3 className="font-semibold text-foreground">Trending Today</h3>
        </div>
        <div className="space-y-3">
          {communities.map((community: any, index: number) => (
            <div key={community.name} className="flex items-center gap-3">
              <span className="text-lg font-bold text-muted-foreground">
                {index + 1}
              </span>
              {/* icon */}
              <span className="text-2xl">
                {" "}
                <img src={community.communityIcon} alt="" className="w-8 h-8" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {community.communityName}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{community.members} members</span>
                  {/* growth percentage */}
                  <span className="text-chart-2">↑ </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Post CTA */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-2 font-semibold text-foreground">Share Your Story</h3>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          Connect with fellow students and share your experiences, questions,
          and insights.
        </p>
        <Button className="w-full" onClick={() => setShowPostPopup(true)}>
          Create Post
        </Button>
      </div>

      {/* Quick Links */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          Quick Links
        </h3>
        <div className="space-y-2 text-sm">
          <NavLink
            to="/about"
            className="block text-muted-foreground hover:text-foreground"
          >
            About
          </NavLink>
          <a
            href="#"
            className="block text-muted-foreground hover:text-foreground"
          >
            Guidelines
          </a>
          <a
            href="#"
            className="block text-muted-foreground hover:text-foreground"
          >
            Privacy
          </a>
          <a
            href="#"
            className="block text-muted-foreground hover:text-foreground"
          >
            Help Center
          </a>
        </div>
      </div>
    </div>
  );
}
