**Task #1 - Displaying All articles with infinite scroll**

1. Add your HTMX CDN link and CSS library or rules to index.html
2. Create the top bar and views container in the index.html file
3. Create an Article schema and export the model
    1. This should contain an id, title and content properties
4. Write the seed() function to seed your database with at least 100 article documents
5. Create a templates folder and inside the folder, create an articleList.js that exports the article list template and renders more articles with infinite scroll trigger
6. Create an /articles endpoint that can page through articles sets and return the fetched batch using the template in articleList.js
7. Load the first set of articles in index.html by default
