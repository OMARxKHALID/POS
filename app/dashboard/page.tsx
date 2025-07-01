"use client";

import { SalesDashboard } from "@/components/dashboard/sales-dashboard";

export default function DashboardPage() {
  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <div className="flex-1 overflow-hidden">
        <SalesDashboard />
      </div>
    </div>
  );
}
