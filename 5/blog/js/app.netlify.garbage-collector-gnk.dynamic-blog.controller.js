// /home/cyber/code/i/266/5/blog/js/app.netlify.garbage-collector-gnk.dynamic-blog.controller.js
import {dynamicBlog$articleEllipsis$Model} from '/blog/js/app.netlify.garbage-collector-gnk.dynamic-blog.model.js';
import {dynamicBlog$articleEllipsis$View} from '/blog/js/app.netlify.garbage-collector-gnk.dynamic-blog.view.js';

import {dynamicBlog$articleOpen$Model} from '/blog/js/app.netlify.garbage-collector-gnk.dynamic-blog.model.js';
import {dynamicBlog$articleOpen$View} from '/blog/js/app.netlify.garbage-collector-gnk.dynamic-blog.view.js';

/* Commentary:
   The controller is actually an event handler in this implementation of MVC.
   When an ellipsis is clicked, the current count of
 */

// Event listener for an article ellipsis button.
export let dynamicBlog$articleEllipsis$Controller = (event) => {
    // Make a variable to refer to the source element for easier access.
    let sourceElement = event.srcElement;

    // The true side of the decision tree only executes if the button is not
    // disabled and if there is at least one paragraph to work with.
    if (sourceElement.parentElement.dataset.paragraphsAvailable >= 1 &&
        !sourceElement.hasAttribute("disabled")) {
        let articleData = {
            articleId: sourceElement.parentElement.id,

            dataSet: {
                paragraphsAvailable: sourceElement.parentElement.dataset.paragraphsAvailable,
                paragraphsDisplayed: sourceElement.parentElement.dataset.paragraphsDisplayed,
                    paragraphsTotal: sourceElement.parentElement.dataset.paragraphsTotal,
                             isOpen: sourceElement.parentElement.dataset.isOpen,
            },
        };

        let base64EncodedObject = window.btoa(articleData);

        if (sourceElement.id.includes("OpenButton")) {
            // TODO: Open button decision path

        } else if (sourceElement.id.includes("EllipsisButton")) {
            // Ellipsis button decision path

            // Dispatch the event by modifying the model.
            let node = dynamicBlog$articleEllipsis$Model(articleData);

            // Dispatch the event by updating the view.
            let successfulViewUpdate = dynamicBlog$articleEllipsis$View(sourceElement, node);
        } else {
            // Emit an error. This should be unreachable.
        }

        // If everything was successful then return true, otherwise return
        // false.
        if (node && successfulViewUpdate) {
            return true;
        } else {
            /* Commentary:
               No node was returned, so the view was not updated. This means
               that there was either an error and the ellipsis button was not
               disabled and was still available for interaction, promises were
               used incorrectly, or there was an error on the server side or
               with the path construction.

               Generally, an ellipsis button will be disabled when there are no
               more article child nodes to retrieve, and this is known
               beforehand because of the data attribute paragraphsAvailable. The
               behaviour here is undefined, so we return undefined. The other
               paths in the decision tree return true and false, so this seems
               appropriate. This could should not be reachable, ideally. If it
               is reached, there has been a mistake.
            */
            console.log("DEBUG: FIXME: TODO: node not found, view not updated."
                        + "\n"
                        + "Element: " + sourceElement + "\n"
                        + "Article data: " + articleData + "\n"
                        + "base64 Encoded object (article data): "
                        + base64EncodedObject);
            return undefined;
        }
    } else {
        sourceElement.setAttribute("disabled", ""); // Disable the button if it is somehow enabled whilst its parent article node has no further paragraphs to retrieve from the server.
        return false;
    }
};

export let dynamicBlog$articleOpen$Controller = dynamicBlog$articleEllipsis$Controller;
