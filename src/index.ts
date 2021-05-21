import 'reflect-metadata';
import http from 'http';
import chalk from 'chalk';
import app from './app';

const main = () => {
	const server = http.createServer(app);

	const port = process.env.PORT || 5000;

	server.listen(port, () => {
		console.log(
			`Server is up ${chalk.green.bold(
				'successfully',
			)} on port ${chalk.blue.bold(port)}`,
		);
	});
};

main();
