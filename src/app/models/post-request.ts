import { Post } from './post';

export type PostRequest = Omit<Post, 'id' | 'createdDate' | 'category'> & {
  categoryId: string;
};
