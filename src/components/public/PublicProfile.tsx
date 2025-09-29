"use client";

import { useLinkFolioStore } from "@/hooks/use-linkfolio-store";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { SocialIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import InquirySheet from "./InquirySheet";

export default function PublicProfile() {
  const { data, isInitialized } = useLinkFolioStore();

  if (!isInitialized || !data) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
        <div className="w-full max-w-2xl space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="h-32 w-32 rounded-full" />
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-full max-w-md" />
          </div>
          <div className="flex justify-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <div className="space-y-4 pt-8">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground font-body animate-in fade-in duration-500">
      <div className="absolute top-4 right-4 z-10">
        <InquirySheet />
      </div>
      <main className="container mx-auto max-w-3xl p-4 md:p-8">
        <header className="flex flex-col items-center text-center py-12">
          <Image
            src={data.profilePictureUrl}
            alt={data.name}
            width={128}
            height={128}
            className="rounded-full object-cover w-32 h-32 border-4 border-card mb-4 shadow-lg"
          />
          <h1 className="text-4xl font-headline font-bold text-foreground">{data.name}</h1>
          <p className="mt-2 text-lg max-w-2xl text-muted-foreground">{data.bio}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {data.socialLinks.map((link) => (
              <Button key={link.id} variant="ghost" size="icon" asChild>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <SocialIcon platform={link.platform} className="h-6 w-6" />
                </a>
              </Button>
            ))}
          </div>
        </header>

        <section className="space-y-4">
            {data.customLinks.map((link) => (
                <a 
                    key={link.id} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group"
                >
                    <Card className="hover:bg-card/95 transition-all duration-300 transform hover:scale-[1.02] active:scale-[1.01] shadow-md hover:shadow-xl">
                        <CardContent className="p-4 flex items-center gap-4">
                            <Image
                                src={link.imageUrl}
                                alt={link.title}
                                width={80}
                                height={80}
                                className="rounded-lg object-cover w-20 h-20 aspect-square"
                            />
                            <div className="flex-grow">
                                <p className="text-lg font-semibold text-card-foreground">{link.title}</p>
                            </div>
                            <ArrowUpRight className="h-5 w-5 text-muted-foreground transform-gpu transition-transform duration-300 group-hover:rotate-45 group-hover:text-foreground" />
                        </CardContent>
                    </Card>
                </a>
            ))}
        </section>
      </main>
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode, className?: string }) {
    return <div className={`rounded-xl border bg-card text-card-foreground ${className}`}>{children}</div>;
}

function CardContent({ children, className }: { children: React.ReactNode, className?: string }) {
    return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
}