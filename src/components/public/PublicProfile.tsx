"use client";

import { useLinkFolioStore } from "@/hooks/use-linkfolio-store";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { SocialIcon } from "../icons";
import { ArrowUpRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { buttonVariants } from "@/components/ui/button";

function PublicProfile() {
  const { data, isInitialized } = useLinkFolioStore();
  const { isAuthenticated } = useAuth();

  if (!isInitialized || !data) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4 md:p-8">
        <Skeleton className="h-32 w-32 rounded-full mx-auto" />
        <Skeleton className="h-8 w-1/2 mx-auto mt-4" />
        <Skeleton className="h-12 w-3/4 mx-auto mt-2" />
        <div className="flex justify-center gap-4 mt-4">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
        <div className="mt-8 space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  const { name, bio, socialLinks, customLinks, profilePictureUrl } = data;

  return (
    <div className="min-h-screen bg-black text-neutral-200 font-body antialiased">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8 text-center flex flex-col items-center">
        <div className="relative w-32 h-32 md:w-40 md:h-40 mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/50 to-white/30 animate-pulse-slow"></div>
          <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-blue-500/50 to-white/30 blur-lg animate-pulse-slow animation-delay-2000"></div>
          <Image
            src={profilePictureUrl}
            alt={name}
            width={160}
            height={160}
            className="rounded-full object-cover w-full h-full border-4 border-black relative z-10"
            priority
          />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold font-headline text-white tracking-tight">
          {name}
        </h1>
        <p className="mt-4 text-base md:text-lg text-neutral-300 max-w-lg">
          {bio}
        </p>

        <div className="flex justify-center gap-6 mt-8">
          {socialLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white transition-colors duration-300"
              aria-label={link.platform}
            >
              <SocialIcon platform={link.platform} className="h-6 w-6 md:h-7 md:w-7" />
            </a>
))}
        </div>

        <div className="w-full mt-10 space-y-3">
          {customLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 rounded-xl p-3 flex items-center gap-4 text-left transition-all duration-300 transform hover:scale-[1.02] hover:bg-neutral-900"
            >
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={link.imageUrl || 'https://picsum.photos/seed/placeholder/128/128'}
                  alt={link.title}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="flex-grow">
                <h3 className="font-bold text-white text-base">{link.title}</h3>
                <p className="text-neutral-400 text-sm truncate">{link.url}</p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-neutral-500 group-hover:text-white transition-transform duration-300 group-hover:rotate-45" />
            </a>
          ))}
        </div>
        
        <footer className="mt-12 text-center">
            <Link href="/login" className={buttonVariants({ variant: "link", className: "text-neutral-600 hover:text-neutral-400" })}>
              Admin
            </Link>
        </footer>

      </div>
    </div>
  );
}

export default PublicProfile;
