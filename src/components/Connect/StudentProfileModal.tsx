"use client";

import type { StudentProfileModalProps } from "@/types/connect/connectTypes";
import {
  Check,
  MessageCircle,
  UserPlus,
  X,
  Smile,
  BookOpen,
  Heart,
  Globe,
  Users,
} from "lucide-react";
import { DialogClose } from "../ui/dialog";
import { Button } from "../ui/button";
import { CustomDialog } from "../widgets/DialogPopup";

function StudentProfileModal({
  student,
  onClose,
  onConnect,
  onCancelRequest,
  connectionStatus,
}: StudentProfileModalProps) {
  console.log("stu----", connectionStatus);
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card text-card-foreground rounded-xl border border-border shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="relative h-12 bg-gradient-to-br ">
          <div className="absolute inset-0 " />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-foreground/60 hover:text-foreground hover:bg-background/50 backdrop-blur-sm rounded-lg p-2 transition-all duration-200 z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 pt-20">
          <div className="px-8 -mt-16 mb-6">
            <div className="flex items-end gap-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-3xl blur-md group-hover:blur-lg transition-all" />
                <div className="relative bg-gradient-to-br from-primary/20 to-accent/20 p-5 rounded-3xl border-4 border-card shadow-xl">
                  <Smile className="w-20 h-20 text-primary" />
                </div>
              </div>
              <div className="flex-1 pb-2">
                <h2 className="text-3xl font-bold text-foreground tracking-tight mb-1">
                  {student.name}
                </h2>
                <p className="text-base text-muted-foreground font-medium">
                  {student.subjects.slice(0, 2).join(" • ")}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-6 px-4 py-3 bg-muted/50 rounded-lg border border-border/50">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {/* {student.connections?.length || 0}{" "} */}
                  <span className="text-muted-foreground">Connections</span>
                </span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {student.subjects.length}{" "}
                  <span className="text-muted-foreground">Subjects</span>
                </span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {student.interests.length}{" "}
                  <span className="text-muted-foreground">Interests</span>
                </span>
              </div>
            </div>
          </div>

          <div className="px-8 pb-8 space-y-6">
            <div className="bg-muted/30 rounded-lg p-5 border border-border/50">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-primary rounded-full" />
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  About
                </h3>
              </div>
              <p className="text-base text-foreground/90 leading-relaxed">
                {student.bio}
              </p>
            </div>

            <div className="bg-muted/30 rounded-lg p-5 border border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  Subjects
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {student.subjects.map((subject) => (
                  <span
                    key={subject}
                    className="px-4 py-2.5 bg-accent/90 hover:bg-accent text-accent-foreground rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md hover:scale-105 border border-accent/20"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-5 border border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  Interests
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {student.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-4 py-2.5 bg-secondary/90 hover:bg-secondary text-secondary-foreground rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md hover:scale-105 border border-secondary/20"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-5 border border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  Languages
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {student.languages.map((language) => (
                  <span
                    key={language}
                    className="px-4 py-2.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md hover:scale-105 border border-border"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border bg-gradient-to-b from-muted/20 to-muted/40 p-6">
          <div className="flex gap-3">
            {connectionStatus === "none" && (
              <button
                onClick={() => {
                  onConnect(student._id);
                  onClose();
                }}
                className="w-48 flex items-center justify-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-400/80 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
              >
                <UserPlus className="w-5 h-5" />
                <span>Connect</span>
              </button>
            )}
            {connectionStatus === "pending" && (
              <Button
                onClick={() => {
                  onCancelRequest(student._id);
                  onClose();
                }}
                className="w-48 flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-400/80 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
              >
                <X className="w-5 h-5" />
                <span>Cancel Request</span>
              </Button>
            )}
            {connectionStatus === "connected" ? (
              <div className="flex gap-3 flex-1">
                <Button
                  variant={"outline"}
                  className="w-48 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-secondary-foreground rounded-lg hover:bg-green-400/80 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                >
                  <Check className="w-5 h-5" />
                  <span>Connected</span>
                </Button>
              </div>
            ) : null}

            {connectionStatus === "connected" && (
              <CustomDialog
                title="Disconnect"
                description="Are you sure you want to diconnect ? This action cannot be undone."
                triggerText="Disconnect"
                triggerStyles="cursor-pointer hover:bg-destructive/90 duration-200 transition-all flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-destructive text-destructive-foreground rounded-lg font-medium shadow-md hover:shadow-lg"
                footerContent={
                  <>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button variant="destructive">Confirm Disconnection</Button>
                  </>
                }
              >
                <div className="py-4 space-y-2">
                  <p className="text-muted-foreground">
                    All your conversation will be lost, this includes:
                  </p>
                  <ul className="list-disc pl-5 text-muted-foreground">
                    <li>All created conversations, comments</li>
                    <li>Message history, shared files</li>
                  </ul>
                </div>
              </CustomDialog>
            )}
            {connectionStatus === "connected" ? (
              <Button
                variant={"outline"}
                className="w-14 flex items-center justify-center px-4 py-3 border-border text-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <MessageCircle className="w-5 h-5" />
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfileModal;
