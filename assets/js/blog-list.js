(function (window, document) {
    'use strict';

    if (!window.__fb || !window.__fb.db) {
        console.error('Firebase not initialized');
        return;
    }

    var db = window.__fb.db;

    function buildPostHTML(post) {
        var id = post.id;
        var data = post.data();
        var title = data.title || '';
        var author = data.author || '';
        var category = data.category || '';
        var readTime = data.readTime ? String(data.readTime) : '';
        var excerpt = data.excerpt || '';
        var thumbnail = data.thumbnailUrl || 'assets/img/blog/blog-s-1-1.jpg';
        var dateText = window.__fb.formatDate(data.publishDate);

        var href = window.__fb.routes.detail(id);

        var html = '';
        html += '<div class="th-blog blog-single has-post-thumbnail">';
        html += '  <div class="blog-img global-img">';
        html += '    <a href="' + href + '"><img src="' + thumbnail + '" alt="Blog Image"></a>';
        html += '  </div>';
        html += '  <div class="blog-content">';
        html += '    <div class="blog-meta">';
        html += '      <a href="' + window.__fb.routes.list() + '"><i class="fa-solid fa-calendar-days"></i>' + dateText + '</a>';
        if (author) {
            html += '      <a class="author" href="' + window.__fb.routes.list() + '"><i class="fa-solid fa-user"></i>by ' + author + '</a>';
        }
        if (readTime) {
            html += '      <a href="' + window.__fb.routes.list() + '"><i class="fa-sharp fa-solid fa-clock"></i>' + readTime + ' min read</a>';
        }
        if (category) {
            html += '      <a href="' + window.__fb.routes.list({category: category}) + '"><span class="badge bg-secondary" style="margin-left:8px">' + category + '</span></a>';
        }
        html += '    </div>';
        html += '    <h3 class="blog-title"><a href="' + href + '">' + title + '</a></h3>';
        html += '    <p class="blog-text">' + excerpt + '</p>';
        html += '    <a href="' + href + '" class="th-btn"><span class="btn-text" data-back="Read More" data-front="Read More"></span></a>';
        html += '  </div>';
        html += '</div>';
        return html;
    }

    function renderPosts() {
        var container = document.querySelector('[data-blog-list]');
        if (!container) return;

        container.innerHTML = '<p>Loading posts...</p>';

        var params = new URLSearchParams(window.location.search);
        var category = params.get('category');
        var tag = params.get('tag');
        var ref = db.collection('posts');
        if (category) { ref = ref.where('category', '==', category); }
        if (tag) { ref = ref.where('tags', 'array-contains', tag); }
        ref = ref.orderBy('publishDate', 'desc');

        ref.get()
            .then(function (snapshot) {
                if (snapshot.empty) {
                    container.innerHTML = '<p>No posts found.</p>';
                    return;
                }
                var html = '';
                snapshot.forEach(function (doc) {
                    html += buildPostHTML(doc);
                });
                container.innerHTML = html;
            })
            .catch(function (err) {
                console.error(err);
                container.innerHTML = '<p>Failed to load posts.</p>';
            });
    }

    document.addEventListener('DOMContentLoaded', renderPosts);
})(window, document);


