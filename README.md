# Basic Authentication Header
Construct a Basic Authentication string for the `Authorization` HTTP Header according to [RFC 7617][7]:

>If the user agent wishes to send the user-id "Aladdin" and password "open sesame", it would use the following header field:
>```
>Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==
>```


## Base64 Encoding Strategy

### Binary Encoding
Encodes strings into a binary [`Uint8Array`][1] as UTF-8. For a discussion of the need for encoding as UTF-8, see ["The Unicode Problem" on MDN][4]. If another text encoding is necessary, Pull Requests are welcome.

### Base64 Conversion
The UTF-8 binary data in the [`Uint8Array` (MDN)][1] is then encoded as Base64 by [`Uint8Array.prototype.toBase64()` (TC39)][2], currently a stage 2 TC39 Proposal, falling back to [`btoa()`][3] if the environment doesn't support or polyfill [`Uint8Array.prototype.toBase64()`][2].

## References
- See [`Uint8Array` on MDN][1]
- See TC39 Proposal ["Uint8Array to/from base64 and hex"][2]
- Problems for [`btoa()`][3] and Unicode in ["The Unicode Problem" on MDN][4]
- Sindre Sorhus: ["It's time to move from [Node.js] `Buffer` to `Uint8Array`"](https://sindresorhus.com/blog/goodbye-nodejs-buffer)

## Prior Art
- [`basic-authorization-header` (npm)](https://www.npmjs.com/package/basic-authorization-header) 
- [`basic-auth-header` (npm)](https://www.npmjs.com/package/basic-auth-header)
    
Both have these negatives: 
- Node.js Only. Rely on non-standard, global `Buffer` to base64 encode. This package uses the standard [`Uint8Array`][1] or the standard [`btoa()`][3] function.
- Use [deprecated `new Buffer(string)`][5], instead of [recommended `Buffer.from(string)`][6]. This package does not.


[1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
[2]: https://github.com/tc39/proposal-arraybuffer-base64
[3]: https://developer.mozilla.org/en-US/docs/Web/API/btoa
[4]: https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem
[5]: https://nodejs.org/api/buffer.html#new-bufferstring-encoding
[6]: https://nodejs.org/api/buffer.html#static-method-bufferfromstring-encoding
[7]: https://datatracker.ietf.org/doc/html/rfc7617#section-2