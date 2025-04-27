import { LoadRecordsDisplayWithSuspense } from "@/components/load-records-display";
import { Suspense } from "react";

// Basic loading component for the page itself
function PageLoading() {
  return <div>Loading page...</div>;
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-12 md:p-24">
      {/* Wrap the main content area with Suspense */}
      <Suspense fallback={<PageLoading />}>
        {/* Render the component that fetches and displays BigQuery data */}
        <LoadRecordsDisplayWithSuspense />
      </Suspense>
    </main>
  );
}
