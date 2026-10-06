import { TaskStatus } from "@/lib/generated/prisma/enums";

export const STATUSES = Object.values(TaskStatus) as TaskStatus[];

export const TAG_COLORS = ["purple", "orange", "pink", "green"] as const;

export function noteFor(status: TaskStatus, progress: number) {
  if (status === "COMPLETED") return "Task Finished";
  if (status === "PENDING") return "Not started yet";
  if (status === "REVIEW") return "Under Review";
  return `${progress}% completed`;
}

export function progressFor(status: TaskStatus, current: number) {
  if (status === "COMPLETED") return 100;
  if (status === "PENDING") return 0;
  if (status === "REVIEW") return Math.max(current, 90);
  return current > 0 && current < 100 ? current : 50;
}

export const SEED_TASKS: {
  tag: string;
  tagColor: string;
  title: string;
  status: TaskStatus;
  progress: number;
  assignees: string[];
}[] = [
  { tag: "ILLUSTRATION", tagColor: "purple", title: "Add one more type of illustration on the home screen", status: "PENDING", progress: 0, assignees: ["AL", "JD", "MK"] },
  { tag: "UX DESIGN", tagColor: "purple", title: "Create designs for admin, and for user web and android platform", status: "PENDING", progress: 0, assignees: ["RS", "TJ"] },
  { tag: "PROTOTYPE", tagColor: "purple", title: "Create prototype for admin, and for user web and android platform", status: "PENDING", progress: 0, assignees: ["JD", "AL"] },
  { tag: "WIREFRAMES", tagColor: "orange", title: "Create Wireframes for admin, and for user web and android platform", status: "IN_PROGRESS", progress: 50, assignees: ["MK", "RS", "AL"] },
  { tag: "ARCHITECTURE", tagColor: "orange", title: "Create information architecture for admin, and for user web and android", status: "IN_PROGRESS", progress: 60, assignees: ["TJ", "JD"] },
  { tag: "TASK FLOW", tagColor: "pink", title: "Create Task Flow for admin, and for user web and android platform", status: "REVIEW", progress: 90, assignees: ["AL", "MK", "RS"] },
  { tag: "USER PERSONAS", tagColor: "green", title: "Create Personas for all type of users on the base of research data", status: "COMPLETED", progress: 100, assignees: ["JD", "TJ", "AL"] },
  { tag: "USER STORIES", tagColor: "green", title: "Create User Stories for admin, and for user web and android platform", status: "COMPLETED", progress: 100, assignees: ["RS", "MK"] },
];
