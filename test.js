// @ts-check

import assert from "node:assert/strict";
import http from "node:http";
import { after, before, describe, test } from "node:test";
import { BasicAuth } from "./index.js";

// Arrange - Username & Password from RFC 7617 (https://datatracker.ietf.org/doc/html/rfc7617#section-2)
const [username, password] = ["Aladdin", "open sesame"];
const base64Credentials = "QWxhZGRpbjpvcGVuIHNlc2FtZQ==";
const expectedAuthHeader = `Basic ${base64Credentials}`;

test("BasicAuth creates the expected encoded value", () => {
	const encoded = new BasicAuth({ username, password }).toString();
	assert.equal(encoded, expectedAuthHeader);
});

test("Can construct Headers() using BasicAuth directly (without converting to a string first)", () => {
	// Assert - Headers Object can be constructed using Basic Auth
	assert.doesNotThrow(() => {
		// @ts-expect-error - BasicAuth implements toString(), so Javascript will accept it here.
		// But Typescript doesn't allow it.
		const headers = new Headers({
			Authorization: new BasicAuth({ username, password }),
		});

		// Assert - Headers Object contains expected value
		assert.equal(headers.get("Authorization"), expectedAuthHeader);
	});
});

test("Can construct Headers() using BasicAuth, converted to a string", () => {
	// Assert - Headers Object can be constructed using Basic Auth
	assert.doesNotThrow(() => {
		const headers = new Headers({
			Authorization: new BasicAuth({ username, password }).toString(),
		});

		// Assert - Headers Object contains expected value
		assert.equal(headers.get("Authorization"), expectedAuthHeader);
	});
});

test("BasicAuth can be used in fetch() constructor", () => {
	assert.doesNotThrow(async () => {
		await fetch("https://example.com", {
			// @ts-expect-error - BasicAuth implements toString(), so Javascript will accept it here.
			// But Typescript doesn't allow it.
			headers: {
				Authorization: new BasicAuth({ username, password }),
			},
		});
	});
});

test("BasicAuth exposes a `credentials` property, containing the base64-encoded 'username:password'", () => {
	const auth = new BasicAuth({ username, password });
	assert.ok(auth.credentials);
	assert.equal(auth.credentials, base64Credentials);
});

describe("BasicAuth can encode Unicode characters", () => {
	const encoders = /** @type {const} */ (["buffer", "btoa"]);
	for (const encoder of encoders) {
		test(`Basic Auth can encode Unicode characters with the '${encoder}' encoder`, () => {
			// Sets of Basic Auth credentials and their expected encoded form
			const credentials = [
				{
					username: "test123@example.com",
					password: "🤣🤣🤣",
					expected: "Basic dGVzdDEyM0BleGFtcGxlLmNvbTrwn6Sj8J+ko/CfpKM=",
				},
				{
					// Source: https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem
					username: "example",
					password: "a Ā 𐀀 文 🦄",
					expected: "Basic ZXhhbXBsZTphIMSAIPCQgIAg5paHIPCfpoQ=",
				},
				{
					// Source: https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings
					username: "✓ à la mode",
					password: "unsafe-password",
					expected: "Basic 4pyTIMOgIGxhIG1vZGU6dW5zYWZlLXBhc3N3b3Jk",
				},
				{
					username: "🤷🏻‍♂️ has some modifiers",
					password: "⚠️⚠️⚠️",
					expected:
						"Basic 8J+kt/Cfj7vigI3imYLvuI8gaGFzIHNvbWUgbW9kaWZpZXJzOuKaoO+4j+KaoO+4j+KaoO+4jw==",
				},
			];

			// Test expected for each unicode credential set
			for (const { username, password, expected } of credentials) {
				// Will throw
				assert.doesNotThrow(() => {
					const encoded = new BasicAuth({
						username,
						password,
						encoder,
					}).toString();
					assert.equal(encoded, expected);
				});
			}
		});
	}
});

describe("HTTP Request to Local HTTP server", () => {
	// Constants
	const hostname = "localhost";
	const port = 3000;
	let closeServerFn;

	// Set up local HTTP server to reflect Request Headers back in Response body
	before(() => {
		const server = http.createServer((req, res) => {
			res.statusCode = 200;
			res.setHeader("Content-Type", "application/json");
			res.end(JSON.stringify(req.headers));
		});
		server.listen(
			port,
			hostname,
			() => `Reflection Server running at http://${hostname}:${port}`,
		);

		closeServerFn = () => server.close();
	});

	// Close HTTP Server
	after(() => closeServerFn());

	test("Real HTTP request has expected Authorization Header", async () => {
		// Make a HTTP request with Authorization header created by BasicAuth
		const res = await fetch(`http://${hostname}:${port}`, {
			// @ts-expect-error - BasicAuth implements toString(), so Javascript will accept it here.
			// But Typescript doesn't allow it.
			headers: new Headers({
				Authorization: new BasicAuth({ username, password }),
			}),
		});

		const requestHeaders = await res.json();
		assert.equal(requestHeaders.authorization, expectedAuthHeader);
	});
});
