// NOTE: form feed character separate logical sections of the source code.
// NOTE: place copyright information here.

// NOTE: general functions.
function exp(base, exponent) {
    if (exponent == 0) return 1;
    if (exponent == 1) return base;
    return (exponent < 0) ?
        (1 / (base * exp(base, -exponent - 1))) :
        base * exp(base, exponent - 1);
}

function paste(seperator, ...args) {
    return args.join(seperator);
}

// Window load and initialization of dynamism.
function windowLoadInsertHorizontalRule(siblingElement) {
    siblingElement.after(document.createElement("hr"));
}

// TODO: write the constructor.
function articleEllipsisButton(articleNode) {
    // Prototype and constructor

    // Properties
    this.parent = articleNode;

    // Methods
    this.fetchNextArticleParagraph = (articleNode, ...rest) => {
        // Find the article URL component from the name of the article node.
        let articleURLcomponent = articleNode.id + ".html";
        let queryParameters = '';
        let url = paste('',
                        '/blog/dynamic/', articleURLcomponent,
                        (queryParameters) ? queryParameters : '');

        // Response parsing.
        let psOrResponse = fetch(url);
        return psOrResponse;
    };

    // TODO: remove this.
    return null;
}

// TODO: write the constructor.
function articleOpenButton(blogArticleNode) {

    // TODO: remove this.
    return null;
}

// NOTE: applied to all cards.
// TODO: after window.load: associate instances of buttons with every article.
function windowLoadInitiateCards(blogArticleNode) {
    // FIXME
    console.log(blogArticleNode);

    blogArticleNode.parentNode.href = blogArticleNode.parentNode.href.replace("blog/", "blog/dynamic/");

    // TODO: append ellipsis and open button object nodes.
    blogArticleNode.appendChild(new articleEllipsisButton(blogArticleNode));
    blogArticleNode.appendChild(new articleOpenButton(blogArticleNode));
}

function windowLoadHandler() {
    var blogArticleNodes = document.querySelectorAll('a[href^="/blog/"] > article');
    // TODO: add instances of ellipsis and open buttons.
    blogArticleNodes.forEach(windowLoadInitiateCards);

    // DONE: Acquire an array of all the articles to apply horizontal rules
    // after.
    document
        .querySelectorAll('a[href^="/blog/"]:nth-last-child(2n)')
        .forEach(windowLoadInsertHorizontalRule);

    console.log(exp(2, -8));
}

// NOTE: a listener is more maintainable than an IIFE.
window.addEventListener("load", windowLoadHandler);
