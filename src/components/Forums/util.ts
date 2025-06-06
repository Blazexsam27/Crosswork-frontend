import type { ThreadRetrieveType, VoteType } from "@/types/forums/forumTypes";

export const checkVote = (
  threads: ThreadRetrieveType[],
  threadId: string,
  voteType: "up" | "down",
  userId: string
) => {
  const thread = threads.find((t) => t._id === threadId);
  if (!thread) return false;

  const vote = thread.votes.find((v) => v.userId === userId);

  return vote?.voteType === voteType ? true : false;
};

export const calcTotalVotes = (votes: VoteType[]): number => {
  return votes.reduce((total, vote) => {
    if (vote.voteType === "up") {
      return total + 1;
    } else if (vote.voteType === "down") {
      return total - 1;
    }
    return total;
  }, 0);
};
