import { Service } from 'typedi';
import { Post } from '../models/Post';
import { PostRepository } from '../repositories/PostRepository';
import { InvalidPropertyError, requiredParam } from './common/ResponseService';

@Service()
class PostService {
	constructor(private readonly postRepository: PostRepository) {}
	async getAllPosts(): Promise<Post[] | Error> {
		return await this.postRepository.getAllPosts();
	}

	async addPost(post: Post): Promise<Post> {
		const validPost = this.validatePost(post);

		return await this.postRepository.addPost(validPost);
	}

	validatePost(postData: Post): Post {
		const {
			id,
			title = requiredParam('title'),
			description = requiredParam('description'),
		} = postData;

		this.validatePostTitle(title as string);
		this.validatePostDescription(description as string);

		return {
			id,
			title,
			description,
		} as Post;
	}

	validatePostTitle(name: string): void {
		if (name.length < 2) {
			throw new InvalidPropertyError(
				`A post's title must be at least 2 characters long.`,
			);
		}
	}

	validatePostDescription(name: string): void {
		if (name.length < 5) {
			throw new InvalidPropertyError(
				`A post's description must be at least 5 characters long.`,
			);
		}
	}
}

export { PostService };
