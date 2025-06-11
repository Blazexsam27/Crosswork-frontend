import type React from "react";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Heart,
  Share,
  Bookmark,
} from "lucide-react";
import type { Comment, VoteType } from "@/types/forums/forumTypes";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import threadService from "@/services/thread.service";
import { cacheThread, setCurrentThread } from "@/features/forum/forumSlice";
import { calcTotalVotes, checkVote } from "@/components/Forums/util";
import { getFromLocalStorage } from "@/utils/webstorage.utls";
import commentService from "@/services/comment.service";
import { formatTimeAgo } from "../utils/time.utils";
import CommentComponent from "@/components/DiscussionPage/CommentComponent";
import forumUtils from "@/utils/forum.utils";
import _ from "lodash";
import Loader from "@/components/widgets/Loader";

export default function DiscussionPage() {
  const threadId = window.location.pathname.split("/")[2];

  const dispatch = useAppDispatch();
  const thread = useAppSelector((state) => state.forum.cache[threadId]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);

  const user = getFromLocalStorage("user");

  const handleVoteDiscussion = async (voteType: "up" | "down") => {
    try {
      const temp = _.cloneDeep(thread);
      const updatedVotes = forumUtils.handleThreadVote(temp, voteType);
      threadService.updateThread(threadId, { votes: updatedVotes });

      await fetchThreadById(threadId);
    } catch (error) {
      console.error("Error while voting:", error);
    }
  };

  const handleVoteComment = async (
    commentId: string,
    voteType: "up" | "down"
  ) => {
    try {
      // get the current voted state of the comment
      const comment = await commentService.getCommentById(commentId);

      if (!comment) return;
      const userId = user._id;
      const existingVoteIndex = comment.votes.findIndex(
        (v: VoteType) => v.userId === userId
      );
      // Case 1: Clicking same vote type again - remove vote
      if (
        existingVoteIndex >= 0 &&
        comment.votes[existingVoteIndex].voteType === voteType
      ) {
        comment.votes = comment.votes.filter(
          (v: VoteType) => v.userId !== userId
        );
      }
      // Case 2: Changing vote type or new vote
      else {
        const newVote = { userId, voteType };
        if (existingVoteIndex >= 0) {
          // Update existing vote
          comment.votes[existingVoteIndex] = newVote;
        } else {
          // Add new vote
          comment.votes.push(newVote);
        }
      }
      await commentService.updateComment(commentId, { votes: comment.votes });
      await fetchThreadById(threadId);
    } catch (error) {
      console.error("Error while voting:", error);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      const comment = await commentService.getCommentById(commentId);
      const currentLikes = await forumUtils.handleCommentLike(
        comment,
        user._id
      );

      await commentService.updateComment(commentId, {
        likes: currentLikes,
      });

      await fetchThreadById(threadId);
    } catch (error) {
      console.error("Error while liking comment:", error);
    }
  };

  const handleThreadLike = async () => {
    try {
      const temp = _.cloneDeep(thread);
      const currentLikes = forumUtils.handleThreadLike(temp, user._id);
      await threadService.updateThread(threadId, { likes: currentLikes });

      await fetchThreadById(threadId);
    } catch (error) {
      console.error("Error while liking:", error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await commentService.createComment({
        content: newComment,
        author: user._id,
        post: threadId,
      });
      setNewComment("");
      fetchThreadById(threadId);
    } catch (error) {
      console.error("Error while creating comment", error);
    }
  };

  const handleAddReply = async (parentId: string) => {
    if (!replyContent.trim()) return;

    try {
      await commentService.createComment({
        content: replyContent,
        author: user._id,
        post: threadId,
        parentComment: parentId,
      });
      setReplyContent("");
      setReplyingTo(null);
      fetchThreadById(threadId);
    } catch (error) {
      console.error("Error while creating comment", error);
    }
  };

  const fetchThreadById = async (threadId: string) => {
    try {
      const response = await threadService.getThreadById(threadId);
      dispatch(cacheThread(response));
      setComments(response.comments);
    } catch (error) {
      console.error("Error while getting thread", error);
    }
  };

  useEffect(() => {
    fetchThreadById(threadId);
    dispatch(setCurrentThread(threadId));
  }, [threadId]);

  const displayedComments = showAllComments ? comments : comments.slice(0, 3);

  if (!thread) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <NavLink
            to="/forums"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forum
          </NavLink>
        </div>

        {/* Discussion Header */}
        <div className="bg-white rounded-sm shadow-lg p-6 mb-6">
          <div className="flex items-start space-x-4">
            <div className="flex flex-col items-center space-y-1 min-w-[60px]">
              <button
                onClick={() => handleVoteDiscussion("up")}
                className={`p-2 rounded-lg transition-colors ${
                  checkVote([thread], thread?._id, "up", user._id)
                    ? "bg-green-100 text-green-600"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <ArrowUp className="w-5 h-5" />
              </button>
              <span
                className={`font-semibold ${
                  thread?.votes.length > 0
                    ? "text-green-600"
                    : thread?.votes.length < 0
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {calcTotalVotes(thread?.votes)}
              </span>
              <button
                onClick={() => handleVoteDiscussion("down")}
                className={`p-2 rounded-lg transition-colors ${
                  checkVote([thread], thread?._id, "down", user._id)
                    ? "bg-red-100 text-red-600"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <ArrowDown className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {thread.title}
              </h1>

              <div className="prose prose-gray max-w-none mb-6">
                <p className="text-gray-700 whitespace-pre-line">
                  {thread.content}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {/* <img
                      src={thread.author.avatar || "/placeholder.svg"}
                      alt={thread.author.name}
                      className="w-8 h-8 rounded-full"
                    /> */}
                    <span className="font-medium text-gray-900">
                      {thread.author.name}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatTimeAgo(thread.createdAt)}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    onClick={handleThreadLike}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        thread.likes.includes(user._id)
                          ? "fill-red-500 text-red-500"
                          : ""
                      }`}
                    />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <Share className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-yellow-600 transition-colors">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-sm shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Comments ({thread.comments.length})
          </h3>

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="mb-8">
            <div className="flex space-x-3">
              <img
                src="/placeholder.svg?height=40&width=40"
                alt="Your avatar"
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts or ask a follow-up question..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Press Enter to post</span>
                  </div>
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {displayedComments.map((comment) => (
              <CommentComponent
                key={comment._id}
                comment={comment}
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

          {/* Show More Comments */}
          {comments.length > 3 && !showAllComments && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowAllComments(true)}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                View {comments.length - 3} more comments
              </button>
            </div>
          )}

          {comments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No comments yet. Be the first to share your thoughts!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
