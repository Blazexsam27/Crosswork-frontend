export interface CommentType {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    profilePic: string;
  };
  post: string;
  likes: string[];
  depth: number;
  replies: CommentType[];
  parentComment: string | null;
  createdAt: string;
  updatedAt: string;
}
