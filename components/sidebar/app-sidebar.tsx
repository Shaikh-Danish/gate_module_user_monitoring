"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar as SidebarShadcn,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  navigationGroups: {
    label: string;
    items: {
      title: string;
      url: string;
      icon: React.ReactNode;
    }[];
  }[];
}


function AppSidebar({ navigationGroups }: AppSidebarProps) {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <SidebarShadcn collapsible="icon">
      <SidebarHeader>
        <div className={`flex items-center py-2 ${state === "expanded" ? "gap-2 px-2" : ""}`}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">CA</span>
          </div>
          {state === "expanded" && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold">ContentAI</span>
              <span className="text-xs text-muted-foreground">
                AI Content Platform
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navigationGroups.map((group, index) => {
          return (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={
                          pathname === item.url ||
                          pathname.startsWith(item.url) ||
                          (pathname === "/" && item.url === "/dashboard")
                        }
                        tooltip={item.title}
                      >
                        <Link href={item.url} className="flex gap-x-2 px-3 py-1">
                          {item.icon}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>

                {state === "collapsed" && index < navigationGroups.length - 1 && <div className="h-px bg-border mt-7" />}
              </SidebarGroupContent>
            </SidebarGroup>
          )
        }

        )}
      </SidebarContent>
    </SidebarShadcn>
  )
}

export default AppSidebar