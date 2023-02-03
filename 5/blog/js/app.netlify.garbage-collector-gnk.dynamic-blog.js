// NOTE: form feed character separate logical sections of the source code.
// NOTE: place copyright information here.


// NOTE: module imports
import {dynamicBlog$articleEllipsis$Controller} from '/blog/js/app.netlify.garbage-collector-gnk.dynamic-blog.controller.js';
import {dynamicBlog$articleOpen$Controller} from '/blog/js/app.netlify.garbage-collector-gnk.dynamic-blog.controller.js';


// Utility functions that may or may not be used.
function paste(seperator, ...args) {
    return args.join(seperator);
}


// Window load and initialization of dynamism.
function windowLoadInsertHorizontalRule(siblingElement) {
    siblingElement.after(document.createElement("hr"));
}

// NOTE: applied to all cards. TODO: after window.load: associate instances of
// the two button classes with every article.
function windowLoadInitiateCards(blogArticleChildAnchorNode) {
    // Acquire the parent article node of the blogArticleChildAnchorNode
    // argument to pass to the constructor methods for each button type.
    let parent = blogArticleChildAnchorNode.parentNode;
    let anchorURL = new URL(blogArticleChildAnchorNode.href);
    parent.id = anchorURL.pathname.replace("/blog/", "");
    parent.id = parent.id.replace(".html", "");

    // Change the hypertext reference of the article to the dynamic subfolder so
    // the server responds in kind when requests are made.
    blogArticleChildAnchorNode.href = blogArticleChildAnchorNode.href.replace("blog/", "blog/dynamic/");

    // Create and append the buttons to the article.
    // Ellipsis button
    let articleEllipsisButton = new ArticleButton(parent, "EllipsisButton");
    articleEllipsisButton.innerText = "...";
    parent.appendChild(articleEllipsisButton);

    // Open button
    let articleOpenButton     = new ArticleButton(parent, "OpenButton");
    articleOpenButton.innerText = "Open";
    parent.appendChild(articleOpenButton);
}

function windowLoadHandler() {
    // Query the DOM for article nodes with an anchor within that node having a
    // hypertext reference to a blog file.
    var blogArticleChildAnchorNodes = document.querySelectorAll('article a[href^="/blog/"]');

    // Attach instances of the ellipsis and open buttons to each article.
    blogArticleChildAnchorNodes.forEach(windowLoadInitiateCards);

    // Acquire an array of all the articles to apply horizontal rules after.
    document
        .querySelectorAll('a[href^="/blog/"]:nth-last-child(2n)')
        .forEach(windowLoadInsertHorizontalRule);
}

// NOTE: a listener is more maintainable than an IIFE (immediately-invoked
// function expression).
window.addEventListener("load", windowLoadHandler);


// Classes
class ArticleButton {
    // Private properties
    #id = "";

    // Public properties

    // Private methods
    #setId(parentArticleNode, typeString) {
        if(typeString === "OpenButton" || typeString === "EllipsisButton") {
            this.#id = parentArticleNode.id + typeString;
        } else {
            // TODO: return an error. The method was not called correctly.
        }
    }

    // Create the button in the DOM so it can be attached to the tree.
    #createButtonElement(parentArticleNode) {
        let button = document.createElement("button");

        button.type = "button";
        button.className = "button-3";

        button.id = this.#id;

        button.addEventListener("click", dynamicBlog$articleOpen$Controller);

        return button;
    }

    // Public methods
    constructor(parentArticleNode, typeString) {
        this.#setId(parentArticleNode, typeString);
        return this.#createButtonElement(parentArticleNode);

    }
}
