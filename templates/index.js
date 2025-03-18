// Load articles on homepage

const base = require('./base');

module.exports = () => base(`
<div id="articles" hx-get="/articles" hx-trigger="load">
    <div class="text-center mt-4">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
</div>
`);