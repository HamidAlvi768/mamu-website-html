(function (window, document) {
    'use strict';

    if (!window.__fb || !window.__fb.db) {
        console.error('Firebase not initialized');
        return;
    }
    var db = window.__fb.db;

    function getIdFromPath() {
        // Expecting /blog/:id
        var parts = window.location.pathname.split('/').filter(Boolean);
        var blogIndex = parts.indexOf('blog');
        if (blogIndex !== -1 && parts.length > blogIndex + 1) {
            return decodeURIComponent(parts[blogIndex + 1]);
        }
        // Fallback to query ?id=
        var params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    function render(doc) {
        var data = doc.data();
        var title = data.title || '';
        var author = data.author || '';
        var category = data.category || '';
        var tags = Array.isArray(data.tags) ? data.tags : [];
        var readTime = data.readTime ? String(data.readTime) : '';
        var thumbnail = data.thumbnailUrl || 'assets/img/blog/blog-s-1-1.jpg';
        var dateText = window.__fb.formatDate(data.publishDate);
        var contentHTML = data.content || '';

        var titleEl = document.querySelector('[data-post-title]');
        var heroImgEl = document.querySelector('[data-post-hero]');
        var metaEl = document.querySelector('[data-post-meta]');
        var contentEl = document.querySelector('[data-post-content]');

        if (titleEl) titleEl.textContent = title;
        if (heroImgEl) heroImgEl.setAttribute('src', thumbnail);
        if (metaEl) {
            var meta = '';
            if (author) meta += '<a class="author" href="' + window.__fb.routes.list() + '"><i class="fa-solid fa-user"></i>by ' + author + '</a>';
            if (dateText) meta += '<a href="' + window.__fb.routes.list() + '"><i class="fa-sharp fa-solid fa-clock"></i>' + dateText + '</a>';
            if (readTime) meta += '<a href="' + window.__fb.routes.list() + '"><i class="fa-sharp fa-solid fa-hourglass"></i>' + readTime + ' min read</a>';
            if (category) meta += '<a href="' + window.__fb.routes.list({category: category}) + '"><span class="badge bg-secondary" style="margin-left:8px">' + category + '</span></a>';
            metaEl.innerHTML = meta;
        }
        if (contentEl) contentEl.innerHTML = contentHTML;

        // Render tags if container exists
        var tagcloud = document.querySelector('.share-links .tagcloud');
        if (tagcloud) {
            if (!tags.length) {
                tagcloud.innerHTML = '';
            } else {
                var html = '';
                tags.forEach(function (t) {
                    var name = String(t || '').trim();
                    if (!name) return;
                    var href = window.__fb.routes.list({ tag: name });
                    html += '<a href="' + href + '">' + name + '</a>';
                });
                tagcloud.innerHTML = html;
            }
        }
    }

    function loadPost() {
        var id = getIdFromPath();
        var container = document.querySelector('[data-post-container]');
        if (!container) return;

        if (!id) {
            container.innerHTML = '<p>Invalid post id.</p>';
            return;
        }

        container.classList.add('loading');
        db.collection('posts').doc(id).get()
            .then(function (doc) {
                container.classList.remove('loading');
                if (!doc.exists) {
                    container.innerHTML = '<p>Post not found.</p>';
                    return;
                }
                render(doc);
            })
            .catch(function (err) {
                console.error(err);
                container.classList.remove('loading');
                container.innerHTML = '<p>Failed to load post.</p>';
            });
    }

    document.addEventListener('DOMContentLoaded', loadPost);
})(window, document);


