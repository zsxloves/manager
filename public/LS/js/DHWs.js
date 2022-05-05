(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.DHWs = factory());
}(this, (function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var jsencrypt = createCommonjsModule(function (module, exports) {
	(function (global, factory) {
		factory(exports) ;
	}(commonjsGlobal, (function (exports) {
	var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
	function int2char(n) {
	    return BI_RM.charAt(n);
	}
	//#region BIT_OPERATIONS
	// (public) this & a
	function op_and(x, y) {
	    return x & y;
	}
	// (public) this | a
	function op_or(x, y) {
	    return x | y;
	}
	// (public) this ^ a
	function op_xor(x, y) {
	    return x ^ y;
	}
	// (public) this & ~a
	function op_andnot(x, y) {
	    return x & ~y;
	}
	// return index of lowest 1-bit in x, x < 2^31
	function lbit(x) {
	    if (x == 0) {
	        return -1;
	    }
	    var r = 0;
	    if ((x & 0xffff) == 0) {
	        x >>= 16;
	        r += 16;
	    }
	    if ((x & 0xff) == 0) {
	        x >>= 8;
	        r += 8;
	    }
	    if ((x & 0xf) == 0) {
	        x >>= 4;
	        r += 4;
	    }
	    if ((x & 3) == 0) {
	        x >>= 2;
	        r += 2;
	    }
	    if ((x & 1) == 0) {
	        ++r;
	    }
	    return r;
	}
	// return number of 1 bits in x
	function cbit(x) {
	    var r = 0;
	    while (x != 0) {
	        x &= x - 1;
	        ++r;
	    }
	    return r;
	}
	//#endregion BIT_OPERATIONS

	var b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var b64pad = "=";
	function hex2b64(h) {
	    var i;
	    var c;
	    var ret = "";
	    for (i = 0; i + 3 <= h.length; i += 3) {
	        c = parseInt(h.substring(i, i + 3), 16);
	        ret += b64map.charAt(c >> 6) + b64map.charAt(c & 63);
	    }
	    if (i + 1 == h.length) {
	        c = parseInt(h.substring(i, i + 1), 16);
	        ret += b64map.charAt(c << 2);
	    }
	    else if (i + 2 == h.length) {
	        c = parseInt(h.substring(i, i + 2), 16);
	        ret += b64map.charAt(c >> 2) + b64map.charAt((c & 3) << 4);
	    }
	    while ((ret.length & 3) > 0) {
	        ret += b64pad;
	    }
	    return ret;
	}
	// convert a base64 string to hex
	function b64tohex(s) {
	    var ret = "";
	    var i;
	    var k = 0; // b64 state, 0-3
	    var slop = 0;
	    for (i = 0; i < s.length; ++i) {
	        if (s.charAt(i) == b64pad) {
	            break;
	        }
	        var v = b64map.indexOf(s.charAt(i));
	        if (v < 0) {
	            continue;
	        }
	        if (k == 0) {
	            ret += int2char(v >> 2);
	            slop = v & 3;
	            k = 1;
	        }
	        else if (k == 1) {
	            ret += int2char((slop << 2) | (v >> 4));
	            slop = v & 0xf;
	            k = 2;
	        }
	        else if (k == 2) {
	            ret += int2char(slop);
	            ret += int2char(v >> 2);
	            slop = v & 3;
	            k = 3;
	        }
	        else {
	            ret += int2char((slop << 2) | (v >> 4));
	            ret += int2char(v & 0xf);
	            k = 0;
	        }
	    }
	    if (k == 1) {
	        ret += int2char(slop << 2);
	    }
	    return ret;
	}

	/*! *****************************************************************************
	Copyright (c) Microsoft Corporation. All rights reserved.
	Licensed under the Apache License, Version 2.0 (the "License"); you may not use
	this file except in compliance with the License. You may obtain a copy of the
	License at http://www.apache.org/licenses/LICENSE-2.0

	THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
	KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
	WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
	MERCHANTABLITY OR NON-INFRINGEMENT.

	See the Apache Version 2.0 License for specific language governing permissions
	and limitations under the License.
	***************************************************************************** */
	/* global Reflect, Promise */

	var extendStatics = function(d, b) {
	    extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return extendStatics(d, b);
	};

	function __extends(d, b) {
	    extendStatics(d, b);
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	}

	// Hex JavaScript decoder
	// Copyright (c) 2008-2013 Lapo Luchini <lapo@lapo.it>
	// Permission to use, copy, modify, and/or distribute this software for any
	// purpose with or without fee is hereby granted, provided that the above
	// copyright notice and this permission notice appear in all copies.
	//
	// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
	// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
	// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
	// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
	// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
	// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
	// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
	/*jshint browser: true, strict: true, immed: true, latedef: true, undef: true, regexdash: false */
	var decoder;
	var Hex = {
	    decode: function (a) {
	        var i;
	        if (decoder === undefined) {
	            var hex = "0123456789ABCDEF";
	            var ignore = " \f\n\r\t\u00A0\u2028\u2029";
	            decoder = {};
	            for (i = 0; i < 16; ++i) {
	                decoder[hex.charAt(i)] = i;
	            }
	            hex = hex.toLowerCase();
	            for (i = 10; i < 16; ++i) {
	                decoder[hex.charAt(i)] = i;
	            }
	            for (i = 0; i < ignore.length; ++i) {
	                decoder[ignore.charAt(i)] = -1;
	            }
	        }
	        var out = [];
	        var bits = 0;
	        var char_count = 0;
	        for (i = 0; i < a.length; ++i) {
	            var c = a.charAt(i);
	            if (c == "=") {
	                break;
	            }
	            c = decoder[c];
	            if (c == -1) {
	                continue;
	            }
	            if (c === undefined) {
	                throw new Error("Illegal character at offset " + i);
	            }
	            bits |= c;
	            if (++char_count >= 2) {
	                out[out.length] = bits;
	                bits = 0;
	                char_count = 0;
	            }
	            else {
	                bits <<= 4;
	            }
	        }
	        if (char_count) {
	            throw new Error("Hex encoding incomplete: 4 bits missing");
	        }
	        return out;
	    }
	};

	// Base64 JavaScript decoder
	// Copyright (c) 2008-2013 Lapo Luchini <lapo@lapo.it>
	// Permission to use, copy, modify, and/or distribute this software for any
	// purpose with or without fee is hereby granted, provided that the above
	// copyright notice and this permission notice appear in all copies.
	//
	// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
	// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
	// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
	// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
	// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
	// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
	// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
	/*jshint browser: true, strict: true, immed: true, latedef: true, undef: true, regexdash: false */
	var decoder$1;
	var Base64 = {
	    decode: function (a) {
	        var i;
	        if (decoder$1 === undefined) {
	            var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	            var ignore = "= \f\n\r\t\u00A0\u2028\u2029";
	            decoder$1 = Object.create(null);
	            for (i = 0; i < 64; ++i) {
	                decoder$1[b64.charAt(i)] = i;
	            }
	            for (i = 0; i < ignore.length; ++i) {
	                decoder$1[ignore.charAt(i)] = -1;
	            }
	        }
	        var out = [];
	        var bits = 0;
	        var char_count = 0;
	        for (i = 0; i < a.length; ++i) {
	            var c = a.charAt(i);
	            if (c == "=") {
	                break;
	            }
	            c = decoder$1[c];
	            if (c == -1) {
	                continue;
	            }
	            if (c === undefined) {
	                throw new Error("Illegal character at offset " + i);
	            }
	            bits |= c;
	            if (++char_count >= 4) {
	                out[out.length] = (bits >> 16);
	                out[out.length] = (bits >> 8) & 0xFF;
	                out[out.length] = bits & 0xFF;
	                bits = 0;
	                char_count = 0;
	            }
	            else {
	                bits <<= 6;
	            }
	        }
	        switch (char_count) {
	            case 1:
	                throw new Error("Base64 encoding incomplete: at least 2 bits missing");
	            case 2:
	                out[out.length] = (bits >> 10);
	                break;
	            case 3:
	                out[out.length] = (bits >> 16);
	                out[out.length] = (bits >> 8) & 0xFF;
	                break;
	        }
	        return out;
	    },
	    re: /-----BEGIN [^-]+-----([A-Za-z0-9+\/=\s]+)-----END [^-]+-----|begin-base64[^\n]+\n([A-Za-z0-9+\/=\s]+)====/,
	    unarmor: function (a) {
	        var m = Base64.re.exec(a);
	        if (m) {
	            if (m[1]) {
	                a = m[1];
	            }
	            else if (m[2]) {
	                a = m[2];
	            }
	            else {
	                throw new Error("RegExp out of sync");
	            }
	        }
	        return Base64.decode(a);
	    }
	};

	// Big integer base-10 printing library
	// Copyright (c) 2014 Lapo Luchini <lapo@lapo.it>
	// Permission to use, copy, modify, and/or distribute this software for any
	// purpose with or without fee is hereby granted, provided that the above
	// copyright notice and this permission notice appear in all copies.
	//
	// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
	// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
	// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
	// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
	// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
	// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
	// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
	/*jshint browser: true, strict: true, immed: true, latedef: true, undef: true, regexdash: false */
	var max = 10000000000000; // biggest integer that can still fit 2^53 when multiplied by 256
	var Int10 = /** @class */ (function () {
	    function Int10(value) {
	        this.buf = [+value || 0];
	    }
	    Int10.prototype.mulAdd = function (m, c) {
	        // assert(m <= 256)
	        var b = this.buf;
	        var l = b.length;
	        var i;
	        var t;
	        for (i = 0; i < l; ++i) {
	            t = b[i] * m + c;
	            if (t < max) {
	                c = 0;
	            }
	            else {
	                c = 0 | (t / max);
	                t -= c * max;
	            }
	            b[i] = t;
	        }
	        if (c > 0) {
	            b[i] = c;
	        }
	    };
	    Int10.prototype.sub = function (c) {
	        // assert(m <= 256)
	        var b = this.buf;
	        var l = b.length;
	        var i;
	        var t;
	        for (i = 0; i < l; ++i) {
	            t = b[i] - c;
	            if (t < 0) {
	                t += max;
	                c = 1;
	            }
	            else {
	                c = 0;
	            }
	            b[i] = t;
	        }
	        while (b[b.length - 1] === 0) {
	            b.pop();
	        }
	    };
	    Int10.prototype.toString = function (base) {
	        if ((base || 10) != 10) {
	            throw new Error("only base 10 is supported");
	        }
	        var b = this.buf;
	        var s = b[b.length - 1].toString();
	        for (var i = b.length - 2; i >= 0; --i) {
	            s += (max + b[i]).toString().substring(1);
	        }
	        return s;
	    };
	    Int10.prototype.valueOf = function () {
	        var b = this.buf;
	        var v = 0;
	        for (var i = b.length - 1; i >= 0; --i) {
	            v = v * max + b[i];
	        }
	        return v;
	    };
	    Int10.prototype.simplify = function () {
	        var b = this.buf;
	        return (b.length == 1) ? b[0] : this;
	    };
	    return Int10;
	}());

	// ASN.1 JavaScript decoder
	var ellipsis = "\u2026";
	var reTimeS = /^(\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;
	var reTimeL = /^(\d\d\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;
	function stringCut(str, len) {
	    if (str.length > len) {
	        str = str.substring(0, len) + ellipsis;
	    }
	    return str;
	}
	var Stream = /** @class */ (function () {
	    function Stream(enc, pos) {
	        this.hexDigits = "0123456789ABCDEF";
	        if (enc instanceof Stream) {
	            this.enc = enc.enc;
	            this.pos = enc.pos;
	        }
	        else {
	            // enc should be an array or a binary string
	            this.enc = enc;
	            this.pos = pos;
	        }
	    }
	    Stream.prototype.get = function (pos) {
	        if (pos === undefined) {
	            pos = this.pos++;
	        }
	        if (pos >= this.enc.length) {
	            throw new Error("Requesting byte offset " + pos + " on a stream of length " + this.enc.length);
	        }
	        return ("string" === typeof this.enc) ? this.enc.charCodeAt(pos) : this.enc[pos];
	    };
	    Stream.prototype.hexByte = function (b) {
	        return this.hexDigits.charAt((b >> 4) & 0xF) + this.hexDigits.charAt(b & 0xF);
	    };
	    Stream.prototype.hexDump = function (start, end, raw) {
	        var s = "";
	        for (var i = start; i < end; ++i) {
	            s += this.hexByte(this.get(i));
	            if (raw !== true) {
	                switch (i & 0xF) {
	                    case 0x7:
	                        s += "  ";
	                        break;
	                    case 0xF:
	                        s += "\n";
	                        break;
	                    default:
	                        s += " ";
	                }
	            }
	        }
	        return s;
	    };
	    Stream.prototype.isASCII = function (start, end) {
	        for (var i = start; i < end; ++i) {
	            var c = this.get(i);
	            if (c < 32 || c > 176) {
	                return false;
	            }
	        }
	        return true;
	    };
	    Stream.prototype.parseStringISO = function (start, end) {
	        var s = "";
	        for (var i = start; i < end; ++i) {
	            s += String.fromCharCode(this.get(i));
	        }
	        return s;
	    };
	    Stream.prototype.parseStringUTF = function (start, end) {
	        var s = "";
	        for (var i = start; i < end;) {
	            var c = this.get(i++);
	            if (c < 128) {
	                s += String.fromCharCode(c);
	            }
	            else if ((c > 191) && (c < 224)) {
	                s += String.fromCharCode(((c & 0x1F) << 6) | (this.get(i++) & 0x3F));
	            }
	            else {
	                s += String.fromCharCode(((c & 0x0F) << 12) | ((this.get(i++) & 0x3F) << 6) | (this.get(i++) & 0x3F));
	            }
	        }
	        return s;
	    };
	    Stream.prototype.parseStringBMP = function (start, end) {
	        var str = "";
	        var hi;
	        var lo;
	        for (var i = start; i < end;) {
	            hi = this.get(i++);
	            lo = this.get(i++);
	            str += String.fromCharCode((hi << 8) | lo);
	        }
	        return str;
	    };
	    Stream.prototype.parseTime = function (start, end, shortYear) {
	        var s = this.parseStringISO(start, end);
	        var m = (shortYear ? reTimeS : reTimeL).exec(s);
	        if (!m) {
	            return "Unrecognized time: " + s;
	        }
	        if (shortYear) {
	            // to avoid querying the timer, use the fixed range [1970, 2069]
	            // it will conform with ITU X.400 [-10, +40] sliding window until 2030
	            m[1] = +m[1];
	            m[1] += (+m[1] < 70) ? 2000 : 1900;
	        }
	        s = m[1] + "-" + m[2] + "-" + m[3] + " " + m[4];
	        if (m[5]) {
	            s += ":" + m[5];
	            if (m[6]) {
	                s += ":" + m[6];
	                if (m[7]) {
	                    s += "." + m[7];
	                }
	            }
	        }
	        if (m[8]) {
	            s += " UTC";
	            if (m[8] != "Z") {
	                s += m[8];
	                if (m[9]) {
	                    s += ":" + m[9];
	                }
	            }
	        }
	        return s;
	    };
	    Stream.prototype.parseInteger = function (start, end) {
	        var v = this.get(start);
	        var neg = (v > 127);
	        var pad = neg ? 255 : 0;
	        var len;
	        var s = "";
	        // skip unuseful bits (not allowed in DER)
	        while (v == pad && ++start < end) {
	            v = this.get(start);
	        }
	        len = end - start;
	        if (len === 0) {
	            return neg ? -1 : 0;
	        }
	        // show bit length of huge integers
	        if (len > 4) {
	            s = v;
	            len <<= 3;
	            while (((+s ^ pad) & 0x80) == 0) {
	                s = +s << 1;
	                --len;
	            }
	            s = "(" + len + " bit)\n";
	        }
	        // decode the integer
	        if (neg) {
	            v = v - 256;
	        }
	        var n = new Int10(v);
	        for (var i = start + 1; i < end; ++i) {
	            n.mulAdd(256, this.get(i));
	        }
	        return s + n.toString();
	    };
	    Stream.prototype.parseBitString = function (start, end, maxLength) {
	        var unusedBit = this.get(start);
	        var lenBit = ((end - start - 1) << 3) - unusedBit;
	        var intro = "(" + lenBit + " bit)\n";
	        var s = "";
	        for (var i = start + 1; i < end; ++i) {
	            var b = this.get(i);
	            var skip = (i == end - 1) ? unusedBit : 0;
	            for (var j = 7; j >= skip; --j) {
	                s += (b >> j) & 1 ? "1" : "0";
	            }
	            if (s.length > maxLength) {
	                return intro + stringCut(s, maxLength);
	            }
	        }
	        return intro + s;
	    };
	    Stream.prototype.parseOctetString = function (start, end, maxLength) {
	        if (this.isASCII(start, end)) {
	            return stringCut(this.parseStringISO(start, end), maxLength);
	        }
	        var len = end - start;
	        var s = "(" + len + " byte)\n";
	        maxLength /= 2; // we work in bytes
	        if (len > maxLength) {
	            end = start + maxLength;
	        }
	        for (var i = start; i < end; ++i) {
	            s += this.hexByte(this.get(i));
	        }
	        if (len > maxLength) {
	            s += ellipsis;
	        }
	        return s;
	    };
	    Stream.prototype.parseOID = function (start, end, maxLength) {
	        var s = "";
	        var n = new Int10();
	        var bits = 0;
	        for (var i = start; i < end; ++i) {
	            var v = this.get(i);
	            n.mulAdd(128, v & 0x7F);
	            bits += 7;
	            if (!(v & 0x80)) { // finished
	                if (s === "") {
	                    n = n.simplify();
	                    if (n instanceof Int10) {
	                        n.sub(80);
	                        s = "2." + n.toString();
	                    }
	                    else {
	                        var m = n < 80 ? n < 40 ? 0 : 1 : 2;
	                        s = m + "." + (n - m * 40);
	                    }
	                }
	                else {
	                    s += "." + n.toString();
	                }
	                if (s.length > maxLength) {
	                    return stringCut(s, maxLength);
	                }
	                n = new Int10();
	                bits = 0;
	            }
	        }
	        if (bits > 0) {
	            s += ".incomplete";
	        }
	        return s;
	    };
	    return Stream;
	}());
	var ASN1 = /** @class */ (function () {
	    function ASN1(stream, header, length, tag, sub) {
	        if (!(tag instanceof ASN1Tag)) {
	            throw new Error("Invalid tag value.");
	        }
	        this.stream = stream;
	        this.header = header;
	        this.length = length;
	        this.tag = tag;
	        this.sub = sub;
	    }
	    ASN1.prototype.typeName = function () {
	        switch (this.tag.tagClass) {
	            case 0: // universal
	                switch (this.tag.tagNumber) {
	                    case 0x00:
	                        return "EOC";
	                    case 0x01:
	                        return "BOOLEAN";
	                    case 0x02:
	                        return "INTEGER";
	                    case 0x03:
	                        return "BIT_STRING";
	                    case 0x04:
	                        return "OCTET_STRING";
	                    case 0x05:
	                        return "NULL";
	                    case 0x06:
	                        return "OBJECT_IDENTIFIER";
	                    case 0x07:
	                        return "ObjectDescriptor";
	                    case 0x08:
	                        return "EXTERNAL";
	                    case 0x09:
	                        return "REAL";
	                    case 0x0A:
	                        return "ENUMERATED";
	                    case 0x0B:
	                        return "EMBEDDED_PDV";
	                    case 0x0C:
	                        return "UTF8String";
	                    case 0x10:
	                        return "SEQUENCE";
	                    case 0x11:
	                        return "SET";
	                    case 0x12:
	                        return "NumericString";
	                    case 0x13:
	                        return "PrintableString"; // ASCII subset
	                    case 0x14:
	                        return "TeletexString"; // aka T61String
	                    case 0x15:
	                        return "VideotexString";
	                    case 0x16:
	                        return "IA5String"; // ASCII
	                    case 0x17:
	                        return "UTCTime";
	                    case 0x18:
	                        return "GeneralizedTime";
	                    case 0x19:
	                        return "GraphicString";
	                    case 0x1A:
	                        return "VisibleString"; // ASCII subset
	                    case 0x1B:
	                        return "GeneralString";
	                    case 0x1C:
	                        return "UniversalString";
	                    case 0x1E:
	                        return "BMPString";
	                }
	                return "Universal_" + this.tag.tagNumber.toString();
	            case 1:
	                return "Application_" + this.tag.tagNumber.toString();
	            case 2:
	                return "[" + this.tag.tagNumber.toString() + "]"; // Context
	            case 3:
	                return "Private_" + this.tag.tagNumber.toString();
	        }
	    };
	    ASN1.prototype.content = function (maxLength) {
	        if (this.tag === undefined) {
	            return null;
	        }
	        if (maxLength === undefined) {
	            maxLength = Infinity;
	        }
	        var content = this.posContent();
	        var len = Math.abs(this.length);
	        if (!this.tag.isUniversal()) {
	            if (this.sub !== null) {
	                return "(" + this.sub.length + " elem)";
	            }
	            return this.stream.parseOctetString(content, content + len, maxLength);
	        }
	        switch (this.tag.tagNumber) {
	            case 0x01: // BOOLEAN
	                return (this.stream.get(content) === 0) ? "false" : "true";
	            case 0x02: // INTEGER
	                return this.stream.parseInteger(content, content + len);
	            case 0x03: // BIT_STRING
	                return this.sub ? "(" + this.sub.length + " elem)" :
	                    this.stream.parseBitString(content, content + len, maxLength);
	            case 0x04: // OCTET_STRING
	                return this.sub ? "(" + this.sub.length + " elem)" :
	                    this.stream.parseOctetString(content, content + len, maxLength);
	            // case 0x05: // NULL
	            case 0x06: // OBJECT_IDENTIFIER
	                return this.stream.parseOID(content, content + len, maxLength);
	            // case 0x07: // ObjectDescriptor
	            // case 0x08: // EXTERNAL
	            // case 0x09: // REAL
	            // case 0x0A: // ENUMERATED
	            // case 0x0B: // EMBEDDED_PDV
	            case 0x10: // SEQUENCE
	            case 0x11: // SET
	                if (this.sub !== null) {
	                    return "(" + this.sub.length + " elem)";
	                }
	                else {
	                    return "(no elem)";
	                }
	            case 0x0C: // UTF8String
	                return stringCut(this.stream.parseStringUTF(content, content + len), maxLength);
	            case 0x12: // NumericString
	            case 0x13: // PrintableString
	            case 0x14: // TeletexString
	            case 0x15: // VideotexString
	            case 0x16: // IA5String
	            // case 0x19: // GraphicString
	            case 0x1A: // VisibleString
	                // case 0x1B: // GeneralString
	                // case 0x1C: // UniversalString
	                return stringCut(this.stream.parseStringISO(content, content + len), maxLength);
	            case 0x1E: // BMPString
	                return stringCut(this.stream.parseStringBMP(content, content + len), maxLength);
	            case 0x17: // UTCTime
	            case 0x18: // GeneralizedTime
	                return this.stream.parseTime(content, content + len, (this.tag.tagNumber == 0x17));
	        }
	        return null;
	    };
	    ASN1.prototype.toString = function () {
	        return this.typeName() + "@" + this.stream.pos + "[header:" + this.header + ",length:" + this.length + ",sub:" + ((this.sub === null) ? "null" : this.sub.length) + "]";
	    };
	    ASN1.prototype.toPrettyString = function (indent) {
	        if (indent === undefined) {
	            indent = "";
	        }
	        var s = indent + this.typeName() + " @" + this.stream.pos;
	        if (this.length >= 0) {
	            s += "+";
	        }
	        s += this.length;
	        if (this.tag.tagConstructed) {
	            s += " (constructed)";
	        }
	        else if ((this.tag.isUniversal() && ((this.tag.tagNumber == 0x03) || (this.tag.tagNumber == 0x04))) && (this.sub !== null)) {
	            s += " (encapsulates)";
	        }
	        s += "\n";
	        if (this.sub !== null) {
	            indent += "  ";
	            for (var i = 0, max = this.sub.length; i < max; ++i) {
	                s += this.sub[i].toPrettyString(indent);
	            }
	        }
	        return s;
	    };
	    ASN1.prototype.posStart = function () {
	        return this.stream.pos;
	    };
	    ASN1.prototype.posContent = function () {
	        return this.stream.pos + this.header;
	    };
	    ASN1.prototype.posEnd = function () {
	        return this.stream.pos + this.header + Math.abs(this.length);
	    };
	    ASN1.prototype.toHexString = function () {
	        return this.stream.hexDump(this.posStart(), this.posEnd(), true);
	    };
	    ASN1.decodeLength = function (stream) {
	        var buf = stream.get();
	        var len = buf & 0x7F;
	        if (len == buf) {
	            return len;
	        }
	        // no reason to use Int10, as it would be a huge buffer anyways
	        if (len > 6) {
	            throw new Error("Length over 48 bits not supported at position " + (stream.pos - 1));
	        }
	        if (len === 0) {
	            return null;
	        } // undefined
	        buf = 0;
	        for (var i = 0; i < len; ++i) {
	            buf = (buf * 256) + stream.get();
	        }
	        return buf;
	    };
	    /**
	     * Retrieve the hexadecimal value (as a string) of the current ASN.1 element
	     * @returns {string}
	     * @public
	     */
	    ASN1.prototype.getHexStringValue = function () {
	        var hexString = this.toHexString();
	        var offset = this.header * 2;
	        var length = this.length * 2;
	        return hexString.substr(offset, length);
	    };
	    ASN1.decode = function (str) {
	        var stream;
	        if (!(str instanceof Stream)) {
	            stream = new Stream(str, 0);
	        }
	        else {
	            stream = str;
	        }
	        var streamStart = new Stream(stream);
	        var tag = new ASN1Tag(stream);
	        var len = ASN1.decodeLength(stream);
	        var start = stream.pos;
	        var header = start - streamStart.pos;
	        var sub = null;
	        var getSub = function () {
	            var ret = [];
	            if (len !== null) {
	                // definite length
	                var end = start + len;
	                while (stream.pos < end) {
	                    ret[ret.length] = ASN1.decode(stream);
	                }
	                if (stream.pos != end) {
	                    throw new Error("Content size is not correct for container starting at offset " + start);
	                }
	            }
	            else {
	                // undefined length
	                try {
	                    for (;;) {
	                        var s = ASN1.decode(stream);
	                        if (s.tag.isEOC()) {
	                            break;
	                        }
	                        ret[ret.length] = s;
	                    }
	                    len = start - stream.pos; // undefined lengths are represented as negative values
	                }
	                catch (e) {
	                    throw new Error("Exception while decoding undefined length content: " + e);
	                }
	            }
	            return ret;
	        };
	        if (tag.tagConstructed) {
	            // must have valid content
	            sub = getSub();
	        }
	        else if (tag.isUniversal() && ((tag.tagNumber == 0x03) || (tag.tagNumber == 0x04))) {
	            // sometimes BitString and OctetString are used to encapsulate ASN.1
	            try {
	                if (tag.tagNumber == 0x03) {
	                    if (stream.get() != 0) {
	                        throw new Error("BIT STRINGs with unused bits cannot encapsulate.");
	                    }
	                }
	                sub = getSub();
	                for (var i = 0; i < sub.length; ++i) {
	                    if (sub[i].tag.isEOC()) {
	                        throw new Error("EOC is not supposed to be actual content.");
	                    }
	                }
	            }
	            catch (e) {
	                // but silently ignore when they don't
	                sub = null;
	            }
	        }
	        if (sub === null) {
	            if (len === null) {
	                throw new Error("We can't skip over an invalid tag with undefined length at offset " + start);
	            }
	            stream.pos = start + Math.abs(len);
	        }
	        return new ASN1(streamStart, header, len, tag, sub);
	    };
	    return ASN1;
	}());
	var ASN1Tag = /** @class */ (function () {
	    function ASN1Tag(stream) {
	        var buf = stream.get();
	        this.tagClass = buf >> 6;
	        this.tagConstructed = ((buf & 0x20) !== 0);
	        this.tagNumber = buf & 0x1F;
	        if (this.tagNumber == 0x1F) { // long tag
	            var n = new Int10();
	            do {
	                buf = stream.get();
	                n.mulAdd(128, buf & 0x7F);
	            } while (buf & 0x80);
	            this.tagNumber = n.simplify();
	        }
	    }
	    ASN1Tag.prototype.isUniversal = function () {
	        return this.tagClass === 0x00;
	    };
	    ASN1Tag.prototype.isEOC = function () {
	        return this.tagClass === 0x00 && this.tagNumber === 0x00;
	    };
	    return ASN1Tag;
	}());

	// Copyright (c) 2005  Tom Wu
	// Bits per digit
	var dbits;
	//#region
	var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
	var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];
	//#endregion
	// (public) Constructor
	var BigInteger = /** @class */ (function () {
	    function BigInteger(a, b, c) {
	        if (a != null) {
	            if ("number" == typeof a) {
	                this.fromNumber(a, b, c);
	            }
	            else if (b == null && "string" != typeof a) {
	                this.fromString(a, 256);
	            }
	            else {
	                this.fromString(a, b);
	            }
	        }
	    }
	    //#region PUBLIC
	    // BigInteger.prototype.toString = bnToString;
	    // (public) return string representation in given radix
	    BigInteger.prototype.toString = function (b) {
	        if (this.s < 0) {
	            return "-" + this.negate().toString(b);
	        }
	        var k;
	        if (b == 16) {
	            k = 4;
	        }
	        else if (b == 8) {
	            k = 3;
	        }
	        else if (b == 2) {
	            k = 1;
	        }
	        else if (b == 32) {
	            k = 5;
	        }
	        else if (b == 4) {
	            k = 2;
	        }
	        else {
	            return this.toRadix(b);
	        }
	        var km = (1 << k) - 1;
	        var d;
	        var m = false;
	        var r = "";
	        var i = this.t;
	        var p = this.DB - (i * this.DB) % k;
	        if (i-- > 0) {
	            if (p < this.DB && (d = this[i] >> p) > 0) {
	                m = true;
	                r = int2char(d);
	            }
	            while (i >= 0) {
	                if (p < k) {
	                    d = (this[i] & ((1 << p) - 1)) << (k - p);
	                    d |= this[--i] >> (p += this.DB - k);
	                }
	                else {
	                    d = (this[i] >> (p -= k)) & km;
	                    if (p <= 0) {
	                        p += this.DB;
	                        --i;
	                    }
	                }
	                if (d > 0) {
	                    m = true;
	                }
	                if (m) {
	                    r += int2char(d);
	                }
	            }
	        }
	        return m ? r : "0";
	    };
	    // BigInteger.prototype.negate = bnNegate;
	    // (public) -this
	    BigInteger.prototype.negate = function () {
	        var r = nbi();
	        BigInteger.ZERO.subTo(this, r);
	        return r;
	    };
	    // BigInteger.prototype.abs = bnAbs;
	    // (public) |this|
	    BigInteger.prototype.abs = function () {
	        return (this.s < 0) ? this.negate() : this;
	    };
	    // BigInteger.prototype.compareTo = bnCompareTo;
	    // (public) return + if this > a, - if this < a, 0 if equal
	    BigInteger.prototype.compareTo = function (a) {
	        var r = this.s - a.s;
	        if (r != 0) {
	            return r;
	        }
	        var i = this.t;
	        r = i - a.t;
	        if (r != 0) {
	            return (this.s < 0) ? -r : r;
	        }
	        while (--i >= 0) {
	            if ((r = this[i] - a[i]) != 0) {
	                return r;
	            }
	        }
	        return 0;
	    };
	    // BigInteger.prototype.bitLength = bnBitLength;
	    // (public) return the number of bits in "this"
	    BigInteger.prototype.bitLength = function () {
	        if (this.t <= 0) {
	            return 0;
	        }
	        return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ (this.s & this.DM));
	    };
	    // BigInteger.prototype.mod = bnMod;
	    // (public) this mod a
	    BigInteger.prototype.mod = function (a) {
	        var r = nbi();
	        this.abs().divRemTo(a, null, r);
	        if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) {
	            a.subTo(r, r);
	        }
	        return r;
	    };
	    // BigInteger.prototype.modPowInt = bnModPowInt;
	    // (public) this^e % m, 0 <= e < 2^32
	    BigInteger.prototype.modPowInt = function (e, m) {
	        var z;
	        if (e < 256 || m.isEven()) {
	            z = new Classic(m);
	        }
	        else {
	            z = new Montgomery(m);
	        }
	        return this.exp(e, z);
	    };
	    // BigInteger.prototype.clone = bnClone;
	    // (public)
	    BigInteger.prototype.clone = function () {
	        var r = nbi();
	        this.copyTo(r);
	        return r;
	    };
	    // BigInteger.prototype.intValue = bnIntValue;
	    // (public) return value as integer
	    BigInteger.prototype.intValue = function () {
	        if (this.s < 0) {
	            if (this.t == 1) {
	                return this[0] - this.DV;
	            }
	            else if (this.t == 0) {
	                return -1;
	            }
	        }
	        else if (this.t == 1) {
	            return this[0];
	        }
	        else if (this.t == 0) {
	            return 0;
	        }
	        // assumes 16 < DB < 32
	        return ((this[1] & ((1 << (32 - this.DB)) - 1)) << this.DB) | this[0];
	    };
	    // BigInteger.prototype.byteValue = bnByteValue;
	    // (public) return value as byte
	    BigInteger.prototype.byteValue = function () {
	        return (this.t == 0) ? this.s : (this[0] << 24) >> 24;
	    };
	    // BigInteger.prototype.shortValue = bnShortValue;
	    // (public) return value as short (assumes DB>=16)
	    BigInteger.prototype.shortValue = function () {
	        return (this.t == 0) ? this.s : (this[0] << 16) >> 16;
	    };
	    // BigInteger.prototype.signum = bnSigNum;
	    // (public) 0 if this == 0, 1 if this > 0
	    BigInteger.prototype.signum = function () {
	        if (this.s < 0) {
	            return -1;
	        }
	        else if (this.t <= 0 || (this.t == 1 && this[0] <= 0)) {
	            return 0;
	        }
	        else {
	            return 1;
	        }
	    };
	    // BigInteger.prototype.toByteArray = bnToByteArray;
	    // (public) convert to bigendian byte array
	    BigInteger.prototype.toByteArray = function () {
	        var i = this.t;
	        var r = [];
	        r[0] = this.s;
	        var p = this.DB - (i * this.DB) % 8;
	        var d;
	        var k = 0;
	        if (i-- > 0) {
	            if (p < this.DB && (d = this[i] >> p) != (this.s & this.DM) >> p) {
	                r[k++] = d | (this.s << (this.DB - p));
	            }
	            while (i >= 0) {
	                if (p < 8) {
	                    d = (this[i] & ((1 << p) - 1)) << (8 - p);
	                    d |= this[--i] >> (p += this.DB - 8);
	                }
	                else {
	                    d = (this[i] >> (p -= 8)) & 0xff;
	                    if (p <= 0) {
	                        p += this.DB;
	                        --i;
	                    }
	                }
	                if ((d & 0x80) != 0) {
	                    d |= -256;
	                }
	                if (k == 0 && (this.s & 0x80) != (d & 0x80)) {
	                    ++k;
	                }
	                if (k > 0 || d != this.s) {
	                    r[k++] = d;
	                }
	            }
	        }
	        return r;
	    };
	    // BigInteger.prototype.equals = bnEquals;
	    BigInteger.prototype.equals = function (a) {
	        return (this.compareTo(a) == 0);
	    };
	    // BigInteger.prototype.min = bnMin;
	    BigInteger.prototype.min = function (a) {
	        return (this.compareTo(a) < 0) ? this : a;
	    };
	    // BigInteger.prototype.max = bnMax;
	    BigInteger.prototype.max = function (a) {
	        return (this.compareTo(a) > 0) ? this : a;
	    };
	    // BigInteger.prototype.and = bnAnd;
	    BigInteger.prototype.and = function (a) {
	        var r = nbi();
	        this.bitwiseTo(a, op_and, r);
	        return r;
	    };
	    // BigInteger.prototype.or = bnOr;
	    BigInteger.prototype.or = function (a) {
	        var r = nbi();
	        this.bitwiseTo(a, op_or, r);
	        return r;
	    };
	    // BigInteger.prototype.xor = bnXor;
	    BigInteger.prototype.xor = function (a) {
	        var r = nbi();
	        this.bitwiseTo(a, op_xor, r);
	        return r;
	    };
	    // BigInteger.prototype.andNot = bnAndNot;
	    BigInteger.prototype.andNot = function (a) {
	        var r = nbi();
	        this.bitwiseTo(a, op_andnot, r);
	        return r;
	    };
	    // BigInteger.prototype.not = bnNot;
	    // (public) ~this
	    BigInteger.prototype.not = function () {
	        var r = nbi();
	        for (var i = 0; i < this.t; ++i) {
	            r[i] = this.DM & ~this[i];
	        }
	        r.t = this.t;
	        r.s = ~this.s;
	        return r;
	    };
	    // BigInteger.prototype.shiftLeft = bnShiftLeft;
	    // (public) this << n
	    BigInteger.prototype.shiftLeft = function (n) {
	        var r = nbi();
	        if (n < 0) {
	            this.rShiftTo(-n, r);
	        }
	        else {
	            this.lShiftTo(n, r);
	        }
	        return r;
	    };
	    // BigInteger.prototype.shiftRight = bnShiftRight;
	    // (public) this >> n
	    BigInteger.prototype.shiftRight = function (n) {
	        var r = nbi();
	        if (n < 0) {
	            this.lShiftTo(-n, r);
	        }
	        else {
	            this.rShiftTo(n, r);
	        }
	        return r;
	    };
	    // BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
	    // (public) returns index of lowest 1-bit (or -1 if none)
	    BigInteger.prototype.getLowestSetBit = function () {
	        for (var i = 0; i < this.t; ++i) {
	            if (this[i] != 0) {
	                return i * this.DB + lbit(this[i]);
	            }
	        }
	        if (this.s < 0) {
	            return this.t * this.DB;
	        }
	        return -1;
	    };
	    // BigInteger.prototype.bitCount = bnBitCount;
	    // (public) return number of set bits
	    BigInteger.prototype.bitCount = function () {
	        var r = 0;
	        var x = this.s & this.DM;
	        for (var i = 0; i < this.t; ++i) {
	            r += cbit(this[i] ^ x);
	        }
	        return r;
	    };
	    // BigInteger.prototype.testBit = bnTestBit;
	    // (public) true iff nth bit is set
	    BigInteger.prototype.testBit = function (n) {
	        var j = Math.floor(n / this.DB);
	        if (j >= this.t) {
	            return (this.s != 0);
	        }
	        return ((this[j] & (1 << (n % this.DB))) != 0);
	    };
	    // BigInteger.prototype.setBit = bnSetBit;
	    // (public) this | (1<<n)
	    BigInteger.prototype.setBit = function (n) {
	        return this.changeBit(n, op_or);
	    };
	    // BigInteger.prototype.clearBit = bnClearBit;
	    // (public) this & ~(1<<n)
	    BigInteger.prototype.clearBit = function (n) {
	        return this.changeBit(n, op_andnot);
	    };
	    // BigInteger.prototype.flipBit = bnFlipBit;
	    // (public) this ^ (1<<n)
	    BigInteger.prototype.flipBit = function (n) {
	        return this.changeBit(n, op_xor);
	    };
	    // BigInteger.prototype.add = bnAdd;
	    // (public) this + a
	    BigInteger.prototype.add = function (a) {
	        var r = nbi();
	        this.addTo(a, r);
	        return r;
	    };
	    // BigInteger.prototype.subtract = bnSubtract;
	    // (public) this - a
	    BigInteger.prototype.subtract = function (a) {
	        var r = nbi();
	        this.subTo(a, r);
	        return r;
	    };
	    // BigInteger.prototype.multiply = bnMultiply;
	    // (public) this * a
	    BigInteger.prototype.multiply = function (a) {
	        var r = nbi();
	        this.multiplyTo(a, r);
	        return r;
	    };
	    // BigInteger.prototype.divide = bnDivide;
	    // (public) this / a
	    BigInteger.prototype.divide = function (a) {
	        var r = nbi();
	        this.divRemTo(a, r, null);
	        return r;
	    };
	    // BigInteger.prototype.remainder = bnRemainder;
	    // (public) this % a
	    BigInteger.prototype.remainder = function (a) {
	        var r = nbi();
	        this.divRemTo(a, null, r);
	        return r;
	    };
	    // BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
	    // (public) [this/a,this%a]
	    BigInteger.prototype.divideAndRemainder = function (a) {
	        var q = nbi();
	        var r = nbi();
	        this.divRemTo(a, q, r);
	        return [q, r];
	    };
	    // BigInteger.prototype.modPow = bnModPow;
	    // (public) this^e % m (HAC 14.85)
	    BigInteger.prototype.modPow = function (e, m) {
	        var i = e.bitLength();
	        var k;
	        var r = nbv(1);
	        var z;
	        if (i <= 0) {
	            return r;
	        }
	        else if (i < 18) {
	            k = 1;
	        }
	        else if (i < 48) {
	            k = 3;
	        }
	        else if (i < 144) {
	            k = 4;
	        }
	        else if (i < 768) {
	            k = 5;
	        }
	        else {
	            k = 6;
	        }
	        if (i < 8) {
	            z = new Classic(m);
	        }
	        else if (m.isEven()) {
	            z = new Barrett(m);
	        }
	        else {
	            z = new Montgomery(m);
	        }
	        // precomputation
	        var g = [];
	        var n = 3;
	        var k1 = k - 1;
	        var km = (1 << k) - 1;
	        g[1] = z.convert(this);
	        if (k > 1) {
	            var g2 = nbi();
	            z.sqrTo(g[1], g2);
	            while (n <= km) {
	                g[n] = nbi();
	                z.mulTo(g2, g[n - 2], g[n]);
	                n += 2;
	            }
	        }
	        var j = e.t - 1;
	        var w;
	        var is1 = true;
	        var r2 = nbi();
	        var t;
	        i = nbits(e[j]) - 1;
	        while (j >= 0) {
	            if (i >= k1) {
	                w = (e[j] >> (i - k1)) & km;
	            }
	            else {
	                w = (e[j] & ((1 << (i + 1)) - 1)) << (k1 - i);
	                if (j > 0) {
	                    w |= e[j - 1] >> (this.DB + i - k1);
	                }
	            }
	            n = k;
	            while ((w & 1) == 0) {
	                w >>= 1;
	                --n;
	            }
	            if ((i -= n) < 0) {
	                i += this.DB;
	                --j;
	            }
	            if (is1) { // ret == 1, don't bother squaring or multiplying it
	                g[w].copyTo(r);
	                is1 = false;
	            }
	            else {
	                while (n > 1) {
	                    z.sqrTo(r, r2);
	                    z.sqrTo(r2, r);
	                    n -= 2;
	                }
	                if (n > 0) {
	                    z.sqrTo(r, r2);
	                }
	                else {
	                    t = r;
	                    r = r2;
	                    r2 = t;
	                }
	                z.mulTo(r2, g[w], r);
	            }
	            while (j >= 0 && (e[j] & (1 << i)) == 0) {
	                z.sqrTo(r, r2);
	                t = r;
	                r = r2;
	                r2 = t;
	                if (--i < 0) {
	                    i = this.DB - 1;
	                    --j;
	                }
	            }
	        }
	        return z.revert(r);
	    };
	    // BigInteger.prototype.modInverse = bnModInverse;
	    // (public) 1/this % m (HAC 14.61)
	    BigInteger.prototype.modInverse = function (m) {
	        var ac = m.isEven();
	        if ((this.isEven() && ac) || m.signum() == 0) {
	            return BigInteger.ZERO;
	        }
	        var u = m.clone();
	        var v = this.clone();
	        var a = nbv(1);
	        var b = nbv(0);
	        var c = nbv(0);
	        var d = nbv(1);
	        while (u.signum() != 0) {
	            while (u.isEven()) {
	                u.rShiftTo(1, u);
	                if (ac) {
	                    if (!a.isEven() || !b.isEven()) {
	                        a.addTo(this, a);
	                        b.subTo(m, b);
	                    }
	                    a.rShiftTo(1, a);
	                }
	                else if (!b.isEven()) {
	                    b.subTo(m, b);
	                }
	                b.rShiftTo(1, b);
	            }
	            while (v.isEven()) {
	                v.rShiftTo(1, v);
	                if (ac) {
	                    if (!c.isEven() || !d.isEven()) {
	                        c.addTo(this, c);
	                        d.subTo(m, d);
	                    }
	                    c.rShiftTo(1, c);
	                }
	                else if (!d.isEven()) {
	                    d.subTo(m, d);
	                }
	                d.rShiftTo(1, d);
	            }
	            if (u.compareTo(v) >= 0) {
	                u.subTo(v, u);
	                if (ac) {
	                    a.subTo(c, a);
	                }
	                b.subTo(d, b);
	            }
	            else {
	                v.subTo(u, v);
	                if (ac) {
	                    c.subTo(a, c);
	                }
	                d.subTo(b, d);
	            }
	        }
	        if (v.compareTo(BigInteger.ONE) != 0) {
	            return BigInteger.ZERO;
	        }
	        if (d.compareTo(m) >= 0) {
	            return d.subtract(m);
	        }
	        if (d.signum() < 0) {
	            d.addTo(m, d);
	        }
	        else {
	            return d;
	        }
	        if (d.signum() < 0) {
	            return d.add(m);
	        }
	        else {
	            return d;
	        }
	    };
	    // BigInteger.prototype.pow = bnPow;
	    // (public) this^e
	    BigInteger.prototype.pow = function (e) {
	        return this.exp(e, new NullExp());
	    };
	    // BigInteger.prototype.gcd = bnGCD;
	    // (public) gcd(this,a) (HAC 14.54)
	    BigInteger.prototype.gcd = function (a) {
	        var x = (this.s < 0) ? this.negate() : this.clone();
	        var y = (a.s < 0) ? a.negate() : a.clone();
	        if (x.compareTo(y) < 0) {
	            var t = x;
	            x = y;
	            y = t;
	        }
	        var i = x.getLowestSetBit();
	        var g = y.getLowestSetBit();
	        if (g < 0) {
	            return x;
	        }
	        if (i < g) {
	            g = i;
	        }
	        if (g > 0) {
	            x.rShiftTo(g, x);
	            y.rShiftTo(g, y);
	        }
	        while (x.signum() > 0) {
	            if ((i = x.getLowestSetBit()) > 0) {
	                x.rShiftTo(i, x);
	            }
	            if ((i = y.getLowestSetBit()) > 0) {
	                y.rShiftTo(i, y);
	            }
	            if (x.compareTo(y) >= 0) {
	                x.subTo(y, x);
	                x.rShiftTo(1, x);
	            }
	            else {
	                y.subTo(x, y);
	                y.rShiftTo(1, y);
	            }
	        }
	        if (g > 0) {
	            y.lShiftTo(g, y);
	        }
	        return y;
	    };
	    // BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
	    // (public) test primality with certainty >= 1-.5^t
	    BigInteger.prototype.isProbablePrime = function (t) {
	        var i;
	        var x = this.abs();
	        if (x.t == 1 && x[0] <= lowprimes[lowprimes.length - 1]) {
	            for (i = 0; i < lowprimes.length; ++i) {
	                if (x[0] == lowprimes[i]) {
	                    return true;
	                }
	            }
	            return false;
	        }
	        if (x.isEven()) {
	            return false;
	        }
	        i = 1;
	        while (i < lowprimes.length) {
	            var m = lowprimes[i];
	            var j = i + 1;
	            while (j < lowprimes.length && m < lplim) {
	                m *= lowprimes[j++];
	            }
	            m = x.modInt(m);
	            while (i < j) {
	                if (m % lowprimes[i++] == 0) {
	                    return false;
	                }
	            }
	        }
	        return x.millerRabin(t);
	    };
	    //#endregion PUBLIC
	    //#region PROTECTED
	    // BigInteger.prototype.copyTo = bnpCopyTo;
	    // (protected) copy this to r
	    BigInteger.prototype.copyTo = function (r) {
	        for (var i = this.t - 1; i >= 0; --i) {
	            r[i] = this[i];
	        }
	        r.t = this.t;
	        r.s = this.s;
	    };
	    // BigInteger.prototype.fromInt = bnpFromInt;
	    // (protected) set from integer value x, -DV <= x < DV
	    BigInteger.prototype.fromInt = function (x) {
	        this.t = 1;
	        this.s = (x < 0) ? -1 : 0;
	        if (x > 0) {
	            this[0] = x;
	        }
	        else if (x < -1) {
	            this[0] = x + this.DV;
	        }
	        else {
	            this.t = 0;
	        }
	    };
	    // BigInteger.prototype.fromString = bnpFromString;
	    // (protected) set from string and radix
	    BigInteger.prototype.fromString = function (s, b) {
	        var k;
	        if (b == 16) {
	            k = 4;
	        }
	        else if (b == 8) {
	            k = 3;
	        }
	        else if (b == 256) {
	            k = 8;
	            /* byte array */
	        }
	        else if (b == 2) {
	            k = 1;
	        }
	        else if (b == 32) {
	            k = 5;
	        }
	        else if (b == 4) {
	            k = 2;
	        }
	        else {
	            this.fromRadix(s, b);
	            return;
	        }
	        this.t = 0;
	        this.s = 0;
	        var i = s.length;
	        var mi = false;
	        var sh = 0;
	        while (--i >= 0) {
	            var x = (k == 8) ? (+s[i]) & 0xff : intAt(s, i);
	            if (x < 0) {
	                if (s.charAt(i) == "-") {
	                    mi = true;
	                }
	                continue;
	            }
	            mi = false;
	            if (sh == 0) {
	                this[this.t++] = x;
	            }
	            else if (sh + k > this.DB) {
	                this[this.t - 1] |= (x & ((1 << (this.DB - sh)) - 1)) << sh;
	                this[this.t++] = (x >> (this.DB - sh));
	            }
	            else {
	                this[this.t - 1] |= x << sh;
	            }
	            sh += k;
	            if (sh >= this.DB) {
	                sh -= this.DB;
	            }
	        }
	        if (k == 8 && ((+s[0]) & 0x80) != 0) {
	            this.s = -1;
	            if (sh > 0) {
	                this[this.t - 1] |= ((1 << (this.DB - sh)) - 1) << sh;
	            }
	        }
	        this.clamp();
	        if (mi) {
	            BigInteger.ZERO.subTo(this, this);
	        }
	    };
	    // BigInteger.prototype.clamp = bnpClamp;
	    // (protected) clamp off excess high words
	    BigInteger.prototype.clamp = function () {
	        var c = this.s & this.DM;
	        while (this.t > 0 && this[this.t - 1] == c) {
	            --this.t;
	        }
	    };
	    // BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
	    // (protected) r = this << n*DB
	    BigInteger.prototype.dlShiftTo = function (n, r) {
	        var i;
	        for (i = this.t - 1; i >= 0; --i) {
	            r[i + n] = this[i];
	        }
	        for (i = n - 1; i >= 0; --i) {
	            r[i] = 0;
	        }
	        r.t = this.t + n;
	        r.s = this.s;
	    };
	    // BigInteger.prototype.drShiftTo = bnpDRShiftTo;
	    // (protected) r = this >> n*DB
	    BigInteger.prototype.drShiftTo = function (n, r) {
	        for (var i = n; i < this.t; ++i) {
	            r[i - n] = this[i];
	        }
	        r.t = Math.max(this.t - n, 0);
	        r.s = this.s;
	    };
	    // BigInteger.prototype.lShiftTo = bnpLShiftTo;
	    // (protected) r = this << n
	    BigInteger.prototype.lShiftTo = function (n, r) {
	        var bs = n % this.DB;
	        var cbs = this.DB - bs;
	        var bm = (1 << cbs) - 1;
	        var ds = Math.floor(n / this.DB);
	        var c = (this.s << bs) & this.DM;
	        for (var i = this.t - 1; i >= 0; --i) {
	            r[i + ds + 1] = (this[i] >> cbs) | c;
	            c = (this[i] & bm) << bs;
	        }
	        for (var i = ds - 1; i >= 0; --i) {
	            r[i] = 0;
	        }
	        r[ds] = c;
	        r.t = this.t + ds + 1;
	        r.s = this.s;
	        r.clamp();
	    };
	    // BigInteger.prototype.rShiftTo = bnpRShiftTo;
	    // (protected) r = this >> n
	    BigInteger.prototype.rShiftTo = function (n, r) {
	        r.s = this.s;
	        var ds = Math.floor(n / this.DB);
	        if (ds >= this.t) {
	            r.t = 0;
	            return;
	        }
	        var bs = n % this.DB;
	        var cbs = this.DB - bs;
	        var bm = (1 << bs) - 1;
	        r[0] = this[ds] >> bs;
	        for (var i = ds + 1; i < this.t; ++i) {
	            r[i - ds - 1] |= (this[i] & bm) << cbs;
	            r[i - ds] = this[i] >> bs;
	        }
	        if (bs > 0) {
	            r[this.t - ds - 1] |= (this.s & bm) << cbs;
	        }
	        r.t = this.t - ds;
	        r.clamp();
	    };
	    // BigInteger.prototype.subTo = bnpSubTo;
	    // (protected) r = this - a
	    BigInteger.prototype.subTo = function (a, r) {
	        var i = 0;
	        var c = 0;
	        var m = Math.min(a.t, this.t);
	        while (i < m) {
	            c += this[i] - a[i];
	            r[i++] = c & this.DM;
	            c >>= this.DB;
	        }
	        if (a.t < this.t) {
	            c -= a.s;
	            while (i < this.t) {
	                c += this[i];
	                r[i++] = c & this.DM;
	                c >>= this.DB;
	            }
	            c += this.s;
	        }
	        else {
	            c += this.s;
	            while (i < a.t) {
	                c -= a[i];
	                r[i++] = c & this.DM;
	                c >>= this.DB;
	            }
	            c -= a.s;
	        }
	        r.s = (c < 0) ? -1 : 0;
	        if (c < -1) {
	            r[i++] = this.DV + c;
	        }
	        else if (c > 0) {
	            r[i++] = c;
	        }
	        r.t = i;
	        r.clamp();
	    };
	    // BigInteger.prototype.multiplyTo = bnpMultiplyTo;
	    // (protected) r = this * a, r != this,a (HAC 14.12)
	    // "this" should be the larger one if appropriate.
	    BigInteger.prototype.multiplyTo = function (a, r) {
	        var x = this.abs();
	        var y = a.abs();
	        var i = x.t;
	        r.t = i + y.t;
	        while (--i >= 0) {
	            r[i] = 0;
	        }
	        for (i = 0; i < y.t; ++i) {
	            r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
	        }
	        r.s = 0;
	        r.clamp();
	        if (this.s != a.s) {
	            BigInteger.ZERO.subTo(r, r);
	        }
	    };
	    // BigInteger.prototype.squareTo = bnpSquareTo;
	    // (protected) r = this^2, r != this (HAC 14.16)
	    BigInteger.prototype.squareTo = function (r) {
	        var x = this.abs();
	        var i = r.t = 2 * x.t;
	        while (--i >= 0) {
	            r[i] = 0;
	        }
	        for (i = 0; i < x.t - 1; ++i) {
	            var c = x.am(i, x[i], r, 2 * i, 0, 1);
	            if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
	                r[i + x.t] -= x.DV;
	                r[i + x.t + 1] = 1;
	            }
	        }
	        if (r.t > 0) {
	            r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
	        }
	        r.s = 0;
	        r.clamp();
	    };
	    // BigInteger.prototype.divRemTo = bnpDivRemTo;
	    // (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
	    // r != q, this != m.  q or r may be null.
	    BigInteger.prototype.divRemTo = function (m, q, r) {
	        var pm = m.abs();
	        if (pm.t <= 0) {
	            return;
	        }
	        var pt = this.abs();
	        if (pt.t < pm.t) {
	            if (q != null) {
	                q.fromInt(0);
	            }
	            if (r != null) {
	                this.copyTo(r);
	            }
	            return;
	        }
	        if (r == null) {
	            r = nbi();
	        }
	        var y = nbi();
	        var ts = this.s;
	        var ms = m.s;
	        var nsh = this.DB - nbits(pm[pm.t - 1]); // normalize modulus
	        if (nsh > 0) {
	            pm.lShiftTo(nsh, y);
	            pt.lShiftTo(nsh, r);
	        }
	        else {
	            pm.copyTo(y);
	            pt.copyTo(r);
	        }
	        var ys = y.t;
	        var y0 = y[ys - 1];
	        if (y0 == 0) {
	            return;
	        }
	        var yt = y0 * (1 << this.F1) + ((ys > 1) ? y[ys - 2] >> this.F2 : 0);
	        var d1 = this.FV / yt;
	        var d2 = (1 << this.F1) / yt;
	        var e = 1 << this.F2;
	        var i = r.t;
	        var j = i - ys;
	        var t = (q == null) ? nbi() : q;
	        y.dlShiftTo(j, t);
	        if (r.compareTo(t) >= 0) {
	            r[r.t++] = 1;
	            r.subTo(t, r);
	        }
	        BigInteger.ONE.dlShiftTo(ys, t);
	        t.subTo(y, y); // "negative" y so we can replace sub with am later
	        while (y.t < ys) {
	            y[y.t++] = 0;
	        }
	        while (--j >= 0) {
	            // Estimate quotient digit
	            var qd = (r[--i] == y0) ? this.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
	            if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) { // Try it out
	                y.dlShiftTo(j, t);
	                r.subTo(t, r);
	                while (r[i] < --qd) {
	                    r.subTo(t, r);
	                }
	            }
	        }
	        if (q != null) {
	            r.drShiftTo(ys, q);
	            if (ts != ms) {
	                BigInteger.ZERO.subTo(q, q);
	            }
	        }
	        r.t = ys;
	        r.clamp();
	        if (nsh > 0) {
	            r.rShiftTo(nsh, r);
	        } // Denormalize remainder
	        if (ts < 0) {
	            BigInteger.ZERO.subTo(r, r);
	        }
	    };
	    // BigInteger.prototype.invDigit = bnpInvDigit;
	    // (protected) return "-1/this % 2^DB"; useful for Mont. reduction
	    // justification:
	    //         xy == 1 (mod m)
	    //         xy =  1+km
	    //   xy(2-xy) = (1+km)(1-km)
	    // x[y(2-xy)] = 1-k^2m^2
	    // x[y(2-xy)] == 1 (mod m^2)
	    // if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
	    // should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
	    // JS multiply "overflows" differently from C/C++, so care is needed here.
	    BigInteger.prototype.invDigit = function () {
	        if (this.t < 1) {
	            return 0;
	        }
	        var x = this[0];
	        if ((x & 1) == 0) {
	            return 0;
	        }
	        var y = x & 3; // y == 1/x mod 2^2
	        y = (y * (2 - (x & 0xf) * y)) & 0xf; // y == 1/x mod 2^4
	        y = (y * (2 - (x & 0xff) * y)) & 0xff; // y == 1/x mod 2^8
	        y = (y * (2 - (((x & 0xffff) * y) & 0xffff))) & 0xffff; // y == 1/x mod 2^16
	        // last step - calculate inverse mod DV directly;
	        // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
	        y = (y * (2 - x * y % this.DV)) % this.DV; // y == 1/x mod 2^dbits
	        // we really want the negative inverse, and -DV < y < DV
	        return (y > 0) ? this.DV - y : -y;
	    };
	    // BigInteger.prototype.isEven = bnpIsEven;
	    // (protected) true iff this is even
	    BigInteger.prototype.isEven = function () {
	        return ((this.t > 0) ? (this[0] & 1) : this.s) == 0;
	    };
	    // BigInteger.prototype.exp = bnpExp;
	    // (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
	    BigInteger.prototype.exp = function (e, z) {
	        if (e > 0xffffffff || e < 1) {
	            return BigInteger.ONE;
	        }
	        var r = nbi();
	        var r2 = nbi();
	        var g = z.convert(this);
	        var i = nbits(e) - 1;
	        g.copyTo(r);
	        while (--i >= 0) {
	            z.sqrTo(r, r2);
	            if ((e & (1 << i)) > 0) {
	                z.mulTo(r2, g, r);
	            }
	            else {
	                var t = r;
	                r = r2;
	                r2 = t;
	            }
	        }
	        return z.revert(r);
	    };
	    // BigInteger.prototype.chunkSize = bnpChunkSize;
	    // (protected) return x s.t. r^x < DV
	    BigInteger.prototype.chunkSize = function (r) {
	        return Math.floor(Math.LN2 * this.DB / Math.log(r));
	    };
	    // BigInteger.prototype.toRadix = bnpToRadix;
	    // (protected) convert to radix string
	    BigInteger.prototype.toRadix = function (b) {
	        if (b == null) {
	            b = 10;
	        }
	        if (this.signum() == 0 || b < 2 || b > 36) {
	            return "0";
	        }
	        var cs = this.chunkSize(b);
	        var a = Math.pow(b, cs);
	        var d = nbv(a);
	        var y = nbi();
	        var z = nbi();
	        var r = "";
	        this.divRemTo(d, y, z);
	        while (y.signum() > 0) {
	            r = (a + z.intValue()).toString(b).substr(1) + r;
	            y.divRemTo(d, y, z);
	        }
	        return z.intValue().toString(b) + r;
	    };
	    // BigInteger.prototype.fromRadix = bnpFromRadix;
	    // (protected) convert from radix string
	    BigInteger.prototype.fromRadix = function (s, b) {
	        this.fromInt(0);
	        if (b == null) {
	            b = 10;
	        }
	        var cs = this.chunkSize(b);
	        var d = Math.pow(b, cs);
	        var mi = false;
	        var j = 0;
	        var w = 0;
	        for (var i = 0; i < s.length; ++i) {
	            var x = intAt(s, i);
	            if (x < 0) {
	                if (s.charAt(i) == "-" && this.signum() == 0) {
	                    mi = true;
	                }
	                continue;
	            }
	            w = b * w + x;
	            if (++j >= cs) {
	                this.dMultiply(d);
	                this.dAddOffset(w, 0);
	                j = 0;
	                w = 0;
	            }
	        }
	        if (j > 0) {
	            this.dMultiply(Math.pow(b, j));
	            this.dAddOffset(w, 0);
	        }
	        if (mi) {
	            BigInteger.ZERO.subTo(this, this);
	        }
	    };
	    // BigInteger.prototype.fromNumber = bnpFromNumber;
	    // (protected) alternate constructor
	    BigInteger.prototype.fromNumber = function (a, b, c) {
	        if ("number" == typeof b) {
	            // new BigInteger(int,int,RNG)
	            if (a < 2) {
	                this.fromInt(1);
	            }
	            else {
	                this.fromNumber(a, c);
	                if (!this.testBit(a - 1)) {
	                    // force MSB set
	                    this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
	                }
	                if (this.isEven()) {
	                    this.dAddOffset(1, 0);
	                } // force odd
	                while (!this.isProbablePrime(b)) {
	                    this.dAddOffset(2, 0);
	                    if (this.bitLength() > a) {
	                        this.subTo(BigInteger.ONE.shiftLeft(a - 1), this);
	                    }
	                }
	            }
	        }
	        else {
	            // new BigInteger(int,RNG)
	            var x = [];
	            var t = a & 7;
	            x.length = (a >> 3) + 1;
	            b.nextBytes(x);
	            if (t > 0) {
	                x[0] &= ((1 << t) - 1);
	            }
	            else {
	                x[0] = 0;
	            }
	            this.fromString(x, 256);
	        }
	    };
	    // BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
	    // (protected) r = this op a (bitwise)
	    BigInteger.prototype.bitwiseTo = function (a, op, r) {
	        var i;
	        var f;
	        var m = Math.min(a.t, this.t);
	        for (i = 0; i < m; ++i) {
	            r[i] = op(this[i], a[i]);
	        }
	        if (a.t < this.t) {
	            f = a.s & this.DM;
	            for (i = m; i < this.t; ++i) {
	                r[i] = op(this[i], f);
	            }
	            r.t = this.t;
	        }
	        else {
	            f = this.s & this.DM;
	            for (i = m; i < a.t; ++i) {
	                r[i] = op(f, a[i]);
	            }
	            r.t = a.t;
	        }
	        r.s = op(this.s, a.s);
	        r.clamp();
	    };
	    // BigInteger.prototype.changeBit = bnpChangeBit;
	    // (protected) this op (1<<n)
	    BigInteger.prototype.changeBit = function (n, op) {
	        var r = BigInteger.ONE.shiftLeft(n);
	        this.bitwiseTo(r, op, r);
	        return r;
	    };
	    // BigInteger.prototype.addTo = bnpAddTo;
	    // (protected) r = this + a
	    BigInteger.prototype.addTo = function (a, r) {
	        var i = 0;
	        var c = 0;
	        var m = Math.min(a.t, this.t);
	        while (i < m) {
	            c += this[i] + a[i];
	            r[i++] = c & this.DM;
	            c >>= this.DB;
	        }
	        if (a.t < this.t) {
	            c += a.s;
	            while (i < this.t) {
	                c += this[i];
	                r[i++] = c & this.DM;
	                c >>= this.DB;
	            }
	            c += this.s;
	        }
	        else {
	            c += this.s;
	            while (i < a.t) {
	                c += a[i];
	                r[i++] = c & this.DM;
	                c >>= this.DB;
	            }
	            c += a.s;
	        }
	        r.s = (c < 0) ? -1 : 0;
	        if (c > 0) {
	            r[i++] = c;
	        }
	        else if (c < -1) {
	            r[i++] = this.DV + c;
	        }
	        r.t = i;
	        r.clamp();
	    };
	    // BigInteger.prototype.dMultiply = bnpDMultiply;
	    // (protected) this *= n, this >= 0, 1 < n < DV
	    BigInteger.prototype.dMultiply = function (n) {
	        this[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
	        ++this.t;
	        this.clamp();
	    };
	    // BigInteger.prototype.dAddOffset = bnpDAddOffset;
	    // (protected) this += n << w words, this >= 0
	    BigInteger.prototype.dAddOffset = function (n, w) {
	        if (n == 0) {
	            return;
	        }
	        while (this.t <= w) {
	            this[this.t++] = 0;
	        }
	        this[w] += n;
	        while (this[w] >= this.DV) {
	            this[w] -= this.DV;
	            if (++w >= this.t) {
	                this[this.t++] = 0;
	            }
	            ++this[w];
	        }
	    };
	    // BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
	    // (protected) r = lower n words of "this * a", a.t <= n
	    // "this" should be the larger one if appropriate.
	    BigInteger.prototype.multiplyLowerTo = function (a, n, r) {
	        var i = Math.min(this.t + a.t, n);
	        r.s = 0; // assumes a,this >= 0
	        r.t = i;
	        while (i > 0) {
	            r[--i] = 0;
	        }
	        for (var j = r.t - this.t; i < j; ++i) {
	            r[i + this.t] = this.am(0, a[i], r, i, 0, this.t);
	        }
	        for (var j = Math.min(a.t, n); i < j; ++i) {
	            this.am(0, a[i], r, i, 0, n - i);
	        }
	        r.clamp();
	    };
	    // BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
	    // (protected) r = "this * a" without lower n words, n > 0
	    // "this" should be the larger one if appropriate.
	    BigInteger.prototype.multiplyUpperTo = function (a, n, r) {
	        --n;
	        var i = r.t = this.t + a.t - n;
	        r.s = 0; // assumes a,this >= 0
	        while (--i >= 0) {
	            r[i] = 0;
	        }
	        for (i = Math.max(n - this.t, 0); i < a.t; ++i) {
	            r[this.t + i - n] = this.am(n - i, a[i], r, 0, 0, this.t + i - n);
	        }
	        r.clamp();
	        r.drShiftTo(1, r);
	    };
	    // BigInteger.prototype.modInt = bnpModInt;
	    // (protected) this % n, n < 2^26
	    BigInteger.prototype.modInt = function (n) {
	        if (n <= 0) {
	            return 0;
	        }
	        var d = this.DV % n;
	        var r = (this.s < 0) ? n - 1 : 0;
	        if (this.t > 0) {
	            if (d == 0) {
	                r = this[0] % n;
	            }
	            else {
	                for (var i = this.t - 1; i >= 0; --i) {
	                    r = (d * r + this[i]) % n;
	                }
	            }
	        }
	        return r;
	    };
	    // BigInteger.prototype.millerRabin = bnpMillerRabin;
	    // (protected) true if probably prime (HAC 4.24, Miller-Rabin)
	    BigInteger.prototype.millerRabin = function (t) {
	        var n1 = this.subtract(BigInteger.ONE);
	        var k = n1.getLowestSetBit();
	        if (k <= 0) {
	            return false;
	        }
	        var r = n1.shiftRight(k);
	        t = (t + 1) >> 1;
	        if (t > lowprimes.length) {
	            t = lowprimes.length;
	        }
	        var a = nbi();
	        for (var i = 0; i < t; ++i) {
	            // Pick bases at random, instead of starting at 2
	            a.fromInt(lowprimes[Math.floor(Math.random() * lowprimes.length)]);
	            var y = a.modPow(r, this);
	            if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
	                var j = 1;
	                while (j++ < k && y.compareTo(n1) != 0) {
	                    y = y.modPowInt(2, this);
	                    if (y.compareTo(BigInteger.ONE) == 0) {
	                        return false;
	                    }
	                }
	                if (y.compareTo(n1) != 0) {
	                    return false;
	                }
	            }
	        }
	        return true;
	    };
	    // BigInteger.prototype.square = bnSquare;
	    // (public) this^2
	    BigInteger.prototype.square = function () {
	        var r = nbi();
	        this.squareTo(r);
	        return r;
	    };
	    //#region ASYNC
	    // Public API method
	    BigInteger.prototype.gcda = function (a, callback) {
	        var x = (this.s < 0) ? this.negate() : this.clone();
	        var y = (a.s < 0) ? a.negate() : a.clone();
	        if (x.compareTo(y) < 0) {
	            var t = x;
	            x = y;
	            y = t;
	        }
	        var i = x.getLowestSetBit();
	        var g = y.getLowestSetBit();
	        if (g < 0) {
	            callback(x);
	            return;
	        }
	        if (i < g) {
	            g = i;
	        }
	        if (g > 0) {
	            x.rShiftTo(g, x);
	            y.rShiftTo(g, y);
	        }
	        // Workhorse of the algorithm, gets called 200 - 800 times per 512 bit keygen.
	        var gcda1 = function () {
	            if ((i = x.getLowestSetBit()) > 0) {
	                x.rShiftTo(i, x);
	            }
	            if ((i = y.getLowestSetBit()) > 0) {
	                y.rShiftTo(i, y);
	            }
	            if (x.compareTo(y) >= 0) {
	                x.subTo(y, x);
	                x.rShiftTo(1, x);
	            }
	            else {
	                y.subTo(x, y);
	                y.rShiftTo(1, y);
	            }
	            if (!(x.signum() > 0)) {
	                if (g > 0) {
	                    y.lShiftTo(g, y);
	                }
	                setTimeout(function () { callback(y); }, 0); // escape
	            }
	            else {
	                setTimeout(gcda1, 0);
	            }
	        };
	        setTimeout(gcda1, 10);
	    };
	    // (protected) alternate constructor
	    BigInteger.prototype.fromNumberAsync = function (a, b, c, callback) {
	        if ("number" == typeof b) {
	            if (a < 2) {
	                this.fromInt(1);
	            }
	            else {
	                this.fromNumber(a, c);
	                if (!this.testBit(a - 1)) {
	                    this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
	                }
	                if (this.isEven()) {
	                    this.dAddOffset(1, 0);
	                }
	                var bnp_1 = this;
	                var bnpfn1_1 = function () {
	                    bnp_1.dAddOffset(2, 0);
	                    if (bnp_1.bitLength() > a) {
	                        bnp_1.subTo(BigInteger.ONE.shiftLeft(a - 1), bnp_1);
	                    }
	                    if (bnp_1.isProbablePrime(b)) {
	                        setTimeout(function () { callback(); }, 0); // escape
	                    }
	                    else {
	                        setTimeout(bnpfn1_1, 0);
	                    }
	                };
	                setTimeout(bnpfn1_1, 0);
	            }
	        }
	        else {
	            var x = [];
	            var t = a & 7;
	            x.length = (a >> 3) + 1;
	            b.nextBytes(x);
	            if (t > 0) {
	                x[0] &= ((1 << t) - 1);
	            }
	            else {
	                x[0] = 0;
	            }
	            this.fromString(x, 256);
	        }
	    };
	    return BigInteger;
	}());
	//#region REDUCERS
	//#region NullExp
	var NullExp = /** @class */ (function () {
	    function NullExp() {
	    }
	    // NullExp.prototype.convert = nNop;
	    NullExp.prototype.convert = function (x) {
	        return x;
	    };
	    // NullExp.prototype.revert = nNop;
	    NullExp.prototype.revert = function (x) {
	        return x;
	    };
	    // NullExp.prototype.mulTo = nMulTo;
	    NullExp.prototype.mulTo = function (x, y, r) {
	        x.multiplyTo(y, r);
	    };
	    // NullExp.prototype.sqrTo = nSqrTo;
	    NullExp.prototype.sqrTo = function (x, r) {
	        x.squareTo(r);
	    };
	    return NullExp;
	}());
	// Modular reduction using "classic" algorithm
	var Classic = /** @class */ (function () {
	    function Classic(m) {
	        this.m = m;
	    }
	    // Classic.prototype.convert = cConvert;
	    Classic.prototype.convert = function (x) {
	        if (x.s < 0 || x.compareTo(this.m) >= 0) {
	            return x.mod(this.m);
	        }
	        else {
	            return x;
	        }
	    };
	    // Classic.prototype.revert = cRevert;
	    Classic.prototype.revert = function (x) {
	        return x;
	    };
	    // Classic.prototype.reduce = cReduce;
	    Classic.prototype.reduce = function (x) {
	        x.divRemTo(this.m, null, x);
	    };
	    // Classic.prototype.mulTo = cMulTo;
	    Classic.prototype.mulTo = function (x, y, r) {
	        x.multiplyTo(y, r);
	        this.reduce(r);
	    };
	    // Classic.prototype.sqrTo = cSqrTo;
	    Classic.prototype.sqrTo = function (x, r) {
	        x.squareTo(r);
	        this.reduce(r);
	    };
	    return Classic;
	}());
	//#endregion
	//#region Montgomery
	// Montgomery reduction
	var Montgomery = /** @class */ (function () {
	    function Montgomery(m) {
	        this.m = m;
	        this.mp = m.invDigit();
	        this.mpl = this.mp & 0x7fff;
	        this.mph = this.mp >> 15;
	        this.um = (1 << (m.DB - 15)) - 1;
	        this.mt2 = 2 * m.t;
	    }
	    // Montgomery.prototype.convert = montConvert;
	    // xR mod m
	    Montgomery.prototype.convert = function (x) {
	        var r = nbi();
	        x.abs().dlShiftTo(this.m.t, r);
	        r.divRemTo(this.m, null, r);
	        if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) {
	            this.m.subTo(r, r);
	        }
	        return r;
	    };
	    // Montgomery.prototype.revert = montRevert;
	    // x/R mod m
	    Montgomery.prototype.revert = function (x) {
	        var r = nbi();
	        x.copyTo(r);
	        this.reduce(r);
	        return r;
	    };
	    // Montgomery.prototype.reduce = montReduce;
	    // x = x/R mod m (HAC 14.32)
	    Montgomery.prototype.reduce = function (x) {
	        while (x.t <= this.mt2) {
	            // pad x so am has enough room later
	            x[x.t++] = 0;
	        }
	        for (var i = 0; i < this.m.t; ++i) {
	            // faster way of calculating u0 = x[i]*mp mod DV
	            var j = x[i] & 0x7fff;
	            var u0 = (j * this.mpl + (((j * this.mph + (x[i] >> 15) * this.mpl) & this.um) << 15)) & x.DM;
	            // use am to combine the multiply-shift-add into one call
	            j = i + this.m.t;
	            x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
	            // propagate carry
	            while (x[j] >= x.DV) {
	                x[j] -= x.DV;
	                x[++j]++;
	            }
	        }
	        x.clamp();
	        x.drShiftTo(this.m.t, x);
	        if (x.compareTo(this.m) >= 0) {
	            x.subTo(this.m, x);
	        }
	    };
	    // Montgomery.prototype.mulTo = montMulTo;
	    // r = "xy/R mod m"; x,y != r
	    Montgomery.prototype.mulTo = function (x, y, r) {
	        x.multiplyTo(y, r);
	        this.reduce(r);
	    };
	    // Montgomery.prototype.sqrTo = montSqrTo;
	    // r = "x^2/R mod m"; x != r
	    Montgomery.prototype.sqrTo = function (x, r) {
	        x.squareTo(r);
	        this.reduce(r);
	    };
	    return Montgomery;
	}());
	//#endregion Montgomery
	//#region Barrett
	// Barrett modular reduction
	var Barrett = /** @class */ (function () {
	    function Barrett(m) {
	        this.m = m;
	        // setup Barrett
	        this.r2 = nbi();
	        this.q3 = nbi();
	        BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
	        this.mu = this.r2.divide(m);
	    }
	    // Barrett.prototype.convert = barrettConvert;
	    Barrett.prototype.convert = function (x) {
	        if (x.s < 0 || x.t > 2 * this.m.t) {
	            return x.mod(this.m);
	        }
	        else if (x.compareTo(this.m) < 0) {
	            return x;
	        }
	        else {
	            var r = nbi();
	            x.copyTo(r);
	            this.reduce(r);
	            return r;
	        }
	    };
	    // Barrett.prototype.revert = barrettRevert;
	    Barrett.prototype.revert = function (x) {
	        return x;
	    };
	    // Barrett.prototype.reduce = barrettReduce;
	    // x = x mod m (HAC 14.42)
	    Barrett.prototype.reduce = function (x) {
	        x.drShiftTo(this.m.t - 1, this.r2);
	        if (x.t > this.m.t + 1) {
	            x.t = this.m.t + 1;
	            x.clamp();
	        }
	        this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
	        this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
	        while (x.compareTo(this.r2) < 0) {
	            x.dAddOffset(1, this.m.t + 1);
	        }
	        x.subTo(this.r2, x);
	        while (x.compareTo(this.m) >= 0) {
	            x.subTo(this.m, x);
	        }
	    };
	    // Barrett.prototype.mulTo = barrettMulTo;
	    // r = x*y mod m; x,y != r
	    Barrett.prototype.mulTo = function (x, y, r) {
	        x.multiplyTo(y, r);
	        this.reduce(r);
	    };
	    // Barrett.prototype.sqrTo = barrettSqrTo;
	    // r = x^2 mod m; x != r
	    Barrett.prototype.sqrTo = function (x, r) {
	        x.squareTo(r);
	        this.reduce(r);
	    };
	    return Barrett;
	}());
	//#endregion
	//#endregion REDUCERS
	// return new, unset BigInteger
	function nbi() { return new BigInteger(null); }
	function parseBigInt(str, r) {
	    return new BigInteger(str, r);
	}
	// am: Compute w_j += (x*this_i), propagate carries,
	// c is initial carry, returns final carry.
	// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
	// We need to select the fastest one that works in this environment.
	// am1: use a single mult and divide to get the high bits,
	// max digit bits should be 26 because
	// max internal value = 2*dvalue^2-2*dvalue (< 2^53)
	function am1(i, x, w, j, c, n) {
	    while (--n >= 0) {
	        var v = x * this[i++] + w[j] + c;
	        c = Math.floor(v / 0x4000000);
	        w[j++] = v & 0x3ffffff;
	    }
	    return c;
	}
	// am2 avoids a big mult-and-extract completely.
	// Max digit bits should be <= 30 because we do bitwise ops
	// on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
	function am2(i, x, w, j, c, n) {
	    var xl = x & 0x7fff;
	    var xh = x >> 15;
	    while (--n >= 0) {
	        var l = this[i] & 0x7fff;
	        var h = this[i++] >> 15;
	        var m = xh * l + h * xl;
	        l = xl * l + ((m & 0x7fff) << 15) + w[j] + (c & 0x3fffffff);
	        c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
	        w[j++] = l & 0x3fffffff;
	    }
	    return c;
	}
	// Alternately, set max digit bits to 28 since some
	// browsers slow down when dealing with 32-bit numbers.
	function am3(i, x, w, j, c, n) {
	    var xl = x & 0x3fff;
	    var xh = x >> 14;
	    while (--n >= 0) {
	        var l = this[i] & 0x3fff;
	        var h = this[i++] >> 14;
	        var m = xh * l + h * xl;
	        l = xl * l + ((m & 0x3fff) << 14) + w[j] + c;
	        c = (l >> 28) + (m >> 14) + xh * h;
	        w[j++] = l & 0xfffffff;
	    }
	    return c;
	}
	if ((navigator.appName == "Microsoft Internet Explorer")) {
	    BigInteger.prototype.am = am2;
	    dbits = 30;
	}
	else if ((navigator.appName != "Netscape")) {
	    BigInteger.prototype.am = am1;
	    dbits = 26;
	}
	else { // Mozilla/Netscape seems to prefer am3
	    BigInteger.prototype.am = am3;
	    dbits = 28;
	}
	BigInteger.prototype.DB = dbits;
	BigInteger.prototype.DM = ((1 << dbits) - 1);
	BigInteger.prototype.DV = (1 << dbits);
	var BI_FP = 52;
	BigInteger.prototype.FV = Math.pow(2, BI_FP);
	BigInteger.prototype.F1 = BI_FP - dbits;
	BigInteger.prototype.F2 = 2 * dbits - BI_FP;
	// Digit conversions
	var BI_RC = [];
	var rr;
	var vv;
	rr = "0".charCodeAt(0);
	for (vv = 0; vv <= 9; ++vv) {
	    BI_RC[rr++] = vv;
	}
	rr = "a".charCodeAt(0);
	for (vv = 10; vv < 36; ++vv) {
	    BI_RC[rr++] = vv;
	}
	rr = "A".charCodeAt(0);
	for (vv = 10; vv < 36; ++vv) {
	    BI_RC[rr++] = vv;
	}
	function intAt(s, i) {
	    var c = BI_RC[s.charCodeAt(i)];
	    return (c == null) ? -1 : c;
	}
	// return bigint initialized to value
	function nbv(i) {
	    var r = nbi();
	    r.fromInt(i);
	    return r;
	}
	// returns bit length of the integer x
	function nbits(x) {
	    var r = 1;
	    var t;
	    if ((t = x >>> 16) != 0) {
	        x = t;
	        r += 16;
	    }
	    if ((t = x >> 8) != 0) {
	        x = t;
	        r += 8;
	    }
	    if ((t = x >> 4) != 0) {
	        x = t;
	        r += 4;
	    }
	    if ((t = x >> 2) != 0) {
	        x = t;
	        r += 2;
	    }
	    if ((t = x >> 1) != 0) {
	        x = t;
	        r += 1;
	    }
	    return r;
	}
	// "constants"
	BigInteger.ZERO = nbv(0);
	BigInteger.ONE = nbv(1);

	// prng4.js - uses Arcfour as a PRNG
	var Arcfour = /** @class */ (function () {
	    function Arcfour() {
	        this.i = 0;
	        this.j = 0;
	        this.S = [];
	    }
	    // Arcfour.prototype.init = ARC4init;
	    // Initialize arcfour context from key, an array of ints, each from [0..255]
	    Arcfour.prototype.init = function (key) {
	        var i;
	        var j;
	        var t;
	        for (i = 0; i < 256; ++i) {
	            this.S[i] = i;
	        }
	        j = 0;
	        for (i = 0; i < 256; ++i) {
	            j = (j + this.S[i] + key[i % key.length]) & 255;
	            t = this.S[i];
	            this.S[i] = this.S[j];
	            this.S[j] = t;
	        }
	        this.i = 0;
	        this.j = 0;
	    };
	    // Arcfour.prototype.next = ARC4next;
	    Arcfour.prototype.next = function () {
	        var t;
	        this.i = (this.i + 1) & 255;
	        this.j = (this.j + this.S[this.i]) & 255;
	        t = this.S[this.i];
	        this.S[this.i] = this.S[this.j];
	        this.S[this.j] = t;
	        return this.S[(t + this.S[this.i]) & 255];
	    };
	    return Arcfour;
	}());
	// Plug in your RNG constructor here
	function prng_newstate() {
	    return new Arcfour();
	}
	// Pool size must be a multiple of 4 and greater than 32.
	// An array of bytes the size of the pool will be passed to init()
	var rng_psize = 256;

	// Random number generator - requires a PRNG backend, e.g. prng4.js
	var rng_state;
	var rng_pool = null;
	var rng_pptr;
	// Initialize the pool with junk if needed.
	if (rng_pool == null) {
	    rng_pool = [];
	    rng_pptr = 0;
	    var t = void 0;
	    if (window.crypto && window.crypto.getRandomValues) {
	        // Extract entropy (2048 bits) from RNG if available
	        var z = new Uint32Array(256);
	        window.crypto.getRandomValues(z);
	        for (t = 0; t < z.length; ++t) {
	            rng_pool[rng_pptr++] = z[t] & 255;
	        }
	    }
	    // Use mouse events for entropy, if we do not have enough entropy by the time
	    // we need it, entropy will be generated by Math.random.
	    var onMouseMoveListener_1 = function (ev) {
	        this.count = this.count || 0;
	        if (this.count >= 256 || rng_pptr >= rng_psize) {
	            if (window.removeEventListener) {
	                window.removeEventListener("mousemove", onMouseMoveListener_1, false);
	            }
	            else if (window.detachEvent) {
	                window.detachEvent("onmousemove", onMouseMoveListener_1);
	            }
	            return;
	        }
	        try {
	            var mouseCoordinates = ev.x + ev.y;
	            rng_pool[rng_pptr++] = mouseCoordinates & 255;
	            this.count += 1;
	        }
	        catch (e) {
	            // Sometimes Firefox will deny permission to access event properties for some reason. Ignore.
	        }
	    };
	    if (window.addEventListener) {
	        window.addEventListener("mousemove", onMouseMoveListener_1, false);
	    }
	    else if (window.attachEvent) {
	        window.attachEvent("onmousemove", onMouseMoveListener_1);
	    }
	}
	function rng_get_byte() {
	    if (rng_state == null) {
	        rng_state = prng_newstate();
	        // At this point, we may not have collected enough entropy.  If not, fall back to Math.random
	        while (rng_pptr < rng_psize) {
	            var random = Math.floor(65536 * Math.random());
	            rng_pool[rng_pptr++] = random & 255;
	        }
	        rng_state.init(rng_pool);
	        for (rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr) {
	            rng_pool[rng_pptr] = 0;
	        }
	        rng_pptr = 0;
	    }
	    // TODO: allow reseeding after first request
	    return rng_state.next();
	}
	var SecureRandom = /** @class */ (function () {
	    function SecureRandom() {
	    }
	    SecureRandom.prototype.nextBytes = function (ba) {
	        for (var i = 0; i < ba.length; ++i) {
	            ba[i] = rng_get_byte();
	        }
	    };
	    return SecureRandom;
	}());

	// Depends on jsbn.js and rng.js
	// function linebrk(s,n) {
	//   var ret = "";
	//   var i = 0;
	//   while(i + n < s.length) {
	//     ret += s.substring(i,i+n) + "\n";
	//     i += n;
	//   }
	//   return ret + s.substring(i,s.length);
	// }
	// function byte2Hex(b) {
	//   if(b < 0x10)
	//     return "0" + b.toString(16);
	//   else
	//     return b.toString(16);
	// }
	function pkcs1pad1(s, n) {
	    if (n < s.length + 22) {
	        console.error("Message too long for RSA");
	        return null;
	    }
	    var len = n - s.length - 6;
	    var filler = "";
	    for (var f = 0; f < len; f += 2) {
	        filler += "ff";
	    }
	    var m = "0001" + filler + "00" + s;
	    return parseBigInt(m, 16);
	}
	// PKCS#1 (type 2, random) pad input string s to n bytes, and return a bigint
	function pkcs1pad2(s, n) {
	    if (n < s.length + 11) { // TODO: fix for utf-8
	        console.error("Message too long for RSA");
	        return null;
	    }
	    var ba = [];
	    var i = s.length - 1;
	    while (i >= 0 && n > 0) {
	        var c = s.charCodeAt(i--);
	        if (c < 128) { // encode using utf-8
	            ba[--n] = c;
	        }
	        else if ((c > 127) && (c < 2048)) {
	            ba[--n] = (c & 63) | 128;
	            ba[--n] = (c >> 6) | 192;
	        }
	        else {
	            ba[--n] = (c & 63) | 128;
	            ba[--n] = ((c >> 6) & 63) | 128;
	            ba[--n] = (c >> 12) | 224;
	        }
	    }
	    ba[--n] = 0;
	    var rng = new SecureRandom();
	    var x = [];
	    while (n > 2) { // random non-zero pad
	        x[0] = 0;
	        while (x[0] == 0) {
	            rng.nextBytes(x);
	        }
	        ba[--n] = x[0];
	    }
	    ba[--n] = 2;
	    ba[--n] = 0;
	    return new BigInteger(ba);
	}
	// "empty" RSA key constructor
	var RSAKey = /** @class */ (function () {
	    function RSAKey() {
	        this.n = null;
	        this.e = 0;
	        this.d = null;
	        this.p = null;
	        this.q = null;
	        this.dmp1 = null;
	        this.dmq1 = null;
	        this.coeff = null;
	    }
	    //#region PROTECTED
	    // protected
	    // RSAKey.prototype.doPublic = RSADoPublic;
	    // Perform raw public operation on "x": return x^e (mod n)
	    RSAKey.prototype.doPublic = function (x) {
	        return x.modPowInt(this.e, this.n);
	    };
	    // RSAKey.prototype.doPrivate = RSADoPrivate;
	    // Perform raw private operation on "x": return x^d (mod n)
	    RSAKey.prototype.doPrivate = function (x) {
	        if (this.p == null || this.q == null) {
	            return x.modPow(this.d, this.n);
	        }
	        // TODO: re-calculate any missing CRT params
	        var xp = x.mod(this.p).modPow(this.dmp1, this.p);
	        var xq = x.mod(this.q).modPow(this.dmq1, this.q);
	        while (xp.compareTo(xq) < 0) {
	            xp = xp.add(this.p);
	        }
	        return xp.subtract(xq).multiply(this.coeff).mod(this.p).multiply(this.q).add(xq);
	    };
	    //#endregion PROTECTED
	    //#region PUBLIC
	    // RSAKey.prototype.setPublic = RSASetPublic;
	    // Set the public key fields N and e from hex strings
	    RSAKey.prototype.setPublic = function (N, E) {
	        if (N != null && E != null && N.length > 0 && E.length > 0) {
	            this.n = parseBigInt(N, 16);
	            this.e = parseInt(E, 16);
	        }
	        else {
	            console.error("Invalid RSA public key");
	        }
	    };
	    // RSAKey.prototype.encrypt = RSAEncrypt;
	    // Return the PKCS#1 RSA encryption of "text" as an even-length hex string
	    RSAKey.prototype.encrypt = function (text) {
	        var m = pkcs1pad2(text, (this.n.bitLength() + 7) >> 3);
	        if (m == null) {
	            return null;
	        }
	        var c = this.doPublic(m);
	        if (c == null) {
	            return null;
	        }
	        var h = c.toString(16);
	        if ((h.length & 1) == 0) {
	            return h;
	        }
	        else {
	            return "0" + h;
	        }
	    };
	    // RSAKey.prototype.setPrivate = RSASetPrivate;
	    // Set the private key fields N, e, and d from hex strings
	    RSAKey.prototype.setPrivate = function (N, E, D) {
	        if (N != null && E != null && N.length > 0 && E.length > 0) {
	            this.n = parseBigInt(N, 16);
	            this.e = parseInt(E, 16);
	            this.d = parseBigInt(D, 16);
	        }
	        else {
	            console.error("Invalid RSA private key");
	        }
	    };
	    // RSAKey.prototype.setPrivateEx = RSASetPrivateEx;
	    // Set the private key fields N, e, d and CRT params from hex strings
	    RSAKey.prototype.setPrivateEx = function (N, E, D, P, Q, DP, DQ, C) {
	        if (N != null && E != null && N.length > 0 && E.length > 0) {
	            this.n = parseBigInt(N, 16);
	            this.e = parseInt(E, 16);
	            this.d = parseBigInt(D, 16);
	            this.p = parseBigInt(P, 16);
	            this.q = parseBigInt(Q, 16);
	            this.dmp1 = parseBigInt(DP, 16);
	            this.dmq1 = parseBigInt(DQ, 16);
	            this.coeff = parseBigInt(C, 16);
	        }
	        else {
	            console.error("Invalid RSA private key");
	        }
	    };
	    // RSAKey.prototype.generate = RSAGenerate;
	    // Generate a new random private key B bits long, using public expt E
	    RSAKey.prototype.generate = function (B, E) {
	        var rng = new SecureRandom();
	        var qs = B >> 1;
	        this.e = parseInt(E, 16);
	        var ee = new BigInteger(E, 16);
	        for (;;) {
	            for (;;) {
	                this.p = new BigInteger(B - qs, 1, rng);
	                if (this.p.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) == 0 && this.p.isProbablePrime(10)) {
	                    break;
	                }
	            }
	            for (;;) {
	                this.q = new BigInteger(qs, 1, rng);
	                if (this.q.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) == 0 && this.q.isProbablePrime(10)) {
	                    break;
	                }
	            }
	            if (this.p.compareTo(this.q) <= 0) {
	                var t = this.p;
	                this.p = this.q;
	                this.q = t;
	            }
	            var p1 = this.p.subtract(BigInteger.ONE);
	            var q1 = this.q.subtract(BigInteger.ONE);
	            var phi = p1.multiply(q1);
	            if (phi.gcd(ee).compareTo(BigInteger.ONE) == 0) {
	                this.n = this.p.multiply(this.q);
	                this.d = ee.modInverse(phi);
	                this.dmp1 = this.d.mod(p1);
	                this.dmq1 = this.d.mod(q1);
	                this.coeff = this.q.modInverse(this.p);
	                break;
	            }
	        }
	    };
	    // RSAKey.prototype.decrypt = RSADecrypt;
	    // Return the PKCS#1 RSA decryption of "ctext".
	    // "ctext" is an even-length hex string and the output is a plain string.
	    RSAKey.prototype.decrypt = function (ctext) {
	        var c = parseBigInt(ctext, 16);
	        var m = this.doPrivate(c);
	        if (m == null) {
	            return null;
	        }
	        return pkcs1unpad2(m, (this.n.bitLength() + 7) >> 3);
	    };
	    // Generate a new random private key B bits long, using public expt E
	    RSAKey.prototype.generateAsync = function (B, E, callback) {
	        var rng = new SecureRandom();
	        var qs = B >> 1;
	        this.e = parseInt(E, 16);
	        var ee = new BigInteger(E, 16);
	        var rsa = this;
	        // These functions have non-descript names because they were originally for(;;) loops.
	        // I don't know about cryptography to give them better names than loop1-4.
	        var loop1 = function () {
	            var loop4 = function () {
	                if (rsa.p.compareTo(rsa.q) <= 0) {
	                    var t = rsa.p;
	                    rsa.p = rsa.q;
	                    rsa.q = t;
	                }
	                var p1 = rsa.p.subtract(BigInteger.ONE);
	                var q1 = rsa.q.subtract(BigInteger.ONE);
	                var phi = p1.multiply(q1);
	                if (phi.gcd(ee).compareTo(BigInteger.ONE) == 0) {
	                    rsa.n = rsa.p.multiply(rsa.q);
	                    rsa.d = ee.modInverse(phi);
	                    rsa.dmp1 = rsa.d.mod(p1);
	                    rsa.dmq1 = rsa.d.mod(q1);
	                    rsa.coeff = rsa.q.modInverse(rsa.p);
	                    setTimeout(function () { callback(); }, 0); // escape
	                }
	                else {
	                    setTimeout(loop1, 0);
	                }
	            };
	            var loop3 = function () {
	                rsa.q = nbi();
	                rsa.q.fromNumberAsync(qs, 1, rng, function () {
	                    rsa.q.subtract(BigInteger.ONE).gcda(ee, function (r) {
	                        if (r.compareTo(BigInteger.ONE) == 0 && rsa.q.isProbablePrime(10)) {
	                            setTimeout(loop4, 0);
	                        }
	                        else {
	                            setTimeout(loop3, 0);
	                        }
	                    });
	                });
	            };
	            var loop2 = function () {
	                rsa.p = nbi();
	                rsa.p.fromNumberAsync(B - qs, 1, rng, function () {
	                    rsa.p.subtract(BigInteger.ONE).gcda(ee, function (r) {
	                        if (r.compareTo(BigInteger.ONE) == 0 && rsa.p.isProbablePrime(10)) {
	                            setTimeout(loop3, 0);
	                        }
	                        else {
	                            setTimeout(loop2, 0);
	                        }
	                    });
	                });
	            };
	            setTimeout(loop2, 0);
	        };
	        setTimeout(loop1, 0);
	    };
	    RSAKey.prototype.sign = function (text, digestMethod, digestName) {
	        var header = getDigestHeader(digestName);
	        var digest = header + digestMethod(text).toString();
	        var m = pkcs1pad1(digest, this.n.bitLength() / 4);
	        if (m == null) {
	            return null;
	        }
	        var c = this.doPrivate(m);
	        if (c == null) {
	            return null;
	        }
	        var h = c.toString(16);
	        if ((h.length & 1) == 0) {
	            return h;
	        }
	        else {
	            return "0" + h;
	        }
	    };
	    RSAKey.prototype.verify = function (text, signature, digestMethod) {
	        var c = parseBigInt(signature, 16);
	        var m = this.doPublic(c);
	        if (m == null) {
	            return null;
	        }
	        var unpadded = m.toString(16).replace(/^1f+00/, "");
	        var digest = removeDigestHeader(unpadded);
	        return digest == digestMethod(text).toString();
	    };
	    return RSAKey;
	}());
	// Undo PKCS#1 (type 2, random) padding and, if valid, return the plaintext
	function pkcs1unpad2(d, n) {
	    var b = d.toByteArray();
	    var i = 0;
	    while (i < b.length && b[i] == 0) {
	        ++i;
	    }
	    if (b.length - i != n - 1 || b[i] != 2) {
	        return null;
	    }
	    ++i;
	    while (b[i] != 0) {
	        if (++i >= b.length) {
	            return null;
	        }
	    }
	    var ret = "";
	    while (++i < b.length) {
	        var c = b[i] & 255;
	        if (c < 128) { // utf-8 decode
	            ret += String.fromCharCode(c);
	        }
	        else if ((c > 191) && (c < 224)) {
	            ret += String.fromCharCode(((c & 31) << 6) | (b[i + 1] & 63));
	            ++i;
	        }
	        else {
	            ret += String.fromCharCode(((c & 15) << 12) | ((b[i + 1] & 63) << 6) | (b[i + 2] & 63));
	            i += 2;
	        }
	    }
	    return ret;
	}
	// https://tools.ietf.org/html/rfc3447#page-43
	var DIGEST_HEADERS = {
	    md2: "3020300c06082a864886f70d020205000410",
	    md5: "3020300c06082a864886f70d020505000410",
	    sha1: "3021300906052b0e03021a05000414",
	    sha224: "302d300d06096086480165030402040500041c",
	    sha256: "3031300d060960864801650304020105000420",
	    sha384: "3041300d060960864801650304020205000430",
	    sha512: "3051300d060960864801650304020305000440",
	    ripemd160: "3021300906052b2403020105000414",
	};
	function getDigestHeader(name) {
	    return DIGEST_HEADERS[name] || "";
	}
	function removeDigestHeader(str) {
	    for (var name_1 in DIGEST_HEADERS) {
	        if (DIGEST_HEADERS.hasOwnProperty(name_1)) {
	            var header = DIGEST_HEADERS[name_1];
	            var len = header.length;
	            if (str.substr(0, len) == header) {
	                return str.substr(len);
	            }
	        }
	    }
	    return str;
	}
	// Return the PKCS#1 RSA encryption of "text" as a Base64-encoded string
	// function RSAEncryptB64(text) {
	//  var h = this.encrypt(text);
	//  if(h) return hex2b64(h); else return null;
	// }
	// public
	// RSAKey.prototype.encrypt_b64 = RSAEncryptB64;

	/*!
	Copyright (c) 2011, Yahoo! Inc. All rights reserved.
	Code licensed under the BSD License:
	http://developer.yahoo.com/yui/license.html
	version: 2.9.0
	*/
	var YAHOO = {};
	YAHOO.lang = {
	    /**
	     * Utility to set up the prototype, constructor and superclass properties to
	     * support an inheritance strategy that can chain constructors and methods.
	     * Static members will not be inherited.
	     *
	     * @method extend
	     * @static
	     * @param {Function} subc   the object to modify
	     * @param {Function} superc the object to inherit
	     * @param {Object} overrides  additional properties/methods to add to the
	     *                              subclass prototype.  These will override the
	     *                              matching items obtained from the superclass
	     *                              if present.
	     */
	    extend: function(subc, superc, overrides) {
	        if (! superc || ! subc) {
	            throw new Error("YAHOO.lang.extend failed, please check that " +
	                "all dependencies are included.");
	        }

	        var F = function() {};
	        F.prototype = superc.prototype;
	        subc.prototype = new F();
	        subc.prototype.constructor = subc;
	        subc.superclass = superc.prototype;

	        if (superc.prototype.constructor == Object.prototype.constructor) {
	            superc.prototype.constructor = superc;
	        }

	        if (overrides) {
	            var i;
	            for (i in overrides) {
	                subc.prototype[i] = overrides[i];
	            }

	            /*
	             * IE will not enumerate native functions in a derived object even if the
	             * function was overridden.  This is a workaround for specific functions
	             * we care about on the Object prototype.
	             * @property _IEEnumFix
	             * @param {Function} r  the object to receive the augmentation
	             * @param {Function} s  the object that supplies the properties to augment
	             * @static
	             * @private
	             */
	            var _IEEnumFix = function() {},
	                ADD = ["toString", "valueOf"];
	            try {
	                if (/MSIE/.test(navigator.userAgent)) {
	                    _IEEnumFix = function(r, s) {
	                        for (i = 0; i < ADD.length; i = i + 1) {
	                            var fname = ADD[i], f = s[fname];
	                            if (typeof f === 'function' && f != Object.prototype[fname]) {
	                                r[fname] = f;
	                            }
	                        }
	                    };
	                }
	            } catch (ex) {}            _IEEnumFix(subc.prototype, overrides);
	        }
	    }
	};

	/* asn1-1.0.13.js (c) 2013-2017 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */

	/**
	 * @fileOverview
	 * @name asn1-1.0.js
	 * @author Kenji Urushima kenji.urushima@gmail.com
	 * @version asn1 1.0.13 (2017-Jun-02)
	 * @since jsrsasign 2.1
	 * @license <a href="https://kjur.github.io/jsrsasign/license/">MIT License</a>
	 */

	/**
	 * kjur's class library name space
	 * <p>
	 * This name space provides following name spaces:
	 * <ul>
	 * <li>{@link KJUR.asn1} - ASN.1 primitive hexadecimal encoder</li>
	 * <li>{@link KJUR.asn1.x509} - ASN.1 structure for X.509 certificate and CRL</li>
	 * <li>{@link KJUR.crypto} - Java Cryptographic Extension(JCE) style MessageDigest/Signature
	 * class and utilities</li>
	 * </ul>
	 * </p>
	 * NOTE: Please ignore method summary and document of this namespace. This caused by a bug of jsdoc2.
	 * @name KJUR
	 * @namespace kjur's class library name space
	 */
	var KJUR = {};

	/**
	 * kjur's ASN.1 class library name space
	 * <p>
	 * This is ITU-T X.690 ASN.1 DER encoder class library and
	 * class structure and methods is very similar to
	 * org.bouncycastle.asn1 package of
	 * well known BouncyCaslte Cryptography Library.
	 * <h4>PROVIDING ASN.1 PRIMITIVES</h4>
	 * Here are ASN.1 DER primitive classes.
	 * <ul>
	 * <li>0x01 {@link KJUR.asn1.DERBoolean}</li>
	 * <li>0x02 {@link KJUR.asn1.DERInteger}</li>
	 * <li>0x03 {@link KJUR.asn1.DERBitString}</li>
	 * <li>0x04 {@link KJUR.asn1.DEROctetString}</li>
	 * <li>0x05 {@link KJUR.asn1.DERNull}</li>
	 * <li>0x06 {@link KJUR.asn1.DERObjectIdentifier}</li>
	 * <li>0x0a {@link KJUR.asn1.DEREnumerated}</li>
	 * <li>0x0c {@link KJUR.asn1.DERUTF8String}</li>
	 * <li>0x12 {@link KJUR.asn1.DERNumericString}</li>
	 * <li>0x13 {@link KJUR.asn1.DERPrintableString}</li>
	 * <li>0x14 {@link KJUR.asn1.DERTeletexString}</li>
	 * <li>0x16 {@link KJUR.asn1.DERIA5String}</li>
	 * <li>0x17 {@link KJUR.asn1.DERUTCTime}</li>
	 * <li>0x18 {@link KJUR.asn1.DERGeneralizedTime}</li>
	 * <li>0x30 {@link KJUR.asn1.DERSequence}</li>
	 * <li>0x31 {@link KJUR.asn1.DERSet}</li>
	 * </ul>
	 * <h4>OTHER ASN.1 CLASSES</h4>
	 * <ul>
	 * <li>{@link KJUR.asn1.ASN1Object}</li>
	 * <li>{@link KJUR.asn1.DERAbstractString}</li>
	 * <li>{@link KJUR.asn1.DERAbstractTime}</li>
	 * <li>{@link KJUR.asn1.DERAbstractStructured}</li>
	 * <li>{@link KJUR.asn1.DERTaggedObject}</li>
	 * </ul>
	 * <h4>SUB NAME SPACES</h4>
	 * <ul>
	 * <li>{@link KJUR.asn1.cades} - CAdES long term signature format</li>
	 * <li>{@link KJUR.asn1.cms} - Cryptographic Message Syntax</li>
	 * <li>{@link KJUR.asn1.csr} - Certificate Signing Request (CSR/PKCS#10)</li>
	 * <li>{@link KJUR.asn1.tsp} - RFC 3161 Timestamping Protocol Format</li>
	 * <li>{@link KJUR.asn1.x509} - RFC 5280 X.509 certificate and CRL</li>
	 * </ul>
	 * </p>
	 * NOTE: Please ignore method summary and document of this namespace.
	 * This caused by a bug of jsdoc2.
	 * @name KJUR.asn1
	 * @namespace
	 */
	if (typeof KJUR.asn1 == "undefined" || !KJUR.asn1) KJUR.asn1 = {};

	/**
	 * ASN1 utilities class
	 * @name KJUR.asn1.ASN1Util
	 * @class ASN1 utilities class
	 * @since asn1 1.0.2
	 */
	KJUR.asn1.ASN1Util = new function() {
	    this.integerToByteHex = function(i) {
	        var h = i.toString(16);
	        if ((h.length % 2) == 1) h = '0' + h;
	        return h;
	    };
	    this.bigIntToMinTwosComplementsHex = function(bigIntegerValue) {
	        var h = bigIntegerValue.toString(16);
	        if (h.substr(0, 1) != '-') {
	            if (h.length % 2 == 1) {
	                h = '0' + h;
	            } else {
	                if (! h.match(/^[0-7]/)) {
	                    h = '00' + h;
	                }
	            }
	        } else {
	            var hPos = h.substr(1);
	            var xorLen = hPos.length;
	            if (xorLen % 2 == 1) {
	                xorLen += 1;
	            } else {
	                if (! h.match(/^[0-7]/)) {
	                    xorLen += 2;
	                }
	            }
	            var hMask = '';
	            for (var i = 0; i < xorLen; i++) {
	                hMask += 'f';
	            }
	            var biMask = new BigInteger(hMask, 16);
	            var biNeg = biMask.xor(bigIntegerValue).add(BigInteger.ONE);
	            h = biNeg.toString(16).replace(/^-/, '');
	        }
	        return h;
	    };
	    /**
	     * get PEM string from hexadecimal data and header string
	     * @name getPEMStringFromHex
	     * @memberOf KJUR.asn1.ASN1Util
	     * @function
	     * @param {String} dataHex hexadecimal string of PEM body
	     * @param {String} pemHeader PEM header string (ex. 'RSA PRIVATE KEY')
	     * @return {String} PEM formatted string of input data
	     * @description
	     * This method converts a hexadecimal string to a PEM string with
	     * a specified header. Its line break will be CRLF("\r\n").
	     * @example
	     * var pem  = KJUR.asn1.ASN1Util.getPEMStringFromHex('616161', 'RSA PRIVATE KEY');
	     * // value of pem will be:
	     * -----BEGIN PRIVATE KEY-----
	     * YWFh
	     * -----END PRIVATE KEY-----
	     */
	    this.getPEMStringFromHex = function(dataHex, pemHeader) {
	        return hextopem(dataHex, pemHeader);
	    };

	    /**
	     * generate ASN1Object specifed by JSON parameters
	     * @name newObject
	     * @memberOf KJUR.asn1.ASN1Util
	     * @function
	     * @param {Array} param JSON parameter to generate ASN1Object
	     * @return {KJUR.asn1.ASN1Object} generated object
	     * @since asn1 1.0.3
	     * @description
	     * generate any ASN1Object specified by JSON param
	     * including ASN.1 primitive or structured.
	     * Generally 'param' can be described as follows:
	     * <blockquote>
	     * {TYPE-OF-ASNOBJ: ASN1OBJ-PARAMETER}
	     * </blockquote>
	     * 'TYPE-OF-ASN1OBJ' can be one of following symbols:
	     * <ul>
	     * <li>'bool' - DERBoolean</li>
	     * <li>'int' - DERInteger</li>
	     * <li>'bitstr' - DERBitString</li>
	     * <li>'octstr' - DEROctetString</li>
	     * <li>'null' - DERNull</li>
	     * <li>'oid' - DERObjectIdentifier</li>
	     * <li>'enum' - DEREnumerated</li>
	     * <li>'utf8str' - DERUTF8String</li>
	     * <li>'numstr' - DERNumericString</li>
	     * <li>'prnstr' - DERPrintableString</li>
	     * <li>'telstr' - DERTeletexString</li>
	     * <li>'ia5str' - DERIA5String</li>
	     * <li>'utctime' - DERUTCTime</li>
	     * <li>'gentime' - DERGeneralizedTime</li>
	     * <li>'seq' - DERSequence</li>
	     * <li>'set' - DERSet</li>
	     * <li>'tag' - DERTaggedObject</li>
	     * </ul>
	     * @example
	     * newObject({'prnstr': 'aaa'});
	     * newObject({'seq': [{'int': 3}, {'prnstr': 'aaa'}]})
	     * // ASN.1 Tagged Object
	     * newObject({'tag': {'tag': 'a1',
	     *                    'explicit': true,
	     *                    'obj': {'seq': [{'int': 3}, {'prnstr': 'aaa'}]}}});
	     * // more simple representation of ASN.1 Tagged Object
	     * newObject({'tag': ['a1',
	     *                    true,
	     *                    {'seq': [
	     *                      {'int': 3},
	     *                      {'prnstr': 'aaa'}]}
	     *                   ]});
	     */
	    this.newObject = function(param) {
	        var _KJUR = KJUR,
	            _KJUR_asn1 = _KJUR.asn1,
	            _DERBoolean = _KJUR_asn1.DERBoolean,
	            _DERInteger = _KJUR_asn1.DERInteger,
	            _DERBitString = _KJUR_asn1.DERBitString,
	            _DEROctetString = _KJUR_asn1.DEROctetString,
	            _DERNull = _KJUR_asn1.DERNull,
	            _DERObjectIdentifier = _KJUR_asn1.DERObjectIdentifier,
	            _DEREnumerated = _KJUR_asn1.DEREnumerated,
	            _DERUTF8String = _KJUR_asn1.DERUTF8String,
	            _DERNumericString = _KJUR_asn1.DERNumericString,
	            _DERPrintableString = _KJUR_asn1.DERPrintableString,
	            _DERTeletexString = _KJUR_asn1.DERTeletexString,
	            _DERIA5String = _KJUR_asn1.DERIA5String,
	            _DERUTCTime = _KJUR_asn1.DERUTCTime,
	            _DERGeneralizedTime = _KJUR_asn1.DERGeneralizedTime,
	            _DERSequence = _KJUR_asn1.DERSequence,
	            _DERSet = _KJUR_asn1.DERSet,
	            _DERTaggedObject = _KJUR_asn1.DERTaggedObject,
	            _newObject = _KJUR_asn1.ASN1Util.newObject;

	        var keys = Object.keys(param);
	        if (keys.length != 1)
	            throw "key of param shall be only one.";
	        var key = keys[0];

	        if (":bool:int:bitstr:octstr:null:oid:enum:utf8str:numstr:prnstr:telstr:ia5str:utctime:gentime:seq:set:tag:".indexOf(":" + key + ":") == -1)
	            throw "undefined key: " + key;

	        if (key == "bool")    return new _DERBoolean(param[key]);
	        if (key == "int")     return new _DERInteger(param[key]);
	        if (key == "bitstr")  return new _DERBitString(param[key]);
	        if (key == "octstr")  return new _DEROctetString(param[key]);
	        if (key == "null")    return new _DERNull(param[key]);
	        if (key == "oid")     return new _DERObjectIdentifier(param[key]);
	        if (key == "enum")    return new _DEREnumerated(param[key]);
	        if (key == "utf8str") return new _DERUTF8String(param[key]);
	        if (key == "numstr")  return new _DERNumericString(param[key]);
	        if (key == "prnstr")  return new _DERPrintableString(param[key]);
	        if (key == "telstr")  return new _DERTeletexString(param[key]);
	        if (key == "ia5str")  return new _DERIA5String(param[key]);
	        if (key == "utctime") return new _DERUTCTime(param[key]);
	        if (key == "gentime") return new _DERGeneralizedTime(param[key]);

	        if (key == "seq") {
	            var paramList = param[key];
	            var a = [];
	            for (var i = 0; i < paramList.length; i++) {
	                var asn1Obj = _newObject(paramList[i]);
	                a.push(asn1Obj);
	            }
	            return new _DERSequence({'array': a});
	        }

	        if (key == "set") {
	            var paramList = param[key];
	            var a = [];
	            for (var i = 0; i < paramList.length; i++) {
	                var asn1Obj = _newObject(paramList[i]);
	                a.push(asn1Obj);
	            }
	            return new _DERSet({'array': a});
	        }

	        if (key == "tag") {
	            var tagParam = param[key];
	            if (Object.prototype.toString.call(tagParam) === '[object Array]' &&
	                tagParam.length == 3) {
	                var obj = _newObject(tagParam[2]);
	                return new _DERTaggedObject({tag: tagParam[0],
	                    explicit: tagParam[1],
	                    obj: obj});
	            } else {
	                var newParam = {};
	                if (tagParam.explicit !== undefined)
	                    newParam.explicit = tagParam.explicit;
	                if (tagParam.tag !== undefined)
	                    newParam.tag = tagParam.tag;
	                if (tagParam.obj === undefined)
	                    throw "obj shall be specified for 'tag'.";
	                newParam.obj = _newObject(tagParam.obj);
	                return new _DERTaggedObject(newParam);
	            }
	        }
	    };

	    /**
	     * get encoded hexadecimal string of ASN1Object specifed by JSON parameters
	     * @name jsonToASN1HEX
	     * @memberOf KJUR.asn1.ASN1Util
	     * @function
	     * @param {Array} param JSON parameter to generate ASN1Object
	     * @return hexadecimal string of ASN1Object
	     * @since asn1 1.0.4
	     * @description
	     * As for ASN.1 object representation of JSON object,
	     * please see {@link newObject}.
	     * @example
	     * jsonToASN1HEX({'prnstr': 'aaa'});
	     */
	    this.jsonToASN1HEX = function(param) {
	        var asn1Obj = this.newObject(param);
	        return asn1Obj.getEncodedHex();
	    };
	};

	/**
	 * get dot noted oid number string from hexadecimal value of OID
	 * @name oidHexToInt
	 * @memberOf KJUR.asn1.ASN1Util
	 * @function
	 * @param {String} hex hexadecimal value of object identifier
	 * @return {String} dot noted string of object identifier
	 * @since jsrsasign 4.8.3 asn1 1.0.7
	 * @description
	 * This static method converts from hexadecimal string representation of
	 * ASN.1 value of object identifier to oid number string.
	 * @example
	 * KJUR.asn1.ASN1Util.oidHexToInt('550406') &rarr; "2.5.4.6"
	 */
	KJUR.asn1.ASN1Util.oidHexToInt = function(hex) {
	    var s = "";
	    var i01 = parseInt(hex.substr(0, 2), 16);
	    var i0 = Math.floor(i01 / 40);
	    var i1 = i01 % 40;
	    var s = i0 + "." + i1;

	    var binbuf = "";
	    for (var i = 2; i < hex.length; i += 2) {
	        var value = parseInt(hex.substr(i, 2), 16);
	        var bin = ("00000000" + value.toString(2)).slice(- 8);
	        binbuf = binbuf + bin.substr(1, 7);
	        if (bin.substr(0, 1) == "0") {
	            var bi = new BigInteger(binbuf, 2);
	            s = s + "." + bi.toString(10);
	            binbuf = "";
	        }
	    }
	    return s;
	};

	/**
	 * get hexadecimal value of object identifier from dot noted oid value
	 * @name oidIntToHex
	 * @memberOf KJUR.asn1.ASN1Util
	 * @function
	 * @param {String} oidString dot noted string of object identifier
	 * @return {String} hexadecimal value of object identifier
	 * @since jsrsasign 4.8.3 asn1 1.0.7
	 * @description
	 * This static method converts from object identifier value string.
	 * to hexadecimal string representation of it.
	 * @example
	 * KJUR.asn1.ASN1Util.oidIntToHex("2.5.4.6") &rarr; "550406"
	 */
	KJUR.asn1.ASN1Util.oidIntToHex = function(oidString) {
	    var itox = function(i) {
	        var h = i.toString(16);
	        if (h.length == 1) h = '0' + h;
	        return h;
	    };

	    var roidtox = function(roid) {
	        var h = '';
	        var bi = new BigInteger(roid, 10);
	        var b = bi.toString(2);
	        var padLen = 7 - b.length % 7;
	        if (padLen == 7) padLen = 0;
	        var bPad = '';
	        for (var i = 0; i < padLen; i++) bPad += '0';
	        b = bPad + b;
	        for (var i = 0; i < b.length - 1; i += 7) {
	            var b8 = b.substr(i, 7);
	            if (i != b.length - 7) b8 = '1' + b8;
	            h += itox(parseInt(b8, 2));
	        }
	        return h;
	    };

	    if (! oidString.match(/^[0-9.]+$/)) {
	        throw "malformed oid string: " + oidString;
	    }
	    var h = '';
	    var a = oidString.split('.');
	    var i0 = parseInt(a[0]) * 40 + parseInt(a[1]);
	    h += itox(i0);
	    a.splice(0, 2);
	    for (var i = 0; i < a.length; i++) {
	        h += roidtox(a[i]);
	    }
	    return h;
	};


	// ********************************************************************
	//  Abstract ASN.1 Classes
	// ********************************************************************

	// ********************************************************************

	/**
	 * base class for ASN.1 DER encoder object
	 * @name KJUR.asn1.ASN1Object
	 * @class base class for ASN.1 DER encoder object
	 * @property {Boolean} isModified flag whether internal data was changed
	 * @property {String} hTLV hexadecimal string of ASN.1 TLV
	 * @property {String} hT hexadecimal string of ASN.1 TLV tag(T)
	 * @property {String} hL hexadecimal string of ASN.1 TLV length(L)
	 * @property {String} hV hexadecimal string of ASN.1 TLV value(V)
	 * @description
	 */
	KJUR.asn1.ASN1Object = function() {
	    var hV = '';

	    /**
	     * get hexadecimal ASN.1 TLV length(L) bytes from TLV value(V)
	     * @name getLengthHexFromValue
	     * @memberOf KJUR.asn1.ASN1Object#
	     * @function
	     * @return {String} hexadecimal string of ASN.1 TLV length(L)
	     */
	    this.getLengthHexFromValue = function() {
	        if (typeof this.hV == "undefined" || this.hV == null) {
	            throw "this.hV is null or undefined.";
	        }
	        if (this.hV.length % 2 == 1) {
	            throw "value hex must be even length: n=" + hV.length + ",v=" + this.hV;
	        }
	        var n = this.hV.length / 2;
	        var hN = n.toString(16);
	        if (hN.length % 2 == 1) {
	            hN = "0" + hN;
	        }
	        if (n < 128) {
	            return hN;
	        } else {
	            var hNlen = hN.length / 2;
	            if (hNlen > 15) {
	                throw "ASN.1 length too long to represent by 8x: n = " + n.toString(16);
	            }
	            var head = 128 + hNlen;
	            return head.toString(16) + hN;
	        }
	    };

	    /**
	     * get hexadecimal string of ASN.1 TLV bytes
	     * @name getEncodedHex
	     * @memberOf KJUR.asn1.ASN1Object#
	     * @function
	     * @return {String} hexadecimal string of ASN.1 TLV
	     */
	    this.getEncodedHex = function() {
	        if (this.hTLV == null || this.isModified) {
	            this.hV = this.getFreshValueHex();
	            this.hL = this.getLengthHexFromValue();
	            this.hTLV = this.hT + this.hL + this.hV;
	            this.isModified = false;
	            //alert("first time: " + this.hTLV);
	        }
	        return this.hTLV;
	    };

	    /**
	     * get hexadecimal string of ASN.1 TLV value(V) bytes
	     * @name getValueHex
	     * @memberOf KJUR.asn1.ASN1Object#
	     * @function
	     * @return {String} hexadecimal string of ASN.1 TLV value(V) bytes
	     */
	    this.getValueHex = function() {
	        this.getEncodedHex();
	        return this.hV;
	    };

	    this.getFreshValueHex = function() {
	        return '';
	    };
	};

	// == BEGIN DERAbstractString ================================================
	/**
	 * base class for ASN.1 DER string classes
	 * @name KJUR.asn1.DERAbstractString
	 * @class base class for ASN.1 DER string classes
	 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
	 * @property {String} s internal string of value
	 * @extends KJUR.asn1.ASN1Object
	 * @description
	 * <br/>
	 * As for argument 'params' for constructor, you can specify one of
	 * following properties:
	 * <ul>
	 * <li>str - specify initial ASN.1 value(V) by a string</li>
	 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
	 * </ul>
	 * NOTE: 'params' can be omitted.
	 */
	KJUR.asn1.DERAbstractString = function(params) {
	    KJUR.asn1.DERAbstractString.superclass.constructor.call(this);

	    /**
	     * get string value of this string object
	     * @name getString
	     * @memberOf KJUR.asn1.DERAbstractString#
	     * @function
	     * @return {String} string value of this string object
	     */
	    this.getString = function() {
	        return this.s;
	    };

	    /**
	     * set value by a string
	     * @name setString
	     * @memberOf KJUR.asn1.DERAbstractString#
	     * @function
	     * @param {String} newS value by a string to set
	     */
	    this.setString = function(newS) {
	        this.hTLV = null;
	        this.isModified = true;
	        this.s = newS;
	        this.hV = stohex(this.s);
	    };

	    /**
	     * set value by a hexadecimal string
	     * @name setStringHex
	     * @memberOf KJUR.asn1.DERAbstractString#
	     * @function
	     * @param {String} newHexString value by a hexadecimal string to set
	     */
	    this.setStringHex = function(newHexString) {
	        this.hTLV = null;
	        this.isModified = true;
	        this.s = null;
	        this.hV = newHexString;
	    };

	    this.getFreshValueHex = function() {
	        return this.hV;
	    };

	    if (typeof params != "undefined") {
	        if (typeof params == "string") {
	            this.setString(params);
	        } else if (typeof params['str'] != "undefined") {
	            this.setString(params['str']);
	        } else if (typeof params['hex'] != "undefined") {
	            this.setStringHex(params['hex']);
	        }
	    }
	};
	YAHOO.lang.extend(KJUR.asn1.DERAbstractString, KJUR.asn1.ASN1Object);
	// == END   DERAbstractString ================================================

	// == BEGIN DERAbstractTime ==================================================
	/**
	 * base class for ASN.1 DER Generalized/UTCTime class
	 * @name KJUR.asn1.DERAbstractTime
	 * @class base class for ASN.1 DER Generalized/UTCTime class
	 * @param {Array} params associative array of parameters (ex. {'str': '130430235959Z'})
	 * @extends KJUR.asn1.ASN1Object
	 * @description
	 * @see KJUR.asn1.ASN1Object - superclass
	 */
	KJUR.asn1.DERAbstractTime = function(params) {
	    KJUR.asn1.DERAbstractTime.superclass.constructor.call(this);

	    // --- PRIVATE METHODS --------------------
	    this.localDateToUTC = function(d) {
	        utc = d.getTime() + (d.getTimezoneOffset() * 60000);
	        var utcDate = new Date(utc);
	        return utcDate;
	    };

	    /*
	     * format date string by Data object
	     * @name formatDate
	     * @memberOf KJUR.asn1.AbstractTime;
	     * @param {Date} dateObject
	     * @param {string} type 'utc' or 'gen'
	     * @param {boolean} withMillis flag for with millisections or not
	     * @description
	     * 'withMillis' flag is supported from asn1 1.0.6.
	     */
	    this.formatDate = function(dateObject, type, withMillis) {
	        var pad = this.zeroPadding;
	        var d = this.localDateToUTC(dateObject);
	        var year = String(d.getFullYear());
	        if (type == 'utc') year = year.substr(2, 2);
	        var month = pad(String(d.getMonth() + 1), 2);
	        var day = pad(String(d.getDate()), 2);
	        var hour = pad(String(d.getHours()), 2);
	        var min = pad(String(d.getMinutes()), 2);
	        var sec = pad(String(d.getSeconds()), 2);
	        var s = year + month + day + hour + min + sec;
	        if (withMillis === true) {
	            var millis = d.getMilliseconds();
	            if (millis != 0) {
	                var sMillis = pad(String(millis), 3);
	                sMillis = sMillis.replace(/[0]+$/, "");
	                s = s + "." + sMillis;
	            }
	        }
	        return s + "Z";
	    };

	    this.zeroPadding = function(s, len) {
	        if (s.length >= len) return s;
	        return new Array(len - s.length + 1).join('0') + s;
	    };

	    // --- PUBLIC METHODS --------------------
	    /**
	     * get string value of this string object
	     * @name getString
	     * @memberOf KJUR.asn1.DERAbstractTime#
	     * @function
	     * @return {String} string value of this time object
	     */
	    this.getString = function() {
	        return this.s;
	    };

	    /**
	     * set value by a string
	     * @name setString
	     * @memberOf KJUR.asn1.DERAbstractTime#
	     * @function
	     * @param {String} newS value by a string to set such like "130430235959Z"
	     */
	    this.setString = function(newS) {
	        this.hTLV = null;
	        this.isModified = true;
	        this.s = newS;
	        this.hV = stohex(newS);
	    };

	    /**
	     * set value by a Date object
	     * @name setByDateValue
	     * @memberOf KJUR.asn1.DERAbstractTime#
	     * @function
	     * @param {Integer} year year of date (ex. 2013)
	     * @param {Integer} month month of date between 1 and 12 (ex. 12)
	     * @param {Integer} day day of month
	     * @param {Integer} hour hours of date
	     * @param {Integer} min minutes of date
	     * @param {Integer} sec seconds of date
	     */
	    this.setByDateValue = function(year, month, day, hour, min, sec) {
	        var dateObject = new Date(Date.UTC(year, month - 1, day, hour, min, sec, 0));
	        this.setByDate(dateObject);
	    };

	    this.getFreshValueHex = function() {
	        return this.hV;
	    };
	};
	YAHOO.lang.extend(KJUR.asn1.DERAbstractTime, KJUR.asn1.ASN1Object);
	// == END   DERAbstractTime ==================================================

	// == BEGIN DERAbstractStructured ============================================
	/**
	 * base class for ASN.1 DER structured class
	 * @name KJUR.asn1.DERAbstractStructured
	 * @class base class for ASN.1 DER structured class
	 * @property {Array} asn1Array internal array of ASN1Object
	 * @extends KJUR.asn1.ASN1Object
	 * @description
	 * @see KJUR.asn1.ASN1Object - superclass
	 */
	KJUR.asn1.DERAbstractStructured = function(params) {
	    KJUR.asn1.DERAbstractString.superclass.constructor.call(this);

	    /**
	     * set value by array of ASN1Object
	     * @name setByASN1ObjectArray
	     * @memberOf KJUR.asn1.DERAbstractStructured#
	     * @function
	     * @param {array} asn1ObjectArray array of ASN1Object to set
	     */
	    this.setByASN1ObjectArray = function(asn1ObjectArray) {
	        this.hTLV = null;
	        this.isModified = true;
	        this.asn1Array = asn1ObjectArray;
	    };

	    /**
	     * append an ASN1Object to internal array
	     * @name appendASN1Object
	     * @memberOf KJUR.asn1.DERAbstractStructured#
	     * @function
	     * @param {ASN1Object} asn1Object to add
	     */
	    this.appendASN1Object = function(asn1Object) {
	        this.hTLV = null;
	        this.isModified = true;
	        this.asn1Array.push(asn1Object);
	    };

	    this.asn1Array = new Array();
	    if (typeof params != "undefined") {
	        if (typeof params['array'] != "undefined") {
	            this.asn1Array = params['array'];
	        }
	    }
	};
	YAHOO.lang.extend(KJUR.asn1.DERAbstractStructured, KJUR.asn1.ASN1Object);


	// ********************************************************************
	//  ASN.1 Object Classes
	// ********************************************************************

	// ********************************************************************
	/**
	 * class for ASN.1 DER Boolean
	 * @name KJUR.asn1.DERBoolean
	 * @class class for ASN.1 DER Boolean
	 * @extends KJUR.asn1.ASN1Object
	 * @description
	 * @see KJUR.asn1.ASN1Object - superclass
	 */
	KJUR.asn1.DERBoolean = function() {
	    KJUR.asn1.DERBoolean.superclass.constructor.call(this);
	    this.hT = "01";
	    this.hTLV = "0101ff";
	};
	YAHOO.lang.extend(KJUR.asn1.DERBoolean, KJUR.asn1.ASN1Object);

	// ********************************************************************
	/**
	 * class for ASN.1 DER Integer
	 * @name KJUR.asn1.DERInteger
	 * @class class for ASN.1 DER Integer
	 * @extends KJUR.asn1.ASN1Object
	 * @description
	 * <br/>
	 * As for argument 'params' for constructor, you can specify one of
	 * following properties:
	 * <ul>
	 * <li>int - specify initial ASN.1 value(V) by integer value</li>
	 * <li>bigint - specify initial ASN.1 value(V) by BigInteger object</li>
	 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
	 * </ul>
	 * NOTE: 'params' can be omitted.
	 */
	KJUR.asn1.DERInteger = function(params) {
	    KJUR.asn1.DERInteger.superclass.constructor.call(this);
	    this.hT = "02";

	    /**
	     * set value by Tom Wu's BigInteger object
	     * @name setByBigInteger
	     * @memberOf KJUR.asn1.DERInteger#
	     * @function
	     * @param {BigInteger} bigIntegerValue to set
	     */
	    this.setByBigInteger = function(bigIntegerValue) {
	        this.hTLV = null;
	        this.isModified = true;
	        this.hV = KJUR.asn1.ASN1Util.bigIntToMinTwosComplementsHex(bigIntegerValue);
	    };

	    /**
	     * set value by integer value
	     * @name setByInteger
	     * @memberOf KJUR.asn1.DERInteger
	     * @function
	     * @param {Integer} integer value to set
	     */
	    this.setByInteger = function(intValue) {
	        var bi = new BigInteger(String(intValue), 10);
	        this.setByBigInteger(bi);
	    };

	    /**
	     * set value by integer value
	     * @name setValueHex
	     * @memberOf KJUR.asn1.DERInteger#
	     * @function
	     * @param {String} hexadecimal string of integer value
	     * @description
	     * <br/>
	     * NOTE: Value shall be represented by minimum octet length of
	     * two's complement representation.
	     * @example
	     * new KJUR.asn1.DERInteger(123);
	     * new KJUR.asn1.DERInteger({'int': 123});
	     * new KJUR.asn1.DERInteger({'hex': '1fad'});
	     */
	    this.setValueHex = function(newHexString) {
	        this.hV = newHexString;
	    };

	    this.getFreshValueHex = function() {
	        return this.hV;
	    };

	    if (typeof params != "undefined") {
	        if (typeof params['bigint'] != "undefined") {
	            this.setByBigInteger(params['bigint']);
	        } else if (typeof params['int'] != "undefined") {
	            this.setByInteger(params['int']);
	        } else if (typeof params == "number") {
	            this.setByInteger(params);
	        } else if (typeof params['hex'] != "undefined") {
	            this.setValueHex(params['hex']);
	        }
	    }
	};
	YAHOO.lang.extend(KJUR.asn1.DERInteger, KJUR.asn1.ASN1Object);

	// ********************************************************************
	/**
	 * class for ASN.1 DER encoded BitString primitive
	 * @name KJUR.asn1.DERBitString
	 * @class class for ASN.1 DER encoded BitString primitive
	 * @extends KJUR.asn1.ASN1Object
	 * @description
	 * <br/>
	 * As for argument 'params' for constructor, you can specify one of
	 * following properties:
	 * <ul>
	 * <li>bin - specify binary string (ex. '10111')</li>
	 * <li>array - specify array of boolean (ex. [true,false,true,true])</li>
	 * <li>hex - specify hexadecimal string of ASN.1 value(V) including unused bits</li>
	 * <li>obj - specify {@link KJUR.asn1.ASN1Util.newObject}
	 * argument for "BitString encapsulates" structure.</li>
	 * </ul>
	 * NOTE1: 'params' can be omitted.<br/>
	 * NOTE2: 'obj' parameter have been supported since
	 * asn1 1.0.11, jsrsasign 6.1.1 (2016-Sep-25).<br/>
	 * @example
	 * // default constructor
	 * o = new KJUR.asn1.DERBitString();
	 * // initialize with binary string
	 * o = new KJUR.asn1.DERBitString({bin: "1011"});
	 * // initialize with boolean array
	 * o = new KJUR.asn1.DERBitString({array: [true,false,true,true]});
	 * // initialize with hexadecimal string (04 is unused bits)
	 * o = new KJUR.asn1.DEROctetString({hex: "04bac0"});
	 * // initialize with ASN1Util.newObject argument for encapsulated
	 * o = new KJUR.asn1.DERBitString({obj: {seq: [{int: 3}, {prnstr: 'aaa'}]}});
	 * // above generates a ASN.1 data like this:
	 * // BIT STRING, encapsulates {
	 * //   SEQUENCE {
	 * //     INTEGER 3
	 * //     PrintableString 'aaa'
	 * //     }
	 * //   }
	 */
	KJUR.asn1.DERBitString = function(params) {
	    if (params !== undefined && typeof params.obj !== "undefined") {
	        var o = KJUR.asn1.ASN1Util.newObject(params.obj);
	        params.hex = "00" + o.getEncodedHex();
	    }
	    KJUR.asn1.DERBitString.superclass.constructor.call(this);
	    this.hT = "03";

	    /**
	     * set ASN.1 value(V) by a hexadecimal string including unused bits
	     * @name setHexValueIncludingUnusedBits
	     * @memberOf KJUR.asn1.DERBitString#
	     * @function
	     * @param {String} newHexStringIncludingUnusedBits
	     */
	    this.setHexValueIncludingUnusedBits = function(newHexStringIncludingUnusedBits) {
	        this.hTLV = null;
	        this.isModified = true;
	        this.hV = newHexStringIncludingUnusedBits;
	    };

	    /**
	     * set ASN.1 value(V) by unused bit and hexadecimal string of value
	     * @name setUnusedBitsAndHexValue
	     * @memberOf KJUR.asn1.DERBitString#
	     * @function
	     * @param {Integer} unusedBits
	     * @param {String} hValue
	     */
	    this.setUnusedBitsAndHexValue = function(unusedBits, hValue) {
	        if (unusedBits < 0 || 7 < unusedBits) {
	            throw "unused bits shall be from 0 to 7: u = " + unusedBits;
	        }
	        var hUnusedBits = "0" + unusedBits;
	        this.hTLV = null;
	        this.isModified = true;
	        this.hV = hUnusedBits + hValue;
	    };

	    /**
	     * set ASN.1 DER BitString by binary string<br/>
	     * @name setByBinaryString
	     * @memberOf KJUR.asn1.DERBitString#
	     * @function
	     * @param {String} binaryString binary value string (i.e. '10111')
	     * @description
	     * Its unused bits will be calculated automatically by length of
	     * 'binaryValue'. <br/>
	     * NOTE: Trailing zeros '0' will be ignored.
	     * @example
	     * o = new KJUR.asn1.DERBitString();
	     * o.setByBooleanArray("01011");
	     */
	    this.setByBinaryString = function(binaryString) {
	        binaryString = binaryString.replace(/0+$/, '');
	        var unusedBits = 8 - binaryString.length % 8;
	        if (unusedBits == 8) unusedBits = 0;
	        for (var i = 0; i <= unusedBits; i++) {
	            binaryString += '0';
	        }
	        var h = '';
	        for (var i = 0; i < binaryString.length - 1; i += 8) {
	            var b = binaryString.substr(i, 8);
	            var x = parseInt(b, 2).toString(16);
	            if (x.length == 1) x = '0' + x;
	            h += x;
	        }
	        this.hTLV = null;
	        this.isModified = true;
	        this.hV = '0' + unusedBits + h;
	    };

	    /**
	     * set ASN.1 TLV value(V) by an array of boolean<br/>
	     * @name setByBooleanArray
	     * @memberOf KJUR.asn1.DERBitString#
	     * @function
	     * @param {array} booleanArray array of boolean (ex. [true, false, true])
	     * @description
	     * NOTE: Trailing falses will be ignored in the ASN.1 DER Object.
	     * @example
	     * o = new KJUR.asn1.DERBitString();
	     * o.setByBooleanArray([false, true, false, true, true]);
	     */
	    this.setByBooleanArray = function(booleanArray) {
	        var s = '';
	        for (var i = 0; i < booleanArray.length; i++) {
	            if (booleanArray[i] == true) {
	                s += '1';
	            } else {
	                s += '0';
	            }
	        }
	        this.setByBinaryString(s);
	    };

	    /**
	     * generate an array of falses with specified length<br/>
	     * @name newFalseArray
	     * @memberOf KJUR.asn1.DERBitString
	     * @function
	     * @param {Integer} nLength length of array to generate
	     * @return {array} array of boolean falses
	     * @description
	     * This static method may be useful to initialize boolean array.
	     * @example
	     * o = new KJUR.asn1.DERBitString();
	     * o.newFalseArray(3) &rarr; [false, false, false]
	     */
	    this.newFalseArray = function(nLength) {
	        var a = new Array(nLength);
	        for (var i = 0; i < nLength; i++) {
	            a[i] = false;
	        }
	        return a;
	    };

	    this.getFreshValueHex = function() {
	        return this.hV;
	    };

	    if (typeof params != "undefined") {
	        if (typeof params == "string" && params.toLowerCase().match(/^[0-9a-f]+$/)) {
	            this.setHexValueIncludingUnusedBits(params);
	        } else if (typeof params['hex'] != "undefined") {
	            this.setHexValueIncludingUnusedBits(params['hex']);
	        } else if (typeof params['bin'] != "undefined") {
	            this.setByBinaryString(params['bin']);
	        } else if (typeof params['array'] != "undefined") {
	            this.setByBooleanArray(params['array']);
	        }
	    }
	};
	YAHOO.lang.extend(KJUR.asn1.DERBitString, KJUR.asn1.ASN1Object);

	// ********************************************************************
	/**
	 * class for ASN.1 DER OctetString<br/>
	 * @name KJUR.asn1.DEROctetString
	 * @class class for ASN.1 DER OctetString
	 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
	 * @extends KJUR.asn1.DERAbstractString
	 * @description
	 * This class provides ASN.1 OctetString simple type.<br/>
	 * Supported "params" attributes are:
	 * <ul>
	 * <li>str - to set a string as a value</li>
	 * <li>hex - to set a hexadecimal string as a value</li>
	 * <li>obj - to set a encapsulated ASN.1 value by JSON object
	 * which is defined in {@link KJUR.asn1.ASN1Util.newObject}</li>
	 * </ul>
	 * NOTE: A parameter 'obj' have been supported
	 * for "OCTET STRING, encapsulates" structure.
	 * since asn1 1.0.11, jsrsasign 6.1.1 (2016-Sep-25).
	 * @see KJUR.asn1.DERAbstractString - superclass
	 * @example
	 * // default constructor
	 * o = new KJUR.asn1.DEROctetString();
	 * // initialize with string
	 * o = new KJUR.asn1.DEROctetString({str: "aaa"});
	 * // initialize with hexadecimal string
	 * o = new KJUR.asn1.DEROctetString({hex: "616161"});
	 * // initialize with ASN1Util.newObject argument
	 * o = new KJUR.asn1.DEROctetString({obj: {seq: [{int: 3}, {prnstr: 'aaa'}]}});
	 * // above generates a ASN.1 data like this:
	 * // OCTET STRING, encapsulates {
	 * //   SEQUENCE {
	 * //     INTEGER 3
	 * //     PrintableString 'aaa'
	 * //     }
	 * //   }
	 */
	KJUR.asn1.DEROctetString = function(params) {
	    if (params !== undefined && typeof params.obj !== "undefined") {
	        var o = KJUR.asn1.ASN1Util.newObject(params.obj);
	        params.hex = o.getEncodedHex();
	    }
	    KJUR.asn1.DEROctetString.superclass.constructor.call(this, params);
	    this.hT = "04";
	};
	YAHOO.lang.extend(KJUR.asn1.DEROctetString, KJUR.asn1.DERAbstractString);

	// ********************************************************************
	/**
	 * class for ASN.1 DER Null
	 * @name KJUR.asn1.DERNull
	 * @class class for ASN.1 DER Null
	 * @extends KJUR.asn1.ASN1Object
	 * @description
	 * @see KJUR.asn1.ASN1Object - superclass
	 */
	KJUR.asn1.DERNull = function() {
	    KJUR.asn1.DERNull.superclass.constructor.call(this);
	    this.hT = "05";
	    this.hTLV = "0500";
	};
	YAHOO.lang.extend(KJUR.asn1.DERNull, KJUR.asn1.ASN1Object);

	// ********************************************************************
	/**
	 * class for ASN.1 DER ObjectIdentifier
	 * @name KJUR.asn1.DERObjectIdentifier
	 * @class class for ASN.1 DER ObjectIdentifier
	 * @param {Array} params associative array of parameters (ex. {'oid': '2.5.4.5'})
	 * @extends KJUR.asn1.ASN1Object
	 * @description
	 * <br/>
	 * As for argument 'params' for constructor, you can specify one of
	 * following properties:
	 * <ul>
	 * <li>oid - specify initial ASN.1 value(V) by a oid string (ex. 2.5.4.13)</li>
	 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
	 * </ul>
	 * NOTE: 'params' can be omitted.
	 */
	KJUR.asn1.DERObjectIdentifier = function(params) {
	    var itox = function(i) {
	        var h = i.toString(16);
	        if (h.length == 1) h = '0' + h;
	        return h;
	    };
	    var roidtox = function(roid) {
	        var h = '';
	        var bi = new BigInteger(roid, 10);
	        var b = bi.toString(2);
	        var padLen = 7 - b.length % 7;
	        if (padLen == 7) padLen = 0;
	        var bPad = '';
	        for (var i = 0; i < padLen; i++) bPad += '0';
	        b = bPad + b;
	        for (var i = 0; i < b.length - 1; i += 7) {
	            var b8 = b.substr(i, 7);
	            if (i != b.length - 7) b8 = '1' + b8;
	            h += itox(parseInt(b8, 2));
	        }
	        return h;
	    };

	    KJUR.asn1.DERObjectIdentifier.superclass.constructor.call(this);
	    this.hT = "06";

	    /**
	     * set value by a hexadecimal string
	     * @name setValueHex
	     * @memberOf KJUR.asn1.DERObjectIdentifier#
	     * @function
	     * @param {String} newHexString hexadecimal value of OID bytes
	     */
	    this.setValueHex = function(newHexString) {
	        this.hTLV = null;
	        this.isModified = true;
	        this.s = null;
	        this.hV = newHexString;
	    };

	    /**
	     * set value by a OID string<br/>
	     * @name setValueOidString
	     * @memberOf KJUR.asn1.DERObjectIdentifier#
	     * @function
	     * @param {String} oidString OID string (ex. 2.5.4.13)
	     * @example
	     * o = new KJUR.asn1.DERObjectIdentifier();
	     * o.setValueOidString("2.5.4.13");
	     */
	    this.setValueOidString = function(oidString) {
	        if (! oidString.match(/^[0-9.]+$/)) {
	            throw "malformed oid string: " + oidString;
	        }
	        var h = '';
	        var a = oidString.split('.');
	        var i0 = parseInt(a[0]) * 40 + parseInt(a[1]);
	        h += itox(i0);
	        a.splice(0, 2);
	        for (var i = 0; i < a.length; i++) {
	            h += roidtox(a[i]);
	        }
	        this.hTLV = null;
	        this.isModified = true;
	        this.s = null;
	        this.hV = h;
	    };

	    /**
	     * set value by a OID name
	     * @name setValueName
	     * @memberOf KJUR.asn1.DERObjectIdentifier#
	     * @function
	     * @param {String} oidName OID name (ex. 'serverAuth')
	     * @since 1.0.1
	     * @description
	     * OID name shall be defined in 'KJUR.asn1.x509.OID.name2oidList'.
	     * Otherwise raise error.
	     * @example
	     * o = new KJUR.asn1.DERObjectIdentifier();
	     * o.setValueName("serverAuth");
	     */
	    this.setValueName = function(oidName) {
	        var oid = KJUR.asn1.x509.OID.name2oid(oidName);
	        if (oid !== '') {
	            this.setValueOidString(oid);
	        } else {
	            throw "DERObjectIdentifier oidName undefined: " + oidName;
	        }
	    };

	    this.getFreshValueHex = function() {
	        return this.hV;
	    };

	    if (params !== undefined) {
	        if (typeof params === "string") {
	            if (params.match(/^[0-2].[0-9.]+$/)) {
	                this.setValueOidString(params);
	            } else {
	                this.setValueName(params);
	            }
	        } else if (params.oid !== undefined) {
	            this.setValueOidString(params.oid);
	        } else if (params.hex !== undefined) {
	            this.setValueHex(params.hex);
	        } else if (params.name !== undefined) {
	            this.setValueName(params.name);
	        }
	    }
	};
	YAHOO.lang.extend(KJUR.asn1.DERObjectIdentifier, KJUR.asn1.ASN1Object);

	// ********************************************************************
	/**
	 * class for ASN.1 DER Enumerated
	 * @name KJUR.asn1.DEREnumerated
	 * @class class for ASN.1 DER Enumerated
	 * @extends KJUR.asn1.ASN1Object
	 * @description
	 * <br/>
	 * As for argument 'params' for constructor, you can specify one of
	 * following properties:
	 * <ul>
	 * <li>int - specify initial ASN.1 value(V) by integer value</li>
	 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
	 * </ul>
	 * NOTE: 'params' can be omitted.
	 * @example
	 * new KJUR.asn1.DEREnumerated(123);
	 * new KJUR.asn1.DEREnumerated({int: 123});
	 * new KJUR.asn1.DEREnumerated({hex: '1fad'});
	 */
	KJUR.asn1.DEREnumerated = function(params) {
	    KJUR.asn1.DEREnumerated.superclass.constructor.call(this);
	    this.hT = "0a";

	    /**
	     * set value by Tom Wu's BigInteger object
	     * @name setByBigInteger
	     * @memberOf KJUR.asn1.DEREnumerated#
	     * @function
	     * @param {BigInteger} bigIntegerValue to set
	     */
	    this.setByBigInteger = function(bigIntegerValue) {
	        this.hTLV = null;
	        this.isModified = true;
	        this.hV = KJUR.asn1.ASN1Util.bigIntToMinTwosComplementsHex(bigIntegerValue);
	    };

	    /**
	     * set value by integer value
	     * @name setByInteger
	     * @memberOf KJUR.asn1.DEREnumerated#
	     * @function
	     * @param {Integer} integer value to set
	     */
	    this.setByInteger = function(intValue) {
	        var bi = new BigInteger(String(intValue), 10);
	        this.setByBigInteger(bi);
	    };

	    /**
	     * set value by integer value
	     * @name setValueHex
	     * @memberOf KJUR.asn1.DEREnumerated#
	     * @function
	     * @param {String} hexadecimal string of integer value
	     * @description
	     * <br/>
	     * NOTE: Value shall be represented by minimum octet length of
	     * two's complement representation.
	     */
	    this.setValueHex = function(newHexString) {
	        this.hV = newHexString;
	    };

	    this.getFreshValueHex = function() {
	        return this.hV;
	    };

	    if (typeof params != "undefined") {
	        if (typeof params['int'] != "undefined") {
	            this.setByInteger(params['int']);
	        } else if (typeof params == "number") {
	            this.setByInteger(params);
	        } else if (typeof params['hex'] != "undefined") {
	            this.setValueHex(params['hex']);
	        }
	    }
	};
	YAHOO.lang.extend(KJUR.asn1.DEREnumerated, KJUR.asn1.ASN1Object);

	// ********************************************************************
	/**
	 * class for ASN.1 DER UTF8String
	 * @name KJUR.asn1.DERUTF8String
	 * @class class for ASN.1 DER UTF8String
	 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
	 * @extends KJUR.asn1.DERAbstractString
	 * @description
	 * @see KJUR.asn1.DERAbstractString - superclass
	 */
	KJUR.asn1.DERUTF8String = function(params) {
	    KJUR.asn1.DERUTF8String.superclass.constructor.call(this, params);
	    this.hT = "0c";
	};
	YAHOO.lang.extend(KJUR.asn1.DERUTF8String, KJUR.asn1.DERAbstractString);

	// ********************************************************************
	/**
	 * class for ASN.1 DER NumericString
	 * @name KJUR.asn1.DERNumericString
	 * @class class for ASN.1 DER NumericString
	 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
	 * @extends KJUR.asn1.DERAbstractString
	 * @description
	 * @see KJUR.asn1.DERAbstractString - superclass
	 */
	KJUR.asn1.DERNumericString = function(params) {
	    KJUR.asn1.DERNumericString.superclass.constructor.call(this, params);
	    this.hT = "12";
	};
	YAHOO.lang.extend(KJUR.asn1.DERNumericString, KJUR.asn1.DERAbstractString);

	// ********************************************************************
	/**
	 * class for ASN.1 DER PrintableString
	 * @name KJUR.asn1.DERPrintableString
	 * @class class for ASN.1 DER PrintableString
	 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
	 * @extends KJUR.asn1.DERAbstractString
	 * @description
	 * @see KJUR.asn1.DERAbstractString - superclass
	 */
	KJUR.asn1.DERPrintableString = function(params) {
	    KJUR.asn1.DERPrintableString.superclass.constructor.call(this, params);
	    this.hT = "13";
	};
	YAHOO.lang.extend(KJUR.asn1.DERPrintableString, KJUR.asn1.DERAbstractString);

	// ********************************************************************
	/**
	 * class for ASN.1 DER TeletexString
	 * @name KJUR.asn1.DERTeletexString
	 * @class class for ASN.1 DER TeletexString
	 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
	 * @extends KJUR.asn1.DERAbstractString
	 * @description
	 * @see KJUR.asn1.DERAbstractString - superclass
	 */
	KJUR.asn1.DERTeletexString = function(params) {
	    KJUR.asn1.DERTeletexString.superclass.constructor.call(this, params);
	    this.hT = "14";
	};
	YAHOO.lang.extend(KJUR.asn1.DERTeletexString, KJUR.asn1.DERAbstractString);

	// ********************************************************************
	/**
	 * class for ASN.1 DER IA5String
	 * @name KJUR.asn1.DERIA5String
	 * @class class for ASN.1 DER IA5String
	 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
	 * @extends KJUR.asn1.DERAbstractString
	 * @description
	 * @see KJUR.asn1.DERAbstractString - superclass
	 */
	KJUR.asn1.DERIA5String = function(params) {
	    KJUR.asn1.DERIA5String.superclass.constructor.call(this, params);
	    this.hT = "16";
	};
	YAHOO.lang.extend(KJUR.asn1.DERIA5String, KJUR.asn1.DERAbstractString);

	// ********************************************************************
	/**
	 * class for ASN.1 DER UTCTime
	 * @name KJUR.asn1.DERUTCTime
	 * @class class for ASN.1 DER UTCTime
	 * @param {Array} params associative array of parameters (ex. {'str': '130430235959Z'})
	 * @extends KJUR.asn1.DERAbstractTime
	 * @description
	 * <br/>
	 * As for argument 'params' for constructor, you can specify one of
	 * following properties:
	 * <ul>
	 * <li>str - specify initial ASN.1 value(V) by a string (ex.'130430235959Z')</li>
	 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
	 * <li>date - specify Date object.</li>
	 * </ul>
	 * NOTE: 'params' can be omitted.
	 * <h4>EXAMPLES</h4>
	 * @example
	 * d1 = new KJUR.asn1.DERUTCTime();
	 * d1.setString('130430125959Z');
	 *
	 * d2 = new KJUR.asn1.DERUTCTime({'str': '130430125959Z'});
	 * d3 = new KJUR.asn1.DERUTCTime({'date': new Date(Date.UTC(2015, 0, 31, 0, 0, 0, 0))});
	 * d4 = new KJUR.asn1.DERUTCTime('130430125959Z');
	 */
	KJUR.asn1.DERUTCTime = function(params) {
	    KJUR.asn1.DERUTCTime.superclass.constructor.call(this, params);
	    this.hT = "17";

	    /**
	     * set value by a Date object<br/>
	     * @name setByDate
	     * @memberOf KJUR.asn1.DERUTCTime#
	     * @function
	     * @param {Date} dateObject Date object to set ASN.1 value(V)
	     * @example
	     * o = new KJUR.asn1.DERUTCTime();
	     * o.setByDate(new Date("2016/12/31"));
	     */
	    this.setByDate = function(dateObject) {
	        this.hTLV = null;
	        this.isModified = true;
	        this.date = dateObject;
	        this.s = this.formatDate(this.date, 'utc');
	        this.hV = stohex(this.s);
	    };

	    this.getFreshValueHex = function() {
	        if (typeof this.date == "undefined" && typeof this.s == "undefined") {
	            this.date = new Date();
	            this.s = this.formatDate(this.date, 'utc');
	            this.hV = stohex(this.s);
	        }
	        return this.hV;
	    };

	    if (params !== undefined) {
	        if (params.str !== undefined) {
	            this.setString(params.str);
	        } else if (typeof params == "string" && params.match(/^[0-9]{12}Z$/)) {
	            this.setString(params);
	        } else if (params.hex !== undefined) {
	            this.setStringHex(params.hex);
	        } else if (params.date !== undefined) {
	            this.setByDate(params.date);
	        }
	    }
	};
	YAHOO.lang.extend(KJUR.asn1.DERUTCTime, KJUR.asn1.DERAbstractTime);

	// ********************************************************************
	/**
	 * class for ASN.1 DER GeneralizedTime
	 * @name KJUR.asn1.DERGeneralizedTime
	 * @class class for ASN.1 DER GeneralizedTime
	 * @param {Array} params associative array of parameters (ex. {'str': '20130430235959Z'})
	 * @property {Boolean} withMillis flag to show milliseconds or not
	 * @extends KJUR.asn1.DERAbstractTime
	 * @description
	 * <br/>
	 * As for argument 'params' for constructor, you can specify one of
	 * following properties:
	 * <ul>
	 * <li>str - specify initial ASN.1 value(V) by a string (ex.'20130430235959Z')</li>
	 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
	 * <li>date - specify Date object.</li>
	 * <li>millis - specify flag to show milliseconds (from 1.0.6)</li>
	 * </ul>
	 * NOTE1: 'params' can be omitted.
	 * NOTE2: 'withMillis' property is supported from asn1 1.0.6.
	 */
	KJUR.asn1.DERGeneralizedTime = function(params) {
	    KJUR.asn1.DERGeneralizedTime.superclass.constructor.call(this, params);
	    this.hT = "18";
	    this.withMillis = false;

	    /**
	     * set value by a Date object
	     * @name setByDate
	     * @memberOf KJUR.asn1.DERGeneralizedTime#
	     * @function
	     * @param {Date} dateObject Date object to set ASN.1 value(V)
	     * @example
	     * When you specify UTC time, use 'Date.UTC' method like this:<br/>
	     * o1 = new DERUTCTime();
	     * o1.setByDate(date);
	     *
	     * date = new Date(Date.UTC(2015, 0, 31, 23, 59, 59, 0)); #2015JAN31 23:59:59
	     */
	    this.setByDate = function(dateObject) {
	        this.hTLV = null;
	        this.isModified = true;
	        this.date = dateObject;
	        this.s = this.formatDate(this.date, 'gen', this.withMillis);
	        this.hV = stohex(this.s);
	    };

	    this.getFreshValueHex = function() {
	        if (this.date === undefined && this.s === undefined) {
	            this.date = new Date();
	            this.s = this.formatDate(this.date, 'gen', this.withMillis);
	            this.hV = stohex(this.s);
	        }
	        return this.hV;
	    };

	    if (params !== undefined) {
	        if (params.str !== undefined) {
	            this.setString(params.str);
	        } else if (typeof params == "string" && params.match(/^[0-9]{14}Z$/)) {
	            this.setString(params);
	        } else if (params.hex !== undefined) {
	            this.setStringHex(params.hex);
	        } else if (params.date !== undefined) {
	            this.setByDate(params.date);
	        }
	        if (params.millis === true) {
	            this.withMillis = true;
	        }
	    }
	};
	YAHOO.lang.extend(KJUR.asn1.DERGeneralizedTime, KJUR.asn1.DERAbstractTime);

	// ********************************************************************
	/**
	 * class for ASN.1 DER Sequence
	 * @name KJUR.asn1.DERSequence
	 * @class class for ASN.1 DER Sequence
	 * @extends KJUR.asn1.DERAbstractStructured
	 * @description
	 * <br/>
	 * As for argument 'params' for constructor, you can specify one of
	 * following properties:
	 * <ul>
	 * <li>array - specify array of ASN1Object to set elements of content</li>
	 * </ul>
	 * NOTE: 'params' can be omitted.
	 */
	KJUR.asn1.DERSequence = function(params) {
	    KJUR.asn1.DERSequence.superclass.constructor.call(this, params);
	    this.hT = "30";
	    this.getFreshValueHex = function() {
	        var h = '';
	        for (var i = 0; i < this.asn1Array.length; i++) {
	            var asn1Obj = this.asn1Array[i];
	            h += asn1Obj.getEncodedHex();
	        }
	        this.hV = h;
	        return this.hV;
	    };
	};
	YAHOO.lang.extend(KJUR.asn1.DERSequence, KJUR.asn1.DERAbstractStructured);

	// ********************************************************************
	/**
	 * class for ASN.1 DER Set
	 * @name KJUR.asn1.DERSet
	 * @class class for ASN.1 DER Set
	 * @extends KJUR.asn1.DERAbstractStructured
	 * @description
	 * <br/>
	 * As for argument 'params' for constructor, you can specify one of
	 * following properties:
	 * <ul>
	 * <li>array - specify array of ASN1Object to set elements of content</li>
	 * <li>sortflag - flag for sort (default: true). ASN.1 BER is not sorted in 'SET OF'.</li>
	 * </ul>
	 * NOTE1: 'params' can be omitted.<br/>
	 * NOTE2: sortflag is supported since 1.0.5.
	 */
	KJUR.asn1.DERSet = function(params) {
	    KJUR.asn1.DERSet.superclass.constructor.call(this, params);
	    this.hT = "31";
	    this.sortFlag = true; // item shall be sorted only in ASN.1 DER
	    this.getFreshValueHex = function() {
	        var a = new Array();
	        for (var i = 0; i < this.asn1Array.length; i++) {
	            var asn1Obj = this.asn1Array[i];
	            a.push(asn1Obj.getEncodedHex());
	        }
	        if (this.sortFlag == true) a.sort();
	        this.hV = a.join('');
	        return this.hV;
	    };

	    if (typeof params != "undefined") {
	        if (typeof params.sortflag != "undefined" &&
	            params.sortflag == false)
	            this.sortFlag = false;
	    }
	};
	YAHOO.lang.extend(KJUR.asn1.DERSet, KJUR.asn1.DERAbstractStructured);

	// ********************************************************************
	/**
	 * class for ASN.1 DER TaggedObject
	 * @name KJUR.asn1.DERTaggedObject
	 * @class class for ASN.1 DER TaggedObject
	 * @extends KJUR.asn1.ASN1Object
	 * @description
	 * <br/>
	 * Parameter 'tagNoNex' is ASN.1 tag(T) value for this object.
	 * For example, if you find '[1]' tag in a ASN.1 dump,
	 * 'tagNoHex' will be 'a1'.
	 * <br/>
	 * As for optional argument 'params' for constructor, you can specify *ANY* of
	 * following properties:
	 * <ul>
	 * <li>explicit - specify true if this is explicit tag otherwise false
	 *     (default is 'true').</li>
	 * <li>tag - specify tag (default is 'a0' which means [0])</li>
	 * <li>obj - specify ASN1Object which is tagged</li>
	 * </ul>
	 * @example
	 * d1 = new KJUR.asn1.DERUTF8String({'str':'a'});
	 * d2 = new KJUR.asn1.DERTaggedObject({'obj': d1});
	 * hex = d2.getEncodedHex();
	 */
	KJUR.asn1.DERTaggedObject = function(params) {
	    KJUR.asn1.DERTaggedObject.superclass.constructor.call(this);
	    this.hT = "a0";
	    this.hV = '';
	    this.isExplicit = true;
	    this.asn1Object = null;

	    /**
	     * set value by an ASN1Object
	     * @name setString
	     * @memberOf KJUR.asn1.DERTaggedObject#
	     * @function
	     * @param {Boolean} isExplicitFlag flag for explicit/implicit tag
	     * @param {Integer} tagNoHex hexadecimal string of ASN.1 tag
	     * @param {ASN1Object} asn1Object ASN.1 to encapsulate
	     */
	    this.setASN1Object = function(isExplicitFlag, tagNoHex, asn1Object) {
	        this.hT = tagNoHex;
	        this.isExplicit = isExplicitFlag;
	        this.asn1Object = asn1Object;
	        if (this.isExplicit) {
	            this.hV = this.asn1Object.getEncodedHex();
	            this.hTLV = null;
	            this.isModified = true;
	        } else {
	            this.hV = null;
	            this.hTLV = asn1Object.getEncodedHex();
	            this.hTLV = this.hTLV.replace(/^../, tagNoHex);
	            this.isModified = false;
	        }
	    };

	    this.getFreshValueHex = function() {
	        return this.hV;
	    };

	    if (typeof params != "undefined") {
	        if (typeof params['tag'] != "undefined") {
	            this.hT = params['tag'];
	        }
	        if (typeof params['explicit'] != "undefined") {
	            this.isExplicit = params['explicit'];
	        }
	        if (typeof params['obj'] != "undefined") {
	            this.asn1Object = params['obj'];
	            this.setASN1Object(this.isExplicit, this.hT, this.asn1Object);
	        }
	    }
	};
	YAHOO.lang.extend(KJUR.asn1.DERTaggedObject, KJUR.asn1.ASN1Object);

	/**
	 * Create a new JSEncryptRSAKey that extends Tom Wu's RSA key object.
	 * This object is just a decorator for parsing the key parameter
	 * @param {string|Object} key - The key in string format, or an object containing
	 * the parameters needed to build a RSAKey object.
	 * @constructor
	 */
	var JSEncryptRSAKey = /** @class */ (function (_super) {
	    __extends(JSEncryptRSAKey, _super);
	    function JSEncryptRSAKey(key) {
	        var _this = _super.call(this) || this;
	        // Call the super constructor.
	        //  RSAKey.call(this);
	        // If a key key was provided.
	        if (key) {
	            // If this is a string...
	            if (typeof key === "string") {
	                _this.parseKey(key);
	            }
	            else if (JSEncryptRSAKey.hasPrivateKeyProperty(key) ||
	                JSEncryptRSAKey.hasPublicKeyProperty(key)) {
	                // Set the values for the key.
	                _this.parsePropertiesFrom(key);
	            }
	        }
	        return _this;
	    }
	    /**
	     * Method to parse a pem encoded string containing both a public or private key.
	     * The method will translate the pem encoded string in a der encoded string and
	     * will parse private key and public key parameters. This method accepts public key
	     * in the rsaencryption pkcs #1 format (oid: 1.2.840.113549.1.1.1).
	     *
	     * @todo Check how many rsa formats use the same format of pkcs #1.
	     *
	     * The format is defined as:
	     * PublicKeyInfo ::= SEQUENCE {
	     *   algorithm       AlgorithmIdentifier,
	     *   PublicKey       BIT STRING
	     * }
	     * Where AlgorithmIdentifier is:
	     * AlgorithmIdentifier ::= SEQUENCE {
	     *   algorithm       OBJECT IDENTIFIER,     the OID of the enc algorithm
	     *   parameters      ANY DEFINED BY algorithm OPTIONAL (NULL for PKCS #1)
	     * }
	     * and PublicKey is a SEQUENCE encapsulated in a BIT STRING
	     * RSAPublicKey ::= SEQUENCE {
	     *   modulus           INTEGER,  -- n
	     *   publicExponent    INTEGER   -- e
	     * }
	     * it's possible to examine the structure of the keys obtained from openssl using
	     * an asn.1 dumper as the one used here to parse the components: http://lapo.it/asn1js/
	     * @argument {string} pem the pem encoded string, can include the BEGIN/END header/footer
	     * @private
	     */
	    JSEncryptRSAKey.prototype.parseKey = function (pem) {
	        try {
	            var modulus = 0;
	            var public_exponent = 0;
	            var reHex = /^\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\s*)+$/;
	            var der = reHex.test(pem) ? Hex.decode(pem) : Base64.unarmor(pem);
	            var asn1 = ASN1.decode(der);
	            // Fixes a bug with OpenSSL 1.0+ private keys
	            if (asn1.sub.length === 3) {
	                asn1 = asn1.sub[2].sub[0];
	            }
	            if (asn1.sub.length === 9) {
	                // Parse the private key.
	                modulus = asn1.sub[1].getHexStringValue(); // bigint
	                this.n = parseBigInt(modulus, 16);
	                public_exponent = asn1.sub[2].getHexStringValue(); // int
	                this.e = parseInt(public_exponent, 16);
	                var private_exponent = asn1.sub[3].getHexStringValue(); // bigint
	                this.d = parseBigInt(private_exponent, 16);
	                var prime1 = asn1.sub[4].getHexStringValue(); // bigint
	                this.p = parseBigInt(prime1, 16);
	                var prime2 = asn1.sub[5].getHexStringValue(); // bigint
	                this.q = parseBigInt(prime2, 16);
	                var exponent1 = asn1.sub[6].getHexStringValue(); // bigint
	                this.dmp1 = parseBigInt(exponent1, 16);
	                var exponent2 = asn1.sub[7].getHexStringValue(); // bigint
	                this.dmq1 = parseBigInt(exponent2, 16);
	                var coefficient = asn1.sub[8].getHexStringValue(); // bigint
	                this.coeff = parseBigInt(coefficient, 16);
	            }
	            else if (asn1.sub.length === 2) {
	                // Parse the public key.
	                var bit_string = asn1.sub[1];
	                var sequence = bit_string.sub[0];
	                modulus = sequence.sub[0].getHexStringValue();
	                this.n = parseBigInt(modulus, 16);
	                public_exponent = sequence.sub[1].getHexStringValue();
	                this.e = parseInt(public_exponent, 16);
	            }
	            else {
	                return false;
	            }
	            return true;
	        }
	        catch (ex) {
	            return false;
	        }
	    };
	    /**
	     * Translate rsa parameters in a hex encoded string representing the rsa key.
	     *
	     * The translation follow the ASN.1 notation :
	     * RSAPrivateKey ::= SEQUENCE {
	     *   version           Version,
	     *   modulus           INTEGER,  -- n
	     *   publicExponent    INTEGER,  -- e
	     *   privateExponent   INTEGER,  -- d
	     *   prime1            INTEGER,  -- p
	     *   prime2            INTEGER,  -- q
	     *   exponent1         INTEGER,  -- d mod (p1)
	     *   exponent2         INTEGER,  -- d mod (q-1)
	     *   coefficient       INTEGER,  -- (inverse of q) mod p
	     * }
	     * @returns {string}  DER Encoded String representing the rsa private key
	     * @private
	     */
	    JSEncryptRSAKey.prototype.getPrivateBaseKey = function () {
	        var options = {
	            array: [
	                new KJUR.asn1.DERInteger({ int: 0 }),
	                new KJUR.asn1.DERInteger({ bigint: this.n }),
	                new KJUR.asn1.DERInteger({ int: this.e }),
	                new KJUR.asn1.DERInteger({ bigint: this.d }),
	                new KJUR.asn1.DERInteger({ bigint: this.p }),
	                new KJUR.asn1.DERInteger({ bigint: this.q }),
	                new KJUR.asn1.DERInteger({ bigint: this.dmp1 }),
	                new KJUR.asn1.DERInteger({ bigint: this.dmq1 }),
	                new KJUR.asn1.DERInteger({ bigint: this.coeff })
	            ]
	        };
	        var seq = new KJUR.asn1.DERSequence(options);
	        return seq.getEncodedHex();
	    };
	    /**
	     * base64 (pem) encoded version of the DER encoded representation
	     * @returns {string} pem encoded representation without header and footer
	     * @public
	     */
	    JSEncryptRSAKey.prototype.getPrivateBaseKeyB64 = function () {
	        return hex2b64(this.getPrivateBaseKey());
	    };
	    /**
	     * Translate rsa parameters in a hex encoded string representing the rsa public key.
	     * The representation follow the ASN.1 notation :
	     * PublicKeyInfo ::= SEQUENCE {
	     *   algorithm       AlgorithmIdentifier,
	     *   PublicKey       BIT STRING
	     * }
	     * Where AlgorithmIdentifier is:
	     * AlgorithmIdentifier ::= SEQUENCE {
	     *   algorithm       OBJECT IDENTIFIER,     the OID of the enc algorithm
	     *   parameters      ANY DEFINED BY algorithm OPTIONAL (NULL for PKCS #1)
	     * }
	     * and PublicKey is a SEQUENCE encapsulated in a BIT STRING
	     * RSAPublicKey ::= SEQUENCE {
	     *   modulus           INTEGER,  -- n
	     *   publicExponent    INTEGER   -- e
	     * }
	     * @returns {string} DER Encoded String representing the rsa public key
	     * @private
	     */
	    JSEncryptRSAKey.prototype.getPublicBaseKey = function () {
	        var first_sequence = new KJUR.asn1.DERSequence({
	            array: [
	                new KJUR.asn1.DERObjectIdentifier({ oid: "1.2.840.113549.1.1.1" }),
	                new KJUR.asn1.DERNull()
	            ]
	        });
	        var second_sequence = new KJUR.asn1.DERSequence({
	            array: [
	                new KJUR.asn1.DERInteger({ bigint: this.n }),
	                new KJUR.asn1.DERInteger({ int: this.e })
	            ]
	        });
	        var bit_string = new KJUR.asn1.DERBitString({
	            hex: "00" + second_sequence.getEncodedHex()
	        });
	        var seq = new KJUR.asn1.DERSequence({
	            array: [
	                first_sequence,
	                bit_string
	            ]
	        });
	        return seq.getEncodedHex();
	    };
	    /**
	     * base64 (pem) encoded version of the DER encoded representation
	     * @returns {string} pem encoded representation without header and footer
	     * @public
	     */
	    JSEncryptRSAKey.prototype.getPublicBaseKeyB64 = function () {
	        return hex2b64(this.getPublicBaseKey());
	    };
	    /**
	     * wrap the string in block of width chars. The default value for rsa keys is 64
	     * characters.
	     * @param {string} str the pem encoded string without header and footer
	     * @param {Number} [width=64] - the length the string has to be wrapped at
	     * @returns {string}
	     * @private
	     */
	    JSEncryptRSAKey.wordwrap = function (str, width) {
	        width = width || 64;
	        if (!str) {
	            return str;
	        }
	        var regex = "(.{1," + width + "})( +|$\n?)|(.{1," + width + "})";
	        return str.match(RegExp(regex, "g")).join("\n");
	    };
	    /**
	     * Retrieve the pem encoded private key
	     * @returns {string} the pem encoded private key with header/footer
	     * @public
	     */
	    JSEncryptRSAKey.prototype.getPrivateKey = function () {
	        var key = "-----BEGIN RSA PRIVATE KEY-----\n";
	        key += JSEncryptRSAKey.wordwrap(this.getPrivateBaseKeyB64()) + "\n";
	        key += "-----END RSA PRIVATE KEY-----";
	        return key;
	    };
	    /**
	     * Retrieve the pem encoded public key
	     * @returns {string} the pem encoded public key with header/footer
	     * @public
	     */
	    JSEncryptRSAKey.prototype.getPublicKey = function () {
	        var key = "-----BEGIN PUBLIC KEY-----\n";
	        key += JSEncryptRSAKey.wordwrap(this.getPublicBaseKeyB64()) + "\n";
	        key += "-----END PUBLIC KEY-----";
	        return key;
	    };
	    /**
	     * Check if the object contains the necessary parameters to populate the rsa modulus
	     * and public exponent parameters.
	     * @param {Object} [obj={}] - An object that may contain the two public key
	     * parameters
	     * @returns {boolean} true if the object contains both the modulus and the public exponent
	     * properties (n and e)
	     * @todo check for types of n and e. N should be a parseable bigInt object, E should
	     * be a parseable integer number
	     * @private
	     */
	    JSEncryptRSAKey.hasPublicKeyProperty = function (obj) {
	        obj = obj || {};
	        return (obj.hasOwnProperty("n") &&
	            obj.hasOwnProperty("e"));
	    };
	    /**
	     * Check if the object contains ALL the parameters of an RSA key.
	     * @param {Object} [obj={}] - An object that may contain nine rsa key
	     * parameters
	     * @returns {boolean} true if the object contains all the parameters needed
	     * @todo check for types of the parameters all the parameters but the public exponent
	     * should be parseable bigint objects, the public exponent should be a parseable integer number
	     * @private
	     */
	    JSEncryptRSAKey.hasPrivateKeyProperty = function (obj) {
	        obj = obj || {};
	        return (obj.hasOwnProperty("n") &&
	            obj.hasOwnProperty("e") &&
	            obj.hasOwnProperty("d") &&
	            obj.hasOwnProperty("p") &&
	            obj.hasOwnProperty("q") &&
	            obj.hasOwnProperty("dmp1") &&
	            obj.hasOwnProperty("dmq1") &&
	            obj.hasOwnProperty("coeff"));
	    };
	    /**
	     * Parse the properties of obj in the current rsa object. Obj should AT LEAST
	     * include the modulus and public exponent (n, e) parameters.
	     * @param {Object} obj - the object containing rsa parameters
	     * @private
	     */
	    JSEncryptRSAKey.prototype.parsePropertiesFrom = function (obj) {
	        this.n = obj.n;
	        this.e = obj.e;
	        if (obj.hasOwnProperty("d")) {
	            this.d = obj.d;
	            this.p = obj.p;
	            this.q = obj.q;
	            this.dmp1 = obj.dmp1;
	            this.dmq1 = obj.dmq1;
	            this.coeff = obj.coeff;
	        }
	    };
	    return JSEncryptRSAKey;
	}(RSAKey));

	/**
	 *
	 * @param {Object} [options = {}] - An object to customize JSEncrypt behaviour
	 * possible parameters are:
	 * - default_key_size        {number}  default: 1024 the key size in bit
	 * - default_public_exponent {string}  default: '010001' the hexadecimal representation of the public exponent
	 * - log                     {boolean} default: false whether log warn/error or not
	 * @constructor
	 */
	var JSEncrypt = /** @class */ (function () {
	    function JSEncrypt(options) {
	        options = options || {};
	        this.default_key_size = parseInt(options.default_key_size, 10) || 1024;
	        this.default_public_exponent = options.default_public_exponent || "010001"; // 65537 default openssl public exponent for rsa key type
	        this.log = options.log || false;
	        // The private and public key.
	        this.key = null;
	    }
	    /**
	     * Method to set the rsa key parameter (one method is enough to set both the public
	     * and the private key, since the private key contains the public key paramenters)
	     * Log a warning if logs are enabled
	     * @param {Object|string} key the pem encoded string or an object (with or without header/footer)
	     * @public
	     */
	    JSEncrypt.prototype.setKey = function (key) {
	        if (this.log && this.key) {
	            console.warn("A key was already set, overriding existing.");
	        }
	        this.key = new JSEncryptRSAKey(key);
	    };
	    /**
	     * Proxy method for setKey, for api compatibility
	     * @see setKey
	     * @public
	     */
	    JSEncrypt.prototype.setPrivateKey = function (privkey) {
	        // Create the key.
	        this.setKey(privkey);
	    };
	    /**
	     * Proxy method for setKey, for api compatibility
	     * @see setKey
	     * @public
	     */
	    JSEncrypt.prototype.setPublicKey = function (pubkey) {
	        // Sets the public key.
	        this.setKey(pubkey);
	    };
	    /**
	     * Proxy method for RSAKey object's decrypt, decrypt the string using the private
	     * components of the rsa key object. Note that if the object was not set will be created
	     * on the fly (by the getKey method) using the parameters passed in the JSEncrypt constructor
	     * @param {string} str base64 encoded crypted string to decrypt
	     * @return {string} the decrypted string
	     * @public
	     */
	    JSEncrypt.prototype.decrypt = function (str) {
	        // Return the decrypted string.
	        try {
	            return this.getKey().decrypt(b64tohex(str));
	        }
	        catch (ex) {
	            return false;
	        }
	    };
	    /**
	     * Proxy method for RSAKey object's encrypt, encrypt the string using the public
	     * components of the rsa key object. Note that if the object was not set will be created
	     * on the fly (by the getKey method) using the parameters passed in the JSEncrypt constructor
	     * @param {string} str the string to encrypt
	     * @return {string} the encrypted string encoded in base64
	     * @public
	     */
	    JSEncrypt.prototype.encrypt = function (str) {
	        // Return the encrypted string.
	        try {
	            return hex2b64(this.getKey().encrypt(str));
	        }
	        catch (ex) {
	            return false;
	        }
	    };
	    /**
	     * Proxy method for RSAKey object's sign.
	     * @param {string} str the string to sign
	     * @param {function} digestMethod hash method
	     * @param {string} digestName the name of the hash algorithm
	     * @return {string} the signature encoded in base64
	     * @public
	     */
	    JSEncrypt.prototype.sign = function (str, digestMethod, digestName) {
	        // return the RSA signature of 'str' in 'hex' format.
	        try {
	            return hex2b64(this.getKey().sign(str, digestMethod, digestName));
	        }
	        catch (ex) {
	            return false;
	        }
	    };
	    /**
	     * Proxy method for RSAKey object's verify.
	     * @param {string} str the string to verify
	     * @param {string} signature the signature encoded in base64 to compare the string to
	     * @param {function} digestMethod hash method
	     * @return {boolean} whether the data and signature match
	     * @public
	     */
	    JSEncrypt.prototype.verify = function (str, signature, digestMethod) {
	        // Return the decrypted 'digest' of the signature.
	        try {
	            return this.getKey().verify(str, b64tohex(signature), digestMethod);
	        }
	        catch (ex) {
	            return false;
	        }
	    };
	    /**
	     * Getter for the current JSEncryptRSAKey object. If it doesn't exists a new object
	     * will be created and returned
	     * @param {callback} [cb] the callback to be called if we want the key to be generated
	     * in an async fashion
	     * @returns {JSEncryptRSAKey} the JSEncryptRSAKey object
	     * @public
	     */
	    JSEncrypt.prototype.getKey = function (cb) {
	        // Only create new if it does not exist.
	        if (!this.key) {
	            // Get a new private key.
	            this.key = new JSEncryptRSAKey();
	            if (cb && {}.toString.call(cb) === "[object Function]") {
	                this.key.generateAsync(this.default_key_size, this.default_public_exponent, cb);
	                return;
	            }
	            // Generate the key.
	            this.key.generate(this.default_key_size, this.default_public_exponent);
	        }
	        return this.key;
	    };
	    /**
	     * Returns the pem encoded representation of the private key
	     * If the key doesn't exists a new key will be created
	     * @returns {string} pem encoded representation of the private key WITH header and footer
	     * @public
	     */
	    JSEncrypt.prototype.getPrivateKey = function () {
	        // Return the private representation of this key.
	        return this.getKey().getPrivateKey();
	    };
	    /**
	     * Returns the pem encoded representation of the private key
	     * If the key doesn't exists a new key will be created
	     * @returns {string} pem encoded representation of the private key WITHOUT header and footer
	     * @public
	     */
	    JSEncrypt.prototype.getPrivateKeyB64 = function () {
	        // Return the private representation of this key.
	        return this.getKey().getPrivateBaseKeyB64();
	    };
	    /**
	     * Returns the pem encoded representation of the public key
	     * If the key doesn't exists a new key will be created
	     * @returns {string} pem encoded representation of the public key WITH header and footer
	     * @public
	     */
	    JSEncrypt.prototype.getPublicKey = function () {
	        // Return the private representation of this key.
	        return this.getKey().getPublicKey();
	    };
	    /**
	     * Returns the pem encoded representation of the public key
	     * If the key doesn't exists a new key will be created
	     * @returns {string} pem encoded representation of the public key WITHOUT header and footer
	     * @public
	     */
	    JSEncrypt.prototype.getPublicKeyB64 = function () {
	        // Return the private representation of this key.
	        return this.getKey().getPublicBaseKeyB64();
	    };
	    JSEncrypt.version = "3.0.0-rc.1";
	    return JSEncrypt;
	}());

	window.JSEncrypt = JSEncrypt;

	exports.JSEncrypt = JSEncrypt;
	exports.default = JSEncrypt;

	Object.defineProperty(exports, '__esModule', { value: true });

	})));
	});

	var JSEncrypt = unwrapExports(jsencrypt);

	/**
	 * @description 处理客户端登陆、登出、保活。版本相关逻辑
	 * @author 178730 <jin_cong2@dahuatech.com>
	 * @date 2021-04-27
	 */
	const encrypt = new JSEncrypt();
	var account = {
	    /**
	     * @description 心跳
	     */
	    heartbeat() {
	        const config = this.config;
	        const { loginIp, userCode } = config;
	        this.postMessage('heartbeat', {
	            loginIp,
	            userCode
	        });
	    },
	    /**
	     * @description 登录客户端
	     */
	    loginClient() {
	        this.loginEnd = false;
	        this.loginStartTime = Date.now();
	        console.log(`ws-this.loginStartTime-${this.loginStartTime}`);
	        const config = this.config;
	        console.log('ws-config', config);
	        let { loginIp, userCode, token, loginPort, userName, userPwd, https, browser: { name, version, platform } } = config;
	        // token登陆的username通过token截取
	        // if(token && token.split('_')[0]) {
	        // 	userName = token.split('_')[0];
	        // }
	        // 登陆确保有用户名+token/pwd
	        if (!(userName && (token || userPwd))) {
	            this.loginEnd = true;
	            return false;
	        }
	        if (typeof https === 'undefined') {
	            if (location.protocol === 'http:') {
	                https = Number(0);
	            }
	            else if (location.protocol === 'https:') {
	                https = 1;
	            }
	            else {
	                https = -1;
	            }
	        }
	        encrypt.setPublicKey(this.publicKey);
	        const params = {
	            loginIp,
	            params: {
	                loginPort,
	                token: token ? token : '',
	                userPwd: token ? '' : encrypt.encrypt(userPwd),
	                userName,
	                https,
	                browser: name,
	                version,
	                platform
	            },
	            userCode
	        };
	        // 心跳保活
	        this._heartbeat();
	        this.postMessage('login', params);
	    },
	    /**
	     * @description 登出客户端
	     */
	    logoutClient() {
	        const config = this.config;
	        const { loginIp, userCode } = config;
	        // 清除保活
	        clearTimeout(this.heartbeatTimer);
	        this.postMessage('logout', {
	            loginIp,
	            userCode
	        });
	        this.config.userName = "";
	    },
	    /**
	     * @description 获取客户端版本
	     */
	    getVersion() {
	        this.getVersionStartTime = Date.now();
	        const config = this.config;
	        const { loginIp, userCode } = config;
	        this.postMessage('getVersion', {
	            loginIp,
	            userCode
	        });
	    },
	};

	/**
	 * @description 处理浏览器位置和DOM对象方法
	 * @author 178730 <jin_cong2@dahuatech.com>
	 * @date 2021-04-27
	 */
	/**
	 * @description 检测浏览器缩放比例
	 */
	function detectZoom() {
	    var ratio = 0, screen = window.screen, ua = navigator.userAgent.toLowerCase();
	    if (window.devicePixelRatio !== undefined) {
	        ratio = window.devicePixelRatio;
	    }
	    else if (~ua.indexOf('msie')) {
	        if (screen['deviceXDPI'] && screen['logicalXDPI']) {
	            ratio = screen['deviceXDPI'] / screen['logicalXDPI'];
	        }
	    }
	    else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
	        ratio = window.outerWidth / window.innerWidth;
	    }
	    if (ratio) {
	        ratio = Math.round(ratio * 100);
	    }
	    return ratio;
	}
	/**
	 * @description 检测浏览器是否有Y轴滚动条
	 */
	function hasScrollbarY() {
	    return (getDocument().body.scrollHeight >
	        (window.innerHeight || getDocument().documentElement.clientHeight));
	}
	/**
	 * @description 检测浏览器是否有X轴滚动条
	 */
	function hasScrollbarX() {
	    return (getDocument().body.scrollWidth >
	        (window.innerWidth || getDocument().documentElement.clientWidth));
	}
	/**
	 * @description 获取浏览器滚动条宽度
	 */
	function getScrollbarWidth() {
	    var scrollDiv = getDocument().createElement('div');
	    scrollDiv.style.cssText =
	        'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
	    getDocument().body.appendChild(scrollDiv);
	    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
	    getDocument().body.removeChild(scrollDiv);
	    return scrollbarWidth;
	}
	/**
	 * @description 获取当前浏览器缩放和滚动条信息
	 */
	function getScrollInfo() {
	    let ratio = detectZoom();
	    let scrollX = window.pageXOffset;
	    let scrollY = window.pageYOffset;
	    var hasscrollbary = hasScrollbarY();
	    var hasscrollbarx = hasScrollbarX();
	    var scrollbarWidth = getScrollbarWidth();
	    let scrollXH = hasscrollbarx ? scrollbarWidth : 0;
	    let scrollYW = hasscrollbary ? scrollbarWidth : 0;
	    return { ratio, scrollX, scrollY, scrollXH, scrollYW };
	}
	/**
	 * @description 根据domId检测Dom是否有宽和高的属性
	 * @param {Obeject} domId 元素ID
	 */
	function checkDomExit(domId, log = true) {
	    let defaultDomInfo = {
	        x: 0,
	        y: 0,
	        width: 0,
	        height: 0
	    };
	    const domTarget = getDocument().getElementById(domId);
	    if (!domTarget) {
	        log && console.log(`ws-can not find dom by id ${domId}`);
	        return defaultDomInfo;
	    }
	    const domInfo = (domTarget.getClientRects() && domTarget.getClientRects()[0]);
	    if (!domInfo) { // 若找不到DOM元素，报错
	        log && console.warn(`ws-can not find domInfo by id ${domId}, please check dom exited`);
	        return defaultDomInfo;
	    }
	    return domInfo;
	}
	/**
	 * @description 判断当前是否在iframe之中
	 */
	function isIframe() {
	    return self.frameElement && self.frameElement.tagName == "IFRAME";
	}
	/**
	 * @description 获取当前的document对象，兼容iframe处理
	 * 存在iframe，实例在top，目标窗口在子层，需要级联
	 */
	function getDocument() {
	    let _document = window.document;
	    // 判断是否在iframe里面
	    if (isIframe()) {
	        // 存在navigator
	        if (top['$nav']) {
	            // 通过navigator获取dom
	            const iframe = top['$nav'].getIframeByPath();
	            if (iframe) {
	                _document = iframe.contentWindow.document;
	            }
	            else {
	                console.log('在iframe中且没有@psi/navigator');
	            }
	        }
	        else {
	            // iframe嵌入，且没有@psi/navigator
	            console.log('在iframe中且没有@psi/navigator');
	        }
	    }
	    return _document;
	}
	/**
	 * @description 通过元素ID获取DOM对象
	 * @param {Obeject} domId 元素ID
	 */
	function getDomById(domId) {
	    console.log('ws-getDomById', domId);
	    const domInfo = checkDomExit(domId);
	    const width = domInfo.width;
	    const height = domInfo.height;
	    let x = domInfo.x;
	    let y = domInfo.y;
	    if (isIframe()) {
	        console.log('dom in iframe');
	        if (top['$nav']) {
	            // 通过navigator获取dom
	            const iframe = top['$nav'].getIframeByPath();
	            if (iframe) {
	                let iframeRect = iframe.getClientRects();
	                if (iframeRect && iframeRect[0]) {
	                    x += iframeRect[0].x;
	                    y += iframeRect[0].y;
	                }
	            }
	        }
	        else {
	            console.log('在iframe中且没有@psi/navigator');
	            let iframeRect = self.frameElement.getClientRects();
	            if (iframeRect && iframeRect[0]) {
	                x += iframeRect[0].x;
	                y += iframeRect[0].y;
	            }
	        }
	    }
	    return {
	        width,
	        height,
	        x,
	        y
	    };
	}

	var control = {
	    /**
	     * @description 提交浏览器信息
	     */
	    browserInfo() {
	        const config = this.config;
	        const { loginIp, userCode } = config;
	        const { browser: { name, version, platform } } = config;
	        this.postMessage('browserInfo', {
	            loginIp,
	            userCode,
	            params: {
	                browser: name,
	                version,
	                platform
	            }
	        });
	    },
	    /**
	     * @description 浏览器切换显隐
	     */
	    webVisibilityChange() {
	        const config = this.config;
	        const { loginIp, userCode } = config;
	        this.postMessage('webVisibilityChange', {
	            loginIp,
	            userCode,
	            params: {
	                hidden: getDocument().hidden
	            }
	        });
	    },
	    /**
	     * @description 受信任站点
	     */
	    trusteSite(http) {
	        console.log('ws-trusteSite-http', http);
	        const config = this.config;
	        const { loginIp, userCode } = config;
	        this.postMessage('trusteSite', {
	            loginIp,
	            userCode,
	            params: {
	                trusteSite: http
	            }
	        });
	    },
	    /**
	     * @description 设置下载路径
	     * @params {String} path 下载路径地址
	     */
	    setDownloadPath(path) {
	        const config = this.config;
	        const { loginIp, userCode } = config;
	        return this.postMessage('setDownloadPath', {
	            loginIp,
	            userCode,
	            params: {
	                downloadPath: path
	            }
	        });
	    },
	    /**
	     * @description 下载视频
	     * @params {Array} downloads 下载录像参数
	     * {
	            channelName: '11111',
	            channelId: '1DSNHDHF654DS',
	            beginTime: 1602559308127,
	            endTime: 1602559308227,
	            format: 1,
	            sourceType: 1,
	            streamType: 1
	        }
	     * @params {Boolean} visible 是否显示下载窗口
	     */
	    downloadVideo(downloads, visible) {
	        const config = this.config;
	        const { loginIp, userCode } = config;
	        return this.postMessage('downloadVideo', {
	            loginIp,
	            userCode,
	            params: {
	                array: downloads,
	                visible: visible
	            }
	        });
	    },
	    /**
	     * @description 创建控件
	     *
	     * @param {Array} documents
	     * {
	     *  array: [{
	     *     ctrlCode: '11',
	     * 	   ctrlType: 'playerCtrl'
	     * }]
	     * }
	     */
	    createCtrl(widgets) {
	        console.log('ws-createCtrl', widgets);
	        const _this = this;
	        const config = this.config;
	        const { loginIp, userCode } = config;
	        let widgetParams = [];
	        if (widgets.length === 0) {
	            console.error('param widget must has a ctrlCode.');
	            return false;
	        }
	        widgets.forEach(item => {
	            if (_this.ids.includes(item.ctrlCode)) {
	                _this.destroyCtrl([item.ctrlCode]);
	            }
	            let widgetParam = {};
	            const { ctrlType, ctrlCode, ctrlProperty, visible, cutList, domId } = item;
	            const domTarget = getDocument().getElementById(domId);
	            if (!domTarget) {
	                console.warn(`can not find dom by id ${domId}`);
	                // throw new Error(`can not find dom by id ${domId}`);
	            }
	            let domInfo = getDomById(domId);
	            let scrollInfo = getScrollInfo();
	            // 停止观测
	            // observer.disconnect();
	            widgetParam['ctrlType'] = ctrlType;
	            widgetParam['visible'] = visible;
	            widgetParam['ctrlCode'] = ctrlCode;
	            widgetParam['ctrlProperty'] = ctrlProperty;
	            widgetParam['cutList'] = cutList;
	            widgetParam['posX'] = domInfo.x;
	            widgetParam['posY'] = domInfo.y;
	            widgetParam['width'] = domInfo.width;
	            widgetParam['height'] = domInfo.height;
	            widgetParam['ratio'] = scrollInfo.ratio;
	            widgetParam['scrollX'] = scrollInfo.scrollX;
	            widgetParam['scrollY'] = scrollInfo.scrollY;
	            widgetParam['scrollXH'] = scrollInfo.scrollXH;
	            widgetParam['scrollYW'] = scrollInfo.scrollYW;
	            // widgetParam['observer'] = observer;
	            widgetParam['domId'] = domId;
	            // widgetParam['domTarget'] = domTarget;
	            widgetParams.push(widgetParam);
	            _this.ctrls.push(widgetParam);
	            _this.ids.push(ctrlCode);
	        });
	        return this.postMessage('createCtrl', {
	            // todo 回退uuidmap/ctrls处理
	            loginIp,
	            userCode,
	            params: {
	                array: widgetParams
	            }
	        });
	    },
	    /**
	     * @description 设置可见
	     *
	     * @param {Array} ctrls
	     * {
	     *  array: [{
	     *      ctrlCode: "bf662065-3bda-4cb7-8fdd-b6e13997d84f"
	     *		visible: true
	     * }]
	     * }
	     */
	    setCtrlVisible(ctrls) {
	        const _this = this;
	        const config = this.config;
	        const { loginIp, userCode } = config;
	        let ctrlParams = [];
	        if (ctrls.length === 0) {
	            return false;
	        }
	        ctrls.forEach(item => {
	            const ctrlParam = {};
	            if (!_this.ids.includes(item.ctrlCode)) {
	                return false;
	            }
	            const ctrl = _this.ctrls.find((ctrl) => {
	                return ctrl.ctrlCode === item.ctrlCode;
	            });
	            ctrl['visible'] = item.visible;
	            ctrlParam['ctrlCode'] = item.ctrlCode;
	            ctrlParam['visible'] = item.visible;
	            ctrlParams.push(ctrlParam);
	        });
	        return this.postMessage('setCtrlVisible', {
	            loginIp,
	            userCode,
	            params: {
	                array: ctrlParams
	            }
	        });
	    },
	    /**
	     * @description 设置控件属性--位置，剪裁
	     *
	     * @param {Array} positions
	     * {
	     *  array: [{
	     *     id: 1,
	     * 	   posX: 100,
	     * 	   posY: 200
	     * }]
	     * }
	     */
	    setCtrlPos(positions) {
	        const _this = this;
	        const config = this.config;
	        const { loginIp, userCode } = config;
	        let widgetParams = [];
	        if (positions.length === 0) {
	            throw new Error('setCtrlPos must has a Id.');
	        }
	        positions.forEach(item => {
	            if (!_this.ids.includes(item.ctrlCode)) {
	                throw new Error(`widget by id:${item.ctrlCode} has not been created.`);
	            }
	            const ctrl = _this.ctrls.find((ctrl) => {
	                return ctrl.ctrlCode === item.ctrlCode;
	            });
	            if (!ctrl) {
	                throw new Error(`can not find ctrl by id:${item.ctrlCode}.`);
	            }
	            // 待设置属性列表
	            let propList = ['posX', 'posY', 'width', 'height', 'ratio', 'scrollX', 'scrollY', 'scrollXH', 'scrollYW', 'cutList'];
	            // 设置控件属性
	            function setProp(ctrl, item, prop) {
	                item.hasOwnProperty(prop) ? ctrl[prop] = item[prop] : '';
	            }
	            propList.forEach(e => {
	                setProp(ctrl, item, e);
	            });
	            const widgetParam = ctrl;
	            widgetParams.push(widgetParam);
	        });
	        return this.postMessage('setCtrlPos', {
	            loginIp,
	            userCode,
	            params: {
	                array: widgetParams
	            }
	        });
	    },
	    /**
	     * @description 重新定位控件位置
	     * @params {Array} ['ctrlId1', 'ctrlId2']
	     */
	    reLocatedPosition(ctrlCode) {
	        let _ctrlList = [];
	        if (ctrlCode && ctrlCode.length > 0) {
	            this.ctrls.forEach(e => {
	                if (ctrlCode.includes(e.ctrlCode)) {
	                    _ctrlList.push(e);
	                }
	            });
	        }
	        let _needLocationList = _ctrlList.length > 0 ? _ctrlList : this.ctrls;
	        if (_needLocationList.length === 0)
	            return false;
	        let exitParams = _needLocationList.filter(e => {
	            return (e.domId && checkDomExit(e.domId, false));
	        });
	        let params = exitParams.map(e => {
	            let domInfo = getDomById(e.domId);
	            let scrollInfo = getScrollInfo();
	            let ctrlCode = e.ctrlCode;
	            let cutList = e.cutList;
	            let posX = domInfo.x;
	            let posY = domInfo.y;
	            let width = domInfo.width;
	            let height = domInfo.height;
	            let ratio = scrollInfo.ratio;
	            let scrollX = scrollInfo.scrollX;
	            let scrollY = scrollInfo.scrollY;
	            let scrollXH = scrollInfo.scrollXH;
	            let scrollYW = scrollInfo.scrollYW;
	            return { ctrlCode, cutList, posX, posY, width, height, ratio, scrollX, scrollY, scrollXH, scrollYW };
	        });
	        if (params.length) {
	            return this.setCtrlPos(params);
	        }
	        else {
	            return new Promise((resolve) => { resolve(true); });
	        }
	    },
	    /**
	     * @description 销毁控件
	     *
	     * @param {Array} ids
	     * {
	     *  array: ['1','2']
	     * }
	     */
	    destroyCtrl(ids) {
	        if (ids.length === 0) {
	            return false;
	        }
	        const _this = this;
	        const config = this.config;
	        const { loginIp, userCode } = config;
	        const _ids = [...ids];
	        // 删除缓存中的控件和ids
	        const params = ids.map(item => {
	            return { ctrlCode: item };
	        });
	        _ids.forEach(id => {
	            // if (!_this.ids.includes(id)) {
	            // 	throw new Error(`element by id:${id} has not been created.`);
	            // }
	            for (var i = 0; i < _this.ctrls.length; i++) {
	                if (_this.ctrls[i].ctrlCode === id) {
	                    _this.ctrls.splice(i, 1);
	                    _this.ids.splice(i, 1);
	                }
	            }
	        });
	        return this.postMessage('destroyCtrl', {
	            loginIp,
	            userCode,
	            params: {
	                array: params
	            }
	        });
	    },
	    /**
	     * @description 播放实时视频
	     *
	     * @param {Object}
	     * {
	     * 	 "ctrlCode":"ctrlCode",// 唯一标识符
	     *   "channelIds": ["AcqRGNrqA1B15042F6AMEO"]// 播放的通道编码
	     * }
	     */
	    openCtrlPreview(obj) {
	        const config = this.config;
	        const { loginIp, userCode } = config;
	        if (!obj.ctrlCode || !this.ids.includes(obj.ctrlCode)) {
	            throw new Error(`widget by id:${obj.ctrlCode} has not been created.`);
	        }
	        if (obj.channelIds.length === 0) {
	            return false;
	        }
	        const arr = obj.channelIds.map((i) => {
	            return { channelId: i };
	        });
	        return this.postMessage('openCtrlPreview', {
	            loginIp,
	            userCode,
	            params: {
	                array: [
	                    {
	                        ctrlCode: obj.ctrlCode,
	                        array: arr
	                    }
	                ]
	            }
	        });
	    },
	    /**
	     * @description 播放录像
	     *
	     * @param {Object}
	     *  [
	     *       {
	     *			"ctrlCode":"code0",
	     *			"array":
	     *           [{
	     *           	"beginTime": "2019-02-21 00:00:00",
	     *           	"channelId": "AcqRGNrqA1B15042F6AMEO",
	     *           	"endTime": "2019-02-21 23:59:59"
	     *			}]
	     *       }
	     *   ]
	     */
	    openCtrlRecord(arr) {
	        const config = this.config;
	        var obj = arr[0];
	        if (!obj.ctrlCode || !this.ids.includes(obj.ctrlCode)) {
	            throw new Error(`widget by id:${obj.ctrlCode} has not been created.`);
	        }
	        const { loginIp, userCode } = config;
	        return this.postMessage('openCtrlRecord', {
	            loginIp,
	            userCode,
	            params: {
	                array: arr
	            }
	        });
	    },
	    /**
	     * @description 关闭单个控件所有视频
	     *
	     * @param {Object}
	     * {
	     * 	 "ctrlCode":["uuidcode"] //唯一标识符
	     * }
	     */
	    closeCtrlVideo(arr) {
	        const config = this.config;
	        const { loginIp, userCode } = config;
	        const arrParams = arr.map(item => {
	            return { ctrlCode: item };
	        });
	        return this.postMessage('closeCtrlVideo', {
	            loginIp,
	            userCode,
	            params: {
	                array: arrParams
	            }
	        });
	    },
	    /**
	     * @description 弹窗打开实时视频
	     *
	     * @param {Array} arr
	     * // 标准参数 ["channelId1", "channelId2" ]
	     * // 兼容qt参数，传入对象{array: [{channelId： "channelId1"}, {channelId： "channelId2"}]}
	     */
	    openVideo(arr) {
	        const config = this.config;
	        const { userCode, loginIp } = config;
	        let params = {};
	        if (Array.isArray(arr)) {
	            let _arr = arr.map(i => {
	                return { channelId: i };
	            });
	            params = { array: _arr };
	        }
	        else { // 兼容之前的代码，之前根据客户端协议传递，为未处理格式的对象
	            params = arr;
	        }
	        return this.postMessage('openVideo', {
	            loginIp,
	            userCode,
	            params: params
	        });
	    },
	    /**
	     * @description 弹窗打开录像
	     *
	     * @param {any} arr
	     */
	    openRecord(arr) {
	        const config = this.config;
	        const { userCode, loginIp } = config;
	        let params = {};
	        if (Array.isArray(arr)) {
	            params = { array: arr };
	        }
	        else { // 兼容之前的代码，之前根据客户端协议传递，为未处理格式的对象
	            params = arr;
	        }
	        return this.postMessage('openRecord', {
	            loginIp,
	            userCode,
	            params: params
	        });
	    },
	    /**
	     * @description 打开混合弹窗
	     * @params {String} menuCode 菜单code
	     * @params {Array} 根据输入参数展示对应按钮。0:以图搜图，1：上传工作台，2：上传视图作战
	     * @params {Array} array 客户端通道和播放时间
	     *  [{
	            "channelId": "AcqRGNrqA1B15042F6AMEO", // 通道Id
	            "beginTime": "2021-01-05 13:57:00", // 回放开始时间
	            "endTime": "2021-01-05 14:26:59" // 回放结束时间
	        }]
	        */
	    openMixedModeDialog(menuCode, array, toolBarFucList = [0, 1, 2]) {
	        const config = this.config;
	        const { userCode, loginIp } = config;
	        let params = {
	            destinationCode: menuCode,
	            toolBarFucList: toolBarFucList,
	            array: array
	        };
	        return this.postMessage('openMixedModeDialog', {
	            loginIp,
	            userCode,
	            params: params
	        });
	    },
	    /**
	     * @description 图片增强
	     *
	     * @param {any} url
	     * @param {any} value
	     * @param {number} [type=1] [[1, 去偏色], [2, 去雾], [3, 夜增强], [4, 降噪]]
	     */
	    PictureEnhance(url, value, type = 1) {
	        const config = this.config;
	        const { userCode, loginIp } = config;
	        const params = {
	            loginIp,
	            userCode,
	            params: {
	                array: [{ type: `${type}`, degree: `${value}`, url }]
	            }
	        };
	        return this.postMessage('PictureEnhance', params);
	    }
	};

	var transparent = {
	    // 透传方法，参数不做任何处理
	    transparent(method, params) {
	        const config = this.config;
	        const { loginIp, userCode } = config;
	        return this.postMessage(method, {
	            loginIp,
	            userCode,
	            params: params
	        });
	    }
	};

	// import basic from './basic';
	var wsActions = {
	    account,
	    control,
	    transparent
	    // basic
	};

	var defaultMessageEvents = {
	    /**
	     * @description 获取版本信息结果
	     */
	    getVersionResult(data) {
	        this.getVersionEnd = true;
	        this.currentDssVersion = data;
	        if (this.onlineDssVersion !== '') {
	            this.compareVersion();
	        }
	    },
	    /**
	     * @description 客户端截图，以图搜图
	     */
	    goToSearchPic(data) {
	        console.log('ws-goToSearchPic', data);
	        if (data && data.params && data.params.array && Array.isArray(data.params.array)) {
	            let menuCode = data.params.destinationCode;
	            let param = {};
	            param[menuCode] = data.params.array[0];
	            if (frames[`nav-frame-${menuCode}`]) {
	                frames[`nav-frame-${menuCode}`].$nav.push({
	                    code: menuCode,
	                    params: param
	                });
	            }
	            else {
	                window && window['$nav'] && window['$nav'].push({
	                    code: menuCode,
	                    params: param
	                });
	            }
	        }
	        else {
	            this.Vue.prototype.$Message.info('未查询到数据');
	        }
	    },
	    /**
	    * @description 登陆结果
	    */
	    loginState(data) {
	        if (data) { // 登录成功
	            this.isLoginSuccess = data;
	            // 登录结束
	            this.loginEnd = true;
	            if (typeof this.callback.loginResult === 'function') {
	                this.callback.loginResult.call(this, this.isLoginSuccess);
	            }
	        }
	        else { // 登录失败
	            this.loginFailCount++;
	            if (this.loginFailCount < this.reLoginCount + 1) { // 登录未到最大次数
	                this.loginClient();
	            }
	            else { // 登录达到最大次数
	                // 登录结束
	                this.loginEnd = true;
	                // 重置登录失败次数
	                this.loginFailCount = 0;
	                this.isLoginSuccess = data;
	                if (typeof this.callback.loginResult === 'function') {
	                    this.callback.loginResult.call(this, this.isLoginSuccess);
	                }
	            }
	        }
	    },
	    /**
	    * @description 创建控件结果
	    */
	    createCtrlResult(data) {
	        // todo 修改ctrls 和 ids
	        let _data = data;
	        let failIds = [];
	        _data.forEach(e => {
	            if (e.result !== 0) {
	                failIds.push(e.ctrlCode);
	            }
	        });
	        this.ids.forEach((e, i) => {
	            if (failIds.indexOf(e) !== -1) {
	                this.ids.splice(i, 1);
	                this.ctrls.splice(i, 1);
	            }
	        });
	    },
	    /**
	     * @description 销毁控件结果
	     */
	    destroyCtrlResult(data) {
	        // 未发现这种情况，不好模拟，暂未调试
	        // todo 修改ctrls 和 ids
	        console.log(data);
	    }
	};

	/**
	 * @description 处理客户端返回数据的数据格式
	 * @author 178730 <jin_cong2@dahuatech.com>
	 * @date 2021-04-27
	 */
	var dealEventData = {
	  loginState: loginState,
	  getVersionResult: getVersionResult,
	  // goToSearchPic,
	  createCtrlResult: createCtrlResult
	};

	function loginState(data) {
	  return data.params.loginResult === 0;
	}

	function getVersionResult(data) {
	  return data.params.version + '';
	} // function goToSearchPic(data) {
	//     return data;
	// }


	function createCtrlResult(data) {
	  return data.params.array;
	}

	/*! *****************************************************************************
	Copyright (c) Microsoft Corporation. All rights reserved.
	Licensed under the Apache License, Version 2.0 (the "License"); you may not use
	this file except in compliance with the License. You may obtain a copy of the
	License at http://www.apache.org/licenses/LICENSE-2.0

	THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
	KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
	WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
	MERCHANTABLITY OR NON-INFRINGEMENT.

	See the Apache Version 2.0 License for specific language governing permissions
	and limitations under the License.
	***************************************************************************** */
	/* global Reflect, Promise */

	var extendStatics = function(d, b) {
	    extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return extendStatics(d, b);
	};

	function __extends(d, b) {
	    extendStatics(d, b);
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	}

	function __values(o) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
	    if (m) return m.call(o);
	    return {
	        next: function () {
	            if (o && i >= o.length) o = void 0;
	            return { value: o && o[i++], done: !o };
	        }
	    };
	}

	function __read(o, n) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator];
	    if (!m) return o;
	    var i = m.call(o), r, ar = [], e;
	    try {
	        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	    }
	    catch (error) { e = { error: error }; }
	    finally {
	        try {
	            if (r && !r.done && (m = i["return"])) m.call(i);
	        }
	        finally { if (e) throw e.error; }
	    }
	    return ar;
	}

	function __spread() {
	    for (var ar = [], i = 0; i < arguments.length; i++)
	        ar = ar.concat(__read(arguments[i]));
	    return ar;
	}

	var Event = /** @class */ (function () {
	    function Event(type, target) {
	        this.target = target;
	        this.type = type;
	    }
	    return Event;
	}());
	var ErrorEvent = /** @class */ (function (_super) {
	    __extends(ErrorEvent, _super);
	    function ErrorEvent(error, target) {
	        var _this = _super.call(this, 'error', target) || this;
	        _this.message = error.message;
	        _this.error = error;
	        return _this;
	    }
	    return ErrorEvent;
	}(Event));
	var CloseEvent = /** @class */ (function (_super) {
	    __extends(CloseEvent, _super);
	    function CloseEvent(code, reason, target) {
	        if (code === void 0) { code = 1000; }
	        if (reason === void 0) { reason = ''; }
	        var _this = _super.call(this, 'close', target) || this;
	        _this.wasClean = true;
	        _this.code = code;
	        _this.reason = reason;
	        return _this;
	    }
	    return CloseEvent;
	}(Event));

	/*!
	 * Reconnecting WebSocket
	 * by Pedro Ladaria <pedro.ladaria@gmail.com>
	 * https://github.com/pladaria/reconnecting-websocket
	 * License MIT
	 */
	var getGlobalWebSocket = function () {
	    if (typeof WebSocket !== 'undefined') {
	        // @ts-ignore
	        return WebSocket;
	    }
	};
	/**
	 * Returns true if given argument looks like a WebSocket class
	 */
	var isWebSocket = function (w) { return typeof w !== 'undefined' && !!w && w.CLOSING === 2; };
	var DEFAULT = {
	    maxReconnectionDelay: 10000,
	    minReconnectionDelay: 1000 + Math.random() * 4000,
	    minUptime: 5000,
	    reconnectionDelayGrowFactor: 1.3,
	    connectionTimeout: 4000,
	    maxRetries: Infinity,
	    maxEnqueuedMessages: Infinity,
	    startClosed: false,
	    debug: false,
	};
	var ReconnectingWebSocket = /** @class */ (function () {
	    function ReconnectingWebSocket(url, protocols, options) {
	        var _this = this;
	        if (options === void 0) { options = {}; }
	        this._listeners = {
	            error: [],
	            message: [],
	            open: [],
	            close: [],
	        };
	        this._retryCount = -1;
	        this._shouldReconnect = true;
	        this._connectLock = false;
	        this._binaryType = 'blob';
	        this._closeCalled = false;
	        this._messageQueue = [];
	        /**
	         * An event listener to be called when the WebSocket connection's readyState changes to CLOSED
	         */
	        this.onclose = null;
	        /**
	         * An event listener to be called when an error occurs
	         */
	        this.onerror = null;
	        /**
	         * An event listener to be called when a message is received from the server
	         */
	        this.onmessage = null;
	        /**
	         * An event listener to be called when the WebSocket connection's readyState changes to OPEN;
	         * this indicates that the connection is ready to send and receive data
	         */
	        this.onopen = null;
	        this._handleOpen = function (event) {
	            _this._debug('open event');
	            var _a = _this._options.minUptime, minUptime = _a === void 0 ? DEFAULT.minUptime : _a;
	            clearTimeout(_this._connectTimeout);
	            _this._uptimeTimeout = setTimeout(function () { return _this._acceptOpen(); }, minUptime);
	            _this._ws.binaryType = _this._binaryType;
	            // send enqueued messages (messages sent before websocket open event)
	            _this._messageQueue.forEach(function (message) { return _this._ws.send(message); });
	            _this._messageQueue = [];
	            if (_this.onopen) {
	                _this.onopen(event);
	            }
	            _this._listeners.open.forEach(function (listener) { return _this._callEventListener(event, listener); });
	        };
	        this._handleMessage = function (event) {
	            _this._debug('message event');
	            if (_this.onmessage) {
	                _this.onmessage(event);
	            }
	            _this._listeners.message.forEach(function (listener) { return _this._callEventListener(event, listener); });
	        };
	        this._handleError = function (event) {
	            _this._debug('error event', event.message);
	            _this._disconnect(undefined, event.message === 'TIMEOUT' ? 'timeout' : undefined);
	            if (_this.onerror) {
	                _this.onerror(event);
	            }
	            _this._debug('exec error listeners');
	            _this._listeners.error.forEach(function (listener) { return _this._callEventListener(event, listener); });
	            _this._connect();
	        };
	        this._handleClose = function (event) {
	            _this._debug('close event');
	            _this._clearTimeouts();
	            if (_this._shouldReconnect) {
	                _this._connect();
	            }
	            if (_this.onclose) {
	                _this.onclose(event);
	            }
	            _this._listeners.close.forEach(function (listener) { return _this._callEventListener(event, listener); });
	        };
	        this._url = url;
	        this._protocols = protocols;
	        this._options = options;
	        if (this._options.startClosed) {
	            this._shouldReconnect = false;
	        }
	        this._connect();
	    }
	    Object.defineProperty(ReconnectingWebSocket, "CONNECTING", {
	        get: function () {
	            return 0;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket, "OPEN", {
	        get: function () {
	            return 1;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket, "CLOSING", {
	        get: function () {
	            return 2;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket, "CLOSED", {
	        get: function () {
	            return 3;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket.prototype, "CONNECTING", {
	        get: function () {
	            return ReconnectingWebSocket.CONNECTING;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket.prototype, "OPEN", {
	        get: function () {
	            return ReconnectingWebSocket.OPEN;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket.prototype, "CLOSING", {
	        get: function () {
	            return ReconnectingWebSocket.CLOSING;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket.prototype, "CLOSED", {
	        get: function () {
	            return ReconnectingWebSocket.CLOSED;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket.prototype, "binaryType", {
	        get: function () {
	            return this._ws ? this._ws.binaryType : this._binaryType;
	        },
	        set: function (value) {
	            this._binaryType = value;
	            if (this._ws) {
	                this._ws.binaryType = value;
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket.prototype, "retryCount", {
	        /**
	         * Returns the number or connection retries
	         */
	        get: function () {
	            return Math.max(this._retryCount, 0);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket.prototype, "bufferedAmount", {
	        /**
	         * The number of bytes of data that have been queued using calls to send() but not yet
	         * transmitted to the network. This value resets to zero once all queued data has been sent.
	         * This value does not reset to zero when the connection is closed; if you keep calling send(),
	         * this will continue to climb. Read only
	         */
	        get: function () {
	            var bytes = this._messageQueue.reduce(function (acc, message) {
	                if (typeof message === 'string') {
	                    acc += message.length; // not byte size
	                }
	                else if (message instanceof Blob) {
	                    acc += message.size;
	                }
	                else {
	                    acc += message.byteLength;
	                }
	                return acc;
	            }, 0);
	            return bytes + (this._ws ? this._ws.bufferedAmount : 0);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket.prototype, "extensions", {
	        /**
	         * The extensions selected by the server. This is currently only the empty string or a list of
	         * extensions as negotiated by the connection
	         */
	        get: function () {
	            return this._ws ? this._ws.extensions : '';
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket.prototype, "protocol", {
	        /**
	         * A string indicating the name of the sub-protocol the server selected;
	         * this will be one of the strings specified in the protocols parameter when creating the
	         * WebSocket object
	         */
	        get: function () {
	            return this._ws ? this._ws.protocol : '';
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket.prototype, "readyState", {
	        /**
	         * The current state of the connection; this is one of the Ready state constants
	         */
	        get: function () {
	            if (this._ws) {
	                return this._ws.readyState;
	            }
	            return this._options.startClosed
	                ? ReconnectingWebSocket.CLOSED
	                : ReconnectingWebSocket.CONNECTING;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ReconnectingWebSocket.prototype, "url", {
	        /**
	         * The URL as resolved by the constructor
	         */
	        get: function () {
	            return this._ws ? this._ws.url : '';
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Closes the WebSocket connection or connection attempt, if any. If the connection is already
	     * CLOSED, this method does nothing
	     */
	    ReconnectingWebSocket.prototype.close = function (code, reason) {
	        if (code === void 0) { code = 1000; }
	        this._closeCalled = true;
	        this._shouldReconnect = false;
	        this._clearTimeouts();
	        if (!this._ws) {
	            this._debug('close enqueued: no ws instance');
	            return;
	        }
	        if (this._ws.readyState === this.CLOSED) {
	            this._debug('close: already closed');
	            return;
	        }
	        this._ws.close(code, reason);
	    };
	    /**
	     * Closes the WebSocket connection or connection attempt and connects again.
	     * Resets retry counter;
	     */
	    ReconnectingWebSocket.prototype.reconnect = function (code, reason) {
	        this._shouldReconnect = true;
	        this._closeCalled = false;
	        this._retryCount = -1;
	        if (!this._ws || this._ws.readyState === this.CLOSED) {
	            this._connect();
	        }
	        else {
	            this._disconnect(code, reason);
	            this._connect();
	        }
	    };
	    /**
	     * Enqueue specified data to be transmitted to the server over the WebSocket connection
	     */
	    ReconnectingWebSocket.prototype.send = function (data) {
	        if (this._ws && this._ws.readyState === this.OPEN) {
	            this._debug('send', data);
	            this._ws.send(data);
	        }
	        else {
	            var _a = this._options.maxEnqueuedMessages, maxEnqueuedMessages = _a === void 0 ? DEFAULT.maxEnqueuedMessages : _a;
	            if (this._messageQueue.length < maxEnqueuedMessages) {
	                this._debug('enqueue', data);
	                this._messageQueue.push(data);
	            }
	        }
	    };
	    /**
	     * Register an event handler of a specific event type
	     */
	    ReconnectingWebSocket.prototype.addEventListener = function (type, listener) {
	        if (this._listeners[type]) {
	            // @ts-ignore
	            this._listeners[type].push(listener);
	        }
	    };
	    ReconnectingWebSocket.prototype.dispatchEvent = function (event) {
	        var e_1, _a;
	        var listeners = this._listeners[event.type];
	        if (listeners) {
	            try {
	                for (var listeners_1 = __values(listeners), listeners_1_1 = listeners_1.next(); !listeners_1_1.done; listeners_1_1 = listeners_1.next()) {
	                    var listener = listeners_1_1.value;
	                    this._callEventListener(event, listener);
	                }
	            }
	            catch (e_1_1) { e_1 = { error: e_1_1 }; }
	            finally {
	                try {
	                    if (listeners_1_1 && !listeners_1_1.done && (_a = listeners_1.return)) _a.call(listeners_1);
	                }
	                finally { if (e_1) throw e_1.error; }
	            }
	        }
	        return true;
	    };
	    /**
	     * Removes an event listener
	     */
	    ReconnectingWebSocket.prototype.removeEventListener = function (type, listener) {
	        if (this._listeners[type]) {
	            // @ts-ignore
	            this._listeners[type] = this._listeners[type].filter(function (l) { return l !== listener; });
	        }
	    };
	    ReconnectingWebSocket.prototype._debug = function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        if (this._options.debug) {
	            // not using spread because compiled version uses Symbols
	            // tslint:disable-next-line
	            console.log.apply(console, __spread(['RWS>'], args));
	        }
	    };
	    ReconnectingWebSocket.prototype._getNextDelay = function () {
	        var _a = this._options, _b = _a.reconnectionDelayGrowFactor, reconnectionDelayGrowFactor = _b === void 0 ? DEFAULT.reconnectionDelayGrowFactor : _b, _c = _a.minReconnectionDelay, minReconnectionDelay = _c === void 0 ? DEFAULT.minReconnectionDelay : _c, _d = _a.maxReconnectionDelay, maxReconnectionDelay = _d === void 0 ? DEFAULT.maxReconnectionDelay : _d;
	        var delay = 0;
	        if (this._retryCount > 0) {
	            delay =
	                minReconnectionDelay * Math.pow(reconnectionDelayGrowFactor, this._retryCount - 1);
	            if (delay > maxReconnectionDelay) {
	                delay = maxReconnectionDelay;
	            }
	        }
	        this._debug('next delay', delay);
	        return delay;
	    };
	    ReconnectingWebSocket.prototype._wait = function () {
	        var _this = this;
	        return new Promise(function (resolve) {
	            setTimeout(resolve, _this._getNextDelay());
	        });
	    };
	    ReconnectingWebSocket.prototype._getNextUrl = function (urlProvider) {
	        if (typeof urlProvider === 'string') {
	            return Promise.resolve(urlProvider);
	        }
	        if (typeof urlProvider === 'function') {
	            var url = urlProvider();
	            if (typeof url === 'string') {
	                return Promise.resolve(url);
	            }
	            if (!!url.then) {
	                return url;
	            }
	        }
	        throw Error('Invalid URL');
	    };
	    ReconnectingWebSocket.prototype._connect = function () {
	        var _this = this;
	        if (this._connectLock || !this._shouldReconnect) {
	            return;
	        }
	        this._connectLock = true;
	        var _a = this._options, _b = _a.maxRetries, maxRetries = _b === void 0 ? DEFAULT.maxRetries : _b, _c = _a.connectionTimeout, connectionTimeout = _c === void 0 ? DEFAULT.connectionTimeout : _c, _d = _a.WebSocket, WebSocket = _d === void 0 ? getGlobalWebSocket() : _d;
	        if (this._retryCount >= maxRetries) {
	            this._debug('max retries reached', this._retryCount, '>=', maxRetries);
	            return;
	        }
	        this._retryCount++;
	        this._debug('connect', this._retryCount);
	        this._removeListeners();
	        if (!isWebSocket(WebSocket)) {
	            throw Error('No valid WebSocket class provided');
	        }
	        this._wait()
	            .then(function () { return _this._getNextUrl(_this._url); })
	            .then(function (url) {
	            // close could be called before creating the ws
	            if (_this._closeCalled) {
	                return;
	            }
	            _this._debug('connect', { url: url, protocols: _this._protocols });
	            _this._ws = _this._protocols
	                ? new WebSocket(url, _this._protocols)
	                : new WebSocket(url);
	            _this._ws.binaryType = _this._binaryType;
	            _this._connectLock = false;
	            _this._addListeners();
	            _this._connectTimeout = setTimeout(function () { return _this._handleTimeout(); }, connectionTimeout);
	        });
	    };
	    ReconnectingWebSocket.prototype._handleTimeout = function () {
	        this._debug('timeout event');
	        this._handleError(new ErrorEvent(Error('TIMEOUT'), this));
	    };
	    ReconnectingWebSocket.prototype._disconnect = function (code, reason) {
	        if (code === void 0) { code = 1000; }
	        this._clearTimeouts();
	        if (!this._ws) {
	            return;
	        }
	        this._removeListeners();
	        try {
	            this._ws.close(code, reason);
	            this._handleClose(new CloseEvent(code, reason, this));
	        }
	        catch (error) {
	            // ignore
	        }
	    };
	    ReconnectingWebSocket.prototype._acceptOpen = function () {
	        this._debug('accept open');
	        this._retryCount = 0;
	    };
	    ReconnectingWebSocket.prototype._callEventListener = function (event, listener) {
	        if ('handleEvent' in listener) {
	            // @ts-ignore
	            listener.handleEvent(event);
	        }
	        else {
	            // @ts-ignore
	            listener(event);
	        }
	    };
	    ReconnectingWebSocket.prototype._removeListeners = function () {
	        if (!this._ws) {
	            return;
	        }
	        this._debug('removeListeners');
	        this._ws.removeEventListener('open', this._handleOpen);
	        this._ws.removeEventListener('close', this._handleClose);
	        this._ws.removeEventListener('message', this._handleMessage);
	        // @ts-ignore
	        this._ws.removeEventListener('error', this._handleError);
	    };
	    ReconnectingWebSocket.prototype._addListeners = function () {
	        if (!this._ws) {
	            return;
	        }
	        this._debug('addListeners');
	        this._ws.addEventListener('open', this._handleOpen);
	        this._ws.addEventListener('close', this._handleClose);
	        this._ws.addEventListener('message', this._handleMessage);
	        // @ts-ignore
	        this._ws.addEventListener('error', this._handleError);
	    };
	    ReconnectingWebSocket.prototype._clearTimeouts = function () {
	        clearTimeout(this._connectTimeout);
	        clearTimeout(this._uptimeTimeout);
	    };
	    return ReconnectingWebSocket;
	}());

	var reconnectingWebsocketCjs = ReconnectingWebSocket;

	var es5 = createCommonjsModule(function (module, exports) {
	!function(e,t){module.exports=t();}(commonjsGlobal,(function(){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var i=t[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n});},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0});},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)r.d(n,i,function(t){return e[t]}.bind(null,i));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=90)}({17:function(e,t,r){t.__esModule=!0,t.default=void 0;var n=r(18),i=function(){function e(){}return e.getFirstMatch=function(e,t){var r=t.match(e);return r&&r.length>0&&r[1]||""},e.getSecondMatch=function(e,t){var r=t.match(e);return r&&r.length>1&&r[2]||""},e.matchAndReturnConst=function(e,t,r){if(e.test(t))return r},e.getWindowsVersionName=function(e){switch(e){case"NT":return "NT";case"XP":return "XP";case"NT 5.0":return "2000";case"NT 5.1":return "XP";case"NT 5.2":return "2003";case"NT 6.0":return "Vista";case"NT 6.1":return "7";case"NT 6.2":return "8";case"NT 6.3":return "8.1";case"NT 10.0":return "10";default:return}},e.getMacOSVersionName=function(e){var t=e.split(".").splice(0,2).map((function(e){return parseInt(e,10)||0}));if(t.push(0),10===t[0])switch(t[1]){case 5:return "Leopard";case 6:return "Snow Leopard";case 7:return "Lion";case 8:return "Mountain Lion";case 9:return "Mavericks";case 10:return "Yosemite";case 11:return "El Capitan";case 12:return "Sierra";case 13:return "High Sierra";case 14:return "Mojave";case 15:return "Catalina";default:return}},e.getAndroidVersionName=function(e){var t=e.split(".").splice(0,2).map((function(e){return parseInt(e,10)||0}));if(t.push(0),!(1===t[0]&&t[1]<5))return 1===t[0]&&t[1]<6?"Cupcake":1===t[0]&&t[1]>=6?"Donut":2===t[0]&&t[1]<2?"Eclair":2===t[0]&&2===t[1]?"Froyo":2===t[0]&&t[1]>2?"Gingerbread":3===t[0]?"Honeycomb":4===t[0]&&t[1]<1?"Ice Cream Sandwich":4===t[0]&&t[1]<4?"Jelly Bean":4===t[0]&&t[1]>=4?"KitKat":5===t[0]?"Lollipop":6===t[0]?"Marshmallow":7===t[0]?"Nougat":8===t[0]?"Oreo":9===t[0]?"Pie":void 0},e.getVersionPrecision=function(e){return e.split(".").length},e.compareVersions=function(t,r,n){void 0===n&&(n=!1);var i=e.getVersionPrecision(t),s=e.getVersionPrecision(r),o=Math.max(i,s),a=0,u=e.map([t,r],(function(t){var r=o-e.getVersionPrecision(t),n=t+new Array(r+1).join(".0");return e.map(n.split("."),(function(e){return new Array(20-e.length).join("0")+e})).reverse()}));for(n&&(a=o-Math.min(i,s)),o-=1;o>=a;){if(u[0][o]>u[1][o])return 1;if(u[0][o]===u[1][o]){if(o===a)return 0;o-=1;}else if(u[0][o]<u[1][o])return -1}},e.map=function(e,t){var r,n=[];if(Array.prototype.map)return Array.prototype.map.call(e,t);for(r=0;r<e.length;r+=1)n.push(t(e[r]));return n},e.find=function(e,t){var r,n;if(Array.prototype.find)return Array.prototype.find.call(e,t);for(r=0,n=e.length;r<n;r+=1){var i=e[r];if(t(i,r))return i}},e.assign=function(e){for(var t,r,n=e,i=arguments.length,s=new Array(i>1?i-1:0),o=1;o<i;o++)s[o-1]=arguments[o];if(Object.assign)return Object.assign.apply(Object,[e].concat(s));var a=function(){var e=s[t];"object"==typeof e&&null!==e&&Object.keys(e).forEach((function(t){n[t]=e[t];}));};for(t=0,r=s.length;t<r;t+=1)a();return e},e.getBrowserAlias=function(e){return n.BROWSER_ALIASES_MAP[e]},e.getBrowserTypeByAlias=function(e){return n.BROWSER_MAP[e]||""},e}();t.default=i,e.exports=t.default;},18:function(e,t,r){t.__esModule=!0,t.ENGINE_MAP=t.OS_MAP=t.PLATFORMS_MAP=t.BROWSER_MAP=t.BROWSER_ALIASES_MAP=void 0;t.BROWSER_ALIASES_MAP={"Amazon Silk":"amazon_silk","Android Browser":"android",Bada:"bada",BlackBerry:"blackberry",Chrome:"chrome",Chromium:"chromium",Electron:"electron",Epiphany:"epiphany",Firefox:"firefox",Focus:"focus",Generic:"generic","Google Search":"google_search",Googlebot:"googlebot","Internet Explorer":"ie","K-Meleon":"k_meleon",Maxthon:"maxthon","Microsoft Edge":"edge","MZ Browser":"mz","NAVER Whale Browser":"naver",Opera:"opera","Opera Coast":"opera_coast",PhantomJS:"phantomjs",Puffin:"puffin",QupZilla:"qupzilla",QQ:"qq",QQLite:"qqlite",Safari:"safari",Sailfish:"sailfish","Samsung Internet for Android":"samsung_internet",SeaMonkey:"seamonkey",Sleipnir:"sleipnir",Swing:"swing",Tizen:"tizen","UC Browser":"uc",Vivaldi:"vivaldi","WebOS Browser":"webos",WeChat:"wechat","Yandex Browser":"yandex",Roku:"roku"};t.BROWSER_MAP={amazon_silk:"Amazon Silk",android:"Android Browser",bada:"Bada",blackberry:"BlackBerry",chrome:"Chrome",chromium:"Chromium",electron:"Electron",epiphany:"Epiphany",firefox:"Firefox",focus:"Focus",generic:"Generic",googlebot:"Googlebot",google_search:"Google Search",ie:"Internet Explorer",k_meleon:"K-Meleon",maxthon:"Maxthon",edge:"Microsoft Edge",mz:"MZ Browser",naver:"NAVER Whale Browser",opera:"Opera",opera_coast:"Opera Coast",phantomjs:"PhantomJS",puffin:"Puffin",qupzilla:"QupZilla",qq:"QQ Browser",qqlite:"QQ Browser Lite",safari:"Safari",sailfish:"Sailfish",samsung_internet:"Samsung Internet for Android",seamonkey:"SeaMonkey",sleipnir:"Sleipnir",swing:"Swing",tizen:"Tizen",uc:"UC Browser",vivaldi:"Vivaldi",webos:"WebOS Browser",wechat:"WeChat",yandex:"Yandex Browser"};t.PLATFORMS_MAP={tablet:"tablet",mobile:"mobile",desktop:"desktop",tv:"tv"};t.OS_MAP={WindowsPhone:"Windows Phone",Windows:"Windows",MacOS:"macOS",iOS:"iOS",Android:"Android",WebOS:"WebOS",BlackBerry:"BlackBerry",Bada:"Bada",Tizen:"Tizen",Linux:"Linux",ChromeOS:"Chrome OS",PlayStation4:"PlayStation 4",Roku:"Roku"};t.ENGINE_MAP={EdgeHTML:"EdgeHTML",Blink:"Blink",Trident:"Trident",Presto:"Presto",Gecko:"Gecko",WebKit:"WebKit"};},90:function(e,t,r){t.__esModule=!0,t.default=void 0;var n,i=(n=r(91))&&n.__esModule?n:{default:n},s=r(18);function o(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n);}}var a=function(){function e(){}var t,r,n;return e.getParser=function(e,t){if(void 0===t&&(t=!1),"string"!=typeof e)throw new Error("UserAgent should be a string");return new i.default(e,t)},e.parse=function(e){return new i.default(e).getResult()},t=e,n=[{key:"BROWSER_MAP",get:function(){return s.BROWSER_MAP}},{key:"ENGINE_MAP",get:function(){return s.ENGINE_MAP}},{key:"OS_MAP",get:function(){return s.OS_MAP}},{key:"PLATFORMS_MAP",get:function(){return s.PLATFORMS_MAP}}],(r=null)&&o(t.prototype,r),n&&o(t,n),e}();t.default=a,e.exports=t.default;},91:function(e,t,r){t.__esModule=!0,t.default=void 0;var n=u(r(92)),i=u(r(93)),s=u(r(94)),o=u(r(95)),a=u(r(17));function u(e){return e&&e.__esModule?e:{default:e}}var d=function(){function e(e,t){if(void 0===t&&(t=!1),null==e||""===e)throw new Error("UserAgent parameter can't be empty");this._ua=e,this.parsedResult={},!0!==t&&this.parse();}var t=e.prototype;return t.getUA=function(){return this._ua},t.test=function(e){return e.test(this._ua)},t.parseBrowser=function(){var e=this;this.parsedResult.browser={};var t=a.default.find(n.default,(function(t){if("function"==typeof t.test)return t.test(e);if(t.test instanceof Array)return t.test.some((function(t){return e.test(t)}));throw new Error("Browser's test function is not valid")}));return t&&(this.parsedResult.browser=t.describe(this.getUA())),this.parsedResult.browser},t.getBrowser=function(){return this.parsedResult.browser?this.parsedResult.browser:this.parseBrowser()},t.getBrowserName=function(e){return e?String(this.getBrowser().name).toLowerCase()||"":this.getBrowser().name||""},t.getBrowserVersion=function(){return this.getBrowser().version},t.getOS=function(){return this.parsedResult.os?this.parsedResult.os:this.parseOS()},t.parseOS=function(){var e=this;this.parsedResult.os={};var t=a.default.find(i.default,(function(t){if("function"==typeof t.test)return t.test(e);if(t.test instanceof Array)return t.test.some((function(t){return e.test(t)}));throw new Error("Browser's test function is not valid")}));return t&&(this.parsedResult.os=t.describe(this.getUA())),this.parsedResult.os},t.getOSName=function(e){var t=this.getOS().name;return e?String(t).toLowerCase()||"":t||""},t.getOSVersion=function(){return this.getOS().version},t.getPlatform=function(){return this.parsedResult.platform?this.parsedResult.platform:this.parsePlatform()},t.getPlatformType=function(e){void 0===e&&(e=!1);var t=this.getPlatform().type;return e?String(t).toLowerCase()||"":t||""},t.parsePlatform=function(){var e=this;this.parsedResult.platform={};var t=a.default.find(s.default,(function(t){if("function"==typeof t.test)return t.test(e);if(t.test instanceof Array)return t.test.some((function(t){return e.test(t)}));throw new Error("Browser's test function is not valid")}));return t&&(this.parsedResult.platform=t.describe(this.getUA())),this.parsedResult.platform},t.getEngine=function(){return this.parsedResult.engine?this.parsedResult.engine:this.parseEngine()},t.getEngineName=function(e){return e?String(this.getEngine().name).toLowerCase()||"":this.getEngine().name||""},t.parseEngine=function(){var e=this;this.parsedResult.engine={};var t=a.default.find(o.default,(function(t){if("function"==typeof t.test)return t.test(e);if(t.test instanceof Array)return t.test.some((function(t){return e.test(t)}));throw new Error("Browser's test function is not valid")}));return t&&(this.parsedResult.engine=t.describe(this.getUA())),this.parsedResult.engine},t.parse=function(){return this.parseBrowser(),this.parseOS(),this.parsePlatform(),this.parseEngine(),this},t.getResult=function(){return a.default.assign({},this.parsedResult)},t.satisfies=function(e){var t=this,r={},n=0,i={},s=0;if(Object.keys(e).forEach((function(t){var o=e[t];"string"==typeof o?(i[t]=o,s+=1):"object"==typeof o&&(r[t]=o,n+=1);})),n>0){var o=Object.keys(r),u=a.default.find(o,(function(e){return t.isOS(e)}));if(u){var d=this.satisfies(r[u]);if(void 0!==d)return d}var c=a.default.find(o,(function(e){return t.isPlatform(e)}));if(c){var f=this.satisfies(r[c]);if(void 0!==f)return f}}if(s>0){var l=Object.keys(i),h=a.default.find(l,(function(e){return t.isBrowser(e,!0)}));if(void 0!==h)return this.compareVersion(i[h])}},t.isBrowser=function(e,t){void 0===t&&(t=!1);var r=this.getBrowserName().toLowerCase(),n=e.toLowerCase(),i=a.default.getBrowserTypeByAlias(n);return t&&i&&(n=i.toLowerCase()),n===r},t.compareVersion=function(e){var t=[0],r=e,n=!1,i=this.getBrowserVersion();if("string"==typeof i)return ">"===e[0]||"<"===e[0]?(r=e.substr(1),"="===e[1]?(n=!0,r=e.substr(2)):t=[],">"===e[0]?t.push(1):t.push(-1)):"="===e[0]?r=e.substr(1):"~"===e[0]&&(n=!0,r=e.substr(1)),t.indexOf(a.default.compareVersions(i,r,n))>-1},t.isOS=function(e){return this.getOSName(!0)===String(e).toLowerCase()},t.isPlatform=function(e){return this.getPlatformType(!0)===String(e).toLowerCase()},t.isEngine=function(e){return this.getEngineName(!0)===String(e).toLowerCase()},t.is=function(e){return this.isBrowser(e)||this.isOS(e)||this.isPlatform(e)},t.some=function(e){var t=this;return void 0===e&&(e=[]),e.some((function(e){return t.is(e)}))},e}();t.default=d,e.exports=t.default;},92:function(e,t,r){t.__esModule=!0,t.default=void 0;var n,i=(n=r(17))&&n.__esModule?n:{default:n};var s=/version\/(\d+(\.?_?\d+)+)/i,o=[{test:[/googlebot/i],describe:function(e){var t={name:"Googlebot"},r=i.default.getFirstMatch(/googlebot\/(\d+(\.\d+))/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/opera/i],describe:function(e){var t={name:"Opera"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:opera)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/opr\/|opios/i],describe:function(e){var t={name:"Opera"},r=i.default.getFirstMatch(/(?:opr|opios)[\s/](\S+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/SamsungBrowser/i],describe:function(e){var t={name:"Samsung Internet for Android"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:SamsungBrowser)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/Whale/i],describe:function(e){var t={name:"NAVER Whale Browser"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:whale)[\s/](\d+(?:\.\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/MZBrowser/i],describe:function(e){var t={name:"MZ Browser"},r=i.default.getFirstMatch(/(?:MZBrowser)[\s/](\d+(?:\.\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/focus/i],describe:function(e){var t={name:"Focus"},r=i.default.getFirstMatch(/(?:focus)[\s/](\d+(?:\.\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/swing/i],describe:function(e){var t={name:"Swing"},r=i.default.getFirstMatch(/(?:swing)[\s/](\d+(?:\.\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/coast/i],describe:function(e){var t={name:"Opera Coast"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:coast)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/yabrowser/i],describe:function(e){var t={name:"Yandex Browser"},r=i.default.getFirstMatch(/(?:yabrowser)[\s/](\d+(\.?_?\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/ucbrowser/i],describe:function(e){var t={name:"UC Browser"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:ucbrowser)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/Maxthon|mxios/i],describe:function(e){var t={name:"Maxthon"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:Maxthon|mxios)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/epiphany/i],describe:function(e){var t={name:"Epiphany"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:epiphany)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/puffin/i],describe:function(e){var t={name:"Puffin"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:puffin)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/sleipnir/i],describe:function(e){var t={name:"Sleipnir"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:sleipnir)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/k-meleon/i],describe:function(e){var t={name:"K-Meleon"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:k-meleon)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/micromessenger/i],describe:function(e){var t={name:"WeChat"},r=i.default.getFirstMatch(/(?:micromessenger)[\s/](\d+(\.?_?\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/qqbrowser/i],describe:function(e){var t={name:/qqbrowserlite/i.test(e)?"QQ Browser Lite":"QQ Browser"},r=i.default.getFirstMatch(/(?:qqbrowserlite|qqbrowser)[/](\d+(\.?_?\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/msie|trident/i],describe:function(e){var t={name:"Internet Explorer"},r=i.default.getFirstMatch(/(?:msie |rv:)(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/\sedg\//i],describe:function(e){var t={name:"Microsoft Edge"},r=i.default.getFirstMatch(/\sedg\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/edg([ea]|ios)/i],describe:function(e){var t={name:"Microsoft Edge"},r=i.default.getSecondMatch(/edg([ea]|ios)\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/vivaldi/i],describe:function(e){var t={name:"Vivaldi"},r=i.default.getFirstMatch(/vivaldi\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/seamonkey/i],describe:function(e){var t={name:"SeaMonkey"},r=i.default.getFirstMatch(/seamonkey\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/sailfish/i],describe:function(e){var t={name:"Sailfish"},r=i.default.getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i,e);return r&&(t.version=r),t}},{test:[/silk/i],describe:function(e){var t={name:"Amazon Silk"},r=i.default.getFirstMatch(/silk\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/phantom/i],describe:function(e){var t={name:"PhantomJS"},r=i.default.getFirstMatch(/phantomjs\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/slimerjs/i],describe:function(e){var t={name:"SlimerJS"},r=i.default.getFirstMatch(/slimerjs\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/blackberry|\bbb\d+/i,/rim\stablet/i],describe:function(e){var t={name:"BlackBerry"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/blackberry[\d]+\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/(web|hpw)[o0]s/i],describe:function(e){var t={name:"WebOS Browser"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/w(?:eb)?[o0]sbrowser\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/bada/i],describe:function(e){var t={name:"Bada"},r=i.default.getFirstMatch(/dolfin\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/tizen/i],describe:function(e){var t={name:"Tizen"},r=i.default.getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.?_?\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/qupzilla/i],describe:function(e){var t={name:"QupZilla"},r=i.default.getFirstMatch(/(?:qupzilla)[\s/](\d+(\.?_?\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/firefox|iceweasel|fxios/i],describe:function(e){var t={name:"Firefox"},r=i.default.getFirstMatch(/(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/electron/i],describe:function(e){var t={name:"Electron"},r=i.default.getFirstMatch(/(?:electron)\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/chromium/i],describe:function(e){var t={name:"Chromium"},r=i.default.getFirstMatch(/(?:chromium)[\s/](\d+(\.?_?\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/chrome|crios|crmo/i],describe:function(e){var t={name:"Chrome"},r=i.default.getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/GSA/i],describe:function(e){var t={name:"Google Search"},r=i.default.getFirstMatch(/(?:GSA)\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:function(e){var t=!e.test(/like android/i),r=e.test(/android/i);return t&&r},describe:function(e){var t={name:"Android Browser"},r=i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/playstation 4/i],describe:function(e){var t={name:"PlayStation 4"},r=i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/safari|applewebkit/i],describe:function(e){var t={name:"Safari"},r=i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/.*/i],describe:function(e){var t=-1!==e.search("\\(")?/^(.*)\/(.*)[ \t]\((.*)/:/^(.*)\/(.*) /;return {name:i.default.getFirstMatch(t,e),version:i.default.getSecondMatch(t,e)}}}];t.default=o,e.exports=t.default;},93:function(e,t,r){t.__esModule=!0,t.default=void 0;var n,i=(n=r(17))&&n.__esModule?n:{default:n},s=r(18);var o=[{test:[/Roku\/DVP/],describe:function(e){var t=i.default.getFirstMatch(/Roku\/DVP-(\d+\.\d+)/i,e);return {name:s.OS_MAP.Roku,version:t}}},{test:[/windows phone/i],describe:function(e){var t=i.default.getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i,e);return {name:s.OS_MAP.WindowsPhone,version:t}}},{test:[/windows /i],describe:function(e){var t=i.default.getFirstMatch(/Windows ((NT|XP)( \d\d?.\d)?)/i,e),r=i.default.getWindowsVersionName(t);return {name:s.OS_MAP.Windows,version:t,versionName:r}}},{test:[/Macintosh(.*?) FxiOS(.*?) Version\//],describe:function(e){var t=i.default.getSecondMatch(/(Version\/)(\d[\d.]+)/,e);return {name:s.OS_MAP.iOS,version:t}}},{test:[/macintosh/i],describe:function(e){var t=i.default.getFirstMatch(/mac os x (\d+(\.?_?\d+)+)/i,e).replace(/[_\s]/g,"."),r=i.default.getMacOSVersionName(t),n={name:s.OS_MAP.MacOS,version:t};return r&&(n.versionName=r),n}},{test:[/(ipod|iphone|ipad)/i],describe:function(e){var t=i.default.getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i,e).replace(/[_\s]/g,".");return {name:s.OS_MAP.iOS,version:t}}},{test:function(e){var t=!e.test(/like android/i),r=e.test(/android/i);return t&&r},describe:function(e){var t=i.default.getFirstMatch(/android[\s/-](\d+(\.\d+)*)/i,e),r=i.default.getAndroidVersionName(t),n={name:s.OS_MAP.Android,version:t};return r&&(n.versionName=r),n}},{test:[/(web|hpw)[o0]s/i],describe:function(e){var t=i.default.getFirstMatch(/(?:web|hpw)[o0]s\/(\d+(\.\d+)*)/i,e),r={name:s.OS_MAP.WebOS};return t&&t.length&&(r.version=t),r}},{test:[/blackberry|\bbb\d+/i,/rim\stablet/i],describe:function(e){var t=i.default.getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i,e)||i.default.getFirstMatch(/blackberry\d+\/(\d+([_\s]\d+)*)/i,e)||i.default.getFirstMatch(/\bbb(\d+)/i,e);return {name:s.OS_MAP.BlackBerry,version:t}}},{test:[/bada/i],describe:function(e){var t=i.default.getFirstMatch(/bada\/(\d+(\.\d+)*)/i,e);return {name:s.OS_MAP.Bada,version:t}}},{test:[/tizen/i],describe:function(e){var t=i.default.getFirstMatch(/tizen[/\s](\d+(\.\d+)*)/i,e);return {name:s.OS_MAP.Tizen,version:t}}},{test:[/linux/i],describe:function(){return {name:s.OS_MAP.Linux}}},{test:[/CrOS/],describe:function(){return {name:s.OS_MAP.ChromeOS}}},{test:[/PlayStation 4/],describe:function(e){var t=i.default.getFirstMatch(/PlayStation 4[/\s](\d+(\.\d+)*)/i,e);return {name:s.OS_MAP.PlayStation4,version:t}}}];t.default=o,e.exports=t.default;},94:function(e,t,r){t.__esModule=!0,t.default=void 0;var n,i=(n=r(17))&&n.__esModule?n:{default:n},s=r(18);var o=[{test:[/googlebot/i],describe:function(){return {type:"bot",vendor:"Google"}}},{test:[/huawei/i],describe:function(e){var t=i.default.getFirstMatch(/(can-l01)/i,e)&&"Nova",r={type:s.PLATFORMS_MAP.mobile,vendor:"Huawei"};return t&&(r.model=t),r}},{test:[/nexus\s*(?:7|8|9|10).*/i],describe:function(){return {type:s.PLATFORMS_MAP.tablet,vendor:"Nexus"}}},{test:[/ipad/i],describe:function(){return {type:s.PLATFORMS_MAP.tablet,vendor:"Apple",model:"iPad"}}},{test:[/Macintosh(.*?) FxiOS(.*?) Version\//],describe:function(){return {type:s.PLATFORMS_MAP.tablet,vendor:"Apple",model:"iPad"}}},{test:[/kftt build/i],describe:function(){return {type:s.PLATFORMS_MAP.tablet,vendor:"Amazon",model:"Kindle Fire HD 7"}}},{test:[/silk/i],describe:function(){return {type:s.PLATFORMS_MAP.tablet,vendor:"Amazon"}}},{test:[/tablet(?! pc)/i],describe:function(){return {type:s.PLATFORMS_MAP.tablet}}},{test:function(e){var t=e.test(/ipod|iphone/i),r=e.test(/like (ipod|iphone)/i);return t&&!r},describe:function(e){var t=i.default.getFirstMatch(/(ipod|iphone)/i,e);return {type:s.PLATFORMS_MAP.mobile,vendor:"Apple",model:t}}},{test:[/nexus\s*[0-6].*/i,/galaxy nexus/i],describe:function(){return {type:s.PLATFORMS_MAP.mobile,vendor:"Nexus"}}},{test:[/[^-]mobi/i],describe:function(){return {type:s.PLATFORMS_MAP.mobile}}},{test:function(e){return "blackberry"===e.getBrowserName(!0)},describe:function(){return {type:s.PLATFORMS_MAP.mobile,vendor:"BlackBerry"}}},{test:function(e){return "bada"===e.getBrowserName(!0)},describe:function(){return {type:s.PLATFORMS_MAP.mobile}}},{test:function(e){return "windows phone"===e.getBrowserName()},describe:function(){return {type:s.PLATFORMS_MAP.mobile,vendor:"Microsoft"}}},{test:function(e){var t=Number(String(e.getOSVersion()).split(".")[0]);return "android"===e.getOSName(!0)&&t>=3},describe:function(){return {type:s.PLATFORMS_MAP.tablet}}},{test:function(e){return "android"===e.getOSName(!0)},describe:function(){return {type:s.PLATFORMS_MAP.mobile}}},{test:function(e){return "macos"===e.getOSName(!0)},describe:function(){return {type:s.PLATFORMS_MAP.desktop,vendor:"Apple"}}},{test:function(e){return "windows"===e.getOSName(!0)},describe:function(){return {type:s.PLATFORMS_MAP.desktop}}},{test:function(e){return "linux"===e.getOSName(!0)},describe:function(){return {type:s.PLATFORMS_MAP.desktop}}},{test:function(e){return "playstation 4"===e.getOSName(!0)},describe:function(){return {type:s.PLATFORMS_MAP.tv}}},{test:function(e){return "roku"===e.getOSName(!0)},describe:function(){return {type:s.PLATFORMS_MAP.tv}}}];t.default=o,e.exports=t.default;},95:function(e,t,r){t.__esModule=!0,t.default=void 0;var n,i=(n=r(17))&&n.__esModule?n:{default:n},s=r(18);var o=[{test:function(e){return "microsoft edge"===e.getBrowserName(!0)},describe:function(e){if(/\sedg\//i.test(e))return {name:s.ENGINE_MAP.Blink};var t=i.default.getFirstMatch(/edge\/(\d+(\.?_?\d+)+)/i,e);return {name:s.ENGINE_MAP.EdgeHTML,version:t}}},{test:[/trident/i],describe:function(e){var t={name:s.ENGINE_MAP.Trident},r=i.default.getFirstMatch(/trident\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:function(e){return e.test(/presto/i)},describe:function(e){var t={name:s.ENGINE_MAP.Presto},r=i.default.getFirstMatch(/presto\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:function(e){var t=e.test(/gecko/i),r=e.test(/like gecko/i);return t&&!r},describe:function(e){var t={name:s.ENGINE_MAP.Gecko},r=i.default.getFirstMatch(/gecko\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/(apple)?webkit\/537\.36/i],describe:function(){return {name:s.ENGINE_MAP.Blink}}},{test:[/(apple)?webkit/i],describe:function(e){var t={name:s.ENGINE_MAP.WebKit},r=i.default.getFirstMatch(/webkit\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}}];t.default=o,e.exports=t.default;}})}));
	});

	var Bowser = unwrapExports(es5);
	es5.bowser;

	// 与客户端交互方法列表
	const browser = Bowser.getParser(window.navigator.userAgent);
	//版本信息
	const DHWs_version = '1.0.33';
	console.log(DHWs_version);
	class Ws {
	    constructor({ url = 'ws://localhost:1234', publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDbEpPpxpLJft4W9YZj8bRh2bYYZshBEsKOlxgyn11rlEyTasjBSZRV9aj33tvQ2T55izH0fWl+dL/dLZChawFrlGDcH8JuWge2xYMgII9mggcYa0UiQ7pLXJ9ivXZ/cOY3HzrRQdR7dGTSNn3Z0Ctbns6mLgvlA2r3qMNs/8wHBwIDAQAB', reConnectCount = 2, connectTimeOut = 30 * 1000, reLoginCount = 0, loginIp = location.hostname, loginPort = location.port, userName = '', userPwd = '', token = '', callback = {
	        connectResult: null,
	        loginResult: null
	    }, isKeepConnect = false, detectDssVersion = true, messageEvents = {} }) {
	        // if (/https/.test(location.protocol)) {
	        // 	url = `wss:${url}`;
	        // } else {
	        // 	url = `ws:${url}`;
	        // }
	        // url = `ws://localhost:1234`;
	        // 是否连接客户端
	        this.isConnectSuccessQt = false;
	        // 是否登录客户端
	        this.isLoginSuccess = false;
	        // 外部注册客户端消息处理
	        this.messageEvents = {};
	        // 最大重连数
	        this.reConnectCount = 2;
	        // 连接失败次数
	        this.connectFailCount = 0;
	        // 连接完成标识
	        this.connectEnd = true;
	        // 连接客户端开始时间
	        this.connectStartTime = 0;
	        // 连接超时时间
	        this.connectTimeOut = 30 * 1000;
	        // 登录完成标识
	        this.loginEnd = true;
	        // 登录客户端开始时间
	        this.loginStartTime = 0;
	        // 登录超时时间
	        this.loginTimeOut = 60 * 1000;
	        // 最大重登数
	        this.reLoginCount = 0;
	        // 连接失败次数
	        this.loginFailCount = 0;
	        // 当前websocket登录配置
	        this.config = {
	            browser: {}
	        };
	        // 用户标识符
	        this.userCode = 0;
	        // 是否检测客户端版本
	        this.detectDssVersion = true;
	        // 当前客户端版本
	        this.currentDssVersion = '';
	        // 获取当前版本结束标志
	        this.getVersionEnd = true;
	        // 获取版本开始时间
	        this.getVersionStartTime = 0;
	        // 获取版本超时时间
	        this.getVersionTimeOut = 30 * 1000;
	        // 线上客户端版本
	        this.onlineDssVersion = '';
	        // 线上客户顿版本获取地址后缀，32系统文件名添加32
	        this.onlineDssVersionAfterfix = '/data/VSL/DSSEnterpriseClient/LightWeightVersion.txt';
	        // 线上客户顿获取地址后缀，32系统文件名添加32
	        this.onlineDssAfterfix = '/data/VSL/DSSEnterpriseClient/DSS_LightWeight_Client.zip';
	        // 是否一直保持重新连接
	        this.isKeepConnect = false;
	        // 创建的控件ID列表
	        this.ids = [];
	        // 创建的控件列表
	        this.ctrls = [];
	        // 心跳
	        this.heartBeatTimer = null;
	        // 监听的添加式方法表
	        this.handlers = {};
	        this.url = url;
	        this.userCode = new Date().valueOf();
	        this.webSocket = null;
	        this.reConnectCount = reConnectCount;
	        this.connectTimeOut = connectTimeOut;
	        this.reLoginCount = reLoginCount;
	        this.publicKey = publicKey;
	        this.loginIp = loginIp;
	        this.loginPort = loginPort;
	        this.userName = userName;
	        this.userPwd = userPwd;
	        this.token = token;
	        this.callback = callback;
	        this.isKeepConnect = isKeepConnect;
	        this.detectDssVersion = detectDssVersion;
	        this.messageEvents = messageEvents || {};
	        this.connectFailCount = this.connectFailCount;
	        // 基础操作所需功能或属性
	        this.ids = [];
	        this.ctrls = [];
	        // 是否连接客户端
	        this.isConnectSuccessQt = false;
	        // 是否登陆客户端
	        this.isLoginSuccess = false;
	        this.heartBeatTimer = null;
	        // 用户注册监听事件表
	        this.handlers = {};
	        // 用户注册监听事件表
	        this.listerns = new Map();
	        // 获取与客户端交互方法列表
	        const defaultActions = [];
	        Object.keys(wsActions).forEach(item => {
	            if (hasKey(wsActions, item)) {
	                defaultActions.push(wsActions[item]);
	            }
	        });
	        // 与客户端通讯功能注册
	        usePlugin(defaultActions);
	        // 处理客户端消息 合并以内置方法为主，客户自定义事件与内置方法重复，则抛弃
	        this.messageEvents = Object.assign(this.messageEvents, defaultMessageEvents);
	        Object.keys(this.messageEvents).forEach(item => {
	            this.addEventListener(item, this.messageEvents[item].bind(this));
	        });
	        // 初始化配置参数
	        this.initConfig();
	        // 连接客户端
	        this.connectQt();
	        // 登录
	        // this.detectConnectQt().then((res: Boolean) => {
	        // 	if(res) {
	        // 		// 登陆客户端
	        // 		this.loginClient();
	        // 	}
	        // });
	    }
	    /**
	     * @description 获得实例对象
	     */
	    static getInstance(options) {
	        try {
	            if (!top['$ws']) {
	                if (!this._instance) {
	                    this._instance = new Ws(options || {});
	                    top['$ws'] = this._instance;
	                }
	            }
	            else {
	                this._instance = top['$ws'];
	            }
	        }
	        catch (e) {
	            if (!this._instance) {
	                this._instance = new Ws(options || {});
	            }
	        }
	        return this._instance;
	    }
	    /**
	     * @description 用户注册监听事件，覆盖式监听
	     * @params {String} eventType 事件名称
	     * @params {any} callback 回调函数
	     */
	    on(eventType, callback) {
	        this.listerns.set(eventType, callback);
	    }
	    /**
	     * @description 用户取消监听事件，覆盖式监听
	     * @params {String} eventType 事件名称
	     */
	    off(eventType) {
	        delete this.listerns[eventType];
	    }
	    /**
	     * @description 用户注册监听事件，添加式监听
	     * @params {String} eventType 事件名称
	     * @params {any} handler 回调函数
	     */
	    addEventListener(eventType, handler) {
	        // 首先判断handlers内有没有type事件容器，没有则创建一个新数组容器
	        if (!(eventType in this.handlers)) {
	            this.handlers[eventType] = [];
	        }
	        // 将事件存入
	        this.handlers[eventType].push(handler);
	    }
	    /**
	     * @description 添加式监听，触发事件
	     * @params {String} eventType 事件名称
	     * @params {any} params 函数参数
	     */
	    dispatchEvent(eventType, ...params) {
	        // 若没有注册该事件则抛出错误
	        if (!(eventType in this.handlers)) {
	            return new Error('未注册该事件');
	        }
	        // 便利触发
	        this.handlers[eventType].forEach(handler => {
	            handler(...params);
	        });
	    }
	    /**
	     * @description 用户取消监听事件
	     * @params {String} eventType 事件名称
	     */
	    removeEventListener(eventType, handler) {
	        // 无效事件抛出
	        if (!(eventType in this.handlers)) {
	            return new Error('无效事件');
	        }
	        if (!handler) {
	            // 直接移除事件
	            delete this.handlers[eventType];
	        }
	        else {
	            const idx = this.handlers[eventType].findIndex(ele => ele === handler);
	            // 抛出异常事件
	            if (idx === -1) {
	                return new Error('无该绑定事件');
	            }
	            // 移除事件
	            this.handlers[eventType].splice(idx, 1);
	            if (this.handlers[eventType].length === 0) {
	                delete this.handlers[eventType];
	            }
	        }
	    }
	    /**
	     * @description 发送消息给客户端
	     * @params {String} method 事件名称
	     * @params {Object} data 传输消息的数据内容
	     */
	    postMessage(method, data) {
	        if (method !== 'heartbeat') {
	            console.log('postMessage', method, data);
	        }
	        const { webSocket } = this;
	        data.method = method;
	        // 不需要判断登录和连接的方法过滤
	        let filterList = ['heartbeat', 'login', 'logout', 'browserInfo', 'getVersion', 'trusteSite'];
	        if (filterList.includes(method)) {
	            webSocket.send(JSON.stringify(data));
	            return Promise.resolve(true);
	        }
	        return new Promise((resolve, reject) => {
	            this.keeper().then(res => {
	                if (res) {
	                    webSocket.send(JSON.stringify(data));
	                    resolve(true);
	                }
	                else {
	                    reject(false);
	                }
	            }).catch(e => {
	                console.error('ws-error in keeper');
	            });
	        });
	    }
	    /*
	    * 初始化配置
	    */
	    initConfig() {
	        // token登陆的username通过token截取
	        if (this.token && this.token.split('_')[0]) {
	            this.userName = this.token.split('_')[0];
	        }
	        this.config = {
	            userName: this.userName,
	            userCode: this.userCode,
	            loginPort: this.loginPort,
	            loginIp: this.loginIp,
	            userPwd: this.userPwd,
	            token: this.token
	        };
	        // 浏览器信息
	        const browserInfo = {
	            name: '',
	            version: '',
	            platform: ''
	        };
	        browserInfo.name = browser.getBrowserName().toLowerCase();
	        browserInfo.version = browser.getBrowser().version.toLowerCase();
	        browserInfo.platform =
	            browser._ua.indexOf('Win64') >= 0 || browser._ua.indexOf('Wow64') >= 0
	                ? 'win64'
	                : 'win32';
	        this.config['browser'] = browserInfo;
	    }
	    /**
	     * @description 连接客户端
	     */
	    connectQt() {
	        this.connectFailCount = 0;
	        this.connectEnd = false;
	        this.connectStartTime = Date.now();
	        // 连接客户端
	        this.webSocket = new reconnectingWebsocketCjs(this.url, '', {
	            maxRetries: this.reConnectCount,
	            connectionTimeout: this.connectTimeOut
	        });
	        // 取消订阅的事件
	        this.removeEvents();
	        // 订阅事件
	        this.addEvents();
	        return this.detectConnectQt();
	    }
	    /**
	     * @description 获取线上和线下客户端版本
	     */
	    getDSSVersion() {
	        this.getVersion();
	        this.getOnlineDssVersion();
	    }
	    /**
	     * @description 获取线上客户端版本
	     */
	    getOnlineDssVersion() {
	        // 待解决跨域问题
	        let _this = this;
	        let platform = this.config['browser'].platform;
	        let versionUrl = this.onlineDssVersionAfterfix;
	        if (platform === 'win32') {
	            versionUrl = versionUrl.replace('.txt', '32.txt');
	        }
	        var request = new XMLHttpRequest();
	        request.open("get", versionUrl); /*设置请求方法与路径*/
	        request.send(null); /*不发送数据到服务器*/
	        request.onload = function () {
	            if (request.status == 200) { /*返回状态为200，即为数据获取成功*/
	                _this.onlineDssVersion = request.response.replace('ClientVersion = ', '');
	                if (_this.currentDssVersion !== '') {
	                    _this.compareVersion();
	                }
	            }
	        };
	    }
	    /**
	     * @description 检测连接客户端状态
	     */
	    detectConnectQt() {
	        let _this = this;
	        return new Promise((resolve, reject) => {
	            if (!this.connectEnd) { // 连接中
	                // let now = Date.now();
	                // if((now - _this.connectStartTime) > _this.connectTimeOut) {
	                // 	console.log(`ws-this.connectEndTime-${now}`);
	                // 	reject('connect timeout');
	                // }
	                let _interval = setInterval(() => {
	                    if (_this.connectEnd) {
	                        clearInterval(_interval);
	                        resolve(_this.isConnectSuccessQt);
	                    }
	                }, 50);
	            }
	            else {
	                resolve(_this.isConnectSuccessQt);
	            }
	        });
	    }
	    /**
	     * @description 检测登录客户端状态
	     */
	    detectLoginClient() {
	        let _this = this;
	        return new Promise((resolve, reject) => {
	            if (!this.loginEnd) { // 登录中
	                // let now = Date.now();
	                // if((now - _this.loginStartTime) > _this.loginTimeOut) {
	                // 	console.log(`ws-this.loginEndTime-${now}`);
	                // 	reject('login timeout');
	                // }
	                let _interval = setInterval(() => {
	                    if (_this.loginEnd) {
	                        clearInterval(_interval);
	                        resolve(_this.isLoginSuccess);
	                    }
	                }, 50);
	            }
	            else {
	                resolve(_this.isLoginSuccess);
	            }
	        });
	    }
	    /**
	     * @description 连接状态守护
	     */
	    keepConnect() {
	        return new Promise((resolve, reject) => {
	            // 监测连接状态
	            this.detectConnectQt().then((connectStatus) => {
	                // 连接正常
	                if (connectStatus) {
	                    resolve(true);
	                }
	                else {
	                    // 连接状态失效，重新连接
	                    this.connectQt().then((ReconnectStatus) => {
	                        // 重连成功
	                        if (ReconnectStatus) {
	                            resolve(true);
	                        }
	                        else {
	                            console.log(`ws-in-keepConnect-reConnect-fail`);
	                            reject(false);
	                        }
	                    });
	                }
	            });
	        });
	    }
	    /**
	     * @description 连接和登录状态守护
	     */
	    keeper() {
	        return new Promise((resolve, reject) => {
	            // 监测连接状态
	            this.detectConnectQt().then((connectStatus) => {
	                // 连接正常
	                if (connectStatus) {
	                    this.detectLoginClient().then((loginStatus) => {
	                        // 登录正常
	                        if (loginStatus) {
	                            resolve(true);
	                        }
	                        else {
	                            // 登录异常
	                            // 登录
	                            this.loginClient();
	                            // 登录后的状态监测
	                            this.detectLoginClient().then((reLoginStatus) => {
	                                if (reLoginStatus) {
	                                    resolve(true);
	                                }
	                                else {
	                                    console.log(`ws-in-keeper-reLogin-fail`);
	                                    reject(false);
	                                }
	                            });
	                        }
	                    });
	                }
	                else {
	                    // 连接状态失效，重新连接
	                    this.connectQt().then((ReconnectStatus) => {
	                        // 连接成功
	                        if (ReconnectStatus) {
	                            // 登录
	                            console.log(`ws-in-keeper-reConnect-reLogin`);
	                            this.loginClient();
	                            // 登录状态监测
	                            this.detectLoginClient().then((loginStatus) => {
	                                if (loginStatus) {
	                                    resolve(true);
	                                }
	                                else {
	                                    console.log(`ws-in-keeper-reLogin-fail`);
	                                    reject(false);
	                                }
	                            });
	                        }
	                        else {
	                            console.log(`ws-in-keeper-reConnect-fail`);
	                            reject(false);
	                        }
	                    });
	                }
	            });
	        });
	    }
	    /**
	     * @description 获取当前客户端版本
	     */
	    getLocalDssVersion() {
	        let _this = this;
	        this.getVersion();
	        console.log(`ws-getLocalDssVersion-getVersionEnd-${this.getVersionEnd}`);
	        return new Promise((resolve, reject) => {
	            if (!this.getVersionEnd) { // 连接中或者获取中
	                // let now = Date.now();
	                // if((now - _this.getVersionStartTime) > _this.getVersionTimeOut) {
	                // 	console.log(`ws-this.getVersionEndTime-${now}`);
	                // 	reject('get version timeout');
	                // }
	                let _interval = setInterval(() => {
	                    if (_this.getVersionEnd) {
	                        clearInterval(_interval);
	                        resolve(_this.currentDssVersion);
	                    }
	                }, 50);
	            }
	            else {
	                resolve(_this.currentDssVersion);
	            }
	        });
	    }
	    /**
	     * @description 比较客户端版本
	     */
	    compareVersion() {
	        if (this.currentDssVersion && this.onlineDssVersion && Number(this.onlineDssVersion) > Number(this.currentDssVersion)) {
	            this.dispatchEvent('updateDss');
	            // this.Vue && this.Vue.prototype.$Modal.confirm({
	            // 	title: '客户端更新',
	            // 		content: '系统检测到新客户端版本，请更新后使用?',
	            // 		onOk: () => {
	            // 			this.downloadClient();
	            // 		},
	            //         onCancel: () => {
	            //             this.detectDssVersion = false;
	            //         }
	            // });
	        }
	    }
	    /**
	     * @description 下载客户端
	     */
	    downloadClient(origin) {
	        var agent = navigator.userAgent.toLowerCase();
	        let type = '64';
	        if (agent.indexOf("win32") >= 0 || agent.indexOf("wow32") >= 0) {
	            type = '32';
	        }
	        else if (agent.indexOf("win64") >= 0 || agent.indexOf("wow64") >= 0) {
	            type = '64';
	        }
	        //线上环境实际应用地址
	        let downUrl = location.origin + '/data/VSL/DSSEnterpriseClient/DSS_LightWeight_Client';
	        //便于开发环境测试
	        if (origin) {
	            downUrl = origin + '/data/VSL/DSSEnterpriseClient/DSS_LightWeight_Client';
	        }
	        type === '32' ? downUrl = downUrl + '32.zip' : downUrl = downUrl + '.zip';
	        window.open(downUrl);
	    }
	    /**
	     * @description 登录客户端
	     * @params {Object} config 登录相关配置
	     */
	    login(config) {
	        console.log('ws-login-start');
	        this.loginFailCount = 0;
	        // 如果登陆时用户名变更，更新userCode
	        let { userName, token } = config;
	        // token登陆的username通过token截取
	        if (token && token.split('_')[0]) {
	            userName = token.split('_')[0];
	        }
	        if (this.config['userName'] && (userName !== this.config['userName'])) {
	            this.userCode = new Date().valueOf();
	        }
	        this.userName = userName;
	        this.initConfig();
	        Object.assign(this.config, config);
	        this.detectConnectQt().then((res) => {
	            if (res) {
	                // 若已登录，先注销
	                console.log('ws-login-start-this.isLoginSuccess', this.isLoginSuccess);
	                // if (this.isLoginSuccess) {
	                // 	this.logout();
	                // }
	                // 登陆客户端
	                this.loginClient();
	                // 获取线上客户端版本
	                this.detectDssVersion && this.getDSSVersion();
	            }
	            else {
	                // 未连接客户端
	                this.connectQt().then((res1) => {
	                    if (res1) {
	                        // 登陆客户端
	                        this.loginClient();
	                        // 获取线上客户端版本
	                        this.detectDssVersion && this.getDSSVersion();
	                    }
	                    else {
	                        throw new Error('连接客户端失败');
	                    }
	                });
	            }
	        });
	    }
	    /**
	     * @description 登出客户端
	     */
	    logout() {
	        // 退出客户端
	        this.detectLoginClient().then(res => {
	            res && this.logoutClient();
	        });
	        this.ids = [];
	        this.ctrls = [];
	        this.isLoginSuccess = false;
	        if (typeof this.callback.loginResult === 'function') {
	            this.callback.loginResult.call(this, this.isLoginSuccess);
	        }
	    }
	    /**
	     * @description 添加websocket/window监听事件
	     */
	    addEvents() {
	        const webSocket = this.webSocket;
	        webSocket.addEventListener('open', this.onOpen.bind(this));
	        webSocket.addEventListener('message', this.onMessage.bind(this));
	        webSocket.addEventListener('error', this.onError.bind(this));
	        window.addEventListener('resize', this.reLocatedPosition.bind(this));
	        window.addEventListener('scroll', this.reLocatedPosition.bind(this));
	        window.addEventListener('visibilitychange', this.webVisibilityChange.bind(this));
	        window.addEventListener('onunload', this.closeBrowser.bind(this));
	    }
	    /**
	     * @description 移除websocket/window监听事件
	     */
	    removeEvents() {
	        const webSocket = this.webSocket;
	        webSocket.removeEventListener('open', this.onOpen);
	        webSocket.removeEventListener('message', this.onMessage);
	        webSocket.removeEventListener('error', this.onError);
	        window.removeEventListener('resize', this.reLocatedPosition);
	        window.removeEventListener('scroll', this.reLocatedPosition);
	        window.removeEventListener('visibilitychange', this.webVisibilityChange);
	        window.removeEventListener('onunload', this.closeBrowser);
	    }
	    /**
	     * @description 连接客户端成功事件
	     */
	    onOpen() {
	        console.log('ws-onOpen');
	        // chrome浏览器版本大于80，需要添加信任站点，加载http/https跨站点资源
	        // if(this.config['browser'].name === 'chrome' && this.config['browser'].version && Number(this.config['browser'].version.split('.')[0]) >= 80) {
	        // 	this.trusteSite(location.hostname);
	        // }
	        this.isConnectSuccessQt = true;
	        this.dispatchEvent('connectStateChange', true);
	        this.connectEnd = true;
	        if (typeof this.callback.connectResult === 'function') {
	            this.callback.connectResult.call(this, this.isConnectSuccessQt);
	        }
	        // 获取客户端版本
	        this.getVersionEnd = false;
	        this.getDSSVersion();
	    }
	    /**
	     * @description 接收客户端消息
	     * @params {Object} event 接收客户端的消息数据
	     */
	    onMessage(event) {
	        console.log('onMessage', event);
	        try {
	            const data = JSON.parse(event.data);
	            const { method } = data;
	            const callback = this.listerns.get(method);
	            // 数据格式处理
	            let dealDataRes = dealEventData[method] ? dealEventData[method](data) : data;
	            this.dispatchEvent(method, dealDataRes);
	            if (method === 'loginState') {
	                callback && callback(this.isLoginSuccess);
	            }
	            else {
	                callback && callback(data);
	            }
	        }
	        catch (e) {
	            // 客户端协议中含有返回的不是Json数据
	            console.log('ws-error-客户端返回的消息不是Json数据', e);
	        }
	    }
	    /**
	     * @description 客户端发生错误事件
	     */
	    onError() {
	        this.ctrls = [];
	        this.ids = [];
	        this.connectFailCount++;
	        if (this.connectFailCount === this.reConnectCount + 1) {
	            clearTimeout(this.heartbeatTimer);
	            this.isConnectSuccessQt = false;
	            this.dispatchEvent('connectStateChange', false);
	            this.connectEnd = true;
	            this.isKeepConnect && this.keepConnect();
	            if (typeof this.callback.connectResult === 'function') {
	                this.callback.connectResult.call(this, this.isConnectSuccessQt);
	            }
	        }
	    }
	    /**
	     * @description 判断是否成功连接客户端
	     */
	    isOpen() {
	        if (!this.webSocket)
	            return false;
	        return this.webSocket.readyState === 1;
	    }
	    /**
	     * @description 心跳事件
	     */
	    _heartbeat() {
	        this.heartbeat();
	        clearTimeout(this.heartbeatTimer);
	        this.heartbeatTimer = setTimeout(() => {
	            this._heartbeat();
	        }, 10000);
	    }
	    /**
	     * @description 关闭浏览器事件
	     */
	    closeBrowser() {
	        this.logout();
	        // 延迟100ms登出，关闭所有控件
	        var timestamp = new Date().getTime();
	        while ((new Date().getTime() - timestamp) < 100) { }
	    }
	}
	// 连接地址
	Ws.url = '';
	// 密码加密公钥
	Ws.publicKey = '';
	// 唯一实例
	Ws._instance = null;
	/**
	 * @description 判断对象是否含有某属性
	 * @params {Object} obj 对象
	 * @params {String} key 属性key
	 */
	function hasKey(obj, key) {
	    return key in obj;
	}
	/**
	 * @description 与客户端通讯功能注册
	 * @params {Array} actions 功能列表
	 */
	function usePlugin(actions) {
	    actions.forEach((plugin) => {
	        Object.getOwnPropertyNames(plugin).forEach(prop => {
	            Ws.prototype[prop] = plugin[prop];
	        });
	    });
	}

	return Ws;

})));
//# sourceMappingURL=DHWs.js.map
