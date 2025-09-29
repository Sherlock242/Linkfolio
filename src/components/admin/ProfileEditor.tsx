"use client";

import { useState }from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ProfileData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Edit, Upload } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().max(200, "Bio can be up to 200 characters"),
  profilePictureUrl: z.string().url("Must be a valid URL or Data URL"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileEditorProps {
  data: ProfileData;
  onUpdate: (newData: Partial<ProfileData>) => void;
}

export default function ProfileEditor({ data, onUpdate }: ProfileEditorProps) {
  const { toast } = useToast();
  const [isEditingImage, setIsEditingImage] = useState(false);
  const hiddenFileInput = React.useRef<HTMLInputElement>(null);


  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: data.name,
      bio: data.bio,
      profilePictureUrl: data.profilePictureUrl,
    },
  });
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({ variant: 'destructive', title: "Error", description: "Image size should not exceed 2MB." });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        form.setValue('profilePictureUrl', imageUrl, { shouldDirty: true });
        setIsEditingImage(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClickUpload = () => {
    hiddenFileInput.current?.click();
  };


  function onSubmit(values: ProfileFormValues) {
    onUpdate(values);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
    form.reset(values);
    setIsEditingImage(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your public name, bio, and profile picture.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <FormLabel>Profile Picture</FormLabel>
              <div className="relative w-32 h-32 group">
                <Image
                  src={form.watch("profilePictureUrl") || "/placeholder.svg"}
                  alt="Profile Picture"
                  width={128}
                  height={128}
                  className="rounded-full object-cover w-32 h-32 border-4 border-card"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute bottom-1 right-1 rounded-full group-hover:opacity-100 opacity-0 transition-opacity"
                  onClick={() => setIsEditingImage(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {isEditingImage && (
              <div className="p-4 rounded-lg border space-y-4">
                  <p className="text-sm font-medium">Update Profile Picture</p>
                  <div className="flex gap-2">
                      <Button type="button" onClick={handleClickUpload}>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Image
                      </Button>
                      <Input
                          type="file"
                          ref={hiddenFileInput}
                          onChange={handleImageUpload}
                          accept="image/*"
                          className="hidden"
                      />
                      <Button type="button" variant="ghost" onClick={() => setIsEditingImage(false)}>Cancel</Button>
                  </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A short bio about yourself..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={!form.formState.isDirty}>Save Changes</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
