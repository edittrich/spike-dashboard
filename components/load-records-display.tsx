// components/load-records-display.tsx
import React from 'react';
// Import the type definition for the original data structure
import { LoadRecord } from '@/lib/bigquery';
// Import the type definition for the serialized data structure
import { SerializableLoadRecord } from '@/app/page'; // Or wherever it's defined/exported
// Import the client component that expects serialized data
import { LoadRecordsTableClient } from './load-records-table-client'; // Adjust path if needed

interface LoadRecordsDisplayProps {
  // Assuming this component receives the original data
  data: LoadRecord[];
  // Add any other props this component needs
  isLoading?: boolean;
  error?: Error | null;
}

export function LoadRecordsDisplay({ data, isLoading, error }: LoadRecordsDisplayProps) {

  // --- TRANSFORMATION STEP ---
  // Convert the received data (LoadRecord[]) into the format expected by the client component (SerializableLoadRecord[])
  const serializableData: SerializableLoadRecord[] = data.map(record => ({
    ...record,
    load_date: record.load_date.value, // Extract the string value from BigQueryDate
  }));
  // --- END TRANSFORMATION ---

  return (
    <div>
      {isLoading && <div>Loading records...</div>}
      {error && <div className="text-red-500">Error loading data: {error.message}</div>}
      {!isLoading && !error && (
        // Pass the *transformed* data to the client component
        // The client component will handle its own internal loading/sorting/filtering states
        <LoadRecordsTableClient initialData={serializableData} /> // <-- Pass the transformed data
      )}
    </div>
  );
}
