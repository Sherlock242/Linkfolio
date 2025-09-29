
"use client";

import { useState } from "react";
import type { ProfileData, CustomLink } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Edit, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";

interface CustomLinksEditorProps {
  data: ProfileData;
  onUpdate: (newData: Partial<ProfileData>) => void;
}

type EditableLink = Partial<CustomLink> & { id?: string; };

export default function CustomLinksEditor({ data, onUpdate }: CustomLinksEditorProps) {
  const { toast } = useToast();
  const [newLink, setNewLink] = useState<Omit<CustomLink, 'id'>>({ title: '', url: '', imageUrl: '' });
  const [editingLink, setEditingLink] = useState<EditableLink | null>(null);
  const [isUploading, setIsUploading] = useState(false);


  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, forEditing: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({ variant: 'destructive', title: "Error", description: "Image size should not exceed 2MB." });
        return;
      }
      setIsUploading(true);
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error } = await supabase.storage
        .from('linkfolio-images')
        .upload(`public/${fileName}`, file);

      if (error) {
        toast({ variant: 'destructive', title: "Upload Error", description: "Failed to upload image." });
        console.error(error);
        setIsUploading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('linkfolio-images')
        .getPublicUrl(uploadData.path);
        
      if (forEditing && editingLink) {
        setEditingLink({ ...editingLink, imageUrl: publicUrl });
      } else {
        setNewLink({ ...newLink, imageUrl: publicUrl });
      }
      setIsUploading(false);
      toast({ title: "Image uploaded successfully."});
    }
  };
  
  const handleAddLink = () => {
    if (!newLink.title || !newLink.url) {
      toast({ variant: 'destructive', title: "Error", description: "Title and URL are required." });
      return;
    }
    if (!newLink.url.startsWith('http')) {
        toast({ variant: 'destructive', title: "Error", description: "URL must start with http or https." });
        return;
    }

    const linkToAdd: CustomLink = { 
      id: Date.now().toString(), 
      title: newLink.title,
      url: newLink.url,
      imageUrl: newLink.imageUrl || 'https://picsum.photos/seed/placeholder/64/64'
    };
    const updatedLinks = [...data.customLinks, linkToAdd];
    onUpdate({ customLinks: updatedLinks });
    setNewLink({ title: '', url: '', imageUrl: '' });
    toast({ title: "Custom Link Added" });
  };

  const handleDeleteLink = (id: string) => {
    const updatedLinks = data.customLinks.filter(link => link.id !== id);
    onUpdate({ customLinks: updatedLinks });
    toast({ title: "Custom Link Removed" });
  };

  const handleStartEdit = (link: CustomLink) => {
    setEditingLink({ ...link });
  };
  
  const handleCancelEdit = () => {
    setEditingLink(null);
  }

  const handleSaveEdit = () => {
    if (!editingLink || !editingLink.id) return;
    const updatedLinks = data.customLinks.map(link => link.id === editingLink.id ? { ...link, ...editingLink } as CustomLink : link);
    onUpdate({ customLinks: updatedLinks });
    setEditingLink(null);
    toast({ title: "Custom Link Updated" });
  };
  
  const handleEditingChange = (field: keyof EditableLink, value: string) => {
    if (editingLink) {
      setEditingLink(prev => ({ ...prev, [field]: value }));
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Links</CardTitle>
        <CardDescription>Highlight your projects, articles, or any other content.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {data.customLinks.map((link) => (
            editingLink?.id === link.id ? (
              <div key={link.id} className="p-4 rounded-lg border space-y-4">
                <Input placeholder="Title" value={editingLink.title} onChange={(e) => handleEditingChange('title', e.target.value)} />
                <Input placeholder="URL" value={editingLink.url} onChange={(e) => handleEditingChange('url', e.target.value)} />
                <div>
                  <Label htmlFor="edit-image">Link Image</Label>
                  <Input id="edit-image" type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} className="mt-1" disabled={isUploading} />
                  {editingLink.imageUrl && <Image src={editingLink.imageUrl} alt="preview" width={64} height={64} className="mt-2 rounded-md object-cover aspect-square" />}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveEdit} disabled={isUploading}><Save className="h-4 w-4 mr-2"/>Save</Button>
                  <Button size="sm" variant="ghost" onClick={handleCancelEdit} disabled={isUploading}><X className="h-4 w-4 mr-2"/>Cancel</Button>
                </div>
              </div>
            ) : (
              <div key={link.id} className="flex items-center gap-4 p-2 rounded-lg border">
                <Image src={link.imageUrl || 'https://picsum.photos/seed/placeholder/64/64'} alt={link.title} width={48} height={48} className="rounded-md object-cover aspect-square" />
                <div className="flex-grow">
                  <p className="font-medium">{link.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                </div>
                <div className="flex items-center">
                  <Button variant="ghost" size="icon" onClick={() => handleStartEdit(link)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteLink(link.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            )
          ))}
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-medium">Add New Link</h3>
          <div className="space-y-2">
            <Input placeholder="Link Title" value={newLink.title} onChange={(e) => setNewLink({ ...newLink, title: e.target.value })} />
            <Input placeholder="URL (e.g., https://...)" value={newLink.url} onChange={(e) => setNewLink({ ...newLink, url: e.target.value })} />
            <div>
                <Label htmlFor="new-image">Link Image (Optional)</Label>
                <Input id="new-image" type="file" accept="image/*" onChange={(e) => handleImageUpload(e, false)} className="mt-1" disabled={isUploading}/>
                {newLink.imageUrl && <Image src={newLink.imageUrl} alt="preview" width={64} height={64} className="mt-2 rounded-md object-cover aspect-square" />}
            </div>
          </div>
          <Button onClick={handleAddLink} disabled={isUploading}>
            {isUploading ? "Uploading..." : <><Plus className="h-4 w-4 mr-2" /> Add Link</>}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
