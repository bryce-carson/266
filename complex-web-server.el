;;; web-server.el --- Serve a COMP 266 website; derived from file-server.el  -*- lexical-binding: t; -*-
;;;
;;; file-server.el --- serve any files using Emacs Web Server
;; Copyright © 2014  Free Software Foundation, Inc.
;; Copyleft 🄯 2022 Bryce Carson
;;;

(setq default-directory "/home/cyberservermgmt/www")

;;; Macros
(defmacro here-request--let*-path-substring (request body)
  (list 'with-slots '(process headers) request
        (list 'let* (list '(path (list 'substring (list 'cdr (list 'assoc :GET headers)) 1)))
              (list 'eval (list 'quote body)))))

(defmacro def-ws-handler-or-matcher (name docstring body)
  (list 'defun name '(request) docstring
        (list 'here-request--let*-path-substring '(request) body)))

;;; Helper functions
(defun buffer-append-string (buffer string)
  (with-temp-buffer
    (insert string)
    (append-to-buffer buffer (point-min) (point-max))))

;;; Matching
;; Using facilities of the URL library, parse the URL and ensure that it also
;; matches the regular expression.
;; (defun )
;; TODO: define a matcher for queries for the full article.
(defvar blog-dynamic-matcher--request-article-node (rx "^/blog/dynamic/*.html$"))
(defvar blog-static-matcher (rx "^/blog/*.html$"))

(defun default-directory-parent-matcher (request)
  "Matches any requests attempting to access the filesystem outside the 'public'
folder, ie any request "
  (with-slots (process headers) request
    (let ((request-path (alist-get :GET headers)))
      (not (f-ancestor-of-p default-directory request-path)))))

(def-ws-handler-or-matcher non-blog-matcher
  "Match any valid descendent path of `default-directory' that is not part of
the blog sub-site."
  (and (not (f-descendant-of-p path "blog/"))
       (f-descendant-of-p path default-directory)))

(def-ws-handler-or-matcher default-document-matcher
  "Match any valid request for the default document."
  (rx (or "/" "/index.html")))

;;; Handling
(def-ws-handler-or-matcher blog-dynamic-handler--send-article-node
  "Handle requests for entire article nodes. This handler corresponds to the
'Open' button on any article card.

The intended article's path is used to load and manipulate the _intended_ HTML
file at PATH, retrieving only the article node, and storing the resulting HTML
temporarily at PATH."
  (let ((real-path (string-replace "dynamic/" "" path))
        (article-node (with-temp-file path
                        (insert-file-contents article-file-name)
                        (let* ((parse-tree (libxml-parse-html-region (point-min) (point-max)))
                               (valid-tree (dom-ensure-node parse-tree))
                               (dom-article-html (when valid-tree
                                                   (dom-print (dom-search parse-tree (lambda (node)
                                                                                       "Is NODE an article tag?"
                                                                                       (if (string-equal (dom-tag node)
                                                                                                         (dom-node "article")))))))))
                          (when dom-article-html dom-article-html)))))
    (if article-node
        (process-send-string process article-node)
      (ws-send-file process "404.html"))))

(def-ws-handler-or-matcher default-directory-parent-handler
  "Reject any request for non-descendent paths (relative to the
default-directory)."
  (ws-send-file process "/img/Htcpcp_teapot.jpg" "image/jpeg"))

(def-ws-handler-or-matcher http-404-file-not-found
  "Send the spilled milk 404 document."
  (progn (ws-send-file process "404.html")
         (buffer-append-string
          (get-buffer "ws-log-buffer")
          (object-print request)
          (format "LISP Request object:\n%S\n\nLISP Request headers:\n%s"
                  request
                  headers))))

;;; Server initialization
(ws-start
 '((non-blog-matcher . non-blog-handler)

   ;; Dynamic blog handling
   (blog-dynamic-matcher--request-article-node
    .
    blog-dynamic-handler--send-article-node)
   (blog-static-matcher . blog-static-handler)

   ;; NOTE: these two are equivalent handlers, but I prefer my own.
   ;; ((":GET" "^([.]+/)*") . (lambda (request) (ws-send-500)))
   (default-directory-parent-matcher . default-directory-parent-handler)

   (".*" . http-404-file-not-found))
 9003
 (get-buffer-create "ws-log-buffer")
 :host "10.0.0.117"
 :service 9003
 :log (lambda (server connection message)
	(buffer-append-string (get-buffer "ws-log-buffer") message)))
