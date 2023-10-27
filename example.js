import { BasicAuth } from "./index.js";

async function main() {
	try {
		const res = await fetch("https://example.com", {
			headers: new Headers({
				Authorization: new BasicAuth({
					username: "plain-text-username",
					password: "plain-text-password",
				}),
			}),
		});

		console.log(`HTTP Status: ${res.status} from '${res.url}'`);
	} catch (err) {
		console.error(err);
	}
}

main();
