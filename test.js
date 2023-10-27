import assert from "node:assert/strict";
import test from "node:test";
import { BasicAuth } from "./index.js";

// Arrange - Create sample username & password
const [username, password] = ["aaa", "123"];
const base64Credentials = "YWFhOjEyMw==";
const expectedAuthHeader = `Basic ${base64Credentials}`;

test("Basic Auth creates the expected encoded value", () => {
	const encoded = new BasicAuth({ username, password }).toString();
	assert.equal(encoded, expectedAuthHeader);
});

test("Can construct Headers() using BasicAuth directly (without converting to a string first)", () => {
	// Arrange - Create sample username & password
	const [username, password] = ["aaa", "123"];

	// Assert - Headers Object can be constructed using Basic Auth
	assert.doesNotThrow(() => {
		const headers = new Headers({
			Authorization: new BasicAuth({ username, password }),
		});

		// Assert - Headers Object contains expected value
		assert.equal(headers.get("Authorization"), expectedAuthHeader);
	});
});

test("Can construct Headers() using BasicAuth, converted to a string", () => {
	// Arrange - Create sample username & password
	const [username, password] = ["aaa", "123"];

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
			headers: {
				Authorization: new BasicAuth({ username, password }),
			},
		});
	});
});

test("Basic Auth exposes a `credentials` property, containing the base64-encoded 'username:password'", () => {
	const auth = new BasicAuth({ username, password });
	assert.ok(auth.credentials);
	assert.equal(auth.credentials, base64Credentials);
});
