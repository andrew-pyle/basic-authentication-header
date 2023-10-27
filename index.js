// @ts-check

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
	 * @param {{username: string, password: string }} options Username & password to encode
	 */
	constructor({ username, password }) {
		// Create the Basic Auth credential format
		const rawString = `${username}:${password}`;

		/**
		 * @type {string} The Encoded version of the provided credentials
		 */
		this.credentials = this.encodeUtf8AsBase64(rawString);

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
	 * Base64 encode the argument using Uint8Array.prototype.toBase64 or the global `btoa`.
	 * Encodes the input string as UTF-8 bytes into a Uint8Array, and encodes these
	 * bytes.
	 * @see https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem
	 *
	 * @param {string} str
	 */
	encodeUtf8AsBase64(str) {
		// const utf8Bytes = new TextEncoder().encode(str);
		// const utf8BytesString = String.fromCodePoint(...utf8Bytes);
		const utf8Binary = new TextEncoder().encode(str);

		/**
		 * Remove custom implementation of Uint8Array.prototype.toBase64()
		 * once "Uint8Array to/from base64 and hex" proposal lands
		 * @see https://github.com/tc39/proposal-arraybuffer-base64
		 */
		// @ts-expect-error - We are detecting if Uint8Array.prototype.toBase64() has landed
		if (typeof utf8Binary.toBase64 !== "function") {
			return btoa(String.fromCodePoint(...utf8Binary));
		}

		// @ts-expect-error - Use Uint8Array.prototype.toBase64(), if it exists
		return utf8Binary.toBase64();
	}
}
