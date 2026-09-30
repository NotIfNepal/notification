export const UNIVERSITIES = [
  "Tribhuvan University",
  "Kathmandu University",
  "Pokhara University",
  "Purbanchal University",
  "Mid-West University",
];

export const COLLEGES: Record<string, string[]> = {
  "Tribhuvan University": [
    "Institute of Engineering (Pulchowk)",
    "Central Department of Computer Science",
    "Shanker Dev Campus",
    "Amrit Science Campus",
  ],
  "Kathmandu University": [
    "School of Engineering",
    "School of Science",
    "School of Management",
    "School of Arts",
  ],
  "Pokhara University": [
    "School of Business",
    "College of Engineering",
    "School of Health Sciences",
  ],
  "Purbanchal University": [
    "College of IT & Engineering",
    "College of Management",
  ],
  "Mid-West University": [
    "Faculty of Science & Technology",
    "Faculty of Management",
  ],
};

export const DEPARTMENTS = [
  "Computer Science",
  "Civil Engineering",
  "Electrical Engineering",
  "Business Administration",
  "Mathematics",
  "Physics",
  "Biotechnology",
];

export const NOTICE_TYPES = [
  {
    id: "general",
    label: "General",
    description: "Campus announcements, holidays, events",
  },
  {
    id: "exam",
    label: "Exams",
    description: "Exam schedules, results, form deadlines",
  },
  {
    id: "admission",
    label: "Admissions",
    description: "Entrance exams, application windows, merit lists",
  },
  {
    id: "scholarship",
    label: "Scholarships",
    description: "Grants, fee waivers, financial aid",
  },
  {
    id: "placement",
    label: "Placements",
    description: "Job fairs, internships, campus recruitment",
  },
  {
    id: "urgent",
    label: "Urgent",
    description: "Time-critical alerts you should never miss",
  },
] as const;

export type NoticeType = (typeof NOTICE_TYPES)[number]["id"];

export interface StudentPreferences {
  university: string;
  college: string;
  department: string;
  noticeTypes: NoticeType[];
}

export const DEFAULT_STUDENT_PREFERENCES: StudentPreferences = {
  university: "",
  college: "",
  department: "",
  noticeTypes: ["general", "exam"],
};

const STORAGE_KEY = "notifnepal.student-preferences";

export function readStudentPreferences(): StudentPreferences {
  if (typeof window === "undefined") return DEFAULT_STUDENT_PREFERENCES;

  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
    if (!value || typeof value !== "object") return DEFAULT_STUDENT_PREFERENCES;

    const stored = value as Partial<StudentPreferences>;
    return {
      university: typeof stored.university === "string" ? stored.university : "",
      college: typeof stored.college === "string" ? stored.college : "",
      department: typeof stored.department === "string" ? stored.department : "",
      noticeTypes: Array.isArray(stored.noticeTypes)
        ? stored.noticeTypes.filter((type): type is NoticeType =>
            NOTICE_TYPES.some((option) => option.id === type),
          )
        : DEFAULT_STUDENT_PREFERENCES.noticeTypes,
    };
  } catch {
    return DEFAULT_STUDENT_PREFERENCES;
  }
}

export function saveStudentPreferences(preferences: StudentPreferences) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }
}