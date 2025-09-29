"use client";

import { useLinkFolioStore } from "@/hooks/use-linkfolio-store";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileEditor from "./ProfileEditor";
import SocialLinksEditor from "./SocialLinksEditor";
import CustomLinksEditor from "./CustomLinksEditor";
import { LogOut } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function AdminDashboard() {
  const { data, updateData, isInitialized } = useLinkFolioStore();
  const { logout } = useAuth();

  if (!isInitialized || !data) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 md:p-8 space-y-8">
        <Skeleton className="h-16 w-1/3" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-500">
      <header className="p-4 border-b">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-headline font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={logout} asChild>
              <Link href="/login">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="socials">Social Links</TabsTrigger>
              <TabsTrigger value="links">Custom Links</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <ProfileEditor data={data} onUpdate={updateData} />
            </TabsContent>
            <TabsContent value="socials">
              <SocialLinksEditor data={data} onUpdate={updateData} />
            </TabsContent>
            <TabsContent value="links">
              <CustomLinksEditor data={data} onUpdate={updateData} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
