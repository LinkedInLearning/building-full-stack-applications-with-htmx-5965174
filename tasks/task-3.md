**Task #3 - Viewing an Article**

1. Create a template with the name articleDetail inside the templates folder. This template should take in an article object and display the title, content and date posted. It should also include a link back to the homepage
2. Inside the server.js file, create a new GET endpoint “/articles/:id”. Use the id path parameter to query for the article and return it as html with the articleDetail template
3. In the articleList template, use the **Read More** button to trigger a request to the “/articles/:id” route and load the response into the main-page-content div