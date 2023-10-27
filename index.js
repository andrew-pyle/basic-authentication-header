/** @typedef {{toString: () => string}} Stringable */

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
	 * @param {{username: Stringable, password: Stringable}} options Username & password to encode
	 */
	constructor({ username, password }) {
		this.credentials = btoa(`${username}:${password}`);
		this.encodedString = `Basic ${this.credentials}`;
	}

	toString() {
		return this.encodedString;
	}
}
