import { Service } from 'typedi';
import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import { InvalidPropertyError, requiredParam } from './common/ResponseService';
import { ValidationService } from './common/ValidationService';

@Service()
class UserService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly validationService: ValidationService,
	) {}
	async getAllUsers(): Promise<User[] | Error> {
		return await this.userRepository.getAllUsers();
	}

	async addUser(user: User): Promise<User> {
		const validUser = this.validateUser(user);

		return await this.userRepository.addUser(validUser);
	}

	validateUser(userData: User): User {
		const {
			id,
			name = requiredParam('name'),
			email = requiredParam('email'),
			password = requiredParam('password'),
		} = userData;

		this.validateUserEmail(email as string);
		this.validateUserPassword(password as string);

		return {
			id,
			name,
			email,
			password,
		} as User;
	}

	validateUserEmail(email: string): void {
		if (!this.validationService.isValidEmail(email)) {
			throw new InvalidPropertyError('Invalid contact email address.');
		}
	}

	validateUserPassword(name: string): void {
		if (name.length < 6) {
			throw new InvalidPropertyError(
				`A password must be at least 6 characters long.`,
			);
		}
	}
}

export { UserService };
