const base = require('./base');

/* module.exports = (article) => base(` */
module.exports = (article) => (`
<div class="card">
    <div class="card-body">
        <h1 class="card-title mb-4">${article.title}</h1>
        <p class="card-text">${article.content}</p>
        <a href="/" class="btn btn-secondary">Back to Articles</a>
    </div>
    <div class="card-footer text-muted">
        Posted on ${article.createdAt.toLocaleDateString()}
    </div>
</div>
`);