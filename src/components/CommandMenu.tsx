import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Home,
  FolderKanban,
  Search,
  Building2,
  ClipboardList,
  MessageSquare,
  Settings,
  Calculator,
  Users,
  FileText,
  Key,
  TestTube,
  Briefcase,
  Target,
  Brain,
} from "lucide-react";

interface CommandItem {
  title: string;
  path: string;
  icon: any;
  keywords?: string[];
}

const commandItems: CommandItem[] = [
  { title: "Home", path: "/home", icon: Home, keywords: ["dashboard", "main", "overview"] },
  { title: "Resume Builder", path: "/resume-builder", icon: FileText, keywords: ["cv", "resume", "builder"] },
  { title: "Quick Score", path: "/quick-score", icon: Target, keywords: ["score", "analyze", "check"] },
  { title: "My Resumes", path: "/my-resumes", icon: FolderKanban, keywords: ["projects", "saved"] },
  { title: "Templates", path: "/templates", icon: FileText, keywords: ["email", "communication"] },
  { title: "Rate Calculator", path: "/rate-calculator", icon: Calculator, keywords: ["salary", "money", "pay"] },
  { title: "Profile", path: "/profile", icon: Users, keywords: ["account", "settings"] },
  { title: "API Keys", path: "/api-keys", icon: Key, keywords: ["integration", "mcp"] },
  { title: "Learning Center", path: "/learning-center", icon: Brain, keywords: ["learn", "education", "help"] },
  { title: "Testing Dashboard", path: "/testing-dashboard", icon: TestTube, keywords: ["beta", "features", "test"] },
];

export const CommandMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Main">
          {commandItems.slice(0, 3).map((item) => {
            const Icon = item.icon;
            return (
              <CommandItem
                key={item.path}
                onSelect={() => handleSelect(item.path)}
                className="cursor-pointer"
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Tools & Settings">
          {commandItems.slice(3).map((item) => {
            const Icon = item.icon;
            return (
              <CommandItem
                key={item.path}
                onSelect={() => handleSelect(item.path)}
                className="cursor-pointer"
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
