
"use client";
import PublicProfile from '@/components/public/PublicProfile';
import ThemeApplicator from '@/components/public/ThemeApplicator';
import { useLinkFolioStore } from "@/hooks/use-linkfolio-store";
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { data, isInitialized } = useLinkFolioStore();

  if (!isInitialized || !data) {
    return (
       <div className="mx-auto max-w-2xl px-4 py-16 md:px-8 md:py-24">
        <div className="flex flex-col items-center text-center">
          <Skeleton className="h-32 w-32 rounded-full" />
          <Skeleton className="mt-6 h-12 w-64" />
          <Skeleton className="mt-4 h-5 w-80" />
        </div>
        <div className="mt-8 flex justify-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
        <div className="mt-12 space-y-4">
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <>
      <ThemeApplicator theme={data.theme} />
      <PublicProfile />
    </>
  );
}
