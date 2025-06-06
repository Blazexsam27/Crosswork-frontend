import type { Comment } from "@/types/forums/forumTypes";
import { formatTimeAgo } from "@/utils/time.utils";
import { ArrowDown, ArrowUp, Heart, MoreHorizontal } from "lucide-react";

export default function CommentComponent({
  comment,
  isReply = false,
  parentId,
  handleLikeComment,
  handleVoteComment,
  handleAddReply,
  replyingTo,
  setReplyingTo,
  replyContent,
  setReplyContent,
}: {
  comment: Comment;
  isReply?: boolean;
  parentId?: string;
  handleLikeComment: Function;
  handleVoteComment: Function;
  handleAddReply: Function;
  setReplyingTo: Function;
  replyingTo: string | null;
  replyContent: string;
  setReplyContent: Function;
}) {
  return (
    <div className={`${isReply ? "ml-8 border-l-2 border-gray-100 pl-4" : ""}`}>
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <img
            src={comment.author.avatar || "/placeholder.svg"}
            alt={comment.author.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 rounded-sm px-4 py-3">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-semibold text-gray-900 text-sm">
                {comment.author.name}
              </span>
            </div>
            <p className="text-gray-800 text-sm leading-relaxed">
              {comment.content}
            </p>
          </div>

          <div className="flex items-center space-x-4 mt-2 px-2">
            <span className="text-xs text-gray-500">
              {formatTimeAgo(comment.createdAt)}
            </span>

            <button
              onClick={() => handleLikeComment(comment._id, isReply, parentId)}
              className={`text-xs font-medium transition-colors ${
                comment.userLiked
                  ? "text-red-600"
                  : "text-gray-500 hover:text-red-600"
              }`}
            >
              {comment.userLiked ? "Liked" : "Like"}
            </button>

            <button
              onClick={() =>
                setReplyingTo(replyingTo === comment._id ? null : comment._id)
              }
              className="text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors"
            >
              Reply
            </button>

            <div className="flex items-center space-x-1">
              <button
                onClick={() =>
                  handleVoteComment(comment._id, "up", isReply, parentId)
                }
                className={`p-1 rounded transition-colors ${
                  comment.userVote === "up"
                    ? "text-green-600"
                    : "text-gray-400 hover:text-green-600"
                }`}
              >
                <ArrowUp className="w-3 h-3" />
              </button>
              <span className="text-xs text-gray-500">
                {comment.votes.length}
              </span>
              <button
                onClick={() =>
                  handleVoteComment(comment._id, "down", isReply, parentId)
                }
                className={`p-1 rounded transition-colors ${
                  comment.userVote === "down"
                    ? "text-red-600"
                    : "text-gray-400 hover:text-red-600"
                }`}
              >
                <ArrowDown className="w-3 h-3" />
              </button>
            </div>

            {comment.likes > 0 && (
              <div className="flex items-center space-x-1">
                <Heart
                  className={`w-3 h-3 ${
                    comment.userLiked
                      ? "text-red-600 fill-current"
                      : "text-gray-400"
                  }`}
                />
                <span className="text-xs text-gray-500">{comment.likes}</span>
              </div>
            )}

            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <MoreHorizontal className="w-3 h-3" />
            </button>
          </div>

          {replyingTo === comment._id && (
            <div className="mt-3 flex space-x-2">
              <img
                src="/placeholder.svg?height=32&width=32"
                alt="Your avatar"
                className="w-6 h-6 rounded-full object-cover flex-shrink-0 mt-1"
              />
              <div className="flex-1">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={`Reply to ${comment.author.name}...`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                  rows={2}
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAddReply(comment._id)}
                    disabled={!replyContent.trim()}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          )}

          {comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentComponent
                  key={reply._id}
                  comment={reply}
                  isReply={true}
                  parentId={comment._id}
                  handleLikeComment={handleLikeComment}
                  handleVoteComment={handleVoteComment}
                  handleAddReply={handleAddReply}
                  setReplyingTo={setReplyingTo}
                  replyingTo={replyingTo}
                  replyContent={replyContent}
                  setReplyContent={setReplyContent}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
