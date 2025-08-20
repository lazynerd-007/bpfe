"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function UserTableContentSkeleton() {
  return (
    <>
      {/* Table skeleton only */}
      <div className="rounded-md border">
        <div className="p-4">
          {/* Table header skeleton */}
          <div className="flex items-center space-x-4 pb-4 border-b">
            <Skeleton className="h-4 w-20" /> {/* Name */}
            <Skeleton className="h-4 w-32" /> {/* Email */}
            <Skeleton className="h-4 w-16" /> {/* Role */}
            <Skeleton className="h-4 w-16" /> {/* Status */}
            <Skeleton className="h-4 w-24" /> {/* Phone */}
            <Skeleton className="h-4 w-20" /> {/* Created At */}
            <Skeleton className="h-4 w-8" />  {/* Actions */}
          </div>
          
          {/* Table rows skeleton */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4 py-4 border-b last:border-b-0">
              <Skeleton className="h-4 w-24" /> {/* Name */}
              <Skeleton className="h-4 w-40" /> {/* Email */}
              <Skeleton className="h-6 w-20 rounded-full" /> {/* Role badge */}
              <Skeleton className="h-6 w-16 rounded-full" /> {/* Status badge */}
              <Skeleton className="h-4 w-28" /> {/* Phone */}
              <Skeleton className="h-4 w-20" /> {/* Created At */}
              <Skeleton className="h-8 w-8 rounded" /> {/* Actions */}
            </div>
          ))}
        </div>
      </div>
      
      {/* Pagination skeleton */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <Skeleton className="h-4 w-48" /> {/* Selection text */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-24" /> {/* Rows per page */}
            <Skeleton className="h-8 w-16" />  {/* Select */}
          </div>
          <Skeleton className="h-4 w-20" /> {/* Page info */}
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8" /> {/* First */}
            <Skeleton className="h-8 w-8" /> {/* Prev */}
            <Skeleton className="h-8 w-8" /> {/* Next */}
            <Skeleton className="h-8 w-8" /> {/* Last */}
          </div>
        </div>
      </div>
    </>
  );
}