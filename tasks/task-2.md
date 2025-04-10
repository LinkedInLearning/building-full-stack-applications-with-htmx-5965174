**Task #2 - Searching Articles**

1. Refactor the /articles endpoint to take in a search query parameter in the query string
2. Use the search parameter to search both the title and content properties of the Article model and return the filtered list
3. Refactor the articleList template to take in the search parameter
4. Within the articleList template, add the query parameter to the query string of the request made by the infinite scroll trigger
5. On the index.html homepage, add a search form field to the top bar of the application
6. Use the input of this field as the query parameter and use it to send a request with the change event to the /articles endpoint. Add a delay of 500ms before the request is triggered