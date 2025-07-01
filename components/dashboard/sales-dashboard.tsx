"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSalesStore } from "@/hooks/use-sales-store";
import { formatCurrency } from "@/utils/pos-utils";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Users,
  Award,
  Calendar,
  CreditCard,
  Banknote,
  Smartphone,
  BarChart3,
  Store,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Button } from "../ui/button";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function SalesDashboard() {
  const { getAnalytics } = useSalesStore();
  const analytics = useMemo(() => getAnalytics(), [getAnalytics]);

  const paymentMethodIcons = {
    cash: Banknote,
    card: CreditCard,
    mobile: Smartphone,
  };

  const MetricCard = ({ title, value, change, icon: Icon, color }: any) => (
    <Card className={`${color} border-opacity-20`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium font-quantico">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4" />
      </CardHeader>
      <CardContent className="pb-3">
        <div className="text-2xl font-bold font-quantico">{value}</div>
        <p className="text-xs flex items-center gap-1 font-quantico">
          <TrendingUp className="w-3 h-3" />
          {change}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="h-full overflow-y-auto ">
      <div className="p-6 space-y-6 ">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-primary " />
            <div>
              <h1 className="text-2xl font-bold text-foreground font-quantico">
                Analytics Overview
              </h1>
              <p className="text-sm text-muted-foreground font-quantico">
                Track your restaurant's performance
              </p>
            </div>
          </div>
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-3 text-xs font-quantico bg-white/60 border-gray-200"
            >
              <Store className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">POS</span>
            </Button>
          </Link>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Sales"
            value={formatCurrency(analytics.totalSales)}
            change="+12% from last week"
            icon={DollarSign}
            color="bg-blue-50 text-blue-700"
          />
          <MetricCard
            title="Total Orders"
            value={analytics.totalOrders}
            change="+8% from last week"
            icon={ShoppingCart}
            color="bg-green-50 text-green-700"
          />
          <MetricCard
            title="Avg Order Value"
            value={formatCurrency(analytics.averageOrderValue)}
            change="+5% from last week"
            icon={TrendingUp}
            color="bg-purple-50 text-purple-700"
          />
          <MetricCard
            title="Customers"
            value={analytics.topCustomers.length}
            change="Active customers"
            icon={Users}
            color="bg-orange-50 text-orange-700"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-quantico">
                <Award className="h-5 w-5 text-yellow-500" />
                Top Selling Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.topProducts.slice(0, 5).map((product, index) => (
                  <div
                    key={product.name}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm font-quantico">
                        {index + 1}
                      </Badge>
                      <div>
                        <p className="text-sm font-medium text-foreground font-quantico">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 font-quantico">
                          <ShoppingCart className="w-3 h-3" />
                          {product.quantity} sold
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground font-quantico">
                        {formatCurrency(product.revenue)}
                      </p>
                    </div>
                  </div>
                ))}
                {analytics.topProducts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Award className="h-12 w-12 mx-auto mb-3" />
                    <p className="text-sm font-quantico">
                      No sales data available
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Customers */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-quantico">
                <Users className="h-5 w-5 text-primary" />
                Top Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.topCustomers.slice(0, 5).map((customer) => (
                  <div
                    key={customer.name}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm font-quantico">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground font-quantico">
                          {customer.name}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 font-quantico">
                          <ShoppingCart className="w-3 h-3" />
                          {customer.orders} orders
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground font-quantico">
                        {formatCurrency(customer.total)}
                      </p>
                    </div>
                  </div>
                ))}
                {analytics.topCustomers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-3" />
                    <p className="text-sm font-quantico">
                      No customer data available
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales by Day */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-quantico">
                <Calendar className="h-5 w-5 text-purple-500" />
                Sales by Day (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ sales: { label: "Sales", color: "var(--chart-1)" } }}
              >
                <ResponsiveContainer width="100%" height={256}>
                  <AreaChart
                    accessibilityLayer
                    data={analytics.salesByDay}
                    margin={{
                      left: 12,
                      right: 12,
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value: string) => {
                        const date = new Date(value);
                        return date.toLocaleDateString("en-US", {
                          weekday: "short",
                        });
                      }}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="line" />}
                    />
                    <Area
                      dataKey="sales"
                      type="natural"
                      fill="var(--color-sales)"
                      fillOpacity={0.4}
                      stroke="var(--color-sales)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
            <CardFooter>
              <div className="flex w-full items-start gap-2 text-sm">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 leading-none font-medium font-quantico">
                    <TrendingUp className="h-4 w-4" />
                    {analytics.salesByDay.length > 0 && (
                      <>
                        {formatCurrency(
                          analytics.salesByDay.reduce(
                            (sum, day) => sum + day.sales,
                            0
                          )
                        )}{" "}
                        total sales
                      </>
                    )}
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2 leading-none font-quantico">
                    {analytics.salesByDay.length > 0 && (
                      <>
                        {analytics.salesByDay.reduce(
                          (sum, day) => sum + day.orders,
                          0
                        )}{" "}
                        total orders
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-quantico">
                <CreditCard className="h-5 w-5 text-indigo-500" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.salesByPaymentMethod.map((payment) => {
                  const Icon =
                    paymentMethodIcons[
                      payment.method as keyof typeof paymentMethodIcons
                    ] || CreditCard;
                  const percentage =
                    analytics.totalSales > 0
                      ? (payment.amount / analytics.totalSales) * 100
                      : 0;

                  return (
                    <div
                      key={payment.method}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground capitalize font-quantico">
                            {payment.method}
                          </p>
                          <p className="text-xs text-muted-foreground font-quantico">
                            {payment.count} transactions
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground font-quantico">
                          {formatCurrency(payment.amount)}
                        </p>
                        <p className="text-xs text-muted-foreground font-quantico">
                          {percentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  );
                })}
                {analytics.salesByPaymentMethod.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CreditCard className="h-12 w-12 mx-auto mb-3" />
                    <p className="text-sm font-quantico">
                      No payment data available
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
