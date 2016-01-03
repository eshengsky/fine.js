/**
 * Created by Sky on 2016/1/1.
 */
;(function (window, document, undefined) {
    'use strict';

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

    $.isElement = function (obj) {
        return obj ? obj.nodeType === 1 : false;
    };

    $.isArray = function (obj) {
        return Array.isArray ? Array.isArray(obj) : Object.prototype.toString.call(obj) === '[object Array]';
    };

    $.isFunction = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Function]';
    };

    $.isRegExp = function (obj) {
        return Object.prototype.toString.call(obj) === '[object RegExp]';
    };

    $.trim = function (str) {
        return str.replace(/^\s+|\s+$/g, '');
    };

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

    $.each = function (obj, fn) {
        var i = 0,
            len = obj.length;
        if ($.isArray(obj) || Object.prototype.toString.call(obj) === '[object HTMLCollection]' || Object.prototype.toString.call(obj) === '[object NodeList]') {
            for (; i < len; i++) {
                if (fn.call(obj[i], i, obj[i]) === false) {
                    break;
                }
            }
        } else {
            for (i in obj) {
                if (fn.call(obj[i], i, obj[i]) === false) {
                    break;
                }
            }
        }
        return obj;
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

    $.ajax = function (obj) {
        var type = obj.type || 'GET',
            url = obj.url,
            async = obj.async || true,
            data = obj.data || null,
            success = obj.success,
            error = obj.error,
            complete = obj.complete,
            xhr;
        if (!url) {
            return;
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

    $.on = function (el, eventName, handler) {
        if (el.addEventListener) {
            el.addEventListener(eventName, handler, false);
        } else if (el.attachEvent) {
            el.attachEvent('on' + eventName, handler);
        } else {
            el['on' + eventName] = handler;
        }
    };

    $.off = function (el, eventName, handler) {
        if (el.removeEventListener) {
            el.removeEventListener(eventName, handler, false);
        } else if (el.detachEvent) {
            el.detachEvent('on' + eventName, handler);
        } else {
            el['on' + eventName] = null;
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