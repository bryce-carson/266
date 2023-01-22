// Do not let the reference remain after the update. There is no need for it
// after the procedure is complete, that is do not create any side effects
// except in the DOM.
(() => {
    // Remove the manually included date and time element if it exits.
    let node = document.querySelector('footer > p:nth-child(2)');
    if (document.body.contains(node)) {
        node.remove();
    }
})(); // A "self-invoking" arrow function with no parameters or arguments.

// Acquire the date and time "from the filesystem"; the modification time and
// date actually derive from the http response, which is built from the web
// server.
// Learned of lastModified property from W3Schools:
//     https://www.w3schools.com/jsref/prop_doc_lastmodified.asp.
document.querySelector('footer').appendChild(
    document.
        createElement('p').
        appendChild(document.createTextNode('Last updated'.
                                            concat(" ", document.lastModified)))
);
