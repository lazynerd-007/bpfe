"use client"

import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from "lucide-react"
import { useFileUpload } from "@/hooks/use-file-upload"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  onFileChange?: (file: File | null) => void;
  className?: string;
  disabled?: boolean;
  maxSizeMB?: number;
  accept?: string;
  placeholder?: string;
  defaultValue?: File | string;
}

export function ImageUpload({ 
  onFileChange, 
  className = "",
  disabled = false,
  maxSizeMB = 2,
  accept = "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif",
  placeholder = "Drop your image here",
  defaultValue
}: ImageUploadProps) {
  const maxSize = maxSizeMB * 1024 * 1024;

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept,
    maxSize,
    onFilesChange: (newFiles) => {
      const file = newFiles[0]?.file || null;
      onFileChange?.(file);
    }
  });

  const previewUrl = files[0]?.preview || 
    (typeof defaultValue === 'string' ? defaultValue : defaultValue?.name ? URL.createObjectURL(defaultValue) : null);
  const fileName = files[0]?.file.name || (typeof defaultValue !== 'string' && defaultValue?.name) || null;

  const handleRemove = () => {
    if (files[0]) {
      removeFile(files[0].id);
    }
    onFileChange?.(null);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="relative">
        <div
          onDragEnter={!disabled ? handleDragEnter : undefined}
          onDragLeave={!disabled ? handleDragLeave : undefined}
          onDragOver={!disabled ? handleDragOver : undefined}
          onDrop={!disabled ? handleDrop : undefined}
          data-dragging={isDragging || undefined}
          className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-[input:focus]:ring-[3px] has-disabled:opacity-50"
          data-disabled={disabled}
        >
          <input
            {...getInputProps()}
            className="sr-only"
            aria-label="Upload image file"
            disabled={disabled}
          />
          {previewUrl ? (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <img
                src={previewUrl}
                alt={fileName || "Uploaded image"}
                className="mx-auto max-h-full rounded object-contain"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
              <div
                className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                aria-hidden="true"
              >
                <ImageIcon className="size-4 opacity-60" />
              </div>
              <p className="mb-1.5 text-sm font-medium">{placeholder}</p>
              <p className="text-muted-foreground text-xs">
                SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={openFileDialog}
                disabled={disabled}
              >
                <UploadIcon
                  className="-ms-1 size-4 opacity-60"
                  aria-hidden="true"
                />
                Select image
              </Button>
            </div>
          )}
        </div>

        {previewUrl && !disabled && (
          <div className="absolute top-4 right-4">
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
              onClick={handleRemove}
              aria-label="Remove image"
            >
              <XIcon className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  )
}