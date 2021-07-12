import { Service } from 'typedi';
import { Post } from '../models/Post';

@Service()
class PostRepository {
	private posts: Post[] = [
		{
			id: 'bfccd1b38422094d',
			title: 'Post #1',
			description: 'post 1 description',
		},
		{
			id: 'bfccd1b38422094f',
			title: 'Post #2',
			description: 'post 2 description',
		},
		{
			id: 'bfccd1b38422094k',
			title: 'Post #3',
			description: 'post 3 description',
		},
	];

	async getAllPosts(): Promise<Post[]> {
		return Promise.resolve(this.posts);
	}

	async addPost(post: Post): Promise<Post> {
		this.posts.push(post);
		return Promise.resolve(post);
	}
}

export { PostRepository };
