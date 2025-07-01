"use client"

import { PageHeader } from "@/components/shared/page-header"
import { SalesDashboard } from "@/components/dashboard/sales-dashboard"

export default function DashboardPage() {
  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <div className="flex-shrink-0 bg-card border-b px-6 py-4">
        <PageHeader title="Sales Dashboard" showPOS />
      </div>
      <div className="flex-1 overflow-hidden">
        <SalesDashboard />
      </div>
    </div>
  )
}
