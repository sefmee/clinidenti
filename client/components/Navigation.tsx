import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  DollarSign,
  Home,
  Plus,
  Bell,
  Settings,
  Activity,
  Stethoscope,
  Pill,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    name: "Tableau de bord",
    href: "/",
    icon: Home,
  },
  {
    name: "Patients",
    href: "/patients",
    icon: Users,
  },
  {
    name: "Rendez-vous",
    href: "/appointments",
    icon: Calendar,
  },
  {
    name: "Interface Dentaire",
    href: "/dental",
    icon: Stethoscope,
  },
  {
    name: "Ordonnances",
    href: "/prescriptions",
    icon: Pill,
  },
  {
    name: "Finances",
    href: "/finances",
    icon: DollarSign,
  },
  {
    name: "Rapports",
    href: "/reports",
    icon: Activity,
  },
];

export function Navigation() {
  const location = useLocation();

  return (
    <div className="w-64 bg-card border-r relative">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">MediCare Pro</h1>
            <p className="text-xs text-muted-foreground">Gestion médicale</p>
          </div>
        </div>
      </div>

      <nav className="px-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link key={item.href} to={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  isActive && "bg-primary text-primary-foreground",
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-accent/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-4 h-4 text-accent-foreground" />
            <span className="text-sm font-medium">Notifications</span>
            <Badge variant="secondary" className="ml-auto">
              3
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            3 rendez-vous aujourd'hui
          </p>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const location = useLocation();

  return (
    <header className="bg-card border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            {navigationItems.find((item) => item.href === location.pathname)
              ?.name || "Tableau de bord"}
          </h2>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Nouveau patient
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
