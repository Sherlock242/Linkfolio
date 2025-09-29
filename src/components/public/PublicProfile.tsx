
"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLinkFolioStore } from "@/hooks/use-linkfolio-store";
import { SocialIcon } from "@/components/icons";
import { Menu } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";


export default function PublicProfile() {
  const { data } = useLinkFolioStore();
  const { toast } = useToast();
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!data) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormState(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { error } = await supabase.from('inquiries').insert([
      { name: formState.name, email: formState.email, message: formState.message }
    ]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "There was a problem sending your message. Please try again.",
      });
      console.error("Supabase insert error:", error);
    } else {
      toast({
        title: "Message Sent!",
        description: "Thanks for reaching out. I'll get back to you soon.",
      });
      setFormState({ name: '', email: '', message: '' });
      // Here you might want to close the sheet, but SheetTrigger doesn't expose that easily.
      // For now, we just clear the form.
    }
    setIsSubmitting(false);
  };


  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-8 md:py-24">
      <header className="absolute top-4 right-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Apply for a custom website</SheetTitle>
              <SheetDescription>
                Fill out the form below and I'll get back to you as soon as possible.
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
               <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={formState.name} onChange={handleInputChange} required />
              </div>
               <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={formState.email} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" value={formState.message} onChange={handleInputChange} required />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </SheetContent>
        </Sheet>
      </header>

      <div className="flex flex-col items-center text-center animate-in fade-in-50 duration-500">
        <div className="profile-picture-ring">
            <Image
            src={data.profilePictureUrl}
            alt={data.name}
            width={128}
            height={128}
            className="rounded-full object-cover z-10 relative"
            priority
            data-ai-hint="portrait person"
            />
        </div>
        <h1 className="mt-6 text-4xl font-headline font-bold">{data.name}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{data.bio}</p>
      </div>
      
      <div className="mt-8 flex justify-center gap-4 animate-in fade-in-50 duration-700">
        {data.socialLinks.map(link => (
          <Button asChild key={link.id} variant="outline" size="icon" className="h-12 w-12 rounded-full">
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              <SocialIcon platform={link.platform} className="h-6 w-6" />
            </a>
          </Button>
        ))}
      </div>

      <div className="mt-12 space-y-4 animate-in fade-in-50 duration-900">
        {data.customLinks.map(link => (
          <a href={link.url} key={link.id} target="_blank" rel="noopener noreferrer" className="block">
            <div className="group flex items-center gap-4 rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg">
                <Image src={link.imageUrl} alt={link.title} width={64} height={64} className="rounded-md object-cover aspect-square" data-ai-hint="abstract tech" />
                <div className="flex-grow">
                    <p className="font-semibold text-lg">{link.title}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-muted-foreground transition-transform duration-200 ease-in-out group-hover:translate-x-1">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </div>
          </a>
        ))}
      </div>
       <div className="mt-12 text-center">
        <Button variant="link" asChild>
          <Link href="/login">Admin Login</Link>
        </Button>
      </div>
    </div>
  );
}
