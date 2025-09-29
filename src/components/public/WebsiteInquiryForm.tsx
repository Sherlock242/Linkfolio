"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function WebsiteInquiryForm() {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !email || !description) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill out all fields.",
      });
      return;
    }
    setIsSubmitting(true);

    // Here you would typically send the data to a server or API endpoint
    // For now, we'll just simulate a network request and show a toast
    
    console.log({ name, email, description });

    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setName('');
    setEmail('');
    setDescription('');

    toast({
      title: "Inquiry Sent!",
      description: "Thank you for your interest. We'll be in touch soon!",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input 
          id="name" 
          placeholder="Jane Doe" 
          required 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="jane@example.com" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Project Description</Label>
        <Textarea
          id="description"
          placeholder="Tell us about your project..."
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[120px]"
        />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Inquiry"
        )}
      </Button>
    </form>
  );
}
