/**
 * Created by Sky on 2016/1/1.
 */
(function (window, document, undefined) {
    'use strict';

    /**Private Functions**/
    var _getType = function (obj) {
        return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
    };

    var _hasClass = function (el, className) {
        if (el.classList) {
            return el.classList.contains(className);
        } else {
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
        }
    };

    var _addClass = function (el, className) {
        if (el.classList) {
            el.classList.add(className);
        }
        else {
            el.className += ' ' + className;
        }
    };

    var _removeClass = function (el, className) {
        if (el.classList) {
            el.classList.remove(className);
        }
        else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    };

    var _empty = function (el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
    };

    var _remove = function (el) {
        el.parentNode.removeChild(el);
    };

    var _addEventListener = function (el, eventName, handler) {
        if (el.addEventListener) {
            el.addEventListener(eventName, handler, false);
        } else if (el.attachEvent) {
            el.attachEvent('on' + eventName, handler);
        } else {
            el['on' + eventName] = handler;
        }
    };

    var _removeEventListener = function (el, eventName, handler) {
        if (el.removeEventListener) {
            el.removeEventListener(eventName, handler, false);
        } else if (el.detachEvent) {
            el.detachEvent('on' + eventName, handler);
        } else {
            el['on' + eventName] = null;
        }
    };

    /**Element**/
    var $ = function (selector, context) {
        if ($.isElement(selector)) {
            return selector;
        } else if (selector === window) {
            return window;
        } else if (selector === document) {
            return document;
        } else {
            if (typeof context === 'string') {
                context = document.querySelector(context || 'null');
            }
            return (context || document).querySelectorAll(selector || 'null');
        }
    };

    $.hasClass = function (el, className) {
        var ret = false;
        if (_getType(el) === 'htmlcollection' || _getType(el) === 'nodelist') {
            $.each(el, function () {
                if (_hasClass(this, className)) {
                    ret = true;
                    return false;
                }
            });
            return ret;
        } else if ($.isElement(el)) {
            return _hasClass(el, className);
        } else {
            return false;
        }
    };

    $.addClass = function (el) {
        var i = 1,
            len = arguments.length,
            className;
        for (; i < len; i++) {
            className = arguments[i];
            if (_getType(el) === 'htmlcollection' || _getType(el) === 'nodelist') {
                $.each(el, function () {
                    _addClass(this, className);
                });
            } else if ($.isElement(el)) {
                _addClass(el, className);
            }
        }
    };

    $.removeClass = function (el) {
        var i = 1,
            len = arguments.length,
            className;
        for (; i < len; i++) {
            className = arguments[i];
            if (_getType(el) === 'htmlcollection' || _getType(el) === 'nodelist') {
                $.each(el, function () {
                    _removeClass(this, className);
                });
            } else if ($.isElement(el)) {
                _removeClass(el, className);
            }
        }
    };

    $.empty = function (el) {
        if (_getType(el) === 'htmlcollection' || _getType(el) === 'nodelist') {
            $.each(el, function () {
                _empty(this);
            });
        } else if ($.isElement(el)) {
            _empty(el);
        }
    };

    $.remove = function (el) {
        if (_getType(el) === 'htmlcollection' || _getType(el) === 'nodelist') {
            $.each(el, function () {
                _remove(this);
            });
        } else if ($.isElement(el)) {
            _remove(el);
        }
    };

    $.isElement = function (obj) {
        return obj ? obj.nodeType === 1 : false;
    };

    /**String**/
    $.stringFormat = function (str, args) {
        var reg = new RegExp('{-?[0-9]+}', 'g');
        return str.replace(reg, function (item) {
            var intVal = parseInt(item.substring(1, item.length - 1));
            var replace;
            if (intVal >= 0) {
                replace = args[intVal];
            } else if (intVal === -1) {
                replace = '{';
            } else if (intVal === -2) {
                replace = '}';
            } else {
                replace = '';
            }
            return replace;
        });
    };

    $.parseHTML = function (str) {
        var el = document.createElement('div');
        el.innerHTML = str;
        return el.children;
    };

    $.url = function (url) {
        var a = document.createElement('a');
        a.href = url || window.location.href;
        return {
            source: url,
            protocol: a.protocol.replace(':', ''),
            host: a.hostname,
            port: a.port,
            query: a.search,
            params: (function () {
                var ret = {},
                    seg = a.search.replace(/^\?/, '').split('&'),
                    len = seg.length, i = 0, s;
                for (; i < len; i++) {
                    if (!seg[i]) {
                        continue;
                    }
                    s = seg[i].split('=');
                    ret[s[0]] = s[1];
                }
                return ret;
            })(),
            file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
            hash: a.hash.replace('#', ''),
            path: a.pathname.replace(/^([^\/])/, '/$1'),
            relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
            segments: a.pathname.replace(/^\//, '').split('/')
        };

    };

    $.trim = function (str) {
        return str.replace(/^\s+|\s+$/g, '');
    };

    $.byteLength = function (str) {
        return str.replace(/[^\x00-\xff]/g, 'aa').length;
    };

    /**Array & Object**/
    $.each = function (obj, fn) {
        var i = 0,
            len = obj.length,
            attr;
        if ($.isArray(obj) || _getType(obj) === 'htmlcollection' || _getType(obj) === 'nodelist') {
            for (; i < len; i++) {
                if (fn.call(obj[i], i, obj[i]) === false) {
                    break;
                }
            }
        } else {
            for (attr in obj) {
                if (fn.call(obj[attr], attr, obj[attr]) === false) {
                    break;
                }
            }
        }
        return obj;
    };

    $.extend = function () {
        var obj = arguments[0] || {};
        var i = 1,
            len = arguments.length,
            arg,
            key;
        for (; i < len; i++) {
            arg = arguments[i];
            if (arg) {
                for (key in arg) {
                    if (arg.hasOwnProperty(key)) {
                        obj[key] = arg[key];
                    }
                }
            }
        }
        return obj;
    };

    $.isArray = function (obj) {
        return Array.isArray ? Array.isArray(obj) : _getType(obj) === 'array';
    };

    $.inArray = function (item, arr) {
        var index = -1;
        $.each(arr, function (i, val) {
            if (val === item) {
                index = i;
                return false;
            }
        });
        return index;
    };

    $.isFunction = function (obj) {
        return _getType(obj) === 'function';
    };

    $.isRegExp = function (obj) {
        return _getType(obj) === 'regexp';
    };

    /**Request**/
    $.ajax = function (obj) {
        var type = obj.type || 'GET',
            url = obj.url,
            async = obj.async || true,
            data = obj.data || null,
            success = obj.success,
            error = obj.error,
            complete = obj.complete,
            xhr,
            requestUrl = $.url(url),
            currentUrl = $.url();
        if (!url) {
            return;
        }
        if (requestUrl.protocol !== currentUrl.protocol || requestUrl.host !== currentUrl.host || requestUrl.port !== currentUrl.port) {
            throw '$.ajax does not support cross domain, please use $.jsonp to request.';
        }
        xhr = new XMLHttpRequest();
        xhr.open(type, url, async);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                    if ($.isFunction(success)) {
                        success.call(xhr, xhr.responseText, xhr.status);
                    }
                } else {
                    if ($.isFunction(error)) {
                        error.call(xhr, xhr.responseText, xhr.status);
                    }
                }
                if ($.isFunction(complete)) {
                    complete.call(xhr, xhr.status);
                }
            }
        };
        xhr.send(data);
    };

    $.jsonp = function (url) {
        if (!url) {
            return;
        }
        var script = document.createElement('script');
        script.src = url;
        $('body')[0].appendChild(script);
    };

    /**Event**/
    $.on = function (el, eventName, handler) {
        if (_getType(el) === 'htmlcollection' || _getType(el) === 'nodelist') {
            $.each(el, function () {
                _addEventListener(this, eventName, handler);
            });
        } else {
            _addEventListener(el, eventName, handler);
        }
    };

    $.off = function (el, eventName, handler) {
        if (_getType(el) === 'htmlcollection' || _getType(el) === 'nodelist') {
            $.each(el, function () {
                _removeEventListener(this, eventName, handler);
            });
        } else {
            _removeEventListener(el, eventName, handler);
        }
    };

    $.getEvent = function (event) {
        return event ? event : window.event;
    };

    $.getTarget = function (event) {
        return event.target || event.srcElement;
    };

    $.preventDefault = function (event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    };

    window.$ = window.$ || $;
}(window, document));