import { BigQuery, BigQueryDate } from '@google-cloud/bigquery';

// Define the structure of the data we expect from BigQuery
export interface LoadRecord {
  load_date: BigQueryDate; // Use BigQueryDate for DATE type
  source: string;
  record_count: number; // BigQuery INTEGER maps to number
  load_status: boolean;
}

// Initialize the BigQuery client
// This will use Application Default Credentials (ADC)
// Ensure your environment is set up correctly (gcloud auth application-default login or GOOGLE_APPLICATION_CREDENTIALS)
const bigqueryClient = new BigQuery({
    projectId: process.env.GCP_PROJECT_ID,
    // location is often needed for jobs, but usually not for simple queries if dataset location is clear
    // location: process.env.BIGQUERY_DATASET_LOCATION,
});


/**
 * Fetches all records from the configured BigQuery table.
 * IMPORTANT: This function should only be called from server-side code (Server Components, API routes, getServerSideProps)
 * as it uses server-side environment variables and credentials.
 * @returns Promise<LoadRecord[]> - A promise that resolves to an array of load records.
 * @throws Error if required environment variables are missing or if the query fails.
 */
export async function fetchLoadRecords(): Promise<LoadRecord[]> {
  const projectId = process.env.GCP_PROJECT_ID;
  const datasetId = process.env.BIGQUERY_DATASET_ID;
  const tableId = process.env.BIGQUERY_TABLE_ID;

  if (!projectId || !datasetId || !tableId) {
    throw new Error('Missing required BigQuery environment variables (GCP_PROJECT_ID, BIGQUERY_DATASET_ID, BIGQUERY_TABLE_ID)');
  }

  // Construct the SQL query
  // Use backticks for table name to handle special characters or reserved words if necessary
  const query = `SELECT load_date, source, record_count, load_status
                 FROM \`${projectId}.${datasetId}.${tableId}\`
                 ORDER BY load_date DESC`; // Example ordering

  const options = {
    query: query,
    // Location must match that of the dataset(s) referenced in the query.
    // Set location property if ADC doesn't implicitly handle it based on dataset location
    location: process.env.BIGQUERY_DATASET_LOCATION,
  };

  try {
    // Run the query
    const [rows] = await bigqueryClient.query(options);

    // We need to explicitly cast the result rows to our interface type.
    // BigQuery client returns generic objects. Add validation if needed.
    // Note: BigQuery client automatically handles type conversions for standard types
    // like DATE -> BigQueryDate, INTEGER -> number, BOOLEAN -> boolean, STRING -> string
    return rows as LoadRecord[];
  } catch (error) {
    console.error('BigQuery query failed:', error);
    // Re-throw the error or handle it more gracefully depending on requirements
    throw new Error(`Failed to fetch data from BigQuery: ${error instanceof Error ? error.message : String(error)}`);
  }
}