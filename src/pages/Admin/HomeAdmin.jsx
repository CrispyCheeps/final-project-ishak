import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function HomeAdmin() {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />

        {/* Content Below */}
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 p-6">
            Welcome back, <span className="text-blue-600">Admin</span>!
          </h1>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
