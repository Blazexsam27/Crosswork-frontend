import type { StudentCardProps } from "@/types/user/userTypes";
import { getFromLocalStorage } from "@/utils/webstorage.utls";
import { Check, MessageCircle, Smile, UserPlus, X } from "lucide-react";

export default function StudentCard({
  student,
  onConnect,
  onCancelRequest,
  onViewProfile,
  isCompact = false,
  connectionStates,
}: StudentCardProps) {
  const connectionStatus = connectionStates[student._id] || "none";

  const user = getFromLocalStorage("user");

  const getConnectionButton = () => {
    switch (connectionStatus) {
      case "none":
        return (
          <button
            onClick={() => onConnect(student._id)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            <UserPlus className="w-4 h-4" />
            <span>Connect</span>
          </button>
        );
      case "pending":
        return (
          <button
            onClick={() => onCancelRequest(student._id)}
            className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Pending</span>
          </button>
        );
      case "connected":
        return (
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
            <Check className="w-4 h-4" />
            <span>Connected</span>
          </button>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200 p-6">
      <div className="flex items-start space-x-4">
        <div className="relative">
          <Smile className="w-16 h-16 rounded-full object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {student.name}
          </h3>
          <p className="text-sm text-gray-600">
            {student.subjects.slice(0, 2).join(" • ")}
          </p>
        </div>
      </div>

      {!isCompact && (
        <p className="text-gray-600 mt-4 text-sm line-clamp-2">{student.bio}</p>
      )}

      <div className="mt-4">
        <div className="flex flex-wrap gap-1">
          {student.interests.slice(0, isCompact ? 2 : 3).map((interest) => (
            <span
              key={interest}
              className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
            >
              {interest}
            </span>
          ))}
          {student.interests.length > (isCompact ? 2 : 3) && (
            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              +{student.interests.length - (isCompact ? 2 : 3)} more
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2 mt-4">
        {getConnectionButton()}
        <button
          onClick={() => onViewProfile(student)}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span>View Profile</span>
        </button>
        {connectionStatus === "connected" && (
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <MessageCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
