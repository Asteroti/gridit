(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.af.U === region.al.U)
	{
		return 'on line ' + region.af.U;
	}
	return 'on lines ' + region.af.U + ' through ' + region.al.U;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.aW,
		impl.a6,
		impl.a4,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		? _Json_wrap(
			/**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		A: func(record.A),
		ag: record.ag,
		ad: record.ad
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.A;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.ag;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.ad) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.aW,
		impl.a6,
		impl.a4,
		function(sendToApp, initialModel) {
			var view = impl.a7;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.aW,
		impl.a6,
		impl.a4,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.ae && impl.ae(sendToApp)
			var view = impl.a7;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.aN);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.a5) && (_VirtualDom_doc.title = title = doc.a5);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.a$;
	var onUrlRequest = impl.a0;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		ae: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.az === next.az
							&& curr.ap === next.ap
							&& curr.aw.a === next.aw.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		aW: function(flags)
		{
			return A3(impl.aW, flags, _Browser_getUrl(), key);
		},
		a7: impl.a7,
		a6: impl.a6,
		a4: impl.a4
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { aT: 'hidden', aP: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { aT: 'mozHidden', aP: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { aT: 'msHidden', aP: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { aT: 'webkitHidden', aP: 'webkitvisibilitychange' }
		: { aT: 'hidden', aP: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		aD: _Browser_getScene(),
		aI: {
			aJ: _Browser_window.pageXOffset,
			aK: _Browser_window.pageYOffset,
			L: _Browser_doc.documentElement.clientWidth,
			N: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		L: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		N: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			aD: {
				L: node.scrollWidth,
				N: node.scrollHeight
			},
			aI: {
				aJ: node.scrollLeft,
				aK: node.scrollTop,
				L: node.clientWidth,
				N: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			aD: _Browser_getScene(),
			aI: {
				aJ: x,
				aK: y,
				L: _Browser_doc.documentElement.clientWidth,
				N: _Browser_doc.documentElement.clientHeight
			},
			aR: {
				aJ: x + rect.left,
				aK: y + rect.top,
				L: rect.width,
				N: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



// DECODER

var _File_decoder = _Json_decodePrim(function(value) {
	// NOTE: checks if `File` exists in case this is run on node
	return (typeof File !== 'undefined' && value instanceof File)
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FILE', value);
});


// METADATA

function _File_name(file) { return file.name; }
function _File_mime(file) { return file.type; }
function _File_size(file) { return file.size; }

function _File_lastModified(file)
{
	return $elm$time$Time$millisToPosix(file.lastModified);
}


// DOWNLOAD

var _File_downloadNode;

function _File_getDownloadNode()
{
	return _File_downloadNode || (_File_downloadNode = document.createElement('a'));
}

var _File_download = F3(function(name, mime, content)
{
	return _Scheduler_binding(function(callback)
	{
		var blob = new Blob([content], {type: mime});

		// for IE10+
		if (navigator.msSaveOrOpenBlob)
		{
			navigator.msSaveOrOpenBlob(blob, name);
			return;
		}

		// for HTML5
		var node = _File_getDownloadNode();
		var objectUrl = URL.createObjectURL(blob);
		node.href = objectUrl;
		node.download = name;
		_File_click(node);
		URL.revokeObjectURL(objectUrl);
	});
});

function _File_downloadUrl(href)
{
	return _Scheduler_binding(function(callback)
	{
		var node = _File_getDownloadNode();
		node.href = href;
		node.download = '';
		node.origin === location.origin || (node.target = '_blank');
		_File_click(node);
	});
}


// IE COMPATIBILITY

function _File_makeBytesSafeForInternetExplorer(bytes)
{
	// only needed by IE10 and IE11 to fix https://github.com/elm/file/issues/10
	// all other browsers can just run `new Blob([bytes])` directly with no problem
	//
	return new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}

function _File_click(node)
{
	// only needed by IE10 and IE11 to fix https://github.com/elm/file/issues/11
	// all other browsers have MouseEvent and do not need this conditional stuff
	//
	if (typeof MouseEvent === 'function')
	{
		node.dispatchEvent(new MouseEvent('click'));
	}
	else
	{
		var event = document.createEvent('MouseEvents');
		event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		document.body.appendChild(node);
		node.dispatchEvent(event);
		document.body.removeChild(node);
	}
}


// UPLOAD

var _File_node;

function _File_uploadOne(mimes)
{
	return _Scheduler_binding(function(callback)
	{
		_File_node = document.createElement('input');
		_File_node.type = 'file';
		_File_node.accept = A2($elm$core$String$join, ',', mimes);
		_File_node.addEventListener('change', function(event)
		{
			callback(_Scheduler_succeed(event.target.files[0]));
		});
		_File_click(_File_node);
	});
}

function _File_uploadOneOrMore(mimes)
{
	return _Scheduler_binding(function(callback)
	{
		_File_node = document.createElement('input');
		_File_node.type = 'file';
		_File_node.multiple = true;
		_File_node.accept = A2($elm$core$String$join, ',', mimes);
		_File_node.addEventListener('change', function(event)
		{
			var elmFiles = _List_fromArray(event.target.files);
			callback(_Scheduler_succeed(_Utils_Tuple2(elmFiles.a, elmFiles.b)));
		});
		_File_click(_File_node);
	});
}


// CONTENT

function _File_toString(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(reader.result));
		});
		reader.readAsText(blob);
		return function() { reader.abort(); };
	});
}

function _File_toBytes(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(new DataView(reader.result)));
		});
		reader.readAsArrayBuffer(blob);
		return function() { reader.abort(); };
	});
}

function _File_toUrl(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(reader.result));
		});
		reader.readAsDataURL(blob);
		return function() { reader.abort(); };
	});
}

var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.d) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.g),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.g);
		} else {
			var treeLen = builder.d * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.l) : builder.l;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.d);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.g) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.g);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{l: nodeList, d: (len / $elm$core$Array$branchFactor) | 0, g: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {an: fragment, ap: host, au: path, aw: port_, az: protocol, aA: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$I18n$Spanish = 1;
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$init = function (_v0) {
	return _Utils_Tuple2(
		{Z: false, E: false, j: '#80ED99', m: 1, b: 10, n: 1, G: $elm$core$Maybe$Nothing, T: 'image', H: $elm$core$Maybe$Nothing, u: false, a: 1, O: 0, P: false, f: false, C: true, t: $elm$core$Maybe$Nothing},
		$elm$core$Platform$Cmd$none);
};
var $author$project$Main$BrowserLanguageReceived = function (a) {
	return {$: 19, a: a};
};
var $author$project$Main$GriddedReady = function (a) {
	return {$: 7, a: a};
};
var $author$project$Main$ResetProcessing = {$: 18};
var $author$project$Main$SettingsLoaded = function (a) {
	return {$: 17, a: a};
};
var $author$project$Main$ShareSupportReceived = function (a) {
	return {$: 22, a: a};
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Main$getBrowserLanguage = _Platform_incomingPort('getBrowserLanguage', $elm$json$Json$Decode$string);
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $author$project$Main$loadSettings = _Platform_incomingPort(
	'loadSettings',
	A2(
		$elm$json$Json$Decode$andThen,
		function (showDiagonals) {
			return A2(
				$elm$json$Json$Decode$andThen,
				function (gridThickness) {
					return A2(
						$elm$json$Json$Decode$andThen,
						function (gridSize) {
							return A2(
								$elm$json$Json$Decode$andThen,
								function (gridOpacity) {
									return A2(
										$elm$json$Json$Decode$andThen,
										function (gridColor) {
											return $elm$json$Json$Decode$succeed(
												{j: gridColor, m: gridOpacity, b: gridSize, n: gridThickness, f: showDiagonals});
										},
										A2($elm$json$Json$Decode$field, 'gridColor', $elm$json$Json$Decode$string));
								},
								A2($elm$json$Json$Decode$field, 'gridOpacity', $elm$json$Json$Decode$float));
						},
						A2($elm$json$Json$Decode$field, 'gridSize', $elm$json$Json$Decode$int));
				},
				A2($elm$json$Json$Decode$field, 'gridThickness', $elm$json$Json$Decode$int));
		},
		A2($elm$json$Json$Decode$field, 'showDiagonals', $elm$json$Json$Decode$bool)));
var $author$project$Main$receivePng = _Platform_incomingPort('receivePng', $elm$json$Json$Decode$string);
var $author$project$Main$receiveShareSupport = _Platform_incomingPort('receiveShareSupport', $elm$json$Json$Decode$bool);
var $elm$json$Json$Decode$null = _Json_decodeNull;
var $author$project$Main$resetProcessing = _Platform_incomingPort(
	'resetProcessing',
	$elm$json$Json$Decode$null(0));
var $author$project$Main$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$author$project$Main$receivePng($author$project$Main$GriddedReady),
				$author$project$Main$loadSettings($author$project$Main$SettingsLoaded),
				$author$project$Main$resetProcessing(
				function (_v1) {
					return $author$project$Main$ResetProcessing;
				}),
				$author$project$Main$getBrowserLanguage($author$project$Main$BrowserLanguageReceived),
				$author$project$Main$receiveShareSupport($author$project$Main$ShareSupportReceived)
			]));
};
var $author$project$Main$ImageLoaded = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$ImageSelected = function (a) {
	return {$: 1, a: a};
};
var $author$project$Main$ResetDownloadSuccess = {$: 12};
var $author$project$I18n$Amharic = 12;
var $author$project$I18n$Asturiano = 6;
var $author$project$I18n$English = 0;
var $author$project$I18n$Euskara = 8;
var $author$project$I18n$French = 5;
var $author$project$I18n$Gaelic = 7;
var $author$project$I18n$Hebrew = 13;
var $author$project$I18n$Italian = 3;
var $author$project$I18n$Japanese = 9;
var $author$project$I18n$Latin = 2;
var $author$project$I18n$Portuguese = 4;
var $author$project$I18n$Russian = 10;
var $author$project$I18n$Tuvan = 11;
var $author$project$Main$allLanguages = _List_fromArray(
	[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Main$downloadImage = _Platform_outgoingPort(
	'downloadImage',
	function ($) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'dataUrl',
					$elm$json$Json$Encode$string($._)),
					_Utils_Tuple2(
					'fileName',
					$elm$json$Json$Encode$string($.aa))
				]));
	});
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$file$File$Select$file = F2(
	function (mimes, toMsg) {
		return A2(
			$elm$core$Task$perform,
			toMsg,
			_File_uploadOne(mimes));
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Char$isHexDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return ((48 <= code) && (code <= 57)) || (((65 <= code) && (code <= 70)) || ((97 <= code) && (code <= 102)));
};
var $author$project$Main$isValidHexColor = function (s) {
	return ($elm$core$String$length(s) === 7) && (A2($elm$core$String$startsWith, '#', s) && A2(
		$elm$core$String$all,
		$elm$core$Char$isHexDigit,
		A2($elm$core$String$dropLeft, 1, s)));
};
var $author$project$Main$languageMeta = function (language) {
	switch (language) {
		case 0:
			return {c: 'en', h: 'ltr', i: 'English', k: 'english'};
		case 1:
			return {c: 'es', h: 'ltr', i: 'Español', k: 'spanish'};
		case 2:
			return {c: 'la', h: 'ltr', i: 'Latin', k: 'latin'};
		case 3:
			return {c: 'it', h: 'ltr', i: 'Italiano', k: 'italian'};
		case 4:
			return {c: 'pt', h: 'ltr', i: 'Português', k: 'portuguese'};
		case 5:
			return {c: 'fr', h: 'ltr', i: 'Français', k: 'french'};
		case 6:
			return {c: 'ast', h: 'ltr', i: 'Asturianu', k: 'asturiano'};
		case 7:
			return {c: 'gd', h: 'ltr', i: 'Gàidhlig', k: 'gaelic'};
		case 8:
			return {c: 'eu', h: 'ltr', i: 'Euskara', k: 'euskara'};
		case 9:
			return {c: 'ja', h: 'ltr', i: '日本語', k: 'japanese'};
		case 10:
			return {c: 'ru', h: 'ltr', i: 'Русский', k: 'russian'};
		case 11:
			return {c: 'tyv', h: 'ltr', i: 'Тыва дыл', k: 'tuvan'};
		case 12:
			return {c: 'am', h: 'ltr', i: 'አማርኛ', k: 'amharic'};
		default:
			return {c: 'he', h: 'rtl', i: 'עברית', k: 'hebrew'};
	}
};
var $elm$file$File$name = _File_name;
var $elm$core$Basics$not = _Basics_not;
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$json$Json$Encode$float = _Json_wrap;
var $elm$json$Json$Encode$int = _Json_wrap;
var $author$project$Main$saveSettings = _Platform_outgoingPort(
	'saveSettings',
	function ($) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'gridColor',
					$elm$json$Json$Encode$string($.j)),
					_Utils_Tuple2(
					'gridOpacity',
					$elm$json$Json$Encode$float($.m)),
					_Utils_Tuple2(
					'gridSize',
					$elm$json$Json$Encode$int($.b)),
					_Utils_Tuple2(
					'gridThickness',
					$elm$json$Json$Encode$int($.n)),
					_Utils_Tuple2(
					'showDiagonals',
					$elm$json$Json$Encode$bool($.f))
				]));
	});
var $author$project$Main$setHtmlDir = _Platform_outgoingPort('setHtmlDir', $elm$json$Json$Encode$string);
var $author$project$Main$setHtmlLang = _Platform_outgoingPort('setHtmlLang', $elm$json$Json$Encode$string);
var $author$project$Main$settingsFromModel = function (m) {
	return {j: m.j, m: m.m, b: m.b, n: m.n, f: m.f};
};
var $author$project$Main$shareImageData = _Platform_outgoingPort(
	'shareImageData',
	function ($) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'dataUrl',
					$elm$json$Json$Encode$string($._)),
					_Utils_Tuple2(
					'fileName',
					$elm$json$Json$Encode$string($.aa))
				]));
	});
var $elm$core$Process$sleep = _Process_sleep;
var $elm$file$File$toUrl = _File_toUrl;
var $author$project$Main$requestPng = _Platform_outgoingPort(
	'requestPng',
	function ($) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'color',
					$elm$json$Json$Encode$string($.aj)),
					_Utils_Tuple2(
					'grid',
					$elm$json$Json$Encode$int($.ao)),
					_Utils_Tuple2(
					'height',
					$elm$json$Json$Encode$int($.N)),
					_Utils_Tuple2(
					'opacity',
					$elm$json$Json$Encode$float($.at)),
					_Utils_Tuple2(
					'showDiagonals',
					$elm$json$Json$Encode$bool($.f)),
					_Utils_Tuple2(
					'thickness',
					$elm$json$Json$Encode$int($.aG)),
					_Utils_Tuple2(
					'url',
					$elm$json$Json$Encode$string($.aH)),
					_Utils_Tuple2(
					'width',
					$elm$json$Json$Encode$int($.L))
				]));
	});
var $author$project$Main$triggerProcessing = F2(
	function (shareAfterProcess, model) {
		var _v0 = _Utils_Tuple3(model.t, model.H, model.G);
		if (((!_v0.a.$) && (!_v0.b.$)) && (!_v0.c.$)) {
			var url = _v0.a.a;
			var w = _v0.b.a;
			var h = _v0.c.a;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{u: true, P: shareAfterProcess}),
				$author$project$Main$requestPng(
					{aj: model.j, ao: model.b, N: h, at: model.m, f: model.f, aG: model.n, aH: url, L: w}));
		} else {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				return _Utils_Tuple2(
					model,
					A2(
						$elm$file$File$Select$file,
						_List_fromArray(
							['image/*']),
						$author$project$Main$ImageSelected));
			case 1:
				var file = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							T: $elm$file$File$name(file)
						}),
					A2(
						$elm$core$Task$perform,
						$author$project$Main$ImageLoaded,
						$elm$file$File$toUrl(file)));
			case 2:
				var url = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							G: $elm$core$Maybe$Nothing,
							H: $elm$core$Maybe$Nothing,
							t: $elm$core$Maybe$Just(url)
						}),
					$elm$core$Platform$Cmd$none);
			case 3:
				var size = msg.a;
				var newModel = _Utils_update(
					model,
					{b: size});
				return _Utils_Tuple2(
					newModel,
					$author$project$Main$saveSettings(
						$author$project$Main$settingsFromModel(newModel)));
			case 8:
				var color = msg.a;
				if ($author$project$Main$isValidHexColor(color)) {
					var newModel = _Utils_update(
						model,
						{j: color});
					return _Utils_Tuple2(
						newModel,
						$author$project$Main$saveSettings(
							$author$project$Main$settingsFromModel(newModel)));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 9:
				var thickness = msg.a;
				var newModel = _Utils_update(
					model,
					{n: thickness});
				return _Utils_Tuple2(
					newModel,
					$author$project$Main$saveSettings(
						$author$project$Main$settingsFromModel(newModel)));
			case 10:
				var opacity = msg.a;
				var newModel = _Utils_update(
					model,
					{m: opacity});
				return _Utils_Tuple2(
					newModel,
					$author$project$Main$saveSettings(
						$author$project$Main$settingsFromModel(newModel)));
			case 4:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{O: model.O + 1}),
					$elm$core$Platform$Cmd$none);
			case 5:
				var width = msg.a;
				var height = msg.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							G: $elm$core$Maybe$Just(height),
							H: $elm$core$Maybe$Just(width)
						}),
					$elm$core$Platform$Cmd$none);
			case 11:
				var newLanguage = msg.a;
				var meta = $author$project$Main$languageMeta(newLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: newLanguage}),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								$author$project$Main$setHtmlLang(meta.c),
								$author$project$Main$setHtmlDir(meta.h)
							])));
			case 12:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{E: false}),
					$elm$core$Platform$Cmd$none);
			case 13:
				var value = msg.a;
				var newModel = _Utils_update(
					model,
					{f: value});
				return _Utils_Tuple2(
					newModel,
					$author$project$Main$saveSettings(
						$author$project$Main$settingsFromModel(newModel)));
			case 14:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{C: !model.C}),
					$elm$core$Platform$Cmd$none);
			case 15:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{u: true}),
					$elm$core$Platform$Cmd$none);
			case 16:
				var name = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{T: name}),
					$elm$core$Platform$Cmd$none);
			case 17:
				var settings = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{j: settings.j, m: settings.m, b: settings.b, n: settings.n, f: settings.f}),
					$elm$core$Platform$Cmd$none);
			case 18:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{u: false}),
					$elm$core$Platform$Cmd$none);
			case 19:
				var langCode = msg.a;
				var detectedLanguage = A2(
					$elm$core$Maybe$withDefault,
					1,
					$elm$core$List$head(
						A2(
							$elm$core$List$filter,
							function (lang) {
								return A2(
									$elm$core$String$startsWith,
									$author$project$Main$languageMeta(lang).c,
									langCode);
							},
							$author$project$Main$allLanguages)));
				var meta = $author$project$Main$languageMeta(detectedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: detectedLanguage}),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								$author$project$Main$setHtmlLang(meta.c),
								$author$project$Main$setHtmlDir(meta.h)
							])));
			case 6:
				return A2($author$project$Main$triggerProcessing, false, model);
			case 21:
				return A2($author$project$Main$triggerProcessing, true, model);
			case 7:
				var dataUrl = msg.a;
				var fileName = model.T + '-gridded.png';
				var action = model.P ? $author$project$Main$shareImageData(
					{_: dataUrl, aa: fileName}) : $author$project$Main$downloadImage(
					{_: dataUrl, aa: fileName});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{E: true, u: false, P: false}),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								action,
								A2(
								$elm$core$Task$perform,
								function (_v1) {
									return $author$project$Main$ResetDownloadSuccess;
								},
								$elm$core$Process$sleep(2000))
							])));
			case 20:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{E: false, G: $elm$core$Maybe$Nothing, H: $elm$core$Maybe$Nothing, u: false, P: false, t: $elm$core$Maybe$Nothing}),
					$elm$core$Platform$Cmd$none);
			default:
				var supported = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{Z: supported}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$node = $elm$virtual_dom$VirtualDom$node;
var $author$project$I18n$ChangeImage = 26;
var $author$project$I18n$GridSettings = 11;
var $author$project$Main$PickImage = {$: 0};
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode('path');
var $elm$svg$Svg$Attributes$strokeLinecap = _VirtualDom_attribute('stroke-linecap');
var $elm$svg$Svg$Attributes$strokeLinejoin = _VirtualDom_attribute('stroke-linejoin');
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var $elm$svg$Svg$Attributes$strokeWidth = _VirtualDom_attribute('stroke-width');
var $elm$svg$Svg$Attributes$style = _VirtualDom_attribute('style');
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $author$project$Main$svgIcon = F2(
	function (extraAttrs, children) {
		return A2(
			$elm$svg$Svg$svg,
			_Utils_ap(
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$viewBox('0 0 20 20'),
						$elm$svg$Svg$Attributes$width('20'),
						$elm$svg$Svg$Attributes$height('20'),
						$elm$svg$Svg$Attributes$fill('none'),
						$elm$svg$Svg$Attributes$stroke('currentColor'),
						$elm$svg$Svg$Attributes$strokeWidth('1.5'),
						A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true'),
						$elm$svg$Svg$Attributes$style('display:inline-block;vertical-align:middle')
					]),
				extraAttrs),
			children);
	});
var $author$project$Main$iconUpload = A2(
	$author$project$Main$svgIcon,
	_List_Nil,
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M10 3 L10 13'),
					$elm$svg$Svg$Attributes$strokeLinecap('round')
				]),
			_List_Nil),
			A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M6 7 L10 3 L14 7'),
					$elm$svg$Svg$Attributes$strokeLinecap('round'),
					$elm$svg$Svg$Attributes$strokeLinejoin('round')
				]),
			_List_Nil),
			A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M3 12 L3 16 Q3 17 4 17 L16 17 Q17 17 17 16 L17 12'),
					$elm$svg$Svg$Attributes$strokeLinecap('round'),
					$elm$svg$Svg$Attributes$strokeLinejoin('round')
				]),
			_List_Nil)
		]));
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$I18n$amharicTranslations = function (key) {
	switch (key) {
		case 0:
			return 'መጠን';
		case 1:
			return 'ቀለም';
		case 2:
			return 'ውፍረት';
		case 3:
			return 'ግልጽነት';
		case 4:
			return 'የፍርግርግ ምስልዎን ያውርዱ!';
		case 5:
			return 'ጥሩ! ';
		case 6:
			return 'እስካሁን ምንም ምስል የለም! ለመጀመር ምስል ይጫኑ ጠቅ ያድርጉ!';
		case 7:
			return 'ቋንቋ:';
		case 8:
			return 'ሰላም። ይህ በእርስዎ ምርጫ ምስል ላይ አራት ማዕዘናዊ ፍርግርግ እንዲፈጥሩ ይረዳዎታል';
		case 9:
			return 'ለመጀመር ምስል ይጫኑ';
		case 10:
			return 'ፋይል ይምረጡ';
		case 11:
			return 'የፍርግርግ ቅንብሮች';
		case 12:
			return 'አውርድ';
		case 13:
			return 'Gridit, baby! ማንኛውንም ምስል ይጫኑ፣ ፍርግርግ ያስቀምጡ እና ስዕልዎን ወደ ሸራ ለማስፋት ይጠቀሙበት። ከህዳሴው ጌቶች እስከ ዘመናዊ ሥዕላውያን ድረስ አርቲስቶች ይህን ዘዴ ለምዕተ ዓመታት ተጠቅመውበታል \u2014 ቅንብሮችን በትክክል ለማስተላለፍ እና ለማስፋት።';
		case 14:
			return 'ከፍተኛ 5MB';
		case 15:
			return 'JPG፣ PNG፣ GIF ይደገፋል';
		case 16:
			return 'በአርጀንቲና ተሰርቷል በ';
		case 17:
			return 'Gridit ምንድን ነው?';
		case 18:
			return 'ሰላም! ኮድ መጻፍ እና መሳል የሚወድ ገንቢ ነኝ። Gridit ፍርግርጎችን በመጠቀም ስዕሎችን ወደ ሸራ ለማስተላለፍ ይረዳኛል። ለእርስዎም እንደሚረዳ ተስፋ አደርጋለሁ!';
		case 19:
			return 'ምስልዎ መሳሪያዎን ፈጽሞ አይለቅም';
		case 20:
			return 'ወርዷል!';
		case 21:
			return 'ፍርግርግ ቀያይር';
		case 22:
			return 'ፍርግርግ አሳይ';
		case 23:
			return 'ፍርግርግ ደብቅ';
		case 24:
			return 'ወደ ፍርግርግ ሰያፍ መስመሮችን ጨምር';
		case 25:
			return '\u1309\u1309\u1275 \u12A0\u1208\u1205? \u1235\u1208\u12DA\u1205 \u12E8\u12D8\u1218\u1293\u1275 \u12D8\u12F4 \u1260\u12CA\u12AA\u1354\u12F2\u12EB \u120B\u12ED \u1270\u132B\u121B\u122A \u12EB\u1295\u1265\u1261:';
		default:
			return '\u120C\u120B \u121D\u1235\u120D \u12ED\u121D\u1228\u1321';
	}
};
var $author$project$I18n$asturianoTranslations = function (key) {
	switch (key) {
		case 0:
			return 'Tamanu';
		case 1:
			return 'Color';
		case 2:
			return 'Grosor';
		case 3:
			return 'Opacida';
		case 4:
			return 'Descarga la to Imaxe con Cuadricula!';
		case 5:
			return 'Guapu! ';
		case 6:
			return 'Enta nun hai imaxe! Fai clic en Xubir Imaxe pa entamar!';
		case 7:
			return 'Llingua:';
		case 8:
			return 'Hola. Esto ayudate a crear una cuadricula retilinia sobro una imaxen de la to eleicion';
		case 9:
			return 'Xube una imaxe pa entamar';
		case 10:
			return 'Escueyi Ficheru';
		case 11:
			return 'Axustes de Cuadricula';
		case 12:
			return 'Descarga';
		case 13:
			return 'Gridit, baby! Xube cualquier imaxe, superpone una cuadricula y usala pa escalar el to dibuxu al llenzu. Los artistes usaron esta tecnica durante sieglos \u2014 dende los maestros del Renacimientu hasta los ilustradores modernos \u2014 pa transferir y ampliar composiciones con precision.';
		case 14:
			return 'Max 5MB';
		case 15:
			return 'JPG, PNG, GIF soportaos';
		case 16:
			return 'Fechu n\'Arxentina con';
		case 17:
			return 'Que ye Gridit?';
		case 18:
			return 'Hola! Soi una desarrolladora que-y presta programar y pintar. Gridit ayudame a tresferir bocetos al llienzu usando cuadricules. Espero que te sirva tambien!';
		case 19:
			return 'La to imaxe nunca sal del to dispositivu';
		case 20:
			return 'Descargau!';
		case 21:
			return 'Alternar Cuadricula';
		case 22:
			return 'Amosar Cuadricula';
		case 23:
			return 'Anubrir Cuadricula';
		case 24:
			return 'Amestar llinies diagonales a la cuadricula';
		case 25:
			return 'Curiosu? Llee mas sobre esti metodu centenariu na Wikipedia:';
		default:
			return 'Escueyi otra imaxe';
	}
};
var $author$project$I18n$englishTranslations = function (key) {
	switch (key) {
		case 0:
			return 'Size';
		case 1:
			return 'Color';
		case 2:
			return 'Thickness';
		case 3:
			return 'Opacity';
		case 4:
			return 'Download!';
		case 5:
			return 'Nice! ';
		case 6:
			return 'No image yet! Click Upload Image to begin!';
		case 7:
			return 'Language:';
		case 8:
			return 'Grid your reference image the way artists do \u2014 private, free, in 14 languages';
		case 9:
			return 'Upload an image to begin';
		case 10:
			return 'Choose File';
		case 11:
			return 'Grid Settings';
		case 12:
			return 'Download';
		case 13:
			return 'Gridit, baby! Upload any image, overlay a grid, and use it to scale your drawing onto canvas. Artists have used this technique for centuries \u2014 from Renaissance masters to modern illustrators \u2014 to transfer and enlarge compositions with precision.';
		case 14:
			return 'Max 5MB';
		case 15:
			return 'JPG, PNG, GIF supported';
		case 16:
			return 'Made in Argentina with';
		case 17:
			return 'What\'s Gridit?';
		case 18:
			return 'Hi! I\'m a developer who loves to code and paint. Gridit helps me transfer sketches to canvas using grids. Hope it helps you too!';
		case 19:
			return 'Your image never leaves your device';
		case 20:
			return 'Downloaded!';
		case 21:
			return 'Toggle Grid';
		case 22:
			return 'Show Grid';
		case 23:
			return 'Hide Grid';
		case 24:
			return 'Add diagonal lines to grid';
		case 25:
			return 'Curious? Read more about this centuries-old method on Wikipedia:';
		default:
			return 'Choose another image';
	}
};
var $author$project$I18n$euskaraTranslations = function (key) {
	switch (key) {
		case 0:
			return 'Tamaina';
		case 1:
			return 'Kolorea';
		case 2:
			return 'Lodiera';
		case 3:
			return 'Opakutasuna';
		case 4:
			return 'Zure Saretadun Irudia Deskargatu!';
		case 5:
			return 'Bikain! ';
		case 6:
			return 'Oraindik ez dago irudirik! Egin klik Irudia Igo botoian hasteko!';
		case 7:
			return 'Hizkuntza:';
		case 8:
			return 'Kaixo. Honek hautatutako irudi baten gainean sareta zuzen bat sortzen laguntzen dizu';
		case 9:
			return 'Igo irudi bat hasteko';
		case 10:
			return 'Fitxategia Aukeratu';
		case 11:
			return 'Sareta Ezarpenak';
		case 12:
			return 'Deskargatu';
		case 13:
			return 'Gridit, baby! Igo edozein irudi, gainjarri sareta bat eta erabili zure marrazkia mihisera eskalatzeko. Artistek teknika hau mendeetan zehar erabili dute \u2014 Pizkundeko maisuengandik egungo ilustratzaileetara \u2014 konposizioak zehaztasunez transferitzeko eta handitzeko.';
		case 14:
			return 'Gehienez 5MB';
		case 15:
			return 'JPG, PNG, GIF onartuta';
		case 16:
			return 'Argentinan egina honekin';
		case 17:
			return 'Zer da Gridit?';
		case 18:
			return 'Kaixo! Programatzea eta margotzea maite duen garatzailea naiz. Gridit-ek zirriborroak oihalera transferitzen laguntzen dit saretak erabiliz. Espero dut zuri ere laguntzea!';
		case 19:
			return 'Zure irudia ez da inoiz zure gailutik ateratzen';
		case 20:
			return 'Deskargatuta!';
		case 21:
			return 'Sareta Txandakatu';
		case 22:
			return 'Sareta Erakutsi';
		case 23:
			return 'Sareta Ezkutatu';
		case 24:
			return 'Lerro diagonalak gehitu saretari';
		case 25:
			return 'Jakin-mina? Irakurri gehiago metodo mendetako honi buruz Wikipedian:';
		default:
			return 'Beste irudi bat aukeratu';
	}
};
var $author$project$I18n$frenchTranslations = function (key) {
	switch (key) {
		case 0:
			return 'Taille';
		case 1:
			return 'Couleur';
		case 2:
			return 'Epaisseur';
		case 3:
			return 'Opacite';
		case 4:
			return 'Telechargez votre Image avec Grille!';
		case 5:
			return 'Sympa! ';
		case 6:
			return 'Pas encore d\'image! Cliquez sur Telecharger une Image pour commencer!';
		case 7:
			return 'Langue:';
		case 8:
			return 'Bonjour. Ceci vous aide a creer une grille rectiligne sur une image de votre choix';
		case 9:
			return 'Telechargez une image pour commencer';
		case 10:
			return 'Choisir Fichier';
		case 11:
			return 'Parametres de Grille';
		case 12:
			return 'Telecharger';
		case 13:
			return 'Gridit, baby! Telechargez n\'importe quelle image, superposez une grille et utilisez-la pour mettre a l\'echelle votre dessin sur toile. Les artistes utilisent cette technique depuis des siecles \u2014 des maitres de la Renaissance aux illustrateurs modernes \u2014 pour transferer et agrandir des compositions avec precision.';
		case 14:
			return 'Max 5Mo';
		case 15:
			return 'JPG, PNG, GIF supportes';
		case 16:
			return 'Fait en Argentine avec';
		case 17:
			return 'C\'est quoi Gridit?';
		case 18:
			return 'Salut! Je suis une developpeuse qui aime coder et peindre. Gridit m\'aide a transferer des croquis sur toile en utilisant des grilles. J\'espere que ca vous aide aussi!';
		case 19:
			return 'Votre image ne quitte jamais votre appareil';
		case 20:
			return 'Telecharge!';
		case 21:
			return 'Basculer la Grille';
		case 22:
			return 'Afficher la Grille';
		case 23:
			return 'Masquer la Grille';
		case 24:
			return 'Ajouter des lignes diagonales a la grille';
		case 25:
			return 'Curieux ? Decouvrez cette methode seculaire sur Wikipedia :';
		default:
			return 'Choisir une autre image';
	}
};
var $author$project$I18n$gaelicTranslations = function (key) {
	switch (key) {
		case 0:
			return 'Meud';
		case 1:
			return 'Dath';
		case 2:
			return 'Tiughad';
		case 3:
			return 'Dorchadas';
		case 4:
			return 'Luchdaich sios do Dhealbh le Griod!';
		case 5:
			return 'Sgoinneil! ';
		case 6:
			return 'Chan eil dealbh ann fhathast! Cliog air Luchdaich Dealbh gus toiseachadh!';
		case 7:
			return 'Canan:';
		case 8:
			return 'Halo. Bidh seo a\' cuideachadh thu le bhith a\' cruthachadh griod direach air iomhaigh de do roghainn';
		case 9:
			return 'Luchdaich dealbh gus toiseachadh';
		case 10:
			return 'Tagh Faidhle';
		case 11:
			return 'Suidheachaidhean Griod';
		case 12:
			return 'Luchdaich sios';
		case 13:
			return 'Gridit, baby! Luchdaich dealbh sam bith, cuir griod air a mhuin agus cleachd e gus do dhealbh a sgaladh air canabhas. Tha luchd-ealain air an doigh seo a chleachdadh fad linntean \u2014 bho mhaighstirean an Ath-bheothachaidh gu dealbhadairean an latha an-diugh \u2014 gus co-dhealbhaidhean a ghluasad agus a mheudachadh le cinnt.';
		case 14:
			return 'Max 5MB';
		case 15:
			return 'JPG, PNG, GIF le taic';
		case 16:
			return 'Air a dheanamh ann an Argentina le';
		case 17:
			return 'De th\' ann an Gridit?';
		case 18:
			return 'Halo! Is mise leasaichear a tha gaolach air codadh agus peantadh. Tha Gridit gam chuideachadh gus sgeidseachan a ghluasad gu canabhas le griodaichean. Tha mi an dochas gun cuidich e thu cuideachd!';
		case 19:
			return 'Chan fhag an dealbh agad an t-inneal agad gu brath';
		case 20:
			return 'Air a luchdachadh sios!';
		case 21:
			return 'Tionndaidh Griod';
		case 22:
			return 'Seall Griod';
		case 23:
			return 'Falaich Griod';
		case 24:
			return 'Cuir loidhnichean trasna ris a\' ghriod';
		case 25:
			return 'An e rud ur a tha seo? Leugh barrachd mu dheidhinn an doigh linntean a dh\'aois seo air Wikipedia:';
		default:
			return 'Tagh dealbh eile';
	}
};
var $author$project$I18n$hebrewTranslations = function (key) {
	switch (key) {
		case 0:
			return 'גודל';
		case 1:
			return 'צבע';
		case 2:
			return 'עובי';
		case 3:
			return 'שקיפות';
		case 4:
			return 'הורד את התמונה עם הרשת!';
		case 5:
			return 'יפה! ';
		case 6:
			return 'אין תמונה עדיין! לחץ על העלאת תמונה כדי להתחיל!';
		case 7:
			return 'שפה:';
		case 8:
			return 'שלום. זה עוזר לך ליצור רשת מלבנית על תמונה לבחירתך';
		case 9:
			return 'העלה תמונה כדי להתחיל';
		case 10:
			return 'בחר קובץ';
		case 11:
			return 'הגדרות רשת';
		case 12:
			return 'הורדה';
		case 13:
			return 'Gridit, baby! העלו כל תמונה, הניחו רשת ושימשו בה כדי להגדיל את הציור על הבד. אמנים השתמשו בטכניקה הזו במשך מאות שנים \u2014 ממאסטרי הרנסנס ועד מאיירים מודרניים \u2014 כדי להעביר ולהגדיל קומפוזיציות בדיוק.';
		case 14:
			return 'מקסימום 5MB';
		case 15:
			return 'JPG, PNG, GIF נתמכים';
		case 16:
			return 'נעשה בארגנטינה עם';
		case 17:
			return 'מה זה Gridit?';
		case 18:
			return 'שלום! אני מפתחת שאוהבת לתכנת ולצייר. Gridit עוזר לי להעביר סקיצות לקנבס באמצעות רשתות. מקווה שזה יעזור גם לך!';
		case 19:
			return 'התמונה שלך אף פעם לא עוזבת את המכשיר שלך';
		case 20:
			return '!הורד בהצלחה';
		case 21:
			return 'הצג/הסתר רשת';
		case 22:
			return 'הצג רשת';
		case 23:
			return 'הסתר רשת';
		case 24:
			return 'הוסף קווים אלכסוניים לרשת';
		case 25:
			return '\u05E1\u05E7\u05E8\u05E0\u05D9\u05DD? \u05E7\u05E8\u05D0\u05D5 \u05E2\u05D5\u05D3 \u05E2\u05DC \u05D4\u05E9\u05D9\u05D8\u05D4 \u05D4\u05E2\u05EA\u05D9\u05E7\u05D4 \u05D4\u05D6\u05D5 \u05D1\u05D5\u05D5\u05D9\u05E7\u05D9\u05E4\u05D3\u05D9\u05D4:';
		default:
			return '\u05D1\u05D7\u05E8 \u05EA\u05DE\u05D5\u05E0\u05D4 \u05D0\u05D7\u05E8\u05EA';
	}
};
var $author$project$I18n$italianTranslations = function (key) {
	switch (key) {
		case 0:
			return 'Dimensione';
		case 1:
			return 'Colore';
		case 2:
			return 'Spessore';
		case 3:
			return 'Opacita';
		case 4:
			return 'Scarica la tua Immagine con Griglia!';
		case 5:
			return 'Bello! ';
		case 6:
			return 'Nessuna immagine ancora! Clicca su Carica Immagine per iniziare!';
		case 7:
			return 'Lingua:';
		case 8:
			return 'Ciao. Questo ti aiuta a creare una griglia rettilinea su un\'immagine di tua scelta';
		case 9:
			return 'Carica un\'immagine per iniziare';
		case 10:
			return 'Scegli File';
		case 11:
			return 'Impostazioni Griglia';
		case 12:
			return 'Scarica';
		case 13:
			return 'Gridit, baby! Carica qualsiasi immagine, sovrapponi una griglia e usala per scalare il tuo disegno sulla tela. Gli artisti hanno usato questa tecnica per secoli \u2014 dai maestri del Rinascimento agli illustratori moderni \u2014 per trasferire e ingrandire composizioni con precisione.';
		case 14:
			return 'Max 5MB';
		case 15:
			return 'JPG, PNG, GIF supportati';
		case 16:
			return 'Fatto in Argentina con';
		case 17:
			return 'Cos\'e Gridit?';
		case 18:
			return 'Ciao! Sono una sviluppatrice che ama programmare e dipingere. Gridit mi aiuta a trasferire schizzi sulla tela usando griglie. Spero sia utile anche a te!';
		case 19:
			return 'La tua immagine non lascia mai il tuo dispositivo';
		case 20:
			return 'Scaricato!';
		case 21:
			return 'Mostra/Nascondi Griglia';
		case 22:
			return 'Mostra Griglia';
		case 23:
			return 'Nascondi Griglia';
		case 24:
			return 'Aggiungi linee diagonali alla griglia';
		case 25:
			return 'Curiosi? Scoprite di piu su questo metodo secolare su Wikipedia:';
		default:
			return 'Scegli un\'altra immagine';
	}
};
var $author$project$I18n$japaneseTranslations = function (key) {
	switch (key) {
		case 0:
			return 'サイズ';
		case 1:
			return '色';
		case 2:
			return '太さ';
		case 3:
			return '不透明度';
		case 4:
			return 'グリッド付き画像をダウンロード!';
		case 5:
			return 'いいね! ';
		case 6:
			return 'まだ画像がありません!画像をアップロードをクリックして始めましょう!';
		case 7:
			return '言語:';
		case 8:
			return 'こんにちは。これはあなたが選んだ画像上に直線グリッドを作成するのに役立ちます';
		case 9:
			return '画像をアップロードして始めましょう';
		case 10:
			return 'ファイル選択';
		case 11:
			return 'グリッド設定';
		case 12:
			return 'ダウンロード';
		case 13:
			return 'Gridit, baby! 画像をアップロードし、グリッドを重ねて、キャンバスへの拡大に活用しましょう。ルネサンスの巨匠から現代のイラストレーターまで、何世紀にもわたってアーティストたちが使ってきた技法です。';
		case 14:
			return '最大5MB';
		case 15:
			return 'JPG、PNG、GIF対応';
		case 16:
			return 'アルゼンチン製';
		case 17:
			return 'Griditとは?';
		case 18:
			return 'こんにちは!プログラミングと絵を描くことが大好きな開発者です。Griditはグリッドを使ってスケッチをキャンバスに転写するのに役立ちます。あなたにも役立つことを願っています!';
		case 19:
			return '画像はデバイスから離れません';
		case 20:
			return 'ダウンロード完了!';
		case 21:
			return 'グリッド切替';
		case 22:
			return 'グリッド表示';
		case 23:
			return 'グリッド非表示';
		case 24:
			return 'グリッドに対角線を追加';
		case 25:
			return '\u3082\u3063\u3068\u77E5\u308A\u305F\u3044\uFF1F\u3053\u306E\u4F55\u4E16\u7D00\u3082\u306E\u6B74\u53F2\u3042\u308B\u624B\u6CD5\u306B\u3064\u3044\u3066Wikipedia\u3067\u8AAD\u3080\uFF1A';
		default:
			return '\u5225\u306E\u753B\u50CF\u3092\u9078\u629E';
	}
};
var $author$project$I18n$latinTranslations = function (key) {
	switch (key) {
		case 0:
			return 'Magnitudinem';
		case 1:
			return 'Color';
		case 2:
			return 'Crassitudo';
		case 3:
			return 'Opacitas';
		case 4:
			return 'Imago cum Craticula Discaricare!';
		case 5:
			return 'Bellus! ';
		case 6:
			return 'Nondum imago! Imago Submittere preme ut incipias!';
		case 7:
			return 'Lingua:';
		case 8:
			return 'Salve. Hoc te adiuvat creare reticulum rectilineare super imaginem tuam electam';
		case 9:
			return 'Submitte imaginem ut incipias';
		case 10:
			return 'Eligere Fasciculum';
		case 11:
			return 'Configuratio Reticulationis';
		case 12:
			return 'Discaricare';
		case 13:
			return 'Gridit, infans! Quamlibet imaginem submitte, reticulum superpone, et eo utere ut picturam tuam in tabulam transferas. Artifices hanc artem per saecula adhibuerunt \u2014 a magistris Renascentiae ad illustratores modernos \u2014 ut compositiones cum praecisione transferant et amplificent.';
		case 14:
			return 'Max 5MB';
		case 15:
			return 'JPG, PNG, GIF sustinetur';
		case 16:
			return 'Factum in Argentina cum';
		case 17:
			return 'Quid est Gridit?';
		case 18:
			return 'Salve! Sum programmator qui amat codicem scribere et pingere. Gridit me adiuvat picturas ad telam transferre utens cratibulis. Spero tibi quoque prodesse!';
		case 19:
			return 'Imago tua numquam discedit de instrumento tuo';
		case 20:
			return 'Discariatum!';
		case 21:
			return 'Commutare Reticulationem';
		case 22:
			return 'Ostende Reticulationem';
		case 23:
			return 'Cela Reticulationem';
		case 24:
			return 'Adde lineas diagonales reticulationi';
		case 25:
			return 'Curiose? Lege plura de hac arte saeculari in Vicipaedia:';
		default:
			return 'Aliam imaginem eligere';
	}
};
var $author$project$I18n$portugueseTranslations = function (key) {
	switch (key) {
		case 0:
			return 'Tamanho';
		case 1:
			return 'Cor';
		case 2:
			return 'Espessura';
		case 3:
			return 'Opacidade';
		case 4:
			return 'Baixe sua Imagem com Grade!';
		case 5:
			return 'Legal! ';
		case 6:
			return 'Nenhuma imagem ainda! Clique em Carregar Imagem para comecar!';
		case 7:
			return 'Idioma:';
		case 8:
			return 'Ola. Isto ajuda-te a criar uma grelha retilinea sobre uma imagem a tua escolha';
		case 9:
			return 'Carregue uma imagem para comecar';
		case 10:
			return 'Escolher Arquivo';
		case 11:
			return 'Configuracoes de Grade';
		case 12:
			return 'Baixar';
		case 13:
			return 'Gridit, baby! Carrega qualquer imagem, sobrepe uma grelha e usa-a para escalar o teu desenho para a tela. Os artistas usam esta tecnica ha seculos \u2014 dos mestres do Renascimento aos ilustradores modernos \u2014 para transferir e ampliar composicoes com precisao.';
		case 14:
			return 'Max 5MB';
		case 15:
			return 'JPG, PNG, GIF suportados';
		case 16:
			return 'Feito na Argentina com';
		case 17:
			return 'O que e Gridit?';
		case 18:
			return 'Ola! Sou uma desenvolvedora que ama programar e pintar. Gridit me ajuda a transferir esbocos para a tela usando grades. Espero que te ajude tambem!';
		case 19:
			return 'A sua imagem nunca sai do seu dispositivo';
		case 20:
			return 'Baixado!';
		case 21:
			return 'Alternar Grade';
		case 22:
			return 'Mostrar Grade';
		case 23:
			return 'Ocultar Grade';
		case 24:
			return 'Adicionar linhas diagonais a grade';
		case 25:
			return 'Curioso? Le mais sobre este metodo centenario na Wikipedia:';
		default:
			return 'Escolher outra imagem';
	}
};
var $author$project$I18n$russianTranslations = function (key) {
	switch (key) {
		case 0:
			return 'Размер';
		case 1:
			return 'Цвет';
		case 2:
			return 'Толщина';
		case 3:
			return 'Прозрачность';
		case 4:
			return 'Скачать изображение с сеткой!';
		case 5:
			return 'Отлично! ';
		case 6:
			return 'Изображения пока нет! Нажмите Загрузить изображение, чтобы начать!';
		case 7:
			return 'Язык:';
		case 8:
			return 'Здравствуйте. Это поможет вам создать прямоугольную сетку поверх выбранного вами изображения';
		case 9:
			return 'Загрузите изображение, чтобы начать';
		case 10:
			return 'Выбрать Файл';
		case 11:
			return 'Настройки Сетки';
		case 12:
			return 'Скачать';
		case 13:
			return 'Gridit, baby! Загрузите любое изображение, наложите сетку и используйте её для масштабирования рисунка на холст. Художники используют эту технику веками \u2014 от мастеров Ренессанса до современных иллюстраторов \u2014 для точного переноса и увеличения композиций.';
		case 14:
			return 'Макс 5МБ';
		case 15:
			return 'JPG, PNG, GIF поддерживаются';
		case 16:
			return 'Сделано в Аргентине с';
		case 17:
			return 'Что такое Gridit?';
		case 18:
			return 'Привет! Я разработчик, который любит программировать и рисовать. Gridit помогает мне переносить эскизы на холст с помощью сеток. Надеюсь, вам тоже пригодится!';
		case 19:
			return 'Ваше изображение никогда не покидает ваше устройство';
		case 20:
			return 'Скачано!';
		case 21:
			return 'Переключить сетку';
		case 22:
			return 'Показать сетку';
		case 23:
			return 'Скрыть сетку';
		case 24:
			return 'Добавить диагональные линии к сетке';
		case 25:
			return '\u041B\u044E\u0431\u043E\u043F\u044B\u0442\u043D\u043E? \u0427\u0438\u0442\u0430\u0439\u0442\u0435 \u0431\u043E\u043B\u044C\u0448\u0435 \u043E\u0431 \u044D\u0442\u043E\u043C \u0432\u0435\u043A\u043E\u0432\u043E\u043C \u043C\u0435\u0442\u043E\u0434\u0435 \u0432 \u0412\u0438\u043A\u0438\u043F\u0435\u0434\u0438\u0438:';
		default:
			return '\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0434\u0440\u0443\u0433\u043E\u0435 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435';
	}
};
var $author$project$I18n$spanishTranslations = function (key) {
	switch (key) {
		case 0:
			return 'Tama\u00F1o';
		case 1:
			return 'Color';
		case 2:
			return 'Grosor';
		case 3:
			return 'Opacidad';
		case 4:
			return 'Descargar!';
		case 5:
			return 'Buen\u00EDsimo! ';
		case 6:
			return 'Hace click en Subir Imagen para empezar!';
		case 7:
			return 'Idioma:';
		case 8:
			return 'Buenas. Agregale una grilla rectilinear a una imagen que elijas';
		case 9:
			return 'Subi una imagen para empezar';
		case 10:
			return 'Elegir imagen';
		case 11:
			return 'Ajustes de Cuadr\u00EDcula';
		case 12:
			return 'Descarga';
		case 13:
			return 'Gridit, baby! Sub\u00ED cualquier imagen, superpon\u00E9 una grilla rectilinear y utilizala para escalar tu dibujo al medio que prefieras. Esta t\u00E9cnica es antiqu\u00EDsima y se mantiene fuerte como uno de los m\u00E9todos m\u00E1s confiables para escalar y traspasar composiciones con precisi\u00F3n.';
		case 14:
			return 'Max 5MB';
		case 15:
			return 'JPG, PNG, GIF soportados';
		case 16:
			return 'Hecho en Argentina con';
		case 17:
			return 'Qu\u00E9 es Gridit?';
		case 18:
			return 'Hola! Soy una desarrolladora que ama programar y pintar. Gridit me ayuda a transferir bocetos al lienzo usando grillas. Espero que te sirva tambi\u00E9n!';
		case 19:
			return 'Tu imagen nunca sale de tu dispositivo';
		case 20:
			return 'Descargado!';
		case 21:
			return 'Alternar Grilla';
		case 22:
			return 'Mostrar Grilla';
		case 23:
			return 'Ocultar Grilla';
		case 24:
			return 'Agregar l\u00EDneas diagonales a la grilla';
		case 25:
			return 'Si te pica la curiosidad, ac\u00E1 te dejo unos links sobre este m\u00E9todo centenario:';
		default:
			return 'Elegir otra imagen';
	}
};
var $author$project$I18n$tuvanTranslations = function (key) {
	switch (key) {
		case 0:
			return 'Хемчээл';
		case 1:
			return 'Он';
		case 2:
			return 'Кылын';
		case 3:
			return 'Коскузу';
		case 4:
			return 'Шыйыглыг чурукту чудуруп алыр!';
		case 5:
			return 'Эки! ';
		case 6:
			return 'Чурук чок! Эгелээр дээш Чурукту киирер деп базынар!';
		case 7:
			return 'Дыл:';
		case 8:
			return 'Экии. Бо дээрге силерниин шилип алган чуруунарга дорт шыйыглар кылырынга дузалаар';
		case 9:
			return 'Эгелээр дээш чурукту киирингер';
		case 10:
			return 'Файл Шилиир';
		case 11:
			return 'Шыйыг Тургузуглары';
		case 12:
			return 'Чүдүрүп алыр';
		case 13:
			return 'Gridit, baby! Кандыг-даа чурук киирип, шыйыгны углааш, холстуже чуруунарны улгаттырарынга ажыглаңар. Чурукчулар бо аргатты чүс-чүс чылдар дургузунда ажыглап келгеннер \u2014 Ренессанстың улуг мастерлеринден амгы үениң иллюстраторларынга чедир.';
		case 14:
			return 'Эн хойу 5MB';
		case 15:
			return 'JPG, PNG, GIF ажыглаттынар';
		case 16:
			return 'Аргентинага кылган';
		case 17:
			return 'Gridit деп чуу?';
		case 18:
			return 'Экии! Мен программировать база чуруур ынак программист мен. Gridit менээ шыйыглар ажыглап скетчтерни холстче кожуреерге дузалаар. Силерге база дузалаар деп идегеп тур мен!';
		case 19:
			return 'Силерниин чуруунар силерниин херекселинерден кажан-даа унмес';
		case 20:
			return 'Чудурген!';
		case 21:
			return 'Шыйыгны солуур';
		case 22:
			return 'Шыйыгны коргузер';
		case 23:
			return 'Шыйыгны чажырар';
		case 24:
			return 'Шыйыгга кыйгаар шыйыглар немээр';
		case 25:
			return '\u0421\u043E\u043D\u0443\u0443\u0440\u0433\u0430\u043B\u0434\u044B\u0433 \u0431\u0435? \u0411\u043E \u044D\u0440\u0433\u0438 \u0430\u0440\u0433\u0430 \u0434\u0443\u0433\u0430\u0439\u044B\u043D\u0434\u0430 \u0412\u0438\u043A\u0438\u043F\u0435\u0434\u0438\u044F\u0434\u0430 \u043D\u043E\u043C\u0447\u0443\u04A3\u0430\u0440:';
		default:
			return '\u04E8\u0441\u043A\u0435 \u0447\u0443\u0440\u0443\u043A\u0442\u0443 \u0448\u0438\u043B\u0438\u0438\u0440';
	}
};
var $author$project$I18n$translate = F2(
	function (language, key) {
		switch (language) {
			case 0:
				return $author$project$I18n$englishTranslations(key);
			case 1:
				return $author$project$I18n$spanishTranslations(key);
			case 2:
				return $author$project$I18n$latinTranslations(key);
			case 3:
				return $author$project$I18n$italianTranslations(key);
			case 4:
				return $author$project$I18n$portugueseTranslations(key);
			case 5:
				return $author$project$I18n$frenchTranslations(key);
			case 6:
				return $author$project$I18n$asturianoTranslations(key);
			case 7:
				return $author$project$I18n$gaelicTranslations(key);
			case 8:
				return $author$project$I18n$euskaraTranslations(key);
			case 9:
				return $author$project$I18n$japaneseTranslations(key);
			case 10:
				return $author$project$I18n$russianTranslations(key);
			case 11:
				return $author$project$I18n$tuvanTranslations(key);
			case 12:
				return $author$project$I18n$amharicTranslations(key);
			default:
				return $author$project$I18n$hebrewTranslations(key);
		}
	});
var $author$project$Main$DownloadClicked = {$: 6};
var $author$project$I18n$DownloadGriddedImage = 4;
var $author$project$I18n$Downloaded = 20;
var $author$project$I18n$Nice = 5;
var $author$project$Main$NiceButtonClicked = {$: 4};
var $author$project$Main$ShareClicked = {$: 21};
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $elm$svg$Svg$Attributes$points = _VirtualDom_attribute('points');
var $elm$svg$Svg$polyline = $elm$svg$Svg$trustedNode('polyline');
var $author$project$Main$iconCheck = A2(
	$author$project$Main$svgIcon,
	_List_Nil,
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$polyline,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$points('4,10 8,15 16,5'),
					$elm$svg$Svg$Attributes$strokeLinecap('round'),
					$elm$svg$Svg$Attributes$strokeLinejoin('round')
				]),
			_List_Nil)
		]));
var $elm$svg$Svg$line = $elm$svg$Svg$trustedNode('line');
var $elm$svg$Svg$Attributes$x1 = _VirtualDom_attribute('x1');
var $elm$svg$Svg$Attributes$x2 = _VirtualDom_attribute('x2');
var $elm$svg$Svg$Attributes$y1 = _VirtualDom_attribute('y1');
var $elm$svg$Svg$Attributes$y2 = _VirtualDom_attribute('y2');
var $author$project$Main$iconDownload = A2(
	$author$project$Main$svgIcon,
	_List_Nil,
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$line,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x1('10'),
					$elm$svg$Svg$Attributes$y1('3'),
					$elm$svg$Svg$Attributes$x2('10'),
					$elm$svg$Svg$Attributes$y2('13')
				]),
			_List_Nil),
			A2(
			$elm$svg$Svg$polyline,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$points('6,10 10,14 14,10')
				]),
			_List_Nil),
			A2(
			$elm$svg$Svg$line,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x1('4'),
					$elm$svg$Svg$Attributes$y1('17'),
					$elm$svg$Svg$Attributes$x2('16'),
					$elm$svg$Svg$Attributes$y2('17')
				]),
			_List_Nil)
		]));
var $author$project$Main$iconHeart = A2(
	$author$project$Main$svgIcon,
	_List_Nil,
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M10 17 C4 12 1 8 4 5 Q7 2 10 6 Q13 2 16 5 C19 8 16 12 10 17 Z')
				]),
			_List_Nil)
		]));
var $author$project$Main$iconShare = A2(
	$author$project$Main$svgIcon,
	_List_Nil,
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M4 12 V16 Q4 17 5 17 L15 17 Q16 17 16 16 L16 12'),
					$elm$svg$Svg$Attributes$strokeLinecap('round'),
					$elm$svg$Svg$Attributes$strokeLinejoin('round')
				]),
			_List_Nil),
			A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M10 3 L10 12'),
					$elm$svg$Svg$Attributes$strokeLinecap('round')
				]),
			_List_Nil),
			A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M7 6 L10 3 L13 6'),
					$elm$svg$Svg$Attributes$strokeLinecap('round'),
					$elm$svg$Svg$Attributes$strokeLinejoin('round')
				]),
			_List_Nil)
		]));
var $elm$html$Html$span = _VirtualDom_node('span');
var $author$project$Main$viewActionButtons = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('action-buttons-wrapper')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('action-buttons')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('button button-primary button-download'),
								$elm$html$Html$Events$onClick($author$project$Main$DownloadClicked),
								$elm$html$Html$Attributes$disabled(
								_Utils_eq(model.t, $elm$core$Maybe$Nothing) || model.u)
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('button-icon')
									]),
								_List_fromArray(
									[
										model.E ? $author$project$Main$iconCheck : $author$project$Main$iconDownload
									])),
								$elm$html$Html$text(
								model.E ? A2($author$project$I18n$translate, model.a, 20) : (model.u ? '...' : A2($author$project$I18n$translate, model.a, 4)))
							])),
						model.Z ? A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('button button-share'),
								$elm$html$Html$Events$onClick($author$project$Main$ShareClicked),
								$elm$html$Html$Attributes$disabled(
								_Utils_eq(model.t, $elm$core$Maybe$Nothing) || model.u)
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('button-icon')
									]),
								_List_fromArray(
									[$author$project$Main$iconShare]))
							])) : $elm$html$Html$text('')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('nice-section')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('button button-nice'),
								$elm$html$Html$Events$onClick($author$project$Main$NiceButtonClicked),
								A2(
								$elm$html$Html$Attributes$attribute,
								'aria-label',
								A2($author$project$I18n$translate, model.a, 5))
							]),
						_List_fromArray(
							[$author$project$Main$iconHeart])),
						(model.O > 0) ? A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('nice-counter')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								'\u00D7' + $elm$core$String$fromInt(model.O))
							])) : $elm$html$Html$text('')
					]))
			]));
};
var $author$project$I18n$GridColor = 1;
var $author$project$Main$GridColorChanged = function (a) {
	return {$: 8, a: a};
};
var $elm$html$Html$Attributes$for = $elm$html$Html$Attributes$stringProperty('htmlFor');
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$label = _VirtualDom_node('label');
var $elm$html$Html$Attributes$maxlength = function (n) {
	return A2(
		_VirtualDom_attribute,
		'maxlength',
		$elm$core$String$fromInt(n));
};
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$core$String$toUpper = _String_toUpper;
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$Main$viewColorControl = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('control-group')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('control-header')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('control-label'),
								$elm$html$Html$Attributes$for('grid-color-input')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								A2($author$project$I18n$translate, model.a, 1))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('color-input-row')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('color'),
								$elm$html$Html$Attributes$id('grid-color-input'),
								$elm$html$Html$Attributes$value(model.j),
								$elm$html$Html$Events$onInput($author$project$Main$GridColorChanged),
								$elm$html$Html$Attributes$class('color-input')
							]),
						_List_Nil),
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('text'),
								$elm$html$Html$Attributes$value(model.j),
								$elm$html$Html$Events$onInput($author$project$Main$GridColorChanged),
								$elm$html$Html$Attributes$class('hex-text-input'),
								$elm$html$Html$Attributes$placeholder('#80ED99'),
								$elm$html$Html$Attributes$maxlength(7),
								A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Hex color value')
							]),
						_List_Nil)
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('color-presets')
					]),
				A2(
					$elm$core$List$map,
					function (color) {
						return A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class(
									_Utils_eq(
										$elm$core$String$toUpper(model.j),
										$elm$core$String$toUpper(color)) ? 'color-swatch color-swatch--selected' : 'color-swatch'),
									A2($elm$html$Html$Attributes$style, 'background-color', color),
									$elm$html$Html$Events$onClick(
									$author$project$Main$GridColorChanged(color)),
									A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Color ' + color)
								]),
							_List_Nil);
					},
					_List_fromArray(
						['#000000', '#FFFFFF', '#FF0000', '#0066FF', '#FFD700'])))
			]));
};
var $author$project$I18n$AddDiagonalLines = 24;
var $author$project$Main$ToggleDiagonals = function (a) {
	return {$: 13, a: a};
};
var $elm$html$Html$Attributes$checked = $elm$html$Html$Attributes$boolProperty('checked');
var $elm$html$Html$Events$targetChecked = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'checked']),
	$elm$json$Json$Decode$bool);
var $elm$html$Html$Events$onCheck = function (tagger) {
	return A2(
		$elm$html$Html$Events$on,
		'change',
		A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetChecked));
};
var $author$project$Main$viewDiagonalsToggle = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('toggle-row')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$input,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$type_('checkbox'),
						$elm$html$Html$Events$onCheck($author$project$Main$ToggleDiagonals),
						$elm$html$Html$Attributes$checked(model.f),
						$elm$html$Html$Attributes$class('toggle-checkbox'),
						$elm$html$Html$Attributes$id('diagonals')
					]),
				_List_Nil),
				A2(
				$elm$html$Html$label,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('toggle-label'),
						$elm$html$Html$Attributes$for('diagonals')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						A2($author$project$I18n$translate, model.a, 24))
					]))
			]));
};
var $author$project$I18n$GridOpacity = 3;
var $author$project$Main$GridOpacityChanged = function (a) {
	return {$: 10, a: a};
};
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$html$Html$Attributes$max = $elm$html$Html$Attributes$stringProperty('max');
var $elm$html$Html$Attributes$min = $elm$html$Html$Attributes$stringProperty('min');
var $elm$core$Basics$round = _Basics_round;
var $elm$html$Html$Attributes$step = function (n) {
	return A2($elm$html$Html$Attributes$stringProperty, 'step', n);
};
var $elm$core$String$toFloat = _String_toFloat;
var $author$project$Main$viewOpacityControl = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('control-group')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('control-header')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('control-label'),
								$elm$html$Html$Attributes$for('grid-opacity-input')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								A2($author$project$I18n$translate, model.a, 3))
							])),
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('control-value')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$elm$core$String$fromInt(
									$elm$core$Basics$round(model.m * 100)) + '%')
							]))
					])),
				A2(
				$elm$html$Html$input,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$type_('range'),
						$elm$html$Html$Attributes$id('grid-opacity-input'),
						$elm$html$Html$Attributes$min('0.1'),
						$elm$html$Html$Attributes$max('1'),
						$elm$html$Html$Attributes$step('0.1'),
						$elm$html$Html$Attributes$value(
						$elm$core$String$fromFloat(model.m)),
						$elm$html$Html$Events$onInput(
						function (s) {
							return $author$project$Main$GridOpacityChanged(
								A2(
									$elm$core$Maybe$withDefault,
									0.5,
									$elm$core$String$toFloat(s)));
						}),
						$elm$html$Html$Attributes$class('slider')
					]),
				_List_Nil)
			]));
};
var $author$project$I18n$GridSize = 0;
var $author$project$Main$GridSizeChanged = function (a) {
	return {$: 3, a: a};
};
var $author$project$Main$viewSizeControl = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('control-group')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('control-header')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('control-label'),
								$elm$html$Html$Attributes$for('grid-size-input')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								A2($author$project$I18n$translate, model.a, 0))
							])),
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('control-value')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$elm$core$String$fromInt(model.b) + ('x' + $elm$core$String$fromInt(model.b)))
							]))
					])),
				A2(
				$elm$html$Html$input,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$type_('range'),
						$elm$html$Html$Attributes$id('grid-size-input'),
						$elm$html$Html$Attributes$min('2'),
						$elm$html$Html$Attributes$max('32'),
						$elm$html$Html$Attributes$value(
						$elm$core$String$fromInt(model.b)),
						$elm$html$Html$Events$onInput(
						function (s) {
							return $author$project$Main$GridSizeChanged(
								A2(
									$elm$core$Maybe$withDefault,
									10,
									$elm$core$String$toInt(s)));
						}),
						$elm$html$Html$Attributes$class('slider')
					]),
				_List_Nil)
			]));
};
var $author$project$I18n$GridThickness = 2;
var $author$project$Main$GridThicknessChanged = function (a) {
	return {$: 9, a: a};
};
var $author$project$Main$viewThicknessControl = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('control-group')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('control-header')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('control-label'),
								$elm$html$Html$Attributes$for('grid-thickness-input')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								A2($author$project$I18n$translate, model.a, 2))
							])),
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('control-value')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$elm$core$String$fromInt(model.n) + 'px')
							]))
					])),
				A2(
				$elm$html$Html$input,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$type_('range'),
						$elm$html$Html$Attributes$id('grid-thickness-input'),
						$elm$html$Html$Attributes$min('1'),
						$elm$html$Html$Attributes$max('5'),
						$elm$html$Html$Attributes$value(
						$elm$core$String$fromInt(model.n)),
						$elm$html$Html$Events$onInput(
						function (s) {
							return $author$project$Main$GridThicknessChanged(
								A2(
									$elm$core$Maybe$withDefault,
									1,
									$elm$core$String$toInt(s)));
						}),
						$elm$html$Html$Attributes$class('slider')
					]),
				_List_Nil)
			]));
};
var $author$project$Main$viewControlsFace = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('card card-face')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('card-section-title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						A2($author$project$I18n$translate, model.a, 11))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('grid-controls-grid')
					]),
				_List_fromArray(
					[
						$author$project$Main$viewSizeControl(model),
						$author$project$Main$viewOpacityControl(model),
						$author$project$Main$viewThicknessControl(model),
						$author$project$Main$viewColorControl(model),
						$author$project$Main$viewDiagonalsToggle(model)
					])),
				$author$project$Main$viewActionButtons(model),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('change-image-link'),
						$elm$html$Html$Events$onClick($author$project$Main$PickImage)
					]),
				_List_fromArray(
					[
						$author$project$Main$iconUpload,
						$elm$html$Html$text(
						' ' + A2($author$project$I18n$translate, model.a, 26))
					]))
			]));
};
var $author$project$I18n$ChooseFile = 10;
var $author$project$I18n$ImagePrivacy = 19;
var $author$project$I18n$MaxFileSize = 14;
var $author$project$I18n$SupportedFormats = 15;
var $elm$svg$Svg$circle = $elm$svg$Svg$trustedNode('circle');
var $elm$svg$Svg$Attributes$cx = _VirtualDom_attribute('cx');
var $elm$svg$Svg$Attributes$cy = _VirtualDom_attribute('cy');
var $elm$svg$Svg$Attributes$r = _VirtualDom_attribute('r');
var $elm$svg$Svg$rect = $elm$svg$Svg$trustedNode('rect');
var $elm$svg$Svg$Attributes$rx = _VirtualDom_attribute('rx');
var $elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var $elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var $author$project$Main$iconLock = A2(
	$author$project$Main$svgIcon,
	_List_Nil,
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$rect,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x('4'),
					$elm$svg$Svg$Attributes$y('9'),
					$elm$svg$Svg$Attributes$width('12'),
					$elm$svg$Svg$Attributes$height('9'),
					$elm$svg$Svg$Attributes$rx('2')
				]),
			_List_Nil),
			A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M7 9 V6 Q7 2 10 2 Q13 2 13 6 V9')
				]),
			_List_Nil),
			A2(
			$elm$svg$Svg$circle,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$cx('10'),
					$elm$svg$Svg$Attributes$cy('14'),
					$elm$svg$Svg$Attributes$r('1.5'),
					$elm$svg$Svg$Attributes$fill('currentColor')
				]),
			_List_Nil)
		]));
var $elm$html$Html$p = _VirtualDom_node('p');
var $author$project$Main$viewUploadFace = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('card card-face')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('button button-upload button-upload--prominent'),
						$elm$html$Html$Events$onClick($author$project$Main$PickImage),
						A2($elm$html$Html$Attributes$attribute, 'data-testid', 'upload-button')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						A2($author$project$I18n$translate, model.a, 10)),
						$elm$html$Html$text(' '),
						$author$project$Main$iconUpload
					])),
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('card-text-small')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						A2($author$project$I18n$translate, model.a, 14) + (' \u2022 ' + A2($author$project$I18n$translate, model.a, 15)))
					])),
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('privacy-note')
					]),
				_List_fromArray(
					[
						$author$project$Main$iconLock,
						$elm$html$Html$text(' '),
						$elm$html$Html$text(
						A2($author$project$I18n$translate, model.a, 19))
					]))
			]));
};
var $author$project$Main$viewCardRegion = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('card-region')
			]),
		_List_fromArray(
			[
				function () {
				var _v0 = model.t;
				if (_v0.$ === 1) {
					return $author$project$Main$viewUploadFace(model);
				} else {
					return $author$project$Main$viewControlsFace(model);
				}
			}()
			]));
};
var $author$project$I18n$FooterTooltip = 18;
var $author$project$I18n$MadeInArgentina = 16;
var $author$project$Main$iconGreenHeart = A2(
	$author$project$Main$svgIcon,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$fill('currentColor'),
			$elm$svg$Svg$Attributes$stroke('none')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M10 17 C4 12 1 8 4 5 Q7 2 10 6 Q13 2 16 5 C19 8 16 12 10 17 Z')
				]),
			_List_Nil)
		]));
var $elm$html$Html$Attributes$tabindex = function (n) {
	return A2(
		_VirtualDom_attribute,
		'tabIndex',
		$elm$core$String$fromInt(n));
};
var $author$project$Main$viewFooter = function (model) {
	return A3(
		$elm$html$Html$node,
		'footer',
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('app-footer')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('footer-content')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('tooltip-container'),
								A2($elm$html$Html$Attributes$attribute, 'aria-describedby', 'footer-tooltip')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('footer-text-main')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										A2($author$project$I18n$translate, model.a, 16) + ' '),
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'color', '#4ade80')
											]),
										_List_fromArray(
											[$author$project$Main$iconGreenHeart])),
										$elm$html$Html$text(' (\u2579\u25E1\u2579\u0E51)')
									])),
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('tooltip-content'),
										$elm$html$Html$Attributes$tabindex(0),
										$elm$html$Html$Attributes$id('footer-tooltip'),
										A2($elm$html$Html$Attributes$attribute, 'role', 'tooltip')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										A2($author$project$I18n$translate, model.a, 18))
									]))
							]))
					]))
			]));
};
var $author$project$I18n$AppSubtitle = 8;
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $elm$svg$Svg$Attributes$opacity = _VirtualDom_attribute('opacity');
var $author$project$Main$iconFrogSized = function (size) {
	return A2(
		$author$project$Main$svgIcon,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$width(size),
				$elm$svg$Svg$Attributes$height(size)
			]),
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$circle,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$cx('6'),
						$elm$svg$Svg$Attributes$cy('6'),
						$elm$svg$Svg$Attributes$r('3')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$circle,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$cx('14'),
						$elm$svg$Svg$Attributes$cy('6'),
						$elm$svg$Svg$Attributes$r('3')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$circle,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$cx('6'),
						$elm$svg$Svg$Attributes$cy('6'),
						$elm$svg$Svg$Attributes$r('1'),
						$elm$svg$Svg$Attributes$fill('currentColor')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$circle,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$cx('14'),
						$elm$svg$Svg$Attributes$cy('6'),
						$elm$svg$Svg$Attributes$r('1'),
						$elm$svg$Svg$Attributes$fill('currentColor')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$path,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$d('M4 12 Q10 18 16 12'),
						$elm$svg$Svg$Attributes$strokeLinecap('round')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$line,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x1('0'),
						$elm$svg$Svg$Attributes$y1('10'),
						$elm$svg$Svg$Attributes$x2('20'),
						$elm$svg$Svg$Attributes$y2('10'),
						$elm$svg$Svg$Attributes$opacity('0.6')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$line,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x1('10'),
						$elm$svg$Svg$Attributes$y1('0'),
						$elm$svg$Svg$Attributes$x2('10'),
						$elm$svg$Svg$Attributes$y2('20'),
						$elm$svg$Svg$Attributes$opacity('0.6')
					]),
				_List_Nil)
			]));
};
var $author$project$Main$iconFrog = $author$project$Main$iconFrogSized('20');
var $author$project$Main$LanguageChanged = function (a) {
	return {$: 11, a: a};
};
var $author$project$I18n$LanguageLabel = 7;
var $elm$svg$Svg$ellipse = $elm$svg$Svg$trustedNode('ellipse');
var $elm$svg$Svg$Attributes$ry = _VirtualDom_attribute('ry');
var $author$project$Main$iconGlobe = A2(
	$author$project$Main$svgIcon,
	_List_Nil,
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$circle,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$cx('10'),
					$elm$svg$Svg$Attributes$cy('10'),
					$elm$svg$Svg$Attributes$r('8')
				]),
			_List_Nil),
			A2(
			$elm$svg$Svg$ellipse,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$cx('10'),
					$elm$svg$Svg$Attributes$cy('10'),
					$elm$svg$Svg$Attributes$rx('4'),
					$elm$svg$Svg$Attributes$ry('8')
				]),
			_List_Nil),
			A2(
			$elm$svg$Svg$line,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x1('2'),
					$elm$svg$Svg$Attributes$y1('10'),
					$elm$svg$Svg$Attributes$x2('18'),
					$elm$svg$Svg$Attributes$y2('10')
				]),
			_List_Nil)
		]));
var $elm$html$Html$option = _VirtualDom_node('option');
var $author$project$Main$parseLanguage = function (langValue) {
	return A2(
		$elm$core$Maybe$withDefault,
		0,
		$elm$core$List$head(
			A2(
				$elm$core$List$filter,
				function (lang) {
					return _Utils_eq(
						$author$project$Main$languageMeta(lang).k,
						langValue);
				},
				$author$project$Main$allLanguages)));
};
var $elm$html$Html$select = _VirtualDom_node('select');
var $elm$html$Html$Attributes$selected = $elm$html$Html$Attributes$boolProperty('selected');
var $author$project$Main$viewLanguageSelector = function (currentLanguage) {
	var languageOption = function (language) {
		var meta = $author$project$Main$languageMeta(language);
		return A2(
			$elm$html$Html$option,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$value(meta.k),
					$elm$html$Html$Attributes$selected(
					_Utils_eq(currentLanguage, language)),
					A2($elm$html$Html$Attributes$attribute, 'aria-label', meta.i)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(
					meta.i + (' (' + ($elm$core$String$toUpper(meta.c) + ')')))
				]));
	};
	var handleLanguageChange = function (langValue) {
		return $author$project$Main$LanguageChanged(
			$author$project$Main$parseLanguage(langValue));
	};
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('language-selector compact')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('globe-icon')
					]),
				_List_fromArray(
					[$author$project$Main$iconGlobe])),
				A2(
				$elm$html$Html$label,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$for('language-select'),
						$elm$html$Html$Attributes$class('sr-only')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						A2($author$project$I18n$translate, currentLanguage, 7))
					])),
				A2(
				$elm$html$Html$select,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('language-select'),
						A2(
						$elm$html$Html$Events$on,
						'change',
						A2(
							$elm$json$Json$Decode$map,
							handleLanguageChange,
							A2(
								$elm$json$Json$Decode$at,
								_List_fromArray(
									['target', 'value']),
								$elm$json$Json$Decode$string))),
						$elm$html$Html$Attributes$class('language-dropdown compact'),
						A2(
						$elm$html$Html$Attributes$attribute,
						'aria-label',
						A2($author$project$I18n$translate, currentLanguage, 7))
					]),
				A2($elm$core$List$map, languageOption, $author$project$Main$allLanguages))
			]));
};
var $author$project$Main$viewHeader = function (model) {
	return A3(
		$elm$html$Html$node,
		'header',
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('app-header')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('header-content')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h1,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('app-title')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Gridit Baby! '),
								$author$project$Main$iconFrog
							])),
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('app-subtitle')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								A2($author$project$I18n$translate, model.a, 8))
							]))
					])),
				$author$project$Main$viewLanguageSelector(model.a)
			]));
};
var $author$project$I18n$HideGrid = 23;
var $author$project$I18n$ShowGrid = 22;
var $author$project$Main$ToggleGridView = {$: 14};
var $author$project$Main$iconGrid = A2(
	$author$project$Main$svgIcon,
	_List_Nil,
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$rect,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x('2'),
					$elm$svg$Svg$Attributes$y('2'),
					$elm$svg$Svg$Attributes$width('16'),
					$elm$svg$Svg$Attributes$height('16')
				]),
			_List_Nil),
			A2(
			$elm$svg$Svg$line,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x1('2'),
					$elm$svg$Svg$Attributes$y1('7'),
					$elm$svg$Svg$Attributes$x2('18'),
					$elm$svg$Svg$Attributes$y2('7')
				]),
			_List_Nil),
			A2(
			$elm$svg$Svg$line,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x1('2'),
					$elm$svg$Svg$Attributes$y1('13'),
					$elm$svg$Svg$Attributes$x2('18'),
					$elm$svg$Svg$Attributes$y2('13')
				]),
			_List_Nil),
			A2(
			$elm$svg$Svg$line,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x1('7'),
					$elm$svg$Svg$Attributes$y1('2'),
					$elm$svg$Svg$Attributes$x2('7'),
					$elm$svg$Svg$Attributes$y2('18')
				]),
			_List_Nil),
			A2(
			$elm$svg$Svg$line,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x1('13'),
					$elm$svg$Svg$Attributes$y1('2'),
					$elm$svg$Svg$Attributes$x2('13'),
					$elm$svg$Svg$Attributes$y2('18')
				]),
			_List_Nil)
		]));
var $author$project$I18n$UploadPlaceholder = 9;
var $elm$svg$Svg$Attributes$class = _VirtualDom_attribute('class');
var $elm$svg$Svg$defs = $elm$svg$Svg$trustedNode('defs');
var $author$project$Main$iconFrogLarge = $author$project$Main$iconFrogSized('48');
var $elm$svg$Svg$Attributes$id = _VirtualDom_attribute('id');
var $elm$svg$Svg$pattern = $elm$svg$Svg$trustedNode('pattern');
var $elm$svg$Svg$Attributes$patternUnits = _VirtualDom_attribute('patternUnits');
var $elm$svg$Svg$Attributes$preserveAspectRatio = _VirtualDom_attribute('preserveAspectRatio');
var $author$project$Main$ImageSizeLoaded = F2(
	function (a, b) {
		return {$: 5, a: a, b: b};
	});
var $author$project$I18n$NoImageYet = 6;
var $author$project$Main$svgLine = F5(
	function (config, x1, y1, x2, y2) {
		return A2(
			$elm$svg$Svg$line,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x1(
					$elm$core$String$fromFloat(x1)),
					$elm$svg$Svg$Attributes$y1(
					$elm$core$String$fromFloat(y1)),
					$elm$svg$Svg$Attributes$x2(
					$elm$core$String$fromFloat(x2)),
					$elm$svg$Svg$Attributes$y2(
					$elm$core$String$fromFloat(y2)),
					$elm$svg$Svg$Attributes$stroke(config.j),
					$elm$svg$Svg$Attributes$strokeWidth(
					$elm$core$String$fromInt(config.n)),
					$elm$svg$Svg$Attributes$opacity(
					$elm$core$String$fromFloat(config.m))
				]),
			_List_Nil);
	});
var $author$project$Main$allGridLines = F2(
	function (config, dims) {
		var cellWidth = dims.L / config.b;
		var verticalLines = A2(
			$elm$core$List$map,
			function (i) {
				return A5($author$project$Main$svgLine, config, i * cellWidth, 0, i * cellWidth, dims.N);
			},
			A2($elm$core$List$range, 0, config.b));
		var cellHeight = dims.N / config.b;
		var diagonal1 = config.f ? A2(
			$elm$core$List$map,
			function (i) {
				return A5($author$project$Main$svgLine, config, i * cellWidth, 0, 0, i * cellHeight);
			},
			A2($elm$core$List$range, 0, config.b * 2)) : _List_Nil;
		var diagonal2 = config.f ? A2(
			$elm$core$List$map,
			function (i) {
				return A5($author$project$Main$svgLine, config, (config.b - i) * cellWidth, 0, dims.L, i * cellHeight);
			},
			A2($elm$core$List$range, 0, config.b * 2)) : _List_Nil;
		var horizontalLines = A2(
			$elm$core$List$map,
			function (i) {
				return A5($author$project$Main$svgLine, config, 0, i * cellHeight, dims.L, i * cellHeight);
			},
			A2($elm$core$List$range, 0, config.b));
		return _Utils_ap(
			verticalLines,
			_Utils_ap(
				horizontalLines,
				_Utils_ap(diagonal1, diagonal2)));
	});
var $elm$html$Html$Attributes$alt = $elm$html$Html$Attributes$stringProperty('alt');
var $author$project$Main$decodeImageSize = function (tagger) {
	return A3(
		$elm$json$Json$Decode$map2,
		tagger,
		A2(
			$elm$json$Json$Decode$at,
			_List_fromArray(
				['target', 'naturalWidth']),
			$elm$json$Json$Decode$int),
		A2(
			$elm$json$Json$Decode$at,
			_List_fromArray(
				['target', 'naturalHeight']),
			$elm$json$Json$Decode$int));
};
var $author$project$Main$gridConfigFromModel = function (model) {
	return {j: model.j, m: model.m, b: model.b, n: model.n, f: model.f};
};
var $elm$html$Html$img = _VirtualDom_node('img');
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $author$project$Main$viewGriddedImage = function (model) {
	var _v0 = _Utils_Tuple3(model.t, model.H, model.G);
	if (!_v0.a.$) {
		if ((!_v0.b.$) && (!_v0.c.$)) {
			var url = _v0.a.a;
			var width = _v0.b.a;
			var height = _v0.c.a;
			var dims = {N: height, L: width};
			var config = $author$project$Main$gridConfigFromModel(model);
			var gridLines = A2($author$project$Main$allGridLines, config, dims);
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('gridded-image-container')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$img,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$src(url),
								$elm$html$Html$Attributes$class('gridded-base-image'),
								$elm$html$Html$Attributes$alt('Uploaded image with grid overlay')
							]),
						_List_Nil),
						model.C ? A2(
						$elm$svg$Svg$svg,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$width(
								$elm$core$String$fromInt(width)),
								$elm$svg$Svg$Attributes$height(
								$elm$core$String$fromInt(height)),
								$elm$svg$Svg$Attributes$viewBox(
								'0 0 ' + ($elm$core$String$fromInt(width) + (' ' + $elm$core$String$fromInt(height)))),
								$elm$svg$Svg$Attributes$class('grid-overlay'),
								A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
							]),
						gridLines) : $elm$html$Html$text('')
					]));
		} else {
			var url = _v0.a.a;
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('gridded-image-container')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$img,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$src(url),
								$elm$html$Html$Attributes$class('gridded-base-image loading'),
								$elm$html$Html$Attributes$alt('Uploaded image with grid overlay'),
								A2(
								$elm$html$Html$Events$on,
								'load',
								$author$project$Main$decodeImageSize($author$project$Main$ImageSizeLoaded))
							]),
						_List_Nil)
					]));
		}
	} else {
		return $elm$html$Html$text(
			A2($author$project$I18n$translate, model.a, 6));
	}
};
var $author$project$Main$viewGridPreview = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('preview-card')
			]),
		_List_fromArray(
			[
				function () {
				var _v0 = model.t;
				if (!_v0.$) {
					return $author$project$Main$viewGriddedImage(model);
				} else {
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('preview-placeholder')
							]),
						_List_fromArray(
							[
								A2(
								$elm$svg$Svg$svg,
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$class('placeholder-grid-background'),
										$elm$svg$Svg$Attributes$width('100%'),
										$elm$svg$Svg$Attributes$height('100%'),
										$elm$svg$Svg$Attributes$preserveAspectRatio('xMidYMid slice'),
										A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
									]),
								_List_fromArray(
									[
										A2(
										$elm$svg$Svg$defs,
										_List_Nil,
										_List_fromArray(
											[
												A2(
												$elm$svg$Svg$pattern,
												_List_fromArray(
													[
														$elm$svg$Svg$Attributes$id('placeholderGrid'),
														$elm$svg$Svg$Attributes$width('40'),
														$elm$svg$Svg$Attributes$height('40'),
														$elm$svg$Svg$Attributes$patternUnits('userSpaceOnUse')
													]),
												_List_fromArray(
													[
														A2(
														$elm$svg$Svg$path,
														_List_fromArray(
															[
																$elm$svg$Svg$Attributes$d('M 40 0 L 0 0 0 40'),
																$elm$svg$Svg$Attributes$fill('none'),
																$elm$svg$Svg$Attributes$stroke('#80ED99'),
																$elm$svg$Svg$Attributes$strokeWidth('1'),
																$elm$svg$Svg$Attributes$opacity('0.3')
															]),
														_List_Nil)
													]))
											])),
										A2(
										$elm$svg$Svg$rect,
										_List_fromArray(
											[
												$elm$svg$Svg$Attributes$width('100%'),
												$elm$svg$Svg$Attributes$height('100%'),
												$elm$svg$Svg$Attributes$fill('url(#placeholderGrid)')
											]),
										_List_Nil)
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('placeholder-content')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('placeholder-icon')
											]),
										_List_fromArray(
											[$author$project$Main$iconFrogLarge])),
										A2(
										$elm$html$Html$p,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('placeholder-text')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												A2($author$project$I18n$translate, model.a, 9))
											]))
									]))
							]));
				}
			}()
			]));
};
var $author$project$Main$viewPreviewRegion = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('preview-region')
			]),
		_List_fromArray(
			[
				$author$project$Main$viewGridPreview(model),
				function () {
				var _v0 = model.t;
				if (!_v0.$) {
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('grid-toggle-container')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('light-switch')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('checkbox'),
												$elm$html$Html$Attributes$checked(model.C),
												$elm$html$Html$Events$onClick($author$project$Main$ToggleGridView),
												$elm$html$Html$Attributes$class('light-switch-input sr-only'),
												A2(
												$elm$html$Html$Attributes$attribute,
												'aria-label',
												model.C ? A2($author$project$I18n$translate, model.a, 23) : A2($author$project$I18n$translate, model.a, 22))
											]),
										_List_Nil),
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('light-switch-track')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$span,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('light-switch-thumb')
													]),
												_List_fromArray(
													[$author$project$Main$iconGrid]))
											])),
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('light-switch-label')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												model.C ? A2($author$project$I18n$translate, model.a, 23) : A2($author$project$I18n$translate, model.a, 22))
											]))
									]))
							]));
				} else {
					return $elm$html$Html$text('');
				}
			}()
			]));
};
var $author$project$I18n$CuriousAboutGrids = 25;
var $author$project$I18n$WhatsGridit = 17;
var $author$project$I18n$WhatsThisDescription = 13;
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$Attributes$rel = _VirtualDom_attribute('rel');
var $elm$html$Html$Attributes$target = $elm$html$Html$Attributes$stringProperty('target');
var $author$project$Main$viewWhatsThisAbout = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('about-section')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h2,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('about-title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						A2($author$project$I18n$translate, model.a, 17))
					])),
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('about-text')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						A2($author$project$I18n$translate, model.a, 13))
					])),
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('about-text about-curious')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						A2($author$project$I18n$translate, model.a, 25))
					])),
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('about-text about-links')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$href('https://en.wikipedia.org/wiki/Grid_(graphic_design)'),
								$elm$html$Html$Attributes$target('_blank'),
								$elm$html$Html$Attributes$rel('noopener noreferrer')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Grid in graphic design')
							])),
						$elm$html$Html$text(' \u00B7 '),
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$href('https://en.wikipedia.org/wiki/Grid_method'),
								$elm$html$Html$Attributes$target('_blank'),
								$elm$html$Html$Attributes$rel('noopener noreferrer')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('The grid method')
							])),
						$elm$html$Html$text(' \u00B7 '),
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$href('https://en.wikipedia.org/wiki/Scaling_(geometry)'),
								$elm$html$Html$Attributes$target('_blank'),
								$elm$html$Html$Attributes$rel('noopener noreferrer')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Scaling in geometry')
							])),
						$elm$html$Html$text(' \u00B7 '),
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$href('https://gurneyjourney.blogspot.com/2009/11/scaling-up-with-grid.html'),
								$elm$html$Html$Attributes$target('_blank'),
								$elm$html$Html$Attributes$rel('noopener noreferrer')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Gurney Journey: Scaling up')
							])),
						$elm$html$Html$text(' \u00B7 '),
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$href('https://www.gadsbys.co.uk/drawing-scaling-up-an-image-using-a-grid/'),
								$elm$html$Html$Attributes$target('_blank'),
								$elm$html$Html$Attributes$rel('noopener noreferrer')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Gadsbys: Using a grid')
							]))
					]))
			]));
};
var $author$project$Main$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('page-wrapper')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('app-container')
					]),
				_List_fromArray(
					[
						$author$project$Main$viewHeader(model),
						A3(
						$elm$html$Html$node,
						'main',
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('main-content'),
								$elm$html$Html$Attributes$id('main-content')
							]),
						_List_fromArray(
							[
								$author$project$Main$viewPreviewRegion(model),
								$author$project$Main$viewCardRegion(model)
							])),
						$author$project$Main$viewWhatsThisAbout(model)
					])),
				$author$project$Main$viewFooter(model)
			]));
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{aW: $author$project$Main$init, a4: $author$project$Main$subscriptions, a6: $author$project$Main$update, a7: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));