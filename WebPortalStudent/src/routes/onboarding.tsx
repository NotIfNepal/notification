import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  GraduationCap,
  Building2,
  BookOpen,
  Bell,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  COLLEGES,
  DEPARTMENTS,
  NOTICE_TYPES,
  UNIVERSITIES,
  type NoticeType,
  saveStudentPreferences,
} from "@/lib/student-preferences";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Set up your feed — NotifNepal" },
      {
        name: "description",
        content:
          "Choose your university, college, department, and the notice types you want to follow.",
      },
      { property: "og:title", content: "Set up your feed — NotifNepal" },
      {
        property: "og:description",
        content: "Personalize your university notice feed in three steps.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OnboardingPage,
});

const STEPS = [
  { id: 1, title: "University", icon: GraduationCap },
  { id: 2, title: "College & Department", icon: Building2 },
  { id: 3, title: "Notice types", icon: Bell },
];

function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [university, setUniversity] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [noticeTypes, setNoticeTypes] = useState<NoticeType[]>(["general", "exam"]);

  const toggleNoticeType = (id: NoticeType) =>
    setNoticeTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );

  const canContinue =
    (step === 1 && !!university) ||
    (step === 2 && !!college && !!department) ||
    (step === 3 && noticeTypes.length > 0);

  const next = () => {
    if (step < 3) setStep(step + 1);
    else {
      saveStudentPreferences({ university, college, department, noticeTypes });
      navigate({ to: "/settings" });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-4 py-10">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="font-display text-xl font-semibold">NotifNepal</span>
        </div>

        {/* Stepper */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                      step > s.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : step === s.id
                          ? "border-primary bg-background text-primary"
                          : "border-border bg-background text-muted-foreground",
                    )}
                  >
                    {step > s.id ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <s.icon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium",
                      step >= s.id ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {s.title}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "mx-2 mb-5 h-0.5 flex-1",
                      step > s.id ? "bg-primary" : "bg-border",
                    )}
                  />
                )}
              </div>
            ))}
          </div>
          <Progress value={(step / 3) * 100} className="h-1.5" />
        </div>

        {/* Step content */}
        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Which university do you attend?"}
              {step === 2 && "Your college and department"}
              {step === 3 && "What notices do you want?"}
            </CardTitle>
            <CardDescription>
              {step === 1 &&
                "We'll show notices published by your university."}
              {step === 2 &&
                "Narrow it down to your college and field of study."}
              {step === 3 &&
                "Pick the categories you care about. You can change this anytime."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-2">
                <Label>University</Label>
                <Select value={university} onValueChange={setUniversity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your university" />
                  </SelectTrigger>
                  <SelectContent>
                    {UNIVERSITIES.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label>College / Campus</Label>
                  <Select value={college} onValueChange={setCollege}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your college" />
                    </SelectTrigger>
                    <SelectContent>
                      {(COLLEGES[university] ?? []).map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Department / Course</Label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {step === 3 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {NOTICE_TYPES.map((type) => {
                  const checked = noticeTypes.includes(type.id);
                  return (
                    <label
                      key={type.id}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors",
                        checked
                          ? "border-primary bg-secondary"
                          : "border-border hover:bg-muted/50",
                      )}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleNoticeType(type.id)}
                        className="mt-0.5"
                      />
                      <div>
                        <p className="text-sm font-medium">{type.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {type.description}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="ghost"
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button onClick={next} disabled={!canContinue}>
                {step === 3 ? (
                  <>
                    <BookOpen className="h-4 w-4" />
                    Open my feed
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
