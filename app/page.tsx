// app/page.tsx (or wherever you fetch and pass the data)
import { fetchLoadRecords, LoadRecord } from '@/lib/bigquery';
import { LoadRecordsTableClient } from '@/components/load-records-table-client'; // Assuming this is your Client Component or contains it

// Define a type for the data *after* serialization
// Note: load_date is now a string
export interface SerializableLoadRecord {
  load_date: string;
  source: string;
  record_count: number;
  load_status: boolean;
}

export default async function Home() {
  const rawLoadRecords: LoadRecord[] = await fetchLoadRecords();

  // --- TRANSFORMATION STEP ---
  // Convert BigQueryDate objects to plain strings before passing to the client
  const serializableLoadRecords: SerializableLoadRecord[] = rawLoadRecords.map(record => ({
    ...record,
    load_date: record.load_date.value, // Extract the string value
  }));
  // --- END TRANSFORMATION ---

  return (
    <main>
      <h1>Load Records Dashboard</h1>
      {/* Make sure you are rendering the correctly imported component */}
      <LoadRecordsTableClient initialData={serializableLoadRecords} />
    </main>
  );
}
