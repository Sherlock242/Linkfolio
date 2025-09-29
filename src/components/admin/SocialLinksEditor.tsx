"use client";

import { useState } from "react";
import type { ProfileData, SocialLink } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { socialIcons, SocialIcon } from "@/components/icons";
import { Trash2, Plus, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialLinksEditorProps {
  data: ProfileData;
  onUpdate: (newData: Partial<ProfileData>) => void;
}

export default function SocialLinksEditor({ data, onUpdate }: SocialLinksEditorProps) {
  const { toast } = useToast();
  const [newLink, setNewLink] = useState<{ platform: SocialLink['platform'] | ''; url: string }>({ platform: '', url: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingUrl, setEditingUrl] = useState('');

  const handleAddLink = () => {
    if (!newLink.platform || !newLink.url) {
      toast({ variant: 'destructive', title: "Error", description: "Please select a platform and enter a URL." });
      return;
    }
    if (!newLink.url.startsWith('http')) {
        toast({ variant: 'destructive', title: "Error", description: "URL must start with http or https." });
        return;
    }

    const updatedLinks = [...data.socialLinks, { id: Date.now().toString(), platform: newLink.platform, url: newLink.url }];
    onUpdate({ socialLinks: updatedLinks });
    setNewLink({ platform: '', url: '' });
    toast({ title: "Social Link Added" });
  };

  const handleDeleteLink = (id: string) => {
    const updatedLinks = data.socialLinks.filter(link => link.id !== id);
    onUpdate({ socialLinks: updatedLinks });
    toast({ title: "Social Link Removed" });
  };
  
  const handleEdit = (link: SocialLink) => {
    setEditingId(link.id);
    setEditingUrl(link.url);
  }

  const handleSaveEdit = (id: string) => {
    const updatedLinks = data.socialLinks.map(link => link.id === id ? {...link, url: editingUrl} : link);
    onUpdate({ socialLinks: updatedLinks });
    setEditingId(null);
    setEditingUrl('');
    toast({ title: "Social Link Updated" });
  }

  const platformOptions = Object.keys(socialIcons) as SocialLink['platform'][];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Links</CardTitle>
        <CardDescription>Add and manage your social media profiles.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {data.socialLinks.map((link) => (
            <div key={link.id} className="flex items-center gap-4 p-2 rounded-lg border">
              <SocialIcon platform={link.platform} className="h-6 w-6 text-muted-foreground" />
              {editingId === link.id ? (
                <Input value={editingUrl} onChange={(e) => setEditingUrl(e.target.value)} className="flex-grow"/>
              ) : (
                <p className="flex-grow truncate text-sm">{link.url}</p>
              )}
              
              <div className="flex items-center gap-1">
                {editingId === link.id ? (
                    <>
                        <Button variant="ghost" size="icon" onClick={() => handleSaveEdit(link.id)}><Save className="h-4 w-4 text-green-500"/></Button>
                        <Button variant="ghost" size="icon" onClick={() => setEditingId(null)}><X className="h-4 w-4"/></Button>
                    </>
                ) : (
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(link)}>
                        <p className="text-sm">Edit</p>
                    </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => handleDeleteLink(link.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-end gap-2 pt-4 border-t">
          <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-2">
            <Select onValueChange={(value) => setNewLink({ ...newLink, platform: value as SocialLink['platform'] })} value={newLink.platform}>
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {platformOptions.map(p => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input
              placeholder="https://twitter.com/username"
              value={newLink.url}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
            />
          </div>
          <Button onClick={handleAddLink}>
            <Plus className="h-4 w-4 mr-2" /> Add Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
