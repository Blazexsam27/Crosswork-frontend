import type { StudentResponse } from "../user/userTypes";

export type CommunityType = {
  _id: string;
  communityName: string;
  description: string;
  category: string;
  isNsfw: boolean;
  communityIcon: string;
  communityCoverImage: string;
  type: string;
  createdBy: string;
  moderators: StudentResponse[];
  membersCount: number;
  postCount: number;
  rules: CommunityRule[];
  tags: string[];
  posts: string[];
  createdAt: string;
  updatedAt: string;
};

export type CommunityRule = {
  title: string;
  body: string;
};
