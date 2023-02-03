// /home/cyber/code/i/266/5/blog/js/app.netlify.garbage-collector-gnk.dynamic-blog.view.js
export let dynamicBlog$articleEllipsis$View = (element, node) => {
    // Update the view with the received DOM object node.
    // element is this in the Controller, so we are passed the element.

    // The responsibility of the View is to simply insert the node in the
    // correct position. The position is before the anchor, which is before the
    // two buttons: the ellipsis button and the open button.
    element.querySelector(":nth-last-child(3)").before(node);
};

export let dynamicBlog$articleEllipsis$View$UpdateText = (element, string) => {
    element.value = string;
};

export let dynamicBlog$articleOpen$View = () => {
    return undefined;
};
