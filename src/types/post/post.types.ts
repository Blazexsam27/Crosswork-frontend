import type { UserType } from "../user/userTypes";

export type PostType = {
  _id: string;
  community: {
    name: string;
    communityIcon: string;
  };
  postType: string;
  author: UserType;
  title: string;
  body: string; // markdown
  linkUrl: string; // optional link posts
  media?: string;
  isNsfw: boolean;
  isSpoiler: boolean;
  tags: string[];

  flair: string;
  isSticky: boolean;
  isRemoved: boolean;
  removedBy: UserType | null;
  score: number; // upvotes - downvotes, denormalized
  upvotes: number;
  downvotes: number;
  commentCount: number;
  createdAt: Date;
  comments: string[];
  likes: string[];
  votes: string[];
  updatedAt: Date;
  lastCommentedAt: Date;
};
