import { BlogComment } from './BlogComment';

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
  comments: BlogComment[];
}
export type BlogFormData = Omit<Blog, 'idBlog' | 'comments' | 'date' | 'likeCount' | 'viewCount'>;
