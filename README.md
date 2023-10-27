# Basic Authentication Header
Construct a Basic Authentication value for the `Authorization` HTTP Header according to [RFC 7617](https://datatracker.ietf.org/doc/html/rfc7617#section-2).

Encodes strings as UTF-8 before encoding as Base64. For a discussion of the need for encoding as UTF-8, see ["The Unicode Problem" on MDN](https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem). If another text encoding is necessary, Pull Requests are welcome.

## Environments
  - Browser `btoa` encoder
  - Node.js `Buffer` encoder


## Prior Art
- [`basic-authorization-header`](https://www.npmjs.com/package/basic-authorization-header) (npm package)
    - Node.js Only. Relies on global `Buffer` to base64 encode.
    - Uses [deprecated `new Buffer(string)`](https://nodejs.org/api/buffer.html#new-bufferstring-encoding), instead of [recommended `Buffer.from(string)`](https://nodejs.org/api/buffer.html#static-method-bufferfromstring-encoding)
- [`basic-auth-header`](https://www.npmjs.com/package/basic-auth-header) (npm package)
    - Node.js Only. Relies on global `Buffer` to base64 encode.
    - Uses [deprecated `new Buffer(string)`](https://nodejs.org/api/buffer.html#new-bufferstring-encoding), instead of [recommended `Buffer.from(string)`](https://nodejs.org/api/buffer.html#static-method-bufferfromstring-encoding)