// @ts-check

/**
 * Class to construct an appropriate string value for a HTTP Authorization Header.
 *
 * Relies on existence of a global `btoa()` function.
 * @example
 * new Headers({
 *     Authorization: new BasicAuth({ username, password })
 * })
 *
 * @example
 * fetch("https://example.com", {
 *     headers: {
 *         Authorization: new BasicAuth({ username, password })
 *     },
 * });
 */
export class BasicAuth {
	/**
	 * @type {string} The Basic Auth header string
	 */
	encodedString;

	/**
	 * @type {string} The Encoded version of the provided credentials
	 */
	credentials;

	/**
	 * @param {{username: string, password: string}} options Username & password to encode
	 */
	constructor({ username, password }) {
		// Create the Basic Auth credential format
		const rawString = `${username}:${password}`;

		// Use the base64 encoder available in the environment to
		// encode the credentials
		if (globalThis.Buffer) {
			this.credentials = Buffer.from(rawString).toString("base64");
		} else {
			this.credentials = btoa(rawString);
		}

		// Assign the complete Authorization header
		this.encodedString = `Basic ${this.credentials}`;
	}

	toString() {
		return this.encodedString;
	}
}
