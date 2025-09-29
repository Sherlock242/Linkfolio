"use client";

import { useLinkFolioStore } from "@/hooks/use-linkfolio-store";
import Image from "next/image";
import Link from "next/link";
import { SocialIcon } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PublicProfile() {
  const { data, isInitialized } = useLinkFolioStore();

  if (!isInitialized || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <Skeleton className="h-32 w-32 rounded-full" />
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="flex justify-center gap-4">
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-background p-4 pt-10 md:pt-16 animate-in fade-in duration-500">
      <div className="w-full max-w-md mx-auto">
        {/* Profile Section */}
        <header className="flex flex-col items-center text-center mb-8">
          <div className="mb-4 relative w-32 h-32 md:w-36 md:h-36">
            <Image
              src={data.profilePictureUrl}
              alt={data.name}
              width={144}
              height={144}
              className="rounded-full object-cover border-4 border-card shadow-lg"
              priority
              data-ai-hint="portrait person"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-headline text-foreground">{data.name}</h1>
          <p className="mt-2 text-base md:text-lg text-muted-foreground max-w-prose">{data.bio}</p>
        </header>

        {/* Social Links */}
        {data.socialLinks.length > 0 && (
          <section className="flex justify-center gap-4 mb-10">
            {data.socialLinks.map((link) => (
              <Button asChild variant="ghost" size="icon" key={link.id} className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg h-12 w-12">
                <Link href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.platform}>
                  <SocialIcon platform={link.platform} className="h-6 w-6" />
                </Link>
              </Button>
            ))}
          </section>
        )}

        {/* Custom Links */}
        <section className="space-y-4">
          {data.customLinks.map((link) => (
            <Card
              key={link.id}
              className="overflow-hidden transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl"
            >
              <Link href={link.url} target="_blank" rel="noopener noreferrer" className="block">
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={link.imageUrl}
                    alt={link.title}
                    fill
                    className="object-cover"
                    data-ai-hint="abstract tech"
                  />
                </div>
                <div className="p-4 bg-card">
                  <h3 className="font-semibold text-center text-lg font-headline text-card-foreground">{link.title}</h3>
                </div>
              </Link>
            </Card>
          ))}
        </section>
        <footer className="text-center mt-12 py-4">
            <Link href="/login" className="text-xs text-muted-foreground hover:text-primary transition-colors">Admin</Link>
        </footer>
      </div>
    </main>
  );
}
