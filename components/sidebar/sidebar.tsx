import {
  Building,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  Receipt,
  TrendingUp,
  Truck,
  User,
} from "lucide-react";

import {
  getServerSession,
  type NextAuthOptions,
  type Session,
} from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

import { UserRole } from "@/types/user";
import AppSidebar from "./app-sidebar";

export default async function Sidebar() {
  const session: Session | null = await getServerSession(
    authOptions as NextAuthOptions,
  );

  if (!session) {
    return <div>Unauthorized</div>;
  }

  const userRole = session.roles;

  const allNavigationGroups = [
    {
      label: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: <LayoutDashboard />,
        },
        {
          title: "Payment Status",
          url: "/payment-status",
          icon: <CreditCard />,
        },
      ],
    },
    {
      label: "Core",
      items: [
        {
          title: "Bills",
          url: "/bills",
          icon: <Receipt />,
        },
        {
          title: "Dispatch Tracker",
          url: "/dispatch-tracker",
          icon: <Truck />,
        },
        {
          title: "Payment Tracker",
          url: "/payment-tracker",
          icon: <TrendingUp />,
        },
      ],
    },
    {
      label: "Learning",
      items: [
        {
          title: "Tutorials",
          url: "/tutorials",
          icon: <GraduationCap />,
        },
      ],
    },
    {
      label: "Management",
      items: [
        {
          title: "Users Management",
          url: "/users-management",
          icon: <User />,
        },
      ],
    },
  ];

  // Filter navigation groups based on user role
  const getFilteredNavigationGroups = () => {
    if (!userRole) return allNavigationGroups;

    if (userRole.includes(UserRole.YFA_ADMIN)) {
      return allNavigationGroups;
    }

    if (userRole.includes(UserRole.TRANSPORTER)) {
      return allNavigationGroups
        .map((group) => {
          if (group.label === "Management") {
            return {
              ...group,
              items: group.items.filter(
                (item) => item.title !== "Users Management",
              ),
            };
          }
          if (group.label === "Core") {
            return {
              ...group,
              items: group.items.filter(
                (item) =>
                  item.title !== "Dispatch Tracker" &&
                  item.title !== "Payment Tracker",
              ),
            };
          }
          return group;
        })
        .filter((group) => group.items.length > 0);
    }

    if (userRole.includes(UserRole.HENKEL)) {
      return allNavigationGroups
        .map((group) => {
          if (group.label === "Core") {
            return {
              ...group,
              items: group.items.filter((item) => item.title === "Bills"),
            };
          }
          return { ...group, items: [] };
        })
        .filter((group) => group.items.length > 0);
    }
  };

  const navigationGroups = getFilteredNavigationGroups();

  return <AppSidebar navigationGroups={navigationGroups ?? []} />;
}
