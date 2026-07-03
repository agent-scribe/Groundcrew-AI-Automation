/**
 * Demo tenant seed (G22): "Northbeam Digital (Demo)" with fixture
 * onboardings across stages so every screen renders alive — no external API.
 */
export type Stage = "parsing" | "review" | "cleared" | "in_progress" | "wheels_up";
export type Health = "green" | "amber" | "red";

export interface DemoOnboarding {
  id: string;
  client: string;
  services: string[];
  stage: Stage;
  health: Health;
  daysInStage: number;
  nextChaseDays: number | null;
  verifiedPct: number;
  itemsTotal: number;
  itemsDone: number;
  kickoff: string | null;
  timeSavedHours: number;
  contact: string;
  contactEmail: string;
}

export const STAGES: { key: Stage; label: string }[] = [
  { key: "parsing", label: "Parsing" },
  { key: "review", label: "Review" },
  { key: "cleared", label: "Cleared" },
  { key: "in_progress", label: "In Progress" },
  { key: "wheels_up", label: "Wheels Up" },
];

export const DEMO_ONBOARDINGS: DemoOnboarding[] = [
  {
    id: "acme-seo",
    client: "Acme Outdoor Co",
    services: ["SEO Retainer"],
    stage: "review",
    health: "green",
    daysInStage: 0,
    nextChaseDays: null,
    verifiedPct: 91.3,
    itemsTotal: 0,
    itemsDone: 0,
    kickoff: "2026-07-14",
    timeSavedHours: 16.4,
    contact: "Dana Reyes",
    contactEmail: "dana@acmeoutdoor.com",
  },
  {
    id: "harbor-ppc",
    client: "Harbor & Finch",
    services: ["PPC", "Landing pages"],
    stage: "in_progress",
    health: "amber",
    daysInStage: 6,
    nextChaseDays: 1,
    verifiedPct: 88.9,
    itemsTotal: 12,
    itemsDone: 7,
    kickoff: "2026-07-09",
    timeSavedHours: 17.1,
    contact: "Miles Chen",
    contactEmail: "miles@harborfinch.co",
  },
  {
    id: "bloom-web",
    client: "Bloom Wellness",
    services: ["Web design", "Web dev"],
    stage: "in_progress",
    health: "red",
    daysInStage: 11,
    nextChaseDays: 0,
    verifiedPct: 94.1,
    itemsTotal: 14,
    itemsDone: 5,
    kickoff: "2026-07-06",
    timeSavedHours: 17.8,
    contact: "Priya Nair",
    contactEmail: "priya@bloomwellness.io",
  },
  {
    id: "atlas-brand",
    client: "Atlas Freight",
    services: ["Branding"],
    stage: "wheels_up",
    health: "green",
    daysInStage: 2,
    nextChaseDays: null,
    verifiedPct: 96.2,
    itemsTotal: 9,
    itemsDone: 9,
    kickoff: "2026-06-24",
    timeSavedHours: 16.9,
    contact: "Tom Okafor",
    contactEmail: "tom@atlasfreight.com",
  },
  {
    id: "verde-social",
    client: "Verde Kitchen",
    services: ["Social media", "Content"],
    stage: "parsing",
    health: "green",
    daysInStage: 0,
    nextChaseDays: null,
    verifiedPct: 0,
    itemsTotal: 0,
    itemsDone: 0,
    kickoff: null,
    timeSavedHours: 0,
    contact: "Sofia Marino",
    contactEmail: "sofia@verdekitchen.com",
  },
  {
    id: "north-email",
    client: "Northwind Gear",
    services: ["Email marketing"],
    stage: "cleared",
    health: "green",
    daysInStage: 1,
    nextChaseDays: 2,
    verifiedPct: 89.5,
    itemsTotal: 10,
    itemsDone: 2,
    kickoff: "2026-07-20",
    timeSavedHours: 15.6,
    contact: "Jonas Feld",
    contactEmail: "jonas@northwindgear.com",
  },
];

export const AGENCY = {
  name: "Northbeam Digital",
  plan: "Pro",
  activeLimit: 20,
};

export function totalTimeSaved() {
  return DEMO_ONBOARDINGS.reduce((acc, o) => acc + o.timeSavedHours, 0);
}

export function byStage(stage: Stage) {
  return DEMO_ONBOARDINGS.filter((o) => o.stage === stage);
}

export function getOnboarding(id: string) {
  return DEMO_ONBOARDINGS.find((o) => o.id === id);
}

export const HEALTH_LABEL: Record<Health, string> = {
  green: "On track",
  amber: "Aging",
  red: "Overdue",
};
