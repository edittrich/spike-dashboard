"use client"; // Mark this as a Client Component

import React, { useState, useMemo } from 'react';
import { LoadRecord } from '@/lib/bigquery'; // Import the data type
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Import Shadcn Table components
import { Button } from "@/components/ui/button"; // Import Button for sorting
import { Input } from "@/components/ui/input"; // Import Input for filtering
import { ArrowUpDown } from "lucide-react"; // Import icon for sort indicator
import { BigQueryDate } from '@google-cloud/bigquery'; // Import BigQueryDate for formatting

// Helper function to format BigQueryDate or Date objects (remains the same)
const formatDate = (date: BigQueryDate | Date | string | null | undefined): string => {
    if (!date) return 'N/A';
    if (typeof date === 'object' && 'value' in date && date.value) {
        return date.value;
    }
    if (date instanceof Date) {
        return date.toISOString().split('T')[0];
    }
    if (typeof date === 'string') {
        try {
            return new Date(date).toISOString().split('T')[0];
        } catch {
            return date;
        }
    }
    return 'Invalid Date';
};

// Define possible sort keys and directions
type SortKey = keyof LoadRecord | null;
type SortDirection = 'asc' | 'desc';

interface LoadRecordsTableClientProps {
  initialData: LoadRecord[];
}

export function LoadRecordsTableClient({ initialData }: LoadRecordsTableClientProps) {
  // State for sorting
  const [sortKey, setSortKey] = useState<SortKey>('load_date'); // Default sort
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc'); // Default direction

  // State for filtering (only 'source' for now)
  const [sourceFilter, setSourceFilter] = useState<string>('');

  // Function to handle sorting
  const handleSort = (key: keyof LoadRecord) => {
    if (sortKey === key) {
      // Toggle direction if same key is clicked
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new key and default to ascending
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // Memoize the filtered and sorted data
  const processedData = useMemo(() => {
    let filteredData = [...initialData];

    // Apply filtering
    if (sourceFilter) {
      filteredData = filteredData.filter(record =>
        record.source.toLowerCase().includes(sourceFilter.toLowerCase())
      );
    }

    // Apply sorting
    if (sortKey) {
      filteredData.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];

        // Handle different types for comparison
        let comparison = 0;
        if (valA === null || valA === undefined) comparison = -1;
        else if (valB === null || valB === undefined) comparison = 1;
        // Special handling for BigQueryDate objects
        else if (sortKey === 'load_date' && typeof valA === 'object' && typeof valB === 'object' && 'value' in valA && 'value' in valB) {
             comparison = (valA.value ?? '').localeCompare(valB.value ?? '');
        }
        else if (typeof valA === 'string' && typeof valB === 'string') {
          comparison = valA.localeCompare(valB);
        } else if (typeof valA === 'number' && typeof valB === 'number') {
          comparison = valA - valB;
        } else if (typeof valA === 'boolean' && typeof valB === 'boolean') {
          comparison = valA === valB ? 0 : valA ? 1 : -1;
        }
        // Add more type handling if necessary

        return sortDirection === 'asc' ? comparison : comparison * -1;
      });
    }

    return filteredData;
  }, [initialData, sourceFilter, sortKey, sortDirection]);

  // Helper to render sort icon
  const renderSortIcon = (key: keyof LoadRecord) => {
    if (sortKey !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    return sortDirection === 'asc' ?
        <ArrowUpDown className="ml-2 h-4 w-4" /> // Could use ArrowUp icon
        : <ArrowUpDown className="ml-2 h-4 w-4" />; // Could use ArrowDown icon
  };


  return (
    <div className="w-full">
        {/* Filter Input */}
        <div className="mb-4">
            <Input
                placeholder="Filter by source..."
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="max-w-sm"
            />
        </div>

        {/* Table */}
        <Table>
            <TableCaption>A list of recent data loads.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[150px]">
                        <Button variant="ghost" onClick={() => handleSort('load_date')}>
                            Load Date
                            {renderSortIcon('load_date')}
                        </Button>
                    </TableHead>
                    <TableHead>
                        <Button variant="ghost" onClick={() => handleSort('source')}>
                            Source
                            {renderSortIcon('source')}
                        </Button>
                    </TableHead>
                    <TableHead className="text-right">
                         <Button variant="ghost" onClick={() => handleSort('record_count')}>
                            Record Count
                            {renderSortIcon('record_count')}
                        </Button>
                    </TableHead>
                    <TableHead className="text-center">
                         <Button variant="ghost" onClick={() => handleSort('load_status')}>
                            Status
                            {renderSortIcon('load_status')}
                        </Button>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {processedData.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">
                    No records match the filter criteria.
                    </TableCell>
                </TableRow>
                ) : (
                processedData.map((record, index) => (
                    <TableRow key={index}> {/* Consider a more stable key if possible */}
                    <TableCell className="font-medium">{formatDate(record.load_date)}</TableCell>
                    <TableCell>{record.source}</TableCell>
                    <TableCell className="text-right">{record.record_count?.toLocaleString() ?? 'N/A'}</TableCell>
                    <TableCell className="text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        record.load_status
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                        {record.load_status ? 'Success' : 'Failed'}
                        </span>
                    </TableCell>
                    </TableRow>
                ))
                )}
            </TableBody>
        </Table>
    </div>
  );
}