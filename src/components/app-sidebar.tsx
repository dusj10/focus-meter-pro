import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Settings, BarChart3, LogOut, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { TeamlenseLogo } from "@/components/team-lense-logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const items = [
  { title: "Přehled týmu", url: "/dashboard", icon: LayoutDashboard },
  { title: "Statistiky", url: "/statistics", icon: BarChart3 },
  { title: "Zaměstnanci", url: "/employees", icon: Users },
  { title: "Nastavení", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const currentPath = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-4 py-5 border-b">
        <Link to="/dashboard" className="flex items-center">
          <TeamlenseLogo textClassName="group-data-[collapsible=icon]:hidden" />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, idx) => (
                <SidebarMenuItem key={idx}>
                  <SidebarMenuButton
                    asChild
                    isActive={currentPath === item.url || (item.url !== "/dashboard" && currentPath.startsWith(item.url))}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span>Odhlásit se</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
