// @ts-check

/** @typedef {'detect'|'buffer'|'btoa'} EncoderOptions */

/**
 * Class to construct an appropriate string value for a HTTP Authorization Header.
 *
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
	 * @param {{username: string, password: string, encoder?:EncoderOptions }} options Username & password to encode
	 */
	constructor({ username, password, encoder = "detect" }) {
		// Create the Basic Auth credential format
		const rawString = `${username}:${password}`;

		/**
		 * @type {string} The Encoded version of the provided credentials
		 */
		this.credentials = this.encode(encoder, rawString);

		/**
		 * Assign the complete Authorization header
		 * @type {string} The Basic Auth header string
		 */
		this.encodedString = `Basic ${this.credentials}`;
	}

	/**
	 * Allow the Class to be used directly in Headers() and fetch(), since these
	 * classes will call their argument's toString() method while being constructed
	 */
	toString() {
		return this.encodedString;
	}

	/**
	 * Encode the provided string as Base64 using the specified type of encoder.
	 * @param {EncoderOptions} encoder
	 * @param {string} str
	 */
	encode(encoder, str) {
		// Use the base64 encoder available in the environment to
		// encode the credentials
		if (encoder === "detect") {
			if ("Buffer" in globalThis) {
				return this.encodeWithBuffer(str);
			} else {
				return this.encodeWithBtoa(str);
			}
		} else if (encoder.toLowerCase() === "buffer") {
			return this.encodeWithBuffer(str);
		} else {
			return this.encodeWithBtoa(str);
		}
	}

	/**
	 * Base64 encode the argument using the Node.js global `Buffer`
	 * @param {string} str
	 */
	encodeWithBuffer(str) {
		return Buffer.from(str).toString("base64");
	}

	/**
	 * Base64 encode the argument using the global `btoa`. Encodes the input string
	 * as UTF-8 bytes, and encodes these bytes with `btoa`.
	 * @see https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem
	 *
	 * @param {string} str
	 */
	encodeWithBtoa(str) {
		const utf8Bytes = new TextEncoder().encode(str);
		const utf8BytesString = String.fromCodePoint(...utf8Bytes);
		return btoa(utf8BytesString);
	}
}
