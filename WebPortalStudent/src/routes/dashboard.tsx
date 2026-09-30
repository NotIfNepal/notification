import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, Bookmark, CalendarDays, Inbox, Pin, Search } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  DEFAULT_STUDENT_PREFERENCES,
  readStudentPreferences,
  type NoticeType,
  type StudentPreferences,
} from "@/lib/student-preferences";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your notice feed — NotifNepal" },
      {
        name: "description",
        content:
          "Your personalized feed of university notices: exams, admissions, scholarships, and more.",
      },
      { property: "og:title", content: "Your notice feed — NotifNepal" },
      {
        property: "og:description",
        content: "Your personalized feed of university notices.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DashboardPage,
});

interface Notice {
  id: number;
  title: string;
  source: string;
  type: NoticeType;
  date: string;
  excerpt: string;
  pinned?: boolean;
}

const TYPE_STYLES: Record<NoticeType, string> = {
  general: "bg-secondary text-secondary-foreground",
  exam: "bg-accent text-accent-foreground",
  admission: "bg-primary text-primary-foreground",
  scholarship: "bg-secondary text-secondary-foreground",
  placement: "bg-secondary text-secondary-foreground",
  urgent: "bg-destructive text-destructive-foreground",
};

const NOTICES: Notice[] = [
  {
    id: 1,
    title: "BE Computer 6th Semester Exam Routine Published",
    source: "Institute of Engineering (Pulchowk)",
    type: "exam",
    date: "Sep 28, 2026",
    excerpt:
      "The examination routine for BE Computer 6th semester (2083 Bhadra) has been published. Exams begin Oct 12. Check the full schedule for subject-wise dates.",
    pinned: true,
  },
  {
    id: 2,
    title: "Urgent: Exam Form Deadline Extended to Oct 3",
    source: "Examination Controller Office",
    type: "urgent",
    date: "Sep 29, 2026",
    excerpt:
      "Due to server issues, the deadline for regular exam form submission has been extended to Oct 3, 2026. Late fees apply after this date.",
  },
  {
    id: 3,
    title: "MSc CS Entrance Exam — Application Open",
    source: "Central Department of Computer Science",
    type: "admission",
    date: "Sep 25, 2026",
    excerpt:
      "Applications are now open for the MSc in Computer Science program (Spring 2027 intake). Entrance exam scheduled for Nov 15.",
  },
  {
    id: 4,
    title: "Merit-Based Scholarship Applications for 2026/27",
    source: "Tribhuvan University",
    type: "scholarship",
    date: "Sep 22, 2026",
    excerpt:
      "Students with a GPA of 3.6 or above are eligible to apply for the university merit scholarship. Submit documents to your campus office by Oct 20.",
  },
  {
    id: 5,
    title: "Campus Job Fair — 40+ Companies Confirmed",
    source: "Placement Cell",
    type: "placement",
    date: "Sep 20, 2026",
    excerpt:
      "The annual campus job fair returns on Nov 5. Over 40 companies including major banks and tech firms will be recruiting. Register through the placement portal.",
  },
  {
    id: 6,
    title: "Dashain Vacation Notice",
    source: "Tribhuvan University",
    type: "general",
    date: "Sep 18, 2026",
    excerpt:
      "All classes remain suspended from Oct 8 to Oct 22 for Dashain and Tihar holidays. Administrative offices operate on reduced hours.",
  },
];

const FILTERS: { id: NoticeType | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "urgent", label: "Urgent" },
  { id: "exam", label: "Exams" },
  { id: "admission", label: "Admissions" },
  { id: "scholarship", label: "Scholarships" },
  { id: "placement", label: "Placements" },
  { id: "general", label: "General" },
];

function DashboardPage() {
  const [filter, setFilter] = useState<NoticeType | "all">("all");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<number[]>([]);
  const [preferences, setPreferences] = useState<StudentPreferences>(
    DEFAULT_STUDENT_PREFERENCES,
  );

  useEffect(() => {
    setPreferences(readStudentPreferences());
  }, []);

  const visible = NOTICES.filter(
    (n) =>
      (filter === "all"
        ? preferences.noticeTypes.includes(n.type)
        : n.type === filter) &&
      (query === "" ||
        n.title.toLowerCase().includes(query.toLowerCase()) ||
        n.source.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          {/* Header */}
          <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur">
            <SidebarTrigger />
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search notices…"
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="ml-auto flex items-center gap-3">
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="h-4 w-4" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  AS
                </AvatarFallback>
              </Avatar>
            </div>
          </header>

          <main className="mx-auto w-full max-w-6xl flex-1 space-y-5 p-4 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b pb-5">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                  {[preferences.university, preferences.college, preferences.department]
                    .filter(Boolean)
                    .join(" / ") || "Set your university preferences"}
                </p>
                <h1 className="font-display text-2xl font-bold">Notice inbox</h1>
              </div>
              <p className="text-sm text-muted-foreground">
                {visible.length} {visible.length === 1 ? "message" : "messages"}
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-1 border-b pb-3">
              {FILTERS.filter(
                (item) => item.id === "all" || preferences.noticeTypes.includes(item.id),
              ).map((f) => (
                <Button
                  key={f.id}
                  variant={filter === f.id ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "rounded-md",
                    filter === f.id && "font-semibold text-primary",
                  )}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label}
                </Button>
              ))}
            </div>

            <div className="overflow-hidden rounded-md border bg-card">
              {visible.length === 0 ? (
                <div className="flex flex-col items-center gap-2 px-4 py-16 text-center text-muted-foreground">
                  <Inbox className="h-8 w-8" />
                  <p className="text-sm">No notices match your filters.</p>
                </div>
              ) : (
                visible.map((notice) => (
                  <article
                    key={notice.id}
                    className={cn(
                      "grid gap-x-4 gap-y-2 border-b px-4 py-4 last:border-b-0 sm:grid-cols-[minmax(150px,0.8fr)_minmax(0,2fr)_auto] sm:items-center",
                      notice.pinned && "bg-secondary/40",
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarFallback className="bg-muted text-xs font-semibold">
                          {notice.source
                            .split(/\s+/)
                            .slice(0, 2)
                            .map((word) => word[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate text-sm font-medium">
                        {notice.source}
                      </span>
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate text-sm font-semibold">
                          {notice.title}
                        </h2>
                        {notice.pinned && (
                          <Pin className="h-3.5 w-3.5 shrink-0 text-primary" />
                        )}
                      </div>
                      <p className="line-clamp-1 text-sm text-muted-foreground">
                        {notice.excerpt}
                      </p>
                      <Badge className={TYPE_STYLES[notice.type]}>
                        {notice.type}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <span className="flex items-center gap-1 whitespace-nowrap text-xs text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {notice.date}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={
                          saved.includes(notice.id)
                            ? "Remove saved notice"
                            : "Save notice"
                        }
                        onClick={() =>
                          setSaved((prev) =>
                            prev.includes(notice.id)
                              ? prev.filter((id) => id !== notice.id)
                              : [...prev, notice.id],
                          )
                        }
                      >
                        <Bookmark
                          className={cn(
                            "h-4 w-4",
                            saved.includes(notice.id) &&
                              "fill-primary text-primary",
                          )}
                        />
                      </Button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
