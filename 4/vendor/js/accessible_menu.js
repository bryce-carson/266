// Copyright (c) 2022 by James (https://codepen.io/jamesevers/pen/MWowqxQ)

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

const navToggle = document.querySelector('.nav__toggle');
const navList = document.querySelector('.nav__list');
const navLinks = document.querySelectorAll('.nav__list-link');

navToggle.addEventListener('click', function () {
    if (navList.hasAttribute('hidden')) {
        this.setAttribute('aria-expanded', 'true');
        navList.removeAttribute('hidden');

        // Set focus on first link
        // will be highlighted for keyboard users
        navLinks[0].focus();
    } else {
        navList.setAttribute('hidden', 'true');
        this.setAttribute('aria-expanded', 'false');
    }
});

document.addEventListener('keydown', (event) => {
    // Ignore IME composition
    if (event.isComposing || event.keyCode === 229) {
        return;
    }

    // Close menu with ESC key
    if (event.keyCode === 27) {
        if (!navList.hasAttribute('hidden')) {
            navToggle.setAttribute('aria-expanded', 'false');
            navList.setAttribute('hidden', 'true');
        }
    }
});
