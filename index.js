export class BasicAuth {
	/**
	 * @type {string} The Encoded version of the Basic Auth
	 */
	encodedString = "";

	/**
	 * @param {{toString: () => string}} username Username to encode
	 * @param {{toString: () => string}} password Password to encode
	 */
	constructor(username, password) {
		this.credentials = btoa(`${username}:${password}`);
		this.encodedString = `Basic ${this.credentials}`;
	}

	// get credentials() {
	// 	return this.credentials;
	// }

	toString() {
		return this.encodedString;
	}
}

export class BearerAuth {
	/**
	 * @type {string} The Encoded version of the Basic Auth
	 */
	encodedString = "";

	/**
	 * @param {{toString: () => string}} token Bearer Token to encode
	 */
	constructor(token) {
		this.encodedString = `Basic ${btoa(token)}`;
	}

	toString() {
		return this.encodedString;
	}
}
