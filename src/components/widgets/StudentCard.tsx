"use client";

import type { StudentCardProps } from "@/types/user/userTypes";
import { Check, MessageCircle, Smile, UserPlus, X } from "lucide-react";

export default function StudentCard({
  student,
  onConnect,
  onCancelRequest,
  onViewProfile,
  isCompact = false,
  connectionStatus,
}: StudentCardProps) {
  console.log(connectionStatus);
  const getConnectionButton = () => {
    switch (connectionStatus) {
      case "none":
        return (
          <button
            onClick={() => onConnect(student._id)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow"
          >
            <UserPlus className="w-4 h-4" />
            <span>Connect</span>
          </button>
        );
      case "pending":
        return (
          <button
            onClick={() => onCancelRequest(student._id)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-all duration-200 font-medium text-sm"
          >
            <X className="w-4 h-4" />
            <span>Pending</span>
          </button>
        );
      case "connected":
        return (
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-accent-foreground rounded-lg font-medium text-sm cursor-default">
            <Check className="w-4 h-4" />
            <span>Connected</span>
          </button>
        );
    }
  };

  return (
    <div className="group bg-card text-card-foreground rounded-xl border border-border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full">
      <div className="h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60 flex-shrink-0" />

      <div className="p-6 flex-1 grid grid-rows-[auto_auto_1fr_auto] gap-4">
        {/* Row 1: Header with avatar and name - Fixed height */}
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center ring-2 ring-border group-hover:ring-primary/30 transition-all duration-300">
              <Smile className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-foreground truncate mb-1 group-hover:text-primary transition-colors">
              {student.name}
            </h3>
            <p className="text-sm text-muted-foreground font-medium">
              {student.subjects.slice(0, 2).join(" • ")}
            </p>
          </div>
        </div>

        {/* Row 2: Bio - Fixed height with line-clamp */}
        {!isCompact && (
          <div className="min-h-[2.5rem]">
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
              {student.bio}
            </p>
          </div>
        )}

        {/* Row 3: Interests - Flexible space that expands */}
        <div className="flex items-start">
          <div className="flex flex-wrap gap-2">
            {student.interests.slice(0, isCompact ? 2 : 3).map((interest) => (
              <span
                key={interest}
                className="inline-flex items-center px-3 py-1.5 bg-secondary/80 text-secondary-foreground rounded-full text-xs font-medium hover:bg-secondary transition-colors"
              >
                {interest}
              </span>
            ))}
            {student.interests.length > (isCompact ? 2 : 3) && (
              <span className="inline-flex items-center px-3 py-1.5 bg-muted text-muted-foreground rounded-full text-xs font-medium">
                +{student.interests.length - (isCompact ? 2 : 3)} more
              </span>
            )}
          </div>
        </div>

        {/* Row 4: Action buttons - Fixed at bottom */}
        <div className="flex items-center gap-2 pt-4 border-t border-border">
          {getConnectionButton()}
          <button
            onClick={() => onViewProfile(student)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-border text-foreground rounded-lg hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-200 font-medium text-sm"
          >
            <span>View Profile</span>
          </button>
          {connectionStatus === "connected" && (
            <button className="flex items-center justify-center p-2.5 border border-border text-foreground rounded-lg hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-200">
              <MessageCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
