import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — NotifNepal" },
      {
        name: "description",
        content:
          "Sign in to NotifNepal, the notice portal for university students. Never miss an exam, admission, or general notice again.",
      },
      { property: "og:title", content: "Sign in — NotifNepal" },
      {
        property: "og:description",
        content:
          "Sign in to NotifNepal, the notice portal for university students.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.16 3.57-8.81Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.07.72-2.44 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28v-3.1H1.29a12 12 0 0 0 0 10.76l3.98-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.76c1.76 0 3.34.6 4.58 1.8l3.44-3.44A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.29 6.62l3.98 3.1C6.22 6.87 8.87 4.76 12 4.76Z"
      />
    </svg>
  );
}

function AuthPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/onboarding" });
  };

  return (
    <div className="flex min-h-screen">
      {/* Left brand panel */}
      <div className="hidden w-1/2 flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="font-display text-xl font-semibold">NotifNepal</span>
        </div>
        <div className="space-y-6">
          <h1 className="font-display text-4xl font-bold leading-tight">
            Every notice.
            <br />
            One place.
          </h1>
          <p className="max-w-md text-lg text-primary-foreground/70">
            Exam schedules, admission updates, and campus announcements from
            your university — delivered to a single, organized feed.
          </p>
          <ul className="space-y-3 text-primary-foreground/80">
            {[
              "Follow your university, college, and department",
              "Filter by notice type: exams, admissions, events",
              "Never miss a deadline again",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-sidebar-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-primary-foreground/50">
          Built for students, by students.
        </p>
      </div>

      {/* Right auth form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="font-display text-xl font-semibold">
              NotifNepal
            </span>
          </div>

          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            {(["signin", "signup"] as const).map((tab) => (
              <TabsContent key={tab} value={tab}>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {tab === "signin" ? "Welcome back" : "Join NotifNepal"}
                    </CardTitle>
                    <CardDescription>
                      {tab === "signin"
                        ? "Sign in to see your personalized notice feed."
                        : "Create an account to start following your university notices."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => navigate({ to: "/onboarding" })}
                      >
                        <GoogleIcon />
                        Google
                      </Button>
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => navigate({ to: "/onboarding" })}
                      >
                        <Mail className="h-4 w-4" />
                        SSO
                      </Button>
                    </div>

                    <div className="flex items-center gap-3">
                      <Separator className="flex-1" />
                      <span className="text-xs text-muted-foreground">
                        or continue with email
                      </span>
                      <Separator className="flex-1" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {tab === "signup" && (
                        <div className="space-y-2">
                          <Label htmlFor={`${tab}-name`}>Full name</Label>
                          <Input
                            id={`${tab}-name`}
                            placeholder="Aarav Sharma"
                            required
                          />
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor={`${tab}-email`}>Email</Label>
                        <Input
                          id={`${tab}-email`}
                          type="email"
                          placeholder="you@university.edu"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${tab}-password`}>Password</Label>
                        <div className="relative">
                          <Input
                            id={`${tab}-password`}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            required
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            aria-label="Toggle password visibility"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <Button type="submit" className="w-full">
                        <Lock className="h-4 w-4" />
                        {tab === "signin" ? "Sign in" : "Create account"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy
            Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
