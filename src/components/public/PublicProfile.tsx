"use client";

import { useState, FormEvent } from "react";
import { useLinkFolioStore } from "@/hooks/use-linkfolio-store";
import { Skeleton } from "@/components/ui/skeleton";
import Image from 'next/image';
import { SocialIcon } from '@/components/icons';
import { ArrowUpRight, AtSign, Globe, Menu } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase/client";

function formatUrl(url: string) {
  try {
    const urlObject = new URL(url);
    return urlObject.hostname.replace(/^www\./, '');
  } catch (error) {
    return url;
  }
}

export default function PublicProfile() {
  const { data, isInitialized } = useLinkFolioStore();
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = await supabase.from('inquiries').insert([
      { name: formState.name, email: formState.email, message: formState.message },
    ]);
    setIsSubmitting(false);
    if (error) {
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "There was an error submitting your message. Please try again.",
      });
    } else {
      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      setFormState({ name: '', email: '', message: '' });
      setOpen(false);
    }
  };

  const handleSheetOpen = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const preventAutoFocus = (e: Event) => {
    e.preventDefault();
  };

  if (!isInitialized || !data) {
    return <PublicProfileSkeleton />;
  }
  
  const { profilePictureUrl, name, bio, socialLinks, customLinks } = data;

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased selection:bg-primary/20">

      <header className="absolute top-0 right-0 p-4 z-20">
        <Sheet open={open} onOpenChange={handleSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-foreground">
                <Menu />
                <span className="sr-only">Open Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full md:max-w-sm overflow-y-auto" onOpenAutoFocus={preventAutoFocus}>
            <SheetHeader>
              <SheetTitle className="font-headline text-2xl">Apply for a custom website</SheetTitle>
              <SheetDescription>
                Fill out the form below to get in touch about your project.
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                <Input type="text" id="name" name="name" value={formState.name} onChange={handleFormChange} required className="mt-1" />
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                <Input type="email" id="email" name="email" value={formState.email} onChange={handleFormChange} required className="mt-1" />
              </div>
              <div>
                <label htmlFor="message" className="text-sm font-medium">Project Details</label>
                <Textarea id="message" name="message" value={formState.message} onChange={handleFormChange} required rows={6} className="mt-1" />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </SheetContent>
        </Sheet>
      </header>

      <main className="relative z-10 mx-auto max-w-2xl px-4 py-8 md:px-8 md:py-16">
        <div className="flex flex-col items-center text-center">
          
          <div className="profile-picture-ring mb-6">
            <div className="relative z-10 w-32 h-32 md:w-40 md:h-40">
              <Image
                src={profilePictureUrl}
                alt={name}
                fill
                priority
                className="rounded-full object-cover border-4 border-background"
                sizes="(max-width: 768px) 128px, 160px"
              />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold font-headline text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary animate-in fade-in duration-700">
            {name}
          </h1>
          <p className="mt-4 max-w-md text-base md:text-lg text-muted-foreground animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-200">
            {bio}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-300">
          {socialLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-full p-3 transition-colors duration-300 hover:bg-primary/10"
              aria-label={link.platform}
            >
              <SocialIcon platform={link.platform} className="h-6 w-6 text-foreground transition-transform duration-300 group-hover:scale-110" />
            </a>
          ))}
        </div>

        <div className="mt-12 space-y-4">
          {customLinks.map((link, index) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group relative flex items-center gap-4 overflow-hidden rounded-lg bg-card p-3 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10",
                "animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
              )}
              style={{ animationDelay: `${400 + index * 100}ms` }}
            >
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md">
                <Image
                  src={link.imageUrl || 'https://picsum.photos/seed/placeholder/64/64'}
                  alt={link.title}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="font-semibold truncate">{link.title}</p>
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  { link.url.includes('@') ? <AtSign className="h-3 w-3" /> : <Globe className="h-3 w-3" /> }
                  {formatUrl(link.url)}
                </p>
              </div>
              <ArrowUpRight className="h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-primary" />
            </a>
          ))}
        </div>
        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <Link href="/login" className="hover:text-primary transition-colors">Admin</Link>
        </footer>
      </main>
      <div className="absolute inset-0 z-0 h-full w-full bg-transparent bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] opacity-50"></div>
      <div className="absolute top-0 z-0 h-1/2 w-full bg-gradient-to-b from-primary/10 to-transparent"></div>
    </div>
  );
}


function PublicProfileSkeleton() {
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
