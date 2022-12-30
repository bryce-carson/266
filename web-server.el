;;; web-server.el --- Serve a COMP 266 website; derived from file-server.el
;;; file-server.el --- serve any files using Emacs Web Server
;; Copyright (C) 2014  Free Software Foundation, Inc.
;; Copyleft 🄯 2022 Bryce Carson

(use-package web-server)

(lexical-let ((docroot (expand-file-name "~/code/i/266/5")))
  (ws-start
   (lambda (request)
     (with-slots (process headers) request
       (let ((path (substring (cdr (assoc :GET headers)) 1)))
         (if (ws-in-directory-p docroot path)
             (if (file-directory-p path)
                 (ws-send-directory-list process
                                         (expand-file-name path docroot) "^[^\.]")
               (ws-send-file process (expand-file-name path docroot)))
           (ws-send-404 process "%s" request)))))
   9003 (get-buffer-create "ws-log-buffer")))
