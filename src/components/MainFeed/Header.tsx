import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomDock from "../widgets/CustomDock";
import { useEffect, useState } from "react";
import { getFromLocalStorage } from "@/utils/webstorage.utls";

export function Header({ setShowPostPopup }: { setShowPostPopup: Function }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getFromLocalStorage("authToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

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

          <div className="hidden flex-1 max-w-xl md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search communities, posts, or people..."
                className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
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
