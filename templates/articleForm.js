const base = require('./base');

/* module.exports = (error) => base(` */
module.exports = (error, values) => (`
<div class="card">
    <div class="card-body">
        <h2 class="card-title mb-4">New Article</h2>
        
        ${error ? `<div class="alert alert-danger">${error}</div>` : ''}
        
        <form hx-post="/articles" hx-target="#main-page-content">
            <div class="mb-3">
                <label class="form-label">Title</label>
                <input type="text" name="title" value="${values.title || ''}" class="form-control" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Content</label>
                <textarea name="content" value="${values.content || ''}" class="form-control" rows="5" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Publish</button>
        </form>
    </div>
</div>
`);