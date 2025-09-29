"use client";
import { useLinkFolioStore } from "@/hooks/use-linkfolio-store";
import { Skeleton } from "@/components/ui/skeleton";
import Image from 'next/image';
import { SocialIcon } from '@/components/icons';
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function PublicProfile() {
  const { data, isInitialized } = useLinkFolioStore();

  if (!isInitialized || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <div className="w-full max-w-md mx-auto">
          <Skeleton className="h-32 w-32 rounded-full mx-auto" />
          <Skeleton className="h-8 w-48 mt-6 mx-auto" />
          <Skeleton className="h-12 w-full mt-4 mx-auto" />
          <div className="flex justify-center gap-6 mt-6">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
          <div className="mt-8 space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const { profilePictureUrl, name, bio, socialLinks, customLinks } = data;

  return (
    <div className="min-h-screen bg-background text-foreground font-body antialiased">
      <main className="max-w-xl mx-auto p-4 sm:p-8">
        <section className="text-center flex flex-col items-center animate-in fade-in duration-500">
          <div className="relative w-36 h-36 mb-4">
            <div className="absolute inset-0 rounded-full bg-blue-500 blur-xl animate-pulse"></div>
            <div className="absolute inset-1 rounded-full bg-white blur-md"></div>
            <Image
                src={profilePictureUrl}
                alt={name}
                width={144}
                height={144}
                className="rounded-full object-cover aspect-square relative z-10 border-4 border-background"
                priority
            />
          </div>
          <h1 className="text-3xl font-bold font-headline">{name}</h1>
          <p className="mt-2 text-center text-muted-foreground max-w-md">{bio}</p>
        </section>

        <section className="mt-6 flex justify-center gap-6 animate-in fade-in-50 duration-500">
          {socialLinks.map(link => (
            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <SocialIcon platform={link.platform} className="h-6 w-6" />
            </a>
          ))}
        </section>

        <section className="mt-8 space-y-4 animate-in fade-in-75 duration-500">
          {customLinks.map(link => (
            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="block group">
              <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary/50 hover:-translate-y-1">
                <CardContent className="p-0 flex items-center">
                  <div className="flex-shrink-0">
                    <Image
                      src={link.imageUrl}
                      alt={link.title}
                      width={80}
                      height={80}
                      className="object-cover h-20 w-20"
                    />
                  </div>
                  <div className="flex-grow p-4">
                    <p className="font-semibold text-lg">{link.title}</p>
                  </div>
                  <div className="p-4 self-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </section>
      </main>
    </div>
  );
}