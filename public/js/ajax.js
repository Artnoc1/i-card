"use strict";
/**
 * 
 * @param {object} [o] 
 * @param {string} [0.url] 
 * @param {string} [0.method]  
 * @param {object} [0.data]  
 * @param {"html"|"json"|"svg"|"text"|"xml"|"arraybuffer"|"document"} [0.responseType] 
 * @param {"application/json"|"application/x-www-form-urlencoded"} [0.contentType] 
 * @param {function(response):void} [0.onsuccess] 
 * @param {function(response):void} [0.onload] 
 * @param {function} [0.onloadend]
 * @param {boolean} [0.response]
 * @param {function(xhr):void} [0.xhr] 
 * @param {function(err):void} [0.onerror]
 * @param {boolean} [0.serialize = true]
 * @returns {Promise<XMLHttpRequest>}
 */
function ajax(o) {
    var f = e();
    var c = o.response === undefined ? true : o.response;
    return new Promise(function (e, t) {
        o = o || {};
        var n = o.contentType || "application/x-www-form-urlencoded";
        var r = o.method === undefined ? "get" : o.method;
        var i = o.url;
        o.responseType = o.responseType === undefined ? "json" : o.responseType;
        o.i = o.i === undefined ? true : o.i;
        o.onsuccess = o.onsuccess || d;
        o.onload = o.onload || d;
        o.onerror = o.onerror || d;
        var u = o.data && a(o.data);
        if (o.data && n === "application/json") {
            u = JSON.stringify(o.data)
        }
        f.open(r, i, true);
        if (o.u) o.u(f);
        f.responseType = o.responseType;
        f.setRequestHeader("Content-Type", n);
        f.send(u);
        if (o.onloadend) {
            f.addEventListener("loadend", o.onloadend)
        }
        if (o.onload) {
            f.addEventListener("load", o.onload)
        }
        if (o.onerror) {
            f.addEventListener("error", o.onerror)
        }
        f.addEventListener("readystatechange", function () {
            if (f.readyState !== 4) {
                if (f.status > 300) t(c ? f.response || f.statusText : f);
                return
            }
            if (f.status >= 200 && f.status < 300 || f.status === 0) {
                if (o.onsuccess) {
                    o.onsuccess(f.response)
                }
                e(c ? f.response : f)
            } else {
                t(c ? f.response || f.statusText : f)
            }
        })
    });
    /**
     * @returns {XMLHttpRequest}
     */
    function e() {
        if (XMLHttpRequest) {
            return new XMLHttpRequest
        } else if (ActiveXObject) {
            return new ActiveXObject("Microsoft.XMLHTTP")
        }
    }
    /**
     * @param {object} data 
     */
    function a(n) {
        var r = Object.keys(n);
        var i = "";
        r.map(function (e, t) {
            i += e + (n[e] ? "=" + n[e] : "") + (t < r.length - 1 ? "&" : "")
        });
        return encodeURI(i)
    }

    function d(e) {
        return e
    }
}