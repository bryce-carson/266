// /home/cyber/code/i/266/5/blog/js/app.netlify.garbage-collector-gnk.dynamic-blog.model.js
/* This file contains the model layer for the single-page application composing my blog. */
let dynamicBlog$Model = (articleData) => {
    // Fetch the necessary data from the server.
    let base64EncodedJSON = btoa(JSON.stringify(articleData));
    const HTML = fetch("/blog/dynamic/" + base64EncodedJSON);

    // The interior return statement is that of the anonymous function which
    // consumes the second promise, which is a string from the response object
    // promise result.
    return HTML
        .then((response) => {
            response.text();
        })
        .then((string) => {
            let template = document.createElement('template');
            template.innerHTML = string.trim();
            return template;
        });
};

export let dynamicBlog$articleOpen$Model = dynamicBlog$Model;
export let dynamicBlog$articleEllipsis$Model = dynamicBlog$Model;
