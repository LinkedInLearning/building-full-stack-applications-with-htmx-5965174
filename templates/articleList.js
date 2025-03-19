const base = require('./base');

module.exports = (articles, page, searchQuery) => {
  const articleItems = articles.map(article => `
    <div class="card mb-3">
      <div class="card-body">
        <h5 class="card-title">${article.title}</h5>
        <p class="card-text">${article.content.substring(0, 100)}...</p>
        <a href="/articles/${article._id}" class="btn btn-primary">Read More</a>
      </div>
    </div>
  `).join('');

  const pagination = articles.length === 10 ? `
    <div hx-get="/articles?page=${page + 1}${searchQuery ? `&q=${searchQuery}` : ''}" 
         hx-trigger="revealed" 
         hx-swap="afterend"></div>
  ` : '';

  /* return base(`
    <div id="articles">
      ${articleItems}
      ${pagination}
    </div>
  `); */
  return `
    <div id="articles">
      ${articleItems}
      ${pagination}
    </div>
  `
};