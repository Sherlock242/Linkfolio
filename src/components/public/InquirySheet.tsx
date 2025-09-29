"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import WebsiteInquiryForm from "./WebsiteInquiryForm";

export default function InquirySheet() {
  const [open, setOpen] = useState(false);

  const handleFormSubmit = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="fixed top-4 right-4 z-50 h-10 w-10 rounded-full bg-background/50 backdrop-blur-sm">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open inquiry form</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-full max-w-md bg-background"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle className="font-headline text-2xl">Apply for a custom website</SheetTitle>
        </SheetHeader>
        <div className="mt-8">
          <WebsiteInquiryForm onFormSubmit={handleFormSubmit} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
