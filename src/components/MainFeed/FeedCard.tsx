import {
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  Share2,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  Send,
  Reply,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { PostType } from "@/types/post/post.types";
import type { CommentType } from "@/types/comment/commentTypes";
import { useState, useEffect } from "react";
import postsService from "@/services/posts.service";
import userService from "@/services/user.service";
import commentService from "@/services/comment.service";
import { useToast } from "@/hooks/use-toast";

import {
  getFromLocalStorage,
  setInLocalStorage,
} from "@/utils/webstorage.utls";
import { cn } from "@/lib/utils";

export function FeedCard({ post }: { post: PostType }) {
  const [userVote, setUserVote] = useState<number>(0); // -1, 0, or 1
  const [, setUpvotes] = useState(post.upvotes);
  const [, setDownvotes] = useState(post.downvotes);
  const [score, setScore] = useState(post.score);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const { toast } = useToast();
  const userData = getFromLocalStorage("user");

  useEffect(() => {
    // Check if post is bookmarked
    if (userData?.bookmarkedPosts) {
      setIsBookmarked(userData.bookmarkedPosts.includes(post._id));
    }

    // Get user's vote for this post
    const fetchUserVote = async () => {
      try {
        const { vote } = await postsService.getUserVoteForPost(post._id);
        setUserVote(vote);
      } catch (error) {
        console.error("Error fetching user vote:", error);
      }
    };
    fetchUserVote();
  }, [post._id, userData]);

  const handleVote = async (value: number) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      // If clicking the same vote, remove it
      const newVote = userVote === value ? 0 : value;

      const result = await postsService.votePost(post._id, newVote);

      setUserVote(newVote);
      setUpvotes(result.post.upvotes);
      setDownvotes(result.post.downvotes);
      setScore(result.post.score);
    } catch (error) {
      console.error("Error voting:", error);
      toast({
        title: "Error",
        description: "Failed to vote on post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (isBookmarked) {
        const updatedUser = await userService.unbookmarkPost(post._id);
        setIsBookmarked(false);
        setInLocalStorage("user", updatedUser);
        toast({
          title: "Removed",
          description: "Post removed from bookmarks",
        });
      } else {
        const updatedUser = await userService.bookmarkPost(post._id);
        setIsBookmarked(true);
        setInLocalStorage("user", updatedUser);
        toast({
          title: "Saved",
          description: "Post bookmarked successfully",
        });
      }
    } catch (error) {
      console.error("Error bookmarking:", error);
      toast({
        title: "Error",
        description: "Failed to bookmark post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/post/${post._id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied",
      description: "Post link copied to clipboard",
    });
  };

  const handleToggleComments = async () => {
    if (!showComments && comments.length === 0) {
      // Fetch comments if not already loaded
      try {
        const fetchedComments = await commentService.getCommentsByPostId(
          post._id
        );
        setComments(fetchedComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
        toast({
          title: "Error",
          description: "Failed to load comments",
          variant: "destructive",
        });
      }
    }
    setShowComments(!showComments);
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;

    try {
      const newComment = await commentService.createComment({
        content: commentText,
        author: userData._id,
        post: post._id,
      });

      setComments([...comments, newComment]);
      setCommentText("");
      toast({
        title: "Success",
        description: "Comment posted successfully",
      });
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    }
  };

  const handleSubmitReply = async (parentCommentId: string) => {
    if (!replyText.trim()) return;

    try {
      const newReply = await commentService.createComment({
        content: replyText,
        author: userData._id,
        post: post._id,
        parentComment: parentCommentId,
      });

      // Update the comments tree with the new reply
      const updateCommentsTree = (comments: CommentType[]): CommentType[] => {
        return comments.map((comment) => {
          if (comment._id === parentCommentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newReply],
            };
          }
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateCommentsTree(comment.replies),
            };
          }
          return comment;
        });
      };

      setComments(updateCommentsTree(comments));
      setReplyText("");
      setReplyingTo(null);
      toast({
        title: "Success",
        description: "Reply posted successfully",
      });
    } catch (error) {
      console.error("Error posting reply:", error);
      toast({
        title: "Error",
        description: "Failed to post reply",
        variant: "destructive",
      });
    }
  };

  const CommentItem = ({
    comment,
    depth = 0,
  }: {
    comment: CommentType;
    depth?: number;
  }) => (
    <div
      className={cn("border-l-2 border-border pl-4 py-3", depth > 0 && "ml-6")}
    >
      <div className="flex items-start gap-3">
        <img
          src={comment.author.profilePic || "/assets/default-avatar.png"}
          alt={comment.author.name}
          className="h-8 w-8 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{comment.author.name}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm mt-1 text-foreground">{comment.content}</p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 h-7 text-xs"
            onClick={() => setReplyingTo(comment._id)}
          >
            <Reply className="h-3 w-3 mr-1" />
            Reply
          </Button>

          {replyingTo === comment._id && (
            <div className="mt-3 flex gap-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="min-h-[60px] text-sm"
              />
              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  onClick={() => handleSubmitReply(comment._id)}
                  disabled={!replyText.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyText("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <article className="rounded-lg border border-border bg-card transition-shadow hover:shadow-md">
      <div className="p-4">
        {/* Header */}
        <div className="mb-3 flex items-center gap-2 text-sm">
          <span className="text-lg">
            <img
              src={post.community.communityIcon}
              alt="community-icon"
              className="w-16 h-auto"
            />
          </span>
          {/* <span className="font-semibold text-foreground">
            {post.community}
          </span> */}
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">
            Posted by u/{post.author.name}
          </span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">
            {new Date(post?.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Content */}
        <h2 className="mb-2 text-lg font-semibold leading-snug text-foreground">
          {post.title}
        </h2>
        <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
          {post.body}
        </p>

        {/* Tags */}
        <div className="mb-3 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-border bg-background">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-1 rounded-r-none border-r border-border ${
                userVote === 1 ? "text-primary" : ""
              }`}
              onClick={() => handleVote(1)}
              disabled={isLoading}
            >
              <ArrowBigUp
                className={`h-4 w-4 ${userVote === 1 ? "fill-current" : ""}`}
              />
              <span className="text-sm font-medium">{score}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-l-none ${
                userVote === -1 ? "text-destructive" : ""
              }`}
              onClick={() => handleVote(-1)}
              disabled={isLoading}
            >
              <ArrowBigDown
                className={`h-4 w-4 ${userVote === -1 ? "fill-current" : ""}`}
              />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={handleToggleComments}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm">{post.commentCount}</span>
            {showComments ? (
              <ChevronUp className="h-4 w-4 ml-1" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-1" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden text-sm sm:inline">Share</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`ml-auto ${isBookmarked ? "text-primary" : ""}`}
            onClick={handleBookmark}
            disabled={isLoading}
            title={isBookmarked ? "Remove bookmark" : "Bookmark post"}
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-4 w-4 fill-current" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Comments Section - Accordion */}
      {showComments && (
        <div className="border-t border-border bg-muted/30">
          <div className="p-4 space-y-4">
            {/* Comment Input */}
            <div className="flex gap-3">
              <img
                src={userData?.profilePic || "/assets/default-avatar.png"}
                alt="Your avatar"
                className="h-10 w-10 rounded-full"
              />
              <div className="flex-1 flex gap-2">
                <Textarea
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
                <Button
                  size="sm"
                  onClick={handleSubmitComment}
                  disabled={!commentText.trim() || isLoading}
                  className="self-end"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Comments List */}
            {comments.length > 0 ? (
              <div className="space-y-2">
                {comments.map((comment) => (
                  <CommentItem key={comment._id} comment={comment} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  No comments yet. Be the first to comment!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
