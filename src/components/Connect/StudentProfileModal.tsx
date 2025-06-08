import type { StudentProfileModalProps } from "@/types/connect/connectTypes";
import { Check, MessageCircle, UserPlus, X } from "lucide-react";
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
  return (
    <div className="fixed inset-0 bg-violet-500/20 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start space-x-4">
              <div className="relative">
                <img
                  src={
                    student.profilePic || "/placeholder.svg?height=80&width=80"
                  }
                  alt={student.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {student.name}
                </h2>
                <p className="text-gray-600">
                  {student.subjects.slice(0, 2).join(" • ")}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                About
              </h3>
              <p className="text-gray-700">{student.bio}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {student.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Subjects
              </h3>
              <div className="flex flex-wrap gap-2">
                {student.subjects.map((subject) => (
                  <span
                    key={subject}
                    className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {student.languages.map((language) => (
                  <span
                    key={language}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              {connectionStatus[student._id] === "none" && (
                <button
                  onClick={() => {
                    onConnect(student._id);
                    onClose();
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-sm hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Connect</span>
                </button>
              )}
              {connectionStatus[student._id] === "pending" && (
                <Button
                  onClick={() => {
                    onCancelRequest(student._id);
                    onClose();
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-yellow-100 text-yellow-800 rounded-sm hover:bg-yellow-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                  <span>Cancel Request</span>
                </Button>
              )}
              {connectionStatus[student._id] === "connected" && (
                <div className="flex gap-2">
                  <Button
                    variant={"outline"}
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-1 bg-green-100 text-green-800 rounded-sm hover:bg-green-100"
                  >
                    <Check className="w-5 h-5" />
                    <span>Connected</span>
                  </Button>
                </div>
              )}

              <CustomDialog
                title="Disconnect"
                description="Are you sure you want to diconnect ? This action cannot be undone."
                triggerText="Disconnect"
                triggerStyles="cursor-pointer hover:bg-red-200 duration-200 transition-all flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-red-100 text-green-800 rounded-sm"
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
                  <p className="text-gray-700">
                    All your conversation will be lost, this includes:
                  </p>
                  <ul className="list-disc pl-5 text-gray-600">
                    <li>All created conversations, comments</li>
                    <li>Message history, shared files</li>
                  </ul>
                </div>
              </CustomDialog>
              <Button
                variant={"outline"}
                className="w-16   flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfileModal;
