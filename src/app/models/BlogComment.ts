export interface BlogComment {
  id: number;
  content: string;
  userId: number;
  createdAt: Date;
  blog: { id: number };
}
