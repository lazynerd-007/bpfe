"use client"

import { CircleUserRoundIcon, XIcon } from "lucide-react"
import { useFileUpload } from "@/hooks/use-file-upload"
import { Button } from "@/components/ui/button"

interface AvatarUploadProps {
  onFileChange?: (file: File | null) => void;
  className?: string;
  disabled?: boolean;
  defaultValue?: File | string;
}

export function AvatarUpload({ 
  onFileChange, 
  className = "", 
  disabled = false,
  defaultValue 
}: AvatarUploadProps) {
  const [
    { files, isDragging },
    {
      removeFile,
      openFileDialog,
      getInputProps,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
    },
  ] = useFileUpload({
    accept: "image/*",
    onFilesChange: (newFiles) => {
      const file = newFiles[0]?.file || null;
      onFileChange?.(file);
    }
  })

  const previewUrl = files[0]?.preview || 
    (typeof defaultValue === 'string' ? defaultValue : defaultValue?.name ? URL.createObjectURL(defaultValue) : null);

  const handleRemove = () => {
    if (files[0]) {
      removeFile(files[0].id);
    }
    onFileChange?.(null);
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="relative inline-flex">
        <button
          type="button"
          className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 relative flex size-16 items-center justify-center overflow-hidden rounded-full border border-dashed transition-colors outline-none focus-visible:ring-[3px] has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none"
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          aria-label={previewUrl ? "Change image" : "Upload image"}
          disabled={disabled}
        >
          {previewUrl ? (
            <img
              className="size-full object-cover"
              src={previewUrl}
              alt="Uploaded avatar"
              width={64}
              height={64}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div aria-hidden="true">
              <CircleUserRoundIcon className="size-4 opacity-60" />
            </div>
          )}
        </button>
        {previewUrl && !disabled && (
          <Button
            type="button"
            onClick={handleRemove}
            size="icon"
            className="border-background focus-visible:border-background absolute -top-1 -right-1 size-6 rounded-full border-2 shadow-none"
            aria-label="Remove image"
          >
            <XIcon className="size-3.5" />
          </Button>
        )}
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload avatar image"
          tabIndex={-1}
          disabled={disabled}
        />
      </div>
    </div>
  )
}