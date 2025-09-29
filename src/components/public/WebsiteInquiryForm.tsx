"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const inquirySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  description: z.string().min(10, "Please provide a brief description (min. 10 characters)"),
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

export default function WebsiteInquiryForm() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
  });

  const onSubmit: SubmitHandler<InquiryFormValues> = (data) => {
    // In a real application, you would send this data to a server or email service.
    // For this example, we'll just log it and show a success message.
    console.log("Form submitted:", data);
    setIsSubmitted(true);
    toast({
      title: "Request Sent!",
      description: "Thank you for your inquiry. I'll be in touch soon.",
    });
    reset();
  };

  if (isSubmitted) {
    return (
        <div className="text-center p-4 rounded-lg bg-secondary">
            <h3 className="text-lg font-medium text-secondary-foreground">Thank You!</h3>
            <p className="text-muted-foreground mt-2">Your request has been sent. I will get back to you shortly.</p>
        </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Project Description</Label>
        <Textarea id="description" {...register("description")} />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>
      <Button type="submit" className="w-full">
        Send Request
      </Button>
    </form>
  );
}