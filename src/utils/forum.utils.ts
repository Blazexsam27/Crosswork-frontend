import type {
  ThreadRetrieveType,
  VoteType,
  Comment,
} from "@/types/forums/forumTypes";
import { getFromLocalStorage } from "./webstorage.utls";

class ForumUtils {
  handleThreadVote = (thread: ThreadRetrieveType, voteType: "up" | "down") => {
    try {
      const userId = getFromLocalStorage("user")._id;
      const existingVoteIndex = thread.votes.findIndex(
        (v: VoteType) => v.userId === userId
      );

      if (
        existingVoteIndex >= 0 &&
        thread.votes[existingVoteIndex].voteType === voteType
      ) {
        thread.votes = thread.votes.filter(
          (v: VoteType) => v.userId !== userId
        );
      }
      // Case 2: Changing vote type or new vote
      else {
        const newVote = { userId, voteType };

        if (existingVoteIndex >= 0) {
          // Update existing vote
          thread.votes[existingVoteIndex] = newVote;
        } else {
          // Add new vote
          thread.votes.push(newVote);
        }
      }

      return thread.votes;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  handleThreadLike = (thread: ThreadRetrieveType, userId: string) => {
    try {
      const currentLikes = thread?.likes || [];

      if (currentLikes.includes(userId)) {
        currentLikes.splice(currentLikes.indexOf(userId), 1);
      } else {
        currentLikes.push(userId);
      }
      return currentLikes;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  handleCommentLike = (comment: Comment, userId: string) => {
    try {
      const currentLikes = comment?.likes || [];

      if (currentLikes.includes(userId)) {
        currentLikes.splice(currentLikes.indexOf(userId), 1);
      } else {
        currentLikes.push(userId);
      }
      return currentLikes;
    } catch (error: any) {
      throw new Error(error);
    }
  };
}

export default new ForumUtils();
