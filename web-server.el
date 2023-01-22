;;; web-server.el --- Serve a COMP 266 website; derived from file-server.el  -*- lexical-binding: t; -*-
;;; file-server.el --- serve any files using Emacs Web Server
;; Copyright © 2014  Free Software Foundation, Inc.
;; Copyleft 🄯 2022 Bryce Carson

(require 'web-server)
(require 'dom)

(require 'f)

(defun ws-dynamic-blog-article-and-datetime (article)
  "Return the HTML article node and the HTML date-time of modification node of the ARTICLE requested."
  (let* ((article-file-name (file-name-concat "/blog" (file-name-nondirectory article)))
         (article-node (with-temp-file article
                         (insert-file-contents article-file-name)
                         (let ((parse-tree (libxml-parse-html-region (point-min) (point-max)))
                               (valid-tree (dom-ensure-node parse-tree))
                               (dom-article (dom-search parse-tree (lambda (node)
                                                                     "Is NODE an article tag?"
                                                                     (if (string-equal (dom-tag node)
                                                                                       (dom-node "article")))))))
                           dom-article)))
         (article-html (dom-print article-node))
         (artcile-modification-date-time (file-attribute-modification-time (file-attributes article-file-name))))
    '(article-file-name article-html artcile-modification-date-time)))

(let ((docroot "/home/cyber/code/i/266/5"))
  (ws-start
  (lambda (request)
    ;; Echo the request to the server log.
    ;; (message "Request received:\n\n==\n%S\n===\n\n" request)

    ;; Handling
    (with-slots (process headers) request
      (let ((path (substring (cdr (assoc :GET headers)) 1)))
        (if (unless (zerop (length path))
              (f-ancestor-of? docroot path))
            (if (file-directory-p path)
                (progn
                  (message "We have been requested with a directory path: %s" path)
                  (ws-send-directory-list process (file-name-concat docroot path) "^[^\.]"))
              ;; FIXME: the server is always changing paths to be part of /blog/
              (if (f-ancestor-of? (file-name-concat docroot "blog/dynamic/") path)
                (ws-send-file process
                              (if (file-exists-p path)
                                  path
                                (car (ws-dynamic-blog-article-and-datetime path))))

                ;; NOTE: normal handling.
                (ws-send-file process (file-name-concat docroot path))))
          (ws-send-404 process "%s\n␄\n`path': `%s'" request path)))))
  9003 (get-buffer-create "ws-log-buffer")))
