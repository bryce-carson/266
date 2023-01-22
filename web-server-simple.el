(use-package f)

(defun simple-web-server-handler (request)
  "Handle the REQUEST simply."
  (with-slots (process headers) request
    (let* ((path (expand-file-name (substring (cdr (assoc :GET headers)) 1) website-root-directory)))
      (if (f-ancestor-of-p website-root-directory (expand-file-name path website-root-directory))
          (if (file-directory-p path)
              (ws-send-directory-list process
                                      (expand-file-name path website-root-directory) "^[^\.]")
            (ws-send-file process (expand-file-name path website-root-directory)))
        (ws-send-404 process "%S\n\n" request path)))))

(defvar website-root-directory (expand-file-name "~/code/i/266/5"))

(ws-start #'simple-web-server-handler 9003 (get-buffer-create "webSever-logBuffer"))
