"use client";

import { ChevronRight, LogOut, Moon, Settings, Sun, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { Fragment } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Hint } from "./hint";

function BreadcrumbsHeader() {
  const pathName = usePathname();
  const paths = pathName === "/" ? [""] : pathName?.split("/").filter(Boolean);

  return (
    <Breadcrumb className="hidden sm:flex">
      <BreadcrumbList>
        {paths?.map((path, index) => {
          const href = `/${paths.slice(0, index + 1).join("/")}`;
          const label =
            path === "" ? "Home" : path.charAt(0).toUpperCase() + path.slice(1);

          return (
            <Fragment key={`item-${path}`}>
              <BreadcrumbItem>
                {index < paths.length - 1 ? (
                  <BreadcrumbLink asChild>
                    <Link
                      href={href}
                      className="font-medium text-sm transition-colors hover:text-primary"
                    >
                      {label}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="font-medium text-primary text-sm">
                    {label}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {index < paths.length - 1 && (
                <BreadcrumbSeparator key={`sep-${path}`}>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              )}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function Header() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleProfile = () => {
    router.push("/settings");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const getUserInitials = (email: string) => {
    return email
      .split("@")[0]
      .split(".")
      .map((part) => part.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  return (
    <header className="h-14 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex items-center gap-4 h-full">
          {pathname !== "/setup" && <Hint text="Toggle sidebar" side="bottom"><SidebarTrigger /></Hint>}
          <BreadcrumbsHeader />
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Hint text="Switch theme" side="bottom">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </Hint>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-auto px-2 gap-2"
                aria-label="User menu"
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage
                    src={session?.user?.image || ""}
                    alt={session?.user?.name || "User"}
                  />
                  <AvatarFallback className="text-xs">
                    {session?.user?.email
                      ? getUserInitials(session.user.email)
                      : "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {session?.user?.name || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session?.user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfile}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleProfile}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} variant="destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
