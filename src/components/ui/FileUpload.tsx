"use client";

import React, { forwardRef, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Upload, X, FileIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  disabled?: boolean;
  onFiles?: (files: File[]) => void;
  className?: string;
}

interface UploadedFile {
  file: File;
  id: string;
  progress: number;
  status: "uploading" | "success" | "error";
  error?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateFile(
  file: File,
  accept: string,
  maxSize: number
): string | null {
  // Check size
  if (file.size > maxSize * 1024 * 1024) {
    return `File exceeds ${maxSize}MB limit`;
  }

  // Check type
  if (accept && accept !== "*") {
    const acceptedTypes = accept.split(",").map((t) => t.trim());
    const fileType = file.type;
    const fileExt = `.${file.name.split(".").pop()?.toLowerCase()}`;

    const isValid = acceptedTypes.some((accepted) => {
      if (accepted.startsWith(".")) {
        return fileExt === accepted.toLowerCase();
      }
      if (accepted.endsWith("/*")) {
        const category = accepted.split("/")[0];
        return fileType.startsWith(`${category}/`);
      }
      return fileType === accepted;
    });

    if (!isValid) {
      return `File type not accepted. Expected: ${accept}`;
    }
  }

  return null;
}

function simulateProgress(
  id: string,
  setFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>
) {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 25 + 10;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, progress: 100, status: "success" } : f
        )
      );
    } else {
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, progress } : f))
      );
    }
  }, 200 + Math.random() * 300);
}

const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      accept = "image/*",
      multiple = false,
      maxSize = 10,
      disabled = false,
      onFiles,
      className,
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const shouldAnimate = !prefersReducedMotion;

    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isDropped, setIsDropped] = useState(false);
    const [files, setFiles] = useState<UploadedFile[]>([]);

    const processFiles = useCallback(
      (fileList: FileList | null) => {
        if (!fileList || disabled) return;

        const incoming = Array.from(fileList);
        const validFiles: File[] = [];
        const newUploadedFiles: UploadedFile[] = [];

        incoming.forEach((file) => {
          const error = validateFile(file, accept, maxSize);
          const id = `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

          if (error) {
            newUploadedFiles.push({
              file,
              id,
              progress: 0,
              status: "error",
              error,
            });
          } else {
            validFiles.push(file);
            newUploadedFiles.push({
              file,
              id,
              progress: 0,
              status: "uploading",
            });
          }
        });

        setFiles((prev) => [...prev, ...newUploadedFiles]);

        // Simulate progress for valid files
        newUploadedFiles
          .filter((f) => f.status === "uploading")
          .forEach((f) => simulateProgress(f.id, setFiles));

        if (validFiles.length > 0) {
          onFiles?.(validFiles);
        }

        // Drop bounce
        if (shouldAnimate) {
          setIsDropped(true);
          setTimeout(() => setIsDropped(false), 300);
        }
      },
      [accept, maxSize, disabled, onFiles, shouldAnimate]
    );

    const handleDragOver = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) setIsDragOver(true);
      },
      [disabled]
    );

    const handleDragLeave = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
      },
      []
    );

    const handleDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        processFiles(e.dataTransfer.files);
      },
      [processFiles]
    );

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        processFiles(e.target.files);
        // Reset input so same file can be re-selected
        if (inputRef.current) inputRef.current.value = "";
      },
      [processFiles]
    );

    const removeFile = useCallback((id: string) => {
      setFiles((prev) => prev.filter((f) => f.id !== id));
    }, []);

    return (
      <div ref={ref} className={cn("w-full", className)}>
        {/* Drop zone */}
        <motion.div
          className={cn(
            "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors cursor-pointer",
            isDragOver
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
              : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500",
            disabled && "cursor-not-allowed opacity-50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          animate={
            shouldAnimate
              ? isDropped
                ? { scale: [1, 0.97, 1.01, 1] }
                : isDragOver
                  ? { scale: 1.02 }
                  : { scale: 1 }
              : undefined
          }
          transition={
            shouldAnimate
              ? { type: "spring", stiffness: 400, damping: 20 }
              : undefined
          }
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label="File upload drop zone"
          aria-disabled={disabled}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !disabled) {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
        >
          {/* Pulse ring on drag over */}
          {isDragOver && shouldAnimate && (
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-blue-400"
              initial={{ opacity: 0.6, scale: 1 }}
              animate={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.8, repeat: Infinity }}
              aria-hidden="true"
            />
          )}

          <motion.div
            animate={
              shouldAnimate && isDragOver
                ? { y: -4, scale: 1.1 }
                : { y: 0, scale: 1 }
            }
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Upload
              className={cn(
                "h-10 w-10 mb-3",
                isDragOver
                  ? "text-blue-500"
                  : "text-gray-400 dark:text-gray-500"
              )}
              aria-hidden="true"
            />
          </motion.div>

          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {isDragOver ? "Drop files here" : "Drag & drop files, or click to browse"}
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            {accept !== "*" ? `Accepted: ${accept}` : "All file types"} &middot; Max {maxSize}MB
          </p>

          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleChange}
            className="sr-only"
            disabled={disabled}
            aria-hidden="true"
            tabIndex={-1}
          />
        </motion.div>

        {/* File list */}
        <AnimatePresence mode="popLayout">
          {files.length > 0 && (
            <motion.ul
              className="mt-4 space-y-2"
              initial={shouldAnimate ? { opacity: 0 } : undefined}
              animate={{ opacity: 1 }}
              role="list"
              aria-label="Uploaded files"
            >
              {files.map((uploadedFile) => (
                <motion.li
                  key={uploadedFile.id}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 p-3"
                  initial={shouldAnimate ? { opacity: 0, y: 10, scale: 0.95 } : undefined}
                  animate={shouldAnimate ? { opacity: 1, y: 0, scale: 1 } : undefined}
                  exit={shouldAnimate ? { opacity: 0, x: -20, scale: 0.9 } : undefined}
                  transition={
                    shouldAnimate
                      ? { type: "spring", stiffness: 300, damping: 25 }
                      : undefined
                  }
                  layout={shouldAnimate}
                >
                  {/* Icon */}
                  <div className="shrink-0">
                    {uploadedFile.status === "success" ? (
                      <CheckCircle2
                        className="h-5 w-5 text-green-500"
                        aria-hidden="true"
                      />
                    ) : uploadedFile.status === "error" ? (
                      <AlertCircle
                        className="h-5 w-5 text-red-500"
                        aria-hidden="true"
                      />
                    ) : (
                      <FileIcon
                        className="h-5 w-5 text-blue-500"
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                      {uploadedFile.file.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {formatFileSize(uploadedFile.file.size)}
                      </span>
                      <span className="text-xs text-gray-300 dark:text-gray-600">
                        &middot;
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {uploadedFile.file.type || "unknown"}
                      </span>
                    </div>

                    {/* Progress bar */}
                    {uploadedFile.status === "uploading" && (
                      <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-blue-500"
                          initial={{ width: "0%" }}
                          animate={{ width: `${uploadedFile.progress}%` }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        />
                      </div>
                    )}

                    {/* Error message */}
                    {uploadedFile.status === "error" && uploadedFile.error && (
                      <p className="mt-1 text-xs text-red-500">
                        {uploadedFile.error}
                      </p>
                    )}
                  </div>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(uploadedFile.id);
                    }}
                    className="shrink-0 rounded-md p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    aria-label={`Remove ${uploadedFile.file.name}`}
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";

export { FileUpload, type FileUploadProps };
