**Task #4 - Adding a new Article**

1. Creating the article form
    1. Create a template with the name articleForm inside the templates folder. This template should take in two arguments, error and values.
    2. Then create a form with two fields for title and article content. Use the error argument variable to conditionally display an error at the top of the form and use the values argument variable to conditionally display the form values the user entered.
    3. Also add the required attribute to the two form field for frontend validation
    4. The form request should call an “/articles” endpoint with hx-post and load the response from the server into the main page content view
2. In server.js, create a new GET endpoint “/articles/new” to display this form using the template just created, passing null and an empty object for the template arguments
3. Create another endpoint, a POST endpoint, “/articles”, that takes the submitted values from the article form, checks for errors, returns the form with errors if any, if none, creates a new article and returns an HTML response with the new article using the articleDetail template.
4. On the index.html page, add a **New Article** button beside the search bar. Use HTMX on this form to load the articleForm template into the main page content view