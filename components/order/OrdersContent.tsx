"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { fetchSalesQuotes } from "@/lib/sales-quote-service"
import { fetchSalesInvoices } from "@/lib/sales-invoice-service"
import { fetchSalesDeliveries } from "@/lib/sales-delivery-service"
import type { SalesQuote } from "@/types/sales-quote"
import { SalesDelivery } from "@/types/sales-delivery"
import { SalesInvoice } from "@/types/sales-invoice"
import SalesQuotesContent from "./SalesQuotesContent"
import SalesDeliveriesContent from "./SalesDeliveriesContent"
import SalesInvoicesContent from "./SalesInvoicesContent"

// actual usage is SalesQuotesContent, SalesInvoicesContent, SalesDeliveriesContent
export default function OrdersContent() {
    const [salesQuotes, setSalesQuotes] = useState<SalesQuote[]>([])
    const [salesInvoices, setSalesInvoices] = useState<SalesInvoice[]>([])
    const [salesDeliveries, setSalesDeliveries] = useState<SalesDelivery[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null)
    const [expandedResourceType, setExpandedResourceType] = useState<string | null>(null)
    const [isAccepting, setIsAccepting] = useState<string | null>(null)
    const [isCancelling, setIsCancelling] = useState<string | null>(null)
    const [range, setRange] = useState<"today" | "week" | "all">("week");
    const startDate = useMemo(() => {
        const now = new Date();
            switch(range) {
                    case "today":
                    return now.toISOString().split('T')[0]; // YYYY-MM-DD format
                case "week":
                    const weekAgo = new Date(now);
                    weekAgo.setDate(now.getDate() - 7);
                    return weekAgo.toISOString().split('T')[0];
                case "all":
                    return "2000-01-01";
                default:
                    const defaultWeekAgo = new Date(now);
                    defaultWeekAgo.setDate(now.getDate() - 7);
                    return defaultWeekAgo.toISOString().split('T')[0];
            }
        }, [range]
    );

    // Load Sales Quotes
    useEffect(() => {
        const loadAllData = async () => {
            setIsLoading(true)

            try {
                const [salesQuotesData, salesInvoicesData, salesDeliveriesData ]= await Promise.all([fetchSalesQuotes(startDate), fetchSalesInvoices(startDate), fetchSalesDeliveries(startDate)]);

                setSalesQuotes(salesQuotesData)
                setSalesDeliveries(salesDeliveriesData)
                setSalesInvoices(salesInvoicesData)
            } catch (error) {
                console.error("Failed to load sales data:", error)
                toast.error("Failed to load sales data")
            } finally {
                setIsLoading(false)
            }
        }

        loadAllData()
    }, [startDate])

    // Load shipping updates when an order is expanded
    const handleToggleExpand = (orderId: number, resourceType: string) => {
        if (expandedOrderId === orderId && expandedResourceType == resourceType) {
            setExpandedOrderId(null)
            setExpandedResourceType(null)
            return
        }

        setExpandedOrderId(orderId)
        setExpandedResourceType(resourceType)
    }

    // Empty orders view
    if (!isLoading && (salesQuotes.length === 0 && salesDeliveries.length === 0 && salesInvoices.length === 0)) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                    <h1 className="text-3xl font-bold mb-4">Your Orders</h1>
                    <p className="text-muted-foreground mb-8 max-w-md">
                        View and track all your orders in one place. You don't have any orders yet.
                    </p>
                    <Link href="/shop">
                        <Button className="flex items-center gap-2">Start Shopping</Button>
                    </Link>
                </div>
            </div>
        )
    }


    return (
        <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Your Orders</h1>
            <div className="inline-flex rounded-md border p-1" role="group" aria-label="Filter orders by time range">
            <Button
                variant={range === "today" ? "default" : "outline"}
                size="sm"
                onClick={() => setRange("today")}
                aria-pressed={range === "today"}
            >
                Today
            </Button>
            <Button
                variant={range === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setRange("week")}
                aria-pressed={range === "week"}
            >
                Week ago
            </Button>
            <Button
                variant={range === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setRange("all")}
                aria-pressed={range === "all"}
            >
                All
            </Button>
            </div>
        </div>

        {isLoading ? (
            <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        ) : (
            <div className="space-y-6">
                <SalesQuotesContent
                    salesQuotes={salesQuotes}
                    expandedOrderId={expandedOrderId}
                    expandedResourceType={expandedResourceType}
                    handleToggleExpand={handleToggleExpand}
                    isAccepting={isAccepting}
                    setIsAccepting={setIsAccepting}
                    isCancelling={isCancelling}
                    setIsCancelling={setIsCancelling}
                />
                <SalesDeliveriesContent
                    salesDeliveries={salesDeliveries}
                    expandedOrderId={expandedOrderId}
                    expandedResourceType={expandedResourceType}
                    handleToggleExpand={handleToggleExpand}
                    isAccepting={isAccepting}
                    setIsAccepting={setIsAccepting}
                    isCancelling={isCancelling}
                    setIsCancelling={setIsCancelling}
                />
                <SalesInvoicesContent
                    salesInvoices={salesInvoices}
                    expandedOrderId={expandedOrderId}
                    expandedResourceType={expandedResourceType}
                    handleToggleExpand={handleToggleExpand}
                />
            </div>
        )}
        </div>
    )
}