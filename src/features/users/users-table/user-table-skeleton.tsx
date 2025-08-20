"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

interface UserTableSkeletonProps {
  rowCount?: number;
}

export function UserTableSkeleton({ rowCount = 5 }: UserTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="h-4 w-24" /> {/* Name */}
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-40" /> {/* Email */}
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-20 rounded-full" /> {/* Role badge */}
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-16 rounded-full" /> {/* Status badge */}
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-28" /> {/* Phone */}
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" /> {/* Created At */}
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 w-8 rounded" /> {/* Actions */}
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}