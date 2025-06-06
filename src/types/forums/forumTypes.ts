export interface Discussion {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    reputation: number;
  };
  subject: string;
  votes: number;
  userVote: "up" | "down" | null;
  commentsCount: number;
  createdAt: string;
  isHot: boolean;
}

export interface CreateDiscussionModalProps {
  onClose: () => void;
  onSubmit: (threadData: ThreadCreateType) => void;
}

export type ThreadCreateType = {
  title: string;
  category: string;
  content: string;
  author: string;
};

export type VoteType = { userId: string; voteType: string };
export type ThreadRetrieveType = {
  _id: string;
  title: string;
  category: string;
  content: string;
  comments: [];
  author: {
    _id: string;
    name: string;
    // avatar: string;
  };
  createdAt: string;
  updatedAt: string;
  votes: VoteType[];
  likes: string[];
};

export interface Discussion {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    reputation: number;
  };
  subject: string;
  votes: number;
  userVote: "up" | "down" | null;
  commentsCount: number;
  createdAt: string;
  isHot: boolean;
}

export interface Comment {
  _id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  votes: VoteType[];
  userVote: "up" | "down" | null;
  createdAt: string;
  replies: Comment[];
  likes: number;
  userLiked: boolean;
}
