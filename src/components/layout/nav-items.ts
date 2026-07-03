import {
  Activity,
  CircleDollarSign,
  Info,
  LayoutDashboard,
  Repeat,
  Rocket,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { title: "Brief", href: "/", icon: LayoutDashboard },
  { title: "Adoption", href: "/adoption", icon: UserPlus },
  { title: "Engagement", href: "/engagement", icon: Activity },
  { title: "Retention", href: "/retention", icon: Repeat },
  { title: "Revenue", href: "/revenue", icon: CircleDollarSign },
  { title: "Initiatives", href: "/initiatives", icon: Rocket },
  { title: "About", href: "/about", icon: Info },
];
