(function (window, document) {
    'use strict';

    if (!window.__fb || !window.__fb.db) {
        console.error('Firebase not initialized');
        return;
    }

    var db = window.__fb.db;
    var TTL_MS = 5 * 60 * 1000; // 5 minutes

    function now() { return Date.now(); }

    function setCache(key, value) {
        try {
            sessionStorage.setItem(key, JSON.stringify({ t: now(), v: value }));
        } catch (e) {}
    }

    function getCache(key) {
        try {
            var raw = sessionStorage.getItem(key);
            if (!raw) return null;
            var parsed = JSON.parse(raw);
            if (!parsed || typeof parsed.t !== 'number') return null;
            if ((now() - parsed.t) > TTL_MS) return null;
            return parsed.v;
        } catch (e) { return null; }
    }

    function formatShortDate(timestamp) {
        var d;
        if (timestamp && typeof timestamp.toDate === 'function') {
            d = timestamp.toDate();
        } else {
            d = new Date(timestamp);
        }
        var day = d.getDate().toString().padStart(2, '0');
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var mon = months[d.getMonth()] || '';
        return day + ' ' + mon + ', ' + d.getFullYear();
    }

    function escapeHtml(s) {
        var div = document.createElement('div');
        div.textContent = s || '';
        return div.innerHTML;
    }

    function buildRecentItem(doc) {
        var d = doc.data();
        var id = doc.id;
        var href = window.__fb.routes.detail(id);
        var date = d.publishDate ? formatShortDate(d.publishDate) : '';
        var title = d.title || '';
        var thumb = d.thumbnailUrl || 'assets/img/blog/recent-post-1-1.jpg';

        var html = '';
        html += '<div class="recent-post">';
        html += '  <div class="media-img">';
        html += '    <a href="' + href + '"><img src="' + thumb + '" alt="Blog Image" style="width:80px;height:80px;object-fit:cover"></a>';
        html += '  </div>';
        html += '  <div class="media-body">';
        html += '    <div class="recent-post-meta">';
        html += '      <a href="' + window.__fb.routes.list() + '">' + escapeHtml(date) + '</a>';
        html += '    </div>';
        html += '    <h4 class="post-title" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden"><a class="text-inherit" href="' + href + '">' + escapeHtml(title) + '</a></h4>';
        html += '  </div>';
        html += '</div>';
        return html;
    }

    function renderRecent() {
        var container = document.querySelector('[data-recent-posts]');
        if (!container) return;

        var cached = getCache('recentPosts');
        if (cached && Array.isArray(cached) && cached.length) {
            container.innerHTML = cached.join('');
            return;
        }

        container.innerHTML = '<p>Loading...</p>';
        db.collection('posts').orderBy('publishDate', 'desc').limit(4).get()
            .then(function (snap) {
                if (snap.empty) { container.innerHTML = '<p>No posts.</p>'; return; }
                var htmls = [];
                snap.forEach(function (doc) { htmls.push(buildRecentItem(doc)); });
                container.innerHTML = htmls.join('');
                setCache('recentPosts', htmls);
            })
            .catch(function () { container.innerHTML = '<p>Failed to load.</p>'; });
    }

    function renderCategories() {
        var container = document.querySelector('[data-categories]');
        if (!container) return;

        var cached = getCache('categoryCounts');
        if (cached && cached.html) {
            container.innerHTML = cached.html;
            return;
        }

        container.innerHTML = '<li>Loading...</li>';

        // Fetch posts to compute category counts client-side
        db.collection('posts').orderBy('publishDate', 'desc').get()
            .then(function (snap) {
                var map = {};
                snap.forEach(function (doc) {
                    var c = (doc.data().category || '').trim();
                    if (!c) return;
                    map[c] = (map[c] || 0) + 1;
                });
                var entries = Object.keys(map).map(function (k) { return { name: k, count: map[k] }; });
                entries.sort(function (a, b) {
                    if (b.count !== a.count) return b.count - a.count;
                    return a.name.localeCompare(b.name);
                });
                var html = entries.map(function (e) {
                    var link = window.__fb.routes.list({category: e.name});
                    return '<li>\n  <a href="' + link + '">' + escapeHtml(e.name) + '</a>\n  <span>(' + e.count + ')</span>\n</li>';
                }).join('');
                container.innerHTML = html || '<li>No categories.</li>';
                setCache('categoryCounts', { html: container.innerHTML });
            })
            .catch(function () { container.innerHTML = '<li>Failed to load.</li>'; });
    }

    document.addEventListener('DOMContentLoaded', function () {
        renderRecent();
        renderCategories();
    });

})(window, document);


