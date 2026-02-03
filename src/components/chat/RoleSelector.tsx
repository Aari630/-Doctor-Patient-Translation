'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Role, Language } from '@/lib/definitions';
import { supportedLanguages } from '@/lib/definitions';
import { Stethoscope, User } from 'lucide-react';
import { Logo } from '../Logo';

interface RoleSelectorProps {
  onSelect: (role: Role, language: Language) => void;
}

export function RoleSelector({ onSelect }: RoleSelectorProps) {
  const [role, setRole] = useState<Role>('Patient');
  const [languageCode, setLanguageCode] = useState<string>('en');

  const handleStart = () => {
    const selectedLanguage = supportedLanguages.find((l) => l.code === languageCode);
    if (selectedLanguage) {
      onSelect(role, selectedLanguage);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[425px]" hideCloseButton>
        <DialogHeader>
          <DialogTitle className="flex justify-center mb-2">
            <Logo />
          </DialogTitle>
          <DialogDescription className="text-center">
            Select your role and preferred language to begin.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label>Your Role</Label>
            <RadioGroup
              defaultValue="Patient"
              onValueChange={(value: Role) => setRole(value)}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem value="Patient" id="patient" className="peer sr-only" />
                <Label
                  htmlFor="patient"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <User className="mb-3 h-6 w-6" />
                  Patient
                </Label>
              </div>
              <div>
                <RadioGroupItem value="Doctor" id="doctor" className="peer sr-only" />
                <Label
                  htmlFor="doctor"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Stethoscope className="mb-3 h-6 w-6" />
                  Doctor
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Your Language</Label>
            <Select value={languageCode} onValueChange={setLanguageCode}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                {supportedLanguages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleStart} className="w-full">
            Start Conversation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
