import { Comment } from './Comment';

export interface Blog {
  idBlog: number;
  title: string;
  description?: string;
  content: string;
  image?: string;
  userId: number;
  date: Date;
  likeCount: number;
  viewCount: number;
  comments: Comment[];
}
