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
	 * @param {{username: string, password: string, encoder?: 'detect'|'buffer'|'btoa'}} options Username & password to encode
	 */
	constructor({ username, password, encoder = "detect" }) {
		// Create the Basic Auth credential format
		const rawString = `${username}:${password}`;

		// Use the base64 encoder available in the environment to
		// encode the credentials
		if (encoder === "detect") {
			if ("Buffer" in globalThis) {
				this.credentials = this.encodeWithBuffer(rawString);
			} else {
				this.credentials = this.encodeWithBtoa(rawString);
			}
		} else if (encoder.toLowerCase() === "buffer") {
			this.credentials = this.encodeWithBuffer(rawString);
		} else {
			this.credentials = this.encodeWithBtoa(rawString);
		}

		// Assign the complete Authorization header
		this.encodedString = `Basic ${this.credentials}`;
	}

	toString() {
		return this.encodedString;
	}

	/**
	 * Base64 encode the argument using the Node.js global `Buffer`
	 * @param {string} str
	 */
	encodeWithBuffer(str) {
		return Buffer.from(str).toString("base64");
	}

	/**
	 * Base64 encode the argument using the global `btoa`
	 * @param {string} str
	 */
	encodeWithBtoa(str) {
		return btoa(str);
	}
}
