"use client";

import { useLinkFolioStore } from "@/hooks/use-linkfolio-store";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { SocialIcon } from "@/components/icons";
import { ArrowUpRight, Lock } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

function PublicProfileContent() {
    const { data, isInitialized } = useLinkFolioStore();
    const { isAuthenticated } = useAuth();
  
    if (!isInitialized || !data) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 w-full">
          <Skeleton className="h-32 w-32 rounded-full mb-4" />
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-64 mb-6" />
          <div className="flex gap-6 mb-8">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
          <div className="w-full max-w-2xl space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      );
    }
  
    return (
      <div className="relative min-h-screen w-full bg-background text-foreground font-body overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        </div>
        <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 pt-20 md:p-8 animate-in fade-in duration-1000">
          <div className="w-full max-w-2xl text-center">
            <div className="relative w-32 h-32 md:w-36 md:h-36 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/50 via-purple-500/50 to-pink-500/50 blur-xl animate-pulse"></div>
              <Image
                src={data.profilePictureUrl || "https://picsum.photos/seed/dev/256/256"}
                alt={data.name}
                width={144}
                height={144}
                className="rounded-full object-cover w-full h-full border-4 border-background/50 shadow-2xl"
              />
            </div>
  
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-foreground/90 tracking-tight">
              {data.name}
            </h1>
            <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-lg mx-auto">
              {data.bio}
            </p>
  
            <div className="flex justify-center gap-6 mt-8">
              {data.socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  <SocialIcon platform={link.platform} className="h-6 w-6" />
                </a>
              ))}
            </div>
  
            <div className="mt-12 grid gap-3 w-full">
              {data.customLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-card/5 border border-card/10 rounded-lg p-2.5 flex items-center gap-4 hover:bg-card/10 hover:border-card/20 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={link.imageUrl || 'https://picsum.photos/seed/placeholder/128/128'}
                      alt={link.title}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow text-left">
                    <h3 className="font-semibold text-foreground/90">{link.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">{new URL(link.url).hostname}</p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground/90 transition-transform duration-300" />
                </a>
              ))}
            </div>
          </div>
  
          {isAuthenticated === false && (
            <footer className="absolute bottom-4 text-center text-sm text-muted-foreground">
              <Link href="/login" className="hover:text-foreground transition-colors inline-flex items-center gap-2 group">
                <Lock className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                Admin
              </Link>
            </footer>
          )}
        </main>
      </div>
    );
}

export default function PublicProfile() {
    return <PublicProfileContent />;
}
