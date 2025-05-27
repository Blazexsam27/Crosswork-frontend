"use client";

import type React from "react";

import { useState } from "react";
import { ArrowUp, ArrowDown, Reply, MoreHorizontal } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    reputation: number;
  };
  votes: number;
  userVote: "up" | "down" | null;
  createdAt: string;
  replies: Comment[];
}

const mockComments: Comment[] = [
  {
    id: "1",
    content:
      "Great question! I found that building small projects really helped me understand useEffect. Try creating a simple weather app or todo list.",
    author: {
      name: "David Kim",
      avatar: "/placeholder.svg?height=32&width=32",
      reputation: 1890,
    },
    votes: 8,
    userVote: null,
    createdAt: "2024-01-20T11:15:00Z",
    replies: [
      {
        id: "1-1",
        content:
          "I second this! The weather app project really helped me grasp the concept of cleanup functions in useEffect.",
        author: {
          name: "Lisa Wang",
          avatar: "/placeholder.svg?height=32&width=32",
          reputation: 567,
        },
        votes: 3,
        userVote: "up",
        createdAt: "2024-01-20T12:30:00Z",
        replies: [],
      },
    ],
  },
  {
    id: "2",
    content:
      "The official React documentation has some excellent examples. Also, check out the React DevTools - they really help visualize what's happening with your hooks.",
    author: {
      name: "Jennifer Lopez",
      avatar: "/placeholder.svg?height=32&width=32",
      reputation: 2340,
    },
    votes: 12,
    userVote: "up",
    createdAt: "2024-01-20T13:45:00Z",
    replies: [],
  },
];

export default function DiscussionDetail() {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const handleVoteComment = (
    commentId: string,
    voteType: "up" | "down",
    isReply = false,
    parentId?: string
  ) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (isReply && comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map((reply) => {
              if (reply.id === commentId) {
                let newVotes = reply.votes;
                let newUserVote: "up" | "down" | null = voteType;

                if (reply.userVote === voteType) {
                  newUserVote = null;
                  newVotes += voteType === "up" ? -1 : 1;
                } else if (reply.userVote === null) {
                  newVotes += voteType === "up" ? 1 : -1;
                } else {
                  newVotes += voteType === "up" ? 2 : -2;
                }

                return { ...reply, votes: newVotes, userVote: newUserVote };
              }
              return reply;
            }),
          };
        } else if (comment.id === commentId) {
          let newVotes = comment.votes;
          let newUserVote: "up" | "down" | null = voteType;

          if (comment.userVote === voteType) {
            newUserVote = null;
            newVotes += voteType === "up" ? -1 : 1;
          } else if (comment.userVote === null) {
            newVotes += voteType === "up" ? 1 : -1;
          } else {
            newVotes += voteType === "up" ? 2 : -2;
          }

          return { ...comment, votes: newVotes, userVote: newUserVote };
        }
        return comment;
      })
    );
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment.trim(),
      author: {
        name: "You",
        avatar: "/placeholder.svg?height=32&width=32",
        reputation: 100,
      },
      votes: 1,
      userVote: "up",
      createdAt: new Date().toISOString(),
      replies: [],
    };

    setComments((prev) => [...prev, comment]);
    setNewComment("");
  };

  const handleAddReply = (parentId: string) => {
    if (!replyContent.trim()) return;

    const reply: Comment = {
      id: `${parentId}-${Date.now()}`,
      content: replyContent.trim(),
      author: {
        name: "You",
        avatar: "/placeholder.svg?height=32&width=32",
        reputation: 100,
      },
      votes: 1,
      userVote: "up",
      createdAt: new Date().toISOString(),
      replies: [],
    };

    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === parentId) {
          return { ...comment, replies: [...comment.replies, reply] };
        }
        return comment;
      })
    );

    setReplyContent("");
    setReplyingTo(null);
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const CommentComponent = ({
    comment,
    isReply = false,
    parentId,
  }: {
    comment: Comment;
    isReply?: boolean;
    parentId?: string;
  }) => (
    <div className={`${isReply ? "ml-8 border-l-2 border-gray-200 pl-4" : ""}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-start space-x-3">
          <div className="flex flex-col items-center space-y-1">
            <button
              onClick={() =>
                handleVoteComment(comment.id, "up", isReply, parentId)
              }
              className={`p-1 rounded transition-colors ${
                comment.userVote === "up"
                  ? "bg-green-100 text-green-600"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <span
              className={`text-sm font-semibold ${
                comment.votes > 0
                  ? "text-green-600"
                  : comment.votes < 0
                  ? "text-red-600"
                  : "text-gray-600"
              }`}
            >
              {comment.votes}
            </span>
            <button
              onClick={() =>
                handleVoteComment(comment.id, "down", isReply, parentId)
              }
              className={`p-1 rounded transition-colors ${
                comment.userVote === "down"
                  ? "bg-red-100 text-red-600"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <img
                src={comment.author.avatar || "/placeholder.svg"}
                alt={comment.author.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="font-medium text-gray-900">
                {comment.author.name}
              </span>
              <span className="text-sm text-gray-500">
                {comment.author.reputation} rep
              </span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-500">
                {formatTimeAgo(comment.createdAt)}
              </span>
            </div>

            <p className="text-gray-700 mb-3">{comment.content}</p>

            <div className="flex items-center space-x-4">
              {!isReply && (
                <button
                  onClick={() =>
                    setReplyingTo(replyingTo === comment.id ? null : comment.id)
                  }
                  className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors text-sm"
                >
                  <Reply className="w-4 h-4" />
                  <span>Reply</span>
                </button>
              )}
              <button className="text-gray-500 hover:text-gray-700 transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {replyingTo === comment.id && (
              <div className="mt-4">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAddReply(comment.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Reply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentComponent
              key={reply.id}
              comment={reply}
              isReply={true}
              parentId={comment.id}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Comments Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Comments (
          {comments.reduce(
            (total, comment) => total + 1 + comment.replies.length,
            0
          )}
          )
        </h3>

        {/* Add Comment Form */}
        <form onSubmit={handleAddComment} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts or ask a follow-up question..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={4}
          />
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Add Comment
            </button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentComponent key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    </div>
  );
}
