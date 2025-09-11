// Firebase Web v9+ modular SDK setup
// Exports initialized app and Firestore db for use across pages

// Load via CDN on pages BEFORE this script if not using bundlers:
// <script src="https://www.gstatic.com/firebasejs/10.12.4/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore-compat.js"></script>

// Fallback for modular import via global firebase (compat builds). This file assumes compat globals.
// If you prefer pure modular, swap to firebase-app.js/firebase-firestore.js and use import syntax.

(function (window) {
    'use strict';

    if (!window.firebase || !window.firebase.apps) {
        console.error('Firebase SDK not found. Make sure to include firebase-app-compat and firebase-firestore-compat before firebase-config.js');
        return;
    }

    var firebaseConfig = {
        apiKey: "AIzaSyDYbv2WlEVng1ekjINA2IqZHq2h0LCPgnQ",
        authDomain: "blog-804c8.firebaseapp.com",
        projectId: "blog-804c8",
        storageBucket: "blog-804c8.firebasestorage.app",
        messagingSenderId: "880272024749",
        appId: "1:880272024749:web:d280f06cd3562535df1224"
    };

    // Initialize app (idempotent)
    var app = firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore();

    // Lightweight helpers exposed globally
    window.__fb = {
        app: app,
        db: db,
        // util: format a Firestore Timestamp or ISO string
        formatDate: function (value) {
            try {
                var d;
                if (value && typeof value.toDate === 'function') {
                    d = value.toDate();
                } else if (typeof value === 'number') {
                    d = new Date(value);
                } else if (typeof value === 'string') {
                    d = new Date(value);
                } else if (value instanceof Date) {
                    d = value;
                } else {
                    return '';
                }
                var opts = { year: 'numeric', month: 'long', day: 'numeric' };
                return d.toLocaleDateString(undefined, opts);
            } catch (e) {
                return '';
            }
        },
        // Routing helpers to work under file:// and http(s)
        routes: (function(){
            var isFile = (window.location.protocol === 'file:');
            // Determine base path of current HTML file
            var basePath = (function(){
                if (!isFile) return '/';
                // e.g., file:///C:/.../download-version%20-%20Copy/
                var href = window.location.href;
                // Strip filename
                return href.replace(/[^/]*$/, '');
            })();
            function blogListUrl(params){
                if (isFile) {
                    var url = basePath + 'blog.html';
                    if (params && (params.category || params.tag)) {
                        var q = [];
                        if (params.category) q.push('category=' + encodeURIComponent(params.category));
                        if (params.tag) q.push('tag=' + encodeURIComponent(params.tag));
                        url += '?' + q.join('&');
                    }
                    return url;
                }
                var p = '/blog';
                if (params && (params.category || params.tag)) {
                    var qs = [];
                    if (params.category) qs.push('category=' + encodeURIComponent(params.category));
                    if (params.tag) qs.push('tag=' + encodeURIComponent(params.tag));
                    p += '?' + qs.join('&');
                }
                return p;
            }
            function blogDetailUrl(id){
                if (isFile) {
                    return basePath + 'blog-details.html?id=' + encodeURIComponent(id);
                }
                return '/blog/' + encodeURIComponent(id);
            }
            return {
                list: blogListUrl,
                detail: blogDetailUrl
            };
        })()
    };
})(window);


