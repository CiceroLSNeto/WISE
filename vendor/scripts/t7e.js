// Generated by CoffeeScript 1.6.3
(function() {
  var dataAll, dataGet, dataSet, defaultOptions, strings, translate,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty;

  strings = {};

  dataSet = function(el, key, value) {
    return el.setAttribute("data-t7e-" + (key.toLowerCase()), value);
  };

  dataGet = function(el, key) {
    return el.getAttribute("data-t7e-" + (key.toLowerCase()));
  };

  dataAll = function(el) {
    var attr, data, _i, _len, _ref;
    data = {};
    _ref = el.attributes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      attr = _ref[_i];
      if ((attr.name.indexOf('data-t7e-')) !== 0) {
        continue;
      }
      data[attr.name.slice('data-t7e-'.length)] = attr.value;
    }
    return data;
  };

  defaultOptions = {
    raw: false,
    literal: false,
    fallback: null
  };

  translate = function() {
    var arg, args, classNames, dataAttribute, element, key, literal, object, options, outer, property, raw, result, segment, segments, tag, transform, typesOfArgs, value, variable, _i, _len, _ref, _ref1;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    typesOfArgs = ((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        arg = args[_i];
        _results.push(typeof arg);
      }
      return _results;
    })()).join(' ');
    _ref = (function() {
      switch (typesOfArgs) {
        case 'string string object function':
          return args;
        case 'string string object':
          return __slice.call(args).concat([null]);
        case 'string string function':
          return [args[0], args[1], {}, args[2]];
        case 'string object function':
          return [null].concat(__slice.call(args));
        case 'string string':
          return __slice.call(args).concat([{}], [null]);
        case 'string object':
          return [null].concat(__slice.call(args), [null]);
        case 'string function':
          return [null, args[0], {}, args[1]];
        case 'string':
          return [null].concat(__slice.call(args), [{}], [null]);
        default:
          throw new Error("Couldn't unpack translate args (" + typesOfArgs + ")");
      }
    })(), tag = _ref[0], key = _ref[1], options = _ref[2], transform = _ref[3];
    if (tag != null) {
      _ref1 = tag.split('.'), tag = _ref1[0], classNames = 2 <= _ref1.length ? __slice.call(_ref1, 1) : [];
      element = document.createElement(tag);
      element.className = classNames.join(' ');
      dataSet(element, 'key', key);
      for (property in options) {
        value = options[property];
        dataAttribute = (property.charAt(0)) === '$' ? "var-" + property.slice(1) : !(property in defaultOptions) ? "attr-" + property : "opt-" + property;
        dataSet(element, dataAttribute, value);
      }
      if (transform != null) {
        dataSet(element, 'transform', transform.toString());
      }
      translate.refresh(element);
      raw = 'raw' in options ? options.raw : defaultOptions.raw;
      if (raw) {
        return element;
      } else {
        outer = document.createElement('div');
        outer.appendChild(element);
        return outer.innerHTML;
      }
    } else {
      segments = key.split('.');
      object = strings;
      for (_i = 0, _len = segments.length; _i < _len; _i++) {
        segment = segments[_i];
        if (object != null) {
          object = object[segment];
        }
      }
      if (object instanceof Array) {
        object = object.join('\n');
      }
      result = object || options.fallback || key;
      literal = options.literal != null ? options.literal : defaultOptions.literal;
      if (!literal) {
        for (variable in options) {
          value = options[variable];
          if ((variable.charAt(0)) === '$') {
            result = result.replace(variable, value, 'gi');
          }
        }
      }
      if (transform) {
        result = transform(result);
      }
      return result;
    }
  };

  translate.refresh = function(root, givenOptions) {
    var attrName, dataAttr, element, key, keyedElements, optName, options, property, transform, value, varName, _i, _len, _ref;
    if (root == null) {
      root = document.body;
    }
    if (givenOptions == null) {
      givenOptions = {};
    }
    keyedElements = (function() {
      var _i, _len, _ref, _results;
      _ref = root.querySelectorAll('[data-t7e-key]');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        _results.push(element);
      }
      return _results;
    })();
    if ((dataGet(root, 'key')) != null) {
      keyedElements.unshift(root);
    }
    for (_i = 0, _len = keyedElements.length; _i < _len; _i++) {
      element = keyedElements[_i];
      options = {};
      for (property in givenOptions) {
        value = givenOptions[property];
        options[property] = value;
      }
      key = dataGet(element, 'key');
      _ref = dataAll(element);
      for (dataAttr in _ref) {
        value = _ref[dataAttr];
        if ((dataAttr.indexOf('var-')) === 0) {
          varName = dataAttr.slice('var-'.length);
          options["$" + varName] = value;
        } else if ((dataAttr.indexOf('attr-')) === 0) {
          attrName = dataAttr.slice('attr-'.length);
          options[attrName] = value;
        } else if ((dataAttr.indexOf('opt-')) === 0) {
          optName = dataAttr.slice('opt-'.length);
          options[optName] = value;
        }
      }
      transform = eval("(" + (dataGet(element, 'transform')) + ")");
      try {
        element.innerHTML = transform != null ? translate(key, options, transform) : translate(key, options);
      } catch (_error) {}
      for (property in options) {
        value = options[property];
        if ((property.charAt(0)) === '$') {
          continue;
        }
        if (property in defaultOptions) {
          continue;
        }
        element.setAttribute(property, translate(value, options));
      }
    }
    return null;
  };

  translate.load = function(newStringSet, _base) {
    var key, value, _results;
    if (_base == null) {
      _base = strings;
    }
    _results = [];
    for (key in newStringSet) {
      if (!__hasProp.call(newStringSet, key)) continue;
      value = newStringSet[key];
      if ((typeof value === 'string') || (value instanceof Array)) {
        _results.push(_base[key] = value);
      } else {
        if (!(key in _base)) {
          _base[key] = {};
        }
        _results.push(translate.load(value, _base[key]));
      }
    }
    return _results;
  };

  translate.strings = strings;

  translate.dataGet = dataGet;

  translate.dataSet = dataSet;

  translate.dataAll = dataAll;

  if (typeof window !== "undefined" && window !== null) {
    window.t7e = translate;
  }

  if (typeof module !== "undefined" && module !== null) {
    module.exports = translate;
  }

}).call(this);