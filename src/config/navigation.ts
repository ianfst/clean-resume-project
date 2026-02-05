import {
  Home,
  Search,
  FileText,
  Linkedin,
  MessageSquare,
  Building2,
  Users,
  DollarSign,
  Brain,
  BookOpen,
  User,
  Key,
  CreditCard,
  LogOut,
  FlaskConical,
  Settings,
  Zap,
  Briefcase,
  Mic,
  type LucideIcon,
} from "lucide-react";
import { ModuleId } from "./modules";

export interface NavItem {
  label: string;
  path?: string;
  icon: LucideIcon;
  dropdown?: DropdownItem[];
  highlight?: boolean;
  module?: ModuleId; // Which module this belongs to
}

export interface DropdownItem {
  label: string;
  path: string;
  icon: LucideIcon;
  module?: ModuleId;
}

export interface ProfileItem {
  label?: string;
  path?: string;
  icon?: LucideIcon;
  action?: 'signout';
  type?: 'separator';
}

// ==========================================
// 5-MODULE NAVIGATION STRUCTURE
// ==========================================
// Module 1: Quick Score (FREE)
// Module 2: Resume & Jobs Studio
// Module 3: Master Resume  
// Module 4: LinkedIn Pro
// Module 5: Interview Mastery
// ==========================================

export const mainNavItems: NavItem[] = [
  {
    label: 'Home',
    path: '/home',
    icon: Home
  },
  // MODULE 1: Quick Score (FREE)
  {
    label: 'Quick Score',
    path: '/quick-score',
    icon: Zap,
    highlight: true,
    module: 'quick_score',
  },
  // MODULE 2: Resume Builder
  {
    label: 'Resume Builder',
    path: '/resume-builder',
    icon: FileText,
    module: 'resume_jobs_studio',
  },
  // Settings & More
  {
    label: 'Settings',
    icon: Settings,
    dropdown: [
      { label: 'My Resumes', path: '/my-resumes', icon: FileText, module: 'resume_jobs_studio' },
      { label: 'Resume Templates', path: '/templates', icon: FileText, module: 'resume_jobs_studio' },
      { label: 'Learning Center', path: '/learning-center', icon: BookOpen },
      { label: 'Profile Settings', path: '/profile', icon: User },
      { label: 'API Keys', path: '/api-keys', icon: Key },
      { label: 'Testing Dashboard', path: '/testing-dashboard', icon: FlaskConical },
    ],
  },
];

// Module-grouped navigation for UI rendering
export const moduleNavGroups = {
  quick_score: [
    { label: 'Quick Score', path: '/quick-score', icon: Zap }
  ],
  resume_jobs_studio: [
    { label: 'Resume Builder', path: '/resume-builder', icon: FileText },
    { label: 'My Resumes', path: '/my-resumes', icon: FileText },
    { label: 'Templates', path: '/templates', icon: FileText },
  ],
};

export const profileDropdownItems: ProfileItem[] = [
  { label: 'Quick Score', path: '/quick-score', icon: Zap },
  { label: 'Resume Builder', path: '/resume-builder', icon: FileText },
  { type: 'separator' },
  { label: 'Financial Planning', path: '/agents/financial-planning', icon: DollarSign },
  { label: 'Learning Center', path: '/learning-center', icon: BookOpen },
  { type: 'separator' },
  { label: 'Testing Dashboard', path: '/testing-dashboard', icon: FlaskConical },
  { type: 'separator' },
  { label: 'Profile Settings', path: '/profile', icon: User },
  { label: 'API Keys', path: '/api-keys', icon: Key },
  { label: 'Subscription', path: '/pricing', icon: CreditCard },
  { type: 'separator' },
  { label: 'Sign Out', action: 'signout', icon: LogOut },
];
