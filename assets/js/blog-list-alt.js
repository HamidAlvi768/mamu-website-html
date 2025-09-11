(function (window, document) {
    'use strict';

    if (!window.__fb || !window.__fb.db) {
        console.error('Firebase not initialized');
        return;
    }

    var db = window.__fb.db;

    function escapeHtml(s) {
        var div = document.createElement('div');
        div.textContent = s || '';
        return div.innerHTML;
    }

    function buildItem(doc) {
        var d = doc.data();
        var id = doc.id;
        var title = d.title || '';
        var author = d.author || '';
        var category = d.category || '';
        var readTime = d.readTime ? String(d.readTime) : '';
        var excerpt = d.excerpt || '';
        var thumbnail = d.thumbnailUrl || 'assets/img/blog/blog-list-1.jpg';
        var href = window.__fb.routes.detail(id);

        var html = '';
        html += '<div class="th-blog blog-list-single">';
        html += '  <div class="blog-img global-img">';
        html += '    <a href="' + href + '"><img src="' + thumbnail + '" alt="Blog Image"></a>';
        html += '  </div>';
        html += '  <div class="blog-content">';
        html += '    <div class="blog-profile">';
        html += '      <div class="blog-author">';
        html += '        <img src="assets/img/blog/author-1.png" alt="">';
        html += '        <div class="">';
        html += '          <h5 class="title">' + (author ? 'by ' + escapeHtml(author) : '') + '</h5>';
        html += '          <span class="text">' + (readTime ? escapeHtml(readTime) + ' min read' : '') + '</span>';
        html += '        </div>';
        html += '      </div>';
        if (category) {
            html += '      <a class="tag" href="' + window.__fb.routes.list({category: category}) + '">' + escapeHtml(category) + '</a>';
        }
        html += '    </div>';
        html += '    <h3 class="box-title"><a href="' + href + '">' + escapeHtml(title) + '</a></h3>';
        html += '    <p class="blog-text">' + escapeHtml(excerpt) + '</p>';
        html += '    <a href="' + href + '" class="th-btn"><span class="btn-text" data-back="Read More" data-front="Read More"></span></a>';
        html += '  </div>';
        html += '</div>';
        return html;
    }

    function renderList() {
        var container = document.querySelector('[data-blog-list-alt]');
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
                    html += buildItem(doc);
                });
                container.innerHTML = html;
            })
            .catch(function (err) {
                console.error(err);
                container.innerHTML = '<p>Failed to load posts.</p>';
            });
    }

    document.addEventListener('DOMContentLoaded', renderList);
})(window, document);


