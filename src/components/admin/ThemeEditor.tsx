"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ProfileData, ThemeSettings } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const themeSchema = z.object({
  background: z.object({ h: z.number(), s: z.number(), l: z.number() }),
  primary: z.object({ h: z.number(), s: z.number(), l: z.number() }),
  accent: z.object({ h: z.number(), s: z.number(), l: z.number() }),
  font: z.enum(['inter', 'space-grotesk', 'geist-sans']),
});

type ThemeFormValues = z.infer<typeof themeSchema>;

interface ThemeEditorProps {
  data: ProfileData;
  onUpdate: (newData: Partial<ProfileData>) => void;
}

const HSLSlider = ({ value, onChange }: { value: { h: number, s: number, l: number }, onChange: (key: 'h'|'s'|'l', value: number) => void }) => (
  <div className="space-y-4">
    <div>
      <Label>Hue ({value.h})</Label>
      <Slider defaultValue={[value.h]} max={360} step={1} onValueChange={([val]) => onChange('h', val)} />
    </div>
    <div>
      <Label>Saturation ({value.s}%)</Label>
      <Slider defaultValue={[value.s]} max={100} step={1} onValueChange={([val]) => onChange('s', val)} />
    </div>
    <div>
      <Label>Lightness ({value.l}%)</Label>
      <Slider defaultValue={[value.l]} max={100} step={1} onValueChange={([val]) => onChange('l', val)} />
    </div>
  </div>
);


export default function ThemeEditor({ data, onUpdate }: ThemeEditorProps) {
  const { toast } = useToast();

  const form = useForm<ThemeFormValues>({
    resolver: zodResolver(themeSchema),
    defaultValues: data.theme,
  });

  function onSubmit(values: ThemeFormValues) {
    onUpdate({ theme: values });
    toast({
      title: "Theme Updated",
      description: "Your new theme has been saved and applied.",
    });
    form.reset(values);
  }

  const currentTheme = form.watch();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Customizer</CardTitle>
        <CardDescription>Adjust the colors and fonts of your public profile.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg font-semibold mb-4">Color Palette</h3>
                    <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="background"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Background Color</FormLabel>
                                    <div className="p-4 rounded-md border" style={{ backgroundColor: `hsl(${field.value.h}, ${field.value.s}%, ${field.value.l}%)`}} />
                                    <HSLSlider value={field.value} onChange={(key, val) => field.onChange({ ...field.value, [key]: val })} />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="primary"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Primary Color</FormLabel>
                                     <div className="p-4 rounded-md border" style={{ backgroundColor: `hsl(${field.value.h}, ${field.value.s}%, ${field.value.l}%)`}} />
                                    <HSLSlider value={field.value} onChange={(key, val) => field.onChange({ ...field.value, [key]: val })} />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="accent"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Accent Color</FormLabel>
                                     <div className="p-4 rounded-md border" style={{ backgroundColor: `hsl(${field.value.h}, ${field.value.s}%, ${field.value.l}%)`}} />
                                    <HSLSlider value={field.value} onChange={(key, val) => field.onChange({ ...field.value, [key]: val })} />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                 <div>
                    <h3 className="text-lg font-semibold mb-4">Typography</h3>
                    <FormField
                    control={form.control}
                    name="font"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormLabel>Choose a font family</FormLabel>
                        <FormControl>
                            <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                            >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="inter" />
                                </FormControl>
                                <FormLabel className="font-normal font-sans">Inter (Sans-serif)</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="space-grotesk" />
                                </FormControl>
                                <FormLabel className="font-normal font-headline">Space Grotesk (Display)</FormLabel>
                            </FormItem>
                             <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="geist-sans" />
                                </FormControl>
                                <FormLabel className="font-normal">Geist (Sans-serif)</FormLabel>
                            </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                 </div>
            </div>

            <Button type="submit" disabled={!form.formState.isDirty}>Save Changes</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
