import { fetchLoadRecords, LoadRecord } from '@/lib/bigquery';
import { LoadRecordsTableClient } from './load-records-table-client'; // We'll create this next
import { Suspense } from 'react';

// Helper component to show loading state
function LoadingSkeleton() {
  // You can replace this with a more sophisticated skeleton loader from Shadcn if desired
  return <div>Loading BigQuery data...</div>;
}

// Helper component to show error state
function ErrorDisplay({ message }: { message: string }) {
  return <div className="text-red-600">Error fetching data: {message}</div>;
}

// The main server component
export async function LoadRecordsDisplay() {
  let data: LoadRecord[] = [];
  let error: string | null = null;

  try {
    // Fetch data directly in the Server Component
    data = await fetchLoadRecords();
  } catch (e) {
    console.error("Failed to load records in Server Component:", e);
    error = e instanceof Error ? e.message : 'An unknown error occurred';
  }

  // Render the client component with fetched data or error state
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">BigQuery Load Records</h1>
      {error ? (
        <ErrorDisplay message={error} />
      ) : (
        // Pass the fetched data to the client component responsible for rendering the table
        // The client component will handle its own internal loading/sorting/filtering states
        <LoadRecordsTableClient initialData={data} />
      )}
    </div>
  );
}

// Optional: Wrap the display component in Suspense for page-level loading
export function LoadRecordsDisplayWithSuspense() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <LoadRecordsDisplay />
    </Suspense>
  );
}