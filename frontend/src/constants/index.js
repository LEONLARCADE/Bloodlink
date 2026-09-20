import {
  Home,
  Info,
  HeartHandshake,
  Mail,
  LayoutDashboard,
  User,
  Inbox,
  History,
  Search,
  Users,
  Droplet,
  FileText,
  BarChart3,
} from "lucide-react";

export const APP_NAME = "BloodLink";
export const APP_TAGLINE = "Connecting donors and recipients, faster.";

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

// Maps display symbols to the Prisma BloodGroup enum values the backend expects.
export const BLOOD_GROUP_OPTIONS = [
  { value: "A_POSITIVE", label: "A+" },
  { value: "A_NEGATIVE", label: "A-" },
  { value: "B_POSITIVE", label: "B+" },
  { value: "B_NEGATIVE", label: "B-" },
  { value: "AB_POSITIVE", label: "AB+" },
  { value: "AB_NEGATIVE", label: "AB-" },
  { value: "O_POSITIVE", label: "O+" },
  { value: "O_NEGATIVE", label: "O-" },
];

// value (Prisma enum) -> display symbol, e.g. "A_POSITIVE" -> "A+"
export const BLOOD_GROUP_LABELS = BLOOD_GROUP_OPTIONS.reduce((acc, opt) => {
  acc[opt.value] = opt.label;
  return acc;
}, {});

export const bloodGroupLabel = (value) => BLOOD_GROUP_LABELS[value] || value || "—";

export const URGENCY_LABELS = {
  NORMAL: "Normal",
  URGENT: "Urgent",
  CRITICAL: "Critical",
};

export const URGENCY_OPTIONS = [
  { value: "NORMAL", label: "Normal" },
  { value: "URGENT", label: "Urgent" },
  { value: "CRITICAL", label: "Critical" },
];

export const URGENCY_BADGE_VARIANTS = {
  NORMAL: "info",
  URGENT: "warning",
  CRITICAL: "danger",
};

export const REQUEST_STATUS_LABELS = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  FULFILLED: "Fulfilled",
  CANCELLED: "Cancelled",
  EXPIRED: "Expired",
};

export const REQUEST_STATUS_BADGE_VARIANTS = {
  OPEN: "info",
  IN_PROGRESS: "warning",
  FULFILLED: "success",
  CANCELLED: "default",
  EXPIRED: "default",
};

// A request can only be edited or cancelled by its owner while it's in one
// of these statuses — kept here so frontend button-disabling logic matches
// the backend's EDITABLE_STATUSES exactly.
export const EDITABLE_REQUEST_STATUSES = ["OPEN", "IN_PROGRESS"];

export const RESPONSE_STATUS_LABELS = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  DECLINED: "Declined",
  COMPLETED: "Completed",
};

export const RESPONSE_STATUS_BADGE_VARIANTS = {
  PENDING: "default",
  ACCEPTED: "success",
  DECLINED: "danger",
  COMPLETED: "primary",
};

export const ROLES = {
  DONOR: "donor",
  RECIPIENT: "recipient",
  ADMIN: "admin",
};

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: "Register",
    body: "Create a free BloodLink account in under a minute.",
  },
  {
    step: 2,
    title: "Build your profile",
    body: "Add your blood group, location and availability as a donor or recipient.",
  },
  {
    step: 3,
    title: "Search or request",
    body: "Recipients raise a request; donors see the ones that fit them.",
  },
  {
    step: 4,
    title: "Find matches",
    body: "Compatibility and proximity narrow the list down to realistic options.",
  },
  {
    step: 5,
    title: "Connect & coordinate",
    body: "Agree on a hospital, a time, and get the donation done.",
  },
];

export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  HOW_IT_WORKS: "/how-it-works",
  CONTACT: "/contact",

  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  COMPLETE_PROFILE: "/complete-profile",

  DONOR: {
    DASHBOARD: "/donor/dashboard",
    PROFILE: "/donor/profile",
    REQUESTS: "/donor/requests",
    HISTORY: "/donor/history",
  },

  RECIPIENT: {
    DASHBOARD: "/recipient/dashboard",
    SEARCH: "/recipient/search",
    REQUESTS: "/recipient/requests",
    PROFILE: "/recipient/profile",
  },

  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    DONORS: "/admin/donors",
    RECIPIENTS: "/admin/recipients",
    REQUESTS: "/admin/requests",
    REPORTS: "/admin/reports",
  },
};

/** Standard route-based nav — back to real pages, no scroll/hash logic. */
export const PUBLIC_NAV = [
  { label: "Home", to: ROUTES.HOME, icon: Home, section: "home" },
  { label: "About", to: ROUTES.ABOUT, icon: Info, section: "about" },
  {
    label: "How It Works",
    to: ROUTES.HOW_IT_WORKS,
    icon: HeartHandshake,
    section: "how-it-works",
  },
  { label: "Contact", to: ROUTES.CONTACT, icon: Mail, section: "contact" },
];

/** Ordered section ids the droplet travels through — HOME → … → CONTACT. */
export const JOURNEY_SECTION_IDS = PUBLIC_NAV.map((item) => item.section);

/** The block after CONTACT whose scroll drives the splash, ripples and rebound. */
export const JOURNEY_POOL_ID = "journey-pool";

export const SIDEBAR_NAV = {
  [ROLES.DONOR]: [
    { label: "Dashboard", to: ROUTES.DONOR.DASHBOARD, icon: LayoutDashboard },
    { label: "Requests", to: ROUTES.DONOR.REQUESTS, icon: Inbox },
    { label: "Donation History", to: ROUTES.DONOR.HISTORY, icon: History },
    { label: "Profile", to: ROUTES.DONOR.PROFILE, icon: User },
  ],
  [ROLES.RECIPIENT]: [
    { label: "Dashboard", to: ROUTES.RECIPIENT.DASHBOARD, icon: LayoutDashboard },
    { label: "Find Donors", to: ROUTES.RECIPIENT.SEARCH, icon: Search },
    { label: "My Requests", to: ROUTES.RECIPIENT.REQUESTS, icon: Inbox },
    { label: "Profile", to: ROUTES.RECIPIENT.PROFILE, icon: User },
  ],
  [ROLES.ADMIN]: [
    { label: "Dashboard", to: ROUTES.ADMIN.DASHBOARD, icon: LayoutDashboard },
    { label: "Users", to: ROUTES.ADMIN.USERS, icon: Users },
    { label: "Donors", to: ROUTES.ADMIN.DONORS, icon: Droplet },
    { label: "Recipients", to: ROUTES.ADMIN.RECIPIENTS, icon: User },
    { label: "Requests", to: ROUTES.ADMIN.REQUESTS, icon: FileText },
    { label: "Reports", to: ROUTES.ADMIN.REPORTS, icon: BarChart3 },
  ],
};

export const ROLE_LABELS = {
  [ROLES.DONOR]: "Donor Portal",
  [ROLES.RECIPIENT]: "Recipient Portal",
  [ROLES.ADMIN]: "Admin Console",
};

export const PLACEHOLDER_NOTICE =
  "Functionality will be implemented in a later phase.";