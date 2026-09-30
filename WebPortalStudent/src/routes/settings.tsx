import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, GraduationCap, Mail } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import {
  COLLEGES,
  DEFAULT_STUDENT_PREFERENCES,
  DEPARTMENTS,
  NOTICE_TYPES,
  UNIVERSITIES,
  readStudentPreferences,
  saveStudentPreferences,
  type NoticeType,
  type StudentPreferences,
} from "@/lib/student-preferences";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — NotifNepal" },
      {
        name: "description",
        content: "Manage your NotifNepal account and notice delivery preferences.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [preferences, setPreferences] = useState<StudentPreferences>(
    DEFAULT_STUDENT_PREFERENCES,
  );
  const [saved, setSaved] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [urgentAlerts, setUrgentAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  useEffect(() => {
    setPreferences(readStudentPreferences());
  }, []);

  const updatePreferences = (update: Partial<StudentPreferences>) => {
    setPreferences((current) => ({ ...current, ...update }));
    setSaved(false);
  };

  const toggleNoticeType = (type: NoticeType, checked: boolean) => {
    const noticeTypes = checked
      ? [...preferences.noticeTypes, type]
      : preferences.noticeTypes.filter((selected) => selected !== type);
    updatePreferences({ noticeTypes });
  };

  const savePreferences = () => {
    saveStudentPreferences(preferences);
    setSaved(true);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="flex h-14 items-center gap-3 border-b bg-background px-4">
            <SidebarTrigger />
            <span className="text-sm font-medium">Settings</span>
          </header>
          <main className="mx-auto w-full max-w-4xl flex-1 space-y-8 p-4 sm:p-8">
            <div className="border-b pb-5">
              <h1 className="font-display text-2xl font-bold">Settings</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage how NotifNepal keeps you up to date.
              </p>
            </div>

            <section aria-labelledby="account-heading" className="space-y-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                <h2 id="account-heading" className="font-display text-lg font-semibold">
                  Account
                </h2>
              </div>
              <div className="grid gap-5 border-y py-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="university">University</Label>
                  <Select
                    value={preferences.university}
                    onValueChange={(university) =>
                      updatePreferences({ university, college: "" })
                    }
                  >
                    <SelectTrigger id="university">
                      <SelectValue placeholder="Select your university" />
                    </SelectTrigger>
                    <SelectContent>
                      {UNIVERSITIES.map((university) => (
                        <SelectItem key={university} value={university}>
                          {university}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="college">College / Campus</Label>
                  <Select
                    value={preferences.college}
                    onValueChange={(college) => updatePreferences({ college })}
                    disabled={!preferences.university}
                  >
                    <SelectTrigger id="college">
                      <SelectValue placeholder="Select your campus" />
                    </SelectTrigger>
                    <SelectContent>
                      {(COLLEGES[preferences.university] ?? []).map((college) => (
                        <SelectItem key={college} value={college}>
                          {college}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department / Course</Label>
                  <Select
                    value={preferences.department}
                    onValueChange={(department) =>
                      updatePreferences({ department })
                    }
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((department) => (
                        <SelectItem key={department} value={department}>
                          {department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            <section aria-labelledby="feed-heading" className="space-y-4">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                <h2 id="feed-heading" className="font-display text-lg font-semibold">
                  Notice categories
                </h2>
              </div>
              <div className="grid gap-3 border-y py-5 sm:grid-cols-2">
                {NOTICE_TYPES.map((type) => (
                  <label
                    key={type.id}
                    className="flex cursor-pointer items-start gap-3 rounded-md border p-3"
                  >
                    <Checkbox
                      checked={preferences.noticeTypes.includes(type.id)}
                      onCheckedChange={(checked) =>
                        toggleNoticeType(type.id, checked === true)
                      }
                      className="mt-0.5"
                    />
                    <span className="space-y-1">
                      <span className="block text-sm font-medium">{type.label}</span>
                      <span className="block text-xs text-muted-foreground">
                        {type.description}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section aria-labelledby="delivery-heading" className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <h2 id="delivery-heading" className="font-display text-lg font-semibold">
                  Email delivery
                </h2>
              </div>
              <div className="divide-y border-y">
                <PreferenceRow
                  id="email-updates"
                  title="Notice updates"
                  description="Receive new notices from your university by email."
                  checked={emailUpdates}
                  onCheckedChange={setEmailUpdates}
                />
                <PreferenceRow
                  id="urgent-alerts"
                  title="Urgent notices"
                  description="Get an email as soon as an urgent notice is published."
                  checked={urgentAlerts}
                  onCheckedChange={setUrgentAlerts}
                />
                <PreferenceRow
                  id="weekly-digest"
                  title="Weekly digest"
                  description="Receive a weekly summary of notices you may have missed."
                  checked={weeklyDigest}
                  onCheckedChange={setWeeklyDigest}
                />
              </div>
            </section>

            <div className="flex items-center justify-end gap-3 border-t pt-5">
              <span aria-live="polite" className="text-sm text-muted-foreground">
                {saved ? "All changes saved" : "Unsaved changes"}
              </span>
              <Button onClick={savePreferences} disabled={saved}>
                Save changes
              </Button>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

interface PreferenceRowProps {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function PreferenceRow({
  id,
  title,
  description,
  checked,
  onCheckedChange,
}: PreferenceRowProps) {
  return (
    <div className="flex items-center justify-between gap-6 py-4">
      <div className="space-y-1">
        <label htmlFor={id} className="text-sm font-medium">
          {title}
        </label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
