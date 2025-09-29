"use client";
import { useLinkFolioStore } from "@/hooks/use-linkfolio-store";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { SocialIcon } from "@/components/icons";
import { ArrowUpRight } from "lucide-react";

export default function PublicProfile() {
  const { data, isInitialized } = useLinkFolioStore();

  if (!isInitialized || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-lg mx-auto">
          <div className="flex flex-col items-center space-y-6">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="space-y-2 text-center w-full">
              <Skeleton className="h-8 w-1/2 mx-auto" />
              <Skeleton className="h-5 w-3/4 mx-auto" />
            </div>
            <div className="flex space-x-4">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
            <div className="w-full space-y-4 pt-6">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { name, bio, profilePictureUrl, socialLinks, customLinks } = data;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-background to-secondary/20 text-foreground font-body">
      <main className="max-w-4xl mx-auto p-4 sm:p-6 md:p-12">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-6">
             <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 to-white rounded-full opacity-75 blur-xl animate-pulse"></div>
            <Image
              src={profilePictureUrl}
              alt={name}
              width={144}
              height={144}
              className="rounded-full object-cover aspect-square relative z-10 border-4 border-background shadow-lg"
              priority
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">{name}</h1>
          <p className="mt-3 text-lg md:text-xl max-w-2xl text-muted-foreground">{bio}</p>

          <div className="flex items-center justify-center space-x-6 mt-6">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-transform duration-300 hover:scale-110"
              >
                <SocialIcon platform={link.platform} className="h-7 w-7" />
                <span className="sr-only">{link.platform}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6">
          {customLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card/50 backdrop-blur-sm border border-border/20 hover:border-primary/50 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex items-center gap-5">
                <div className="w-24 h-24 relative flex-shrink-0">
                  <Image
                    src={link.imageUrl}
                    alt={link.title}
                    fill
                    className="rounded-lg object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold font-headline">{link.title}</h3>
                  <p className="text-muted-foreground text-sm truncate">{link.url}</p>
                </div>
                <ArrowUpRight className="h-6 w-6 text-muted-foreground transition-transform duration-300 group-hover:text-primary group-hover:rotate-45" />
              </div>
            </a>
          ))}
        </div>
      </main>
       <footer className="text-center p-4">
          <Link href="/login" className="text-xs text-muted-foreground hover:text-primary">
            Admin
          </Link>
        </footer>
    </div>
  );
}
