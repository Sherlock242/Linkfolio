"use client";

import { useLinkFolioStore } from "@/hooks/use-linkfolio-store";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { SocialIcon } from "@/components/icons";
import { ArrowUpRight, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

function ProfileSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8 flex flex-col items-center gap-8">
      <Skeleton className="h-32 w-32 rounded-full" />
      <div className="w-full max-w-md space-y-4">
        <Skeleton className="h-8 w-1/2 mx-auto" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4 mx-auto" />
      </div>
      <div className="flex gap-6">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <div className="w-full max-w-md space-y-4 pt-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  )
}

const formatUrl = (url: string) => {
  try {
    const { hostname, pathname } = new URL(url);
    const path = pathname === '/' ? '' : pathname;
    // remove www. and trailing slash
    return `${hostname.replace(/^www\./, '')}${path.length > 15 ? path.substring(0, 15) + '...' : path}`;
  } catch (error) {
    return url;
  }
};

export default function PublicProfile() {
  const { data, isInitialized } = useLinkFolioStore();

  if (!isInitialized || !data) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <ProfileSkeleton />
      </main>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground font-body overflow-hidden">
        <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-in fade-in-0 duration-1000" />
        <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[40rem] h-[40rem] bg-accent/10 rounded-full blur-3xl animate-in fade-in-0 duration-1000 delay-500" />
        
        <main className="relative z-10 flex flex-col items-center justify-start min-h-screen p-4 sm:p-6 md:p-8 animate-in fade-in-0 slide-in-from-top-10 duration-500">
            <div className="w-full max-w-2xl mx-auto">
                <header className="flex flex-col items-center text-center py-12">
                    <div className="relative mb-6">
                        <Image
                            src={data.profilePictureUrl || 'https://picsum.photos/seed/placeholder-profile/256/256'}
                            alt={data.name}
                            width={128}
                            height={128}
                            className="rounded-full object-cover w-32 h-32 border-4 border-background/50 shadow-lg"
                        />
                        <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-pulse" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary bg-[200%_auto] animate-gradient">{data.name}</h1>
                    <p className="mt-4 max-w-md text-lg text-foreground/80">{data.bio}</p>
                    <div className="mt-8 flex gap-6">
                        {data.socialLinks.map(link => (
                            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-primary transition-transform duration-300 hover:scale-110">
                                <SocialIcon platform={link.platform} className="h-7 w-7" />
                            </a>
                        ))}
                    </div>
                </header>

                <section className="w-full">
                    <div className="grid grid-cols-1 gap-4">
                        {data.customLinks.map(link => (
                            <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group bg-card/50 backdrop-blur-sm border border-border/20 rounded-lg p-3 flex items-center gap-4 transition-all duration-300 hover:bg-card/80 hover:border-primary/50 hover:shadow-xl hover:scale-[1.02]"
                            >
                                <Image
                                    src={link.imageUrl || 'https://picsum.photos/seed/placeholder-link/128/128'}
                                    alt={link.title}
                                    width={48}
                                    height={48}
                                    className="rounded-md object-cover aspect-square"
                                />
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-base text-foreground">{link.title}</h3>
                                    <p className="text-sm text-foreground/60 flex items-center gap-1">
                                      <LinkIcon className="w-3 h-3"/>
                                      {formatUrl(link.url)}
                                    </p>
                                </div>
                                <ArrowUpRight className="h-5 w-5 text-foreground/50 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-primary" />
                            </a>
                        ))}
                    </div>
                </section>
                
                <footer className="text-center py-12 text-foreground/50">
                    <p>
                      <Link href="/login" className="hover:text-primary transition-colors">
                        Admin
                      </Link>
                    </p>
                </footer>
            </div>
        </main>
    </div>
  );
}