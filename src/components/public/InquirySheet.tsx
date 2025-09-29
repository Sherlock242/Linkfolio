"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import WebsiteInquiryForm from "./WebsiteInquiryForm";
import Link from "next/link";

export default function InquirySheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open inquiry menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Request a Custom Website</SheetTitle>
          <SheetDescription>
            Fill out the form below and I'll get back to you as soon as possible.
          </SheetDescription>
        </SheetHeader>
        <div className="py-8">
          <WebsiteInquiryForm />
        </div>
        <div className="absolute bottom-4 right-4">
          <Button variant="link" asChild>
            <Link href="/login">Admin</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}