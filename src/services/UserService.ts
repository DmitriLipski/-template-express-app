import { Service } from 'typedi';
import User from '../models/User';
import UserRepository from '../repositories/UserRepository';

@Service()
class UserService {
	constructor(private readonly userRepository: UserRepository) {}
	async getAllUsers(): Promise<User[]> {
		return await this.userRepository.getAllUsers();
	}
}

export default UserService;
