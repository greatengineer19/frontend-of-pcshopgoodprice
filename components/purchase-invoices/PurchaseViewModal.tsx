"use client"

import Image from "next/image"
import { Calendar, User, Edit } from "lucide-react"
import type { PurchaseInvoice } from "@/types/purchase-invoice"
import { getStatusColor } from "@/utils/status-utils"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useWindowSize } from "@/lib/window-size"

interface ParamsProps {
    invoice: PurchaseInvoice | null
    isViewModalOpen: boolean
    closeViewModal: () => void
    onEditModal: (invoice: PurchaseInvoice) => void
}

export function PurchaseViewModal({ invoice, isViewModalOpen, closeViewModal, onEditModal }:
    ParamsProps
) {
    if (!invoice) return null

    const windowSize = useWindowSize()

    if (windowSize.typeId == 0) {
        return (
            <Dialog open={isViewModalOpen} onOpenChange={closeViewModal}>
                <DialogContent className="max-w-[95vw] w-[1400px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Purchase Invoice Detail</DialogTitle>
                        <DialogDescription>Invoice #{invoice.purchase_invoice_no}</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Invoice Date</h4>
                                <p className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                    {new Date(invoice.invoice_date).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                                <Badge className={`${getStatusColor(invoice.status)} text-white`}>
                                    {invoice.status}
                                </Badge>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                    Supplier
                                </h4>
                                <p className="flex items-center">
                                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                    {invoice.supplier_name}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                    Expected Delivery
                                </h4>
                                <p>{invoice.expected_delivery_date 
                                    ? new Date(invoice.expected_delivery_date).toLocaleDateString("en-GB", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                        })
                                    : "Not Specified"}
                                </p>
                            </div>
                        </div>

                        {
                            invoice.notes && (
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Notes</h4>
                                    <p className="text-sm bg-muted p-2 rounded">{invoice.notes}</p>
                                </div>
                            )
                        }

                        <Separator />

                        <div>
                            <h4 className="font-medium mb-2">Products</h4>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead className="text-center">Quantity</TableHead>
                                            <TableHead className="text-right">Unit Price</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {invoice.purchase_invoice_lines.map((invoice_line) => (
                                            <TableRow key={invoice_line.id}>
                                                <TableCell
                                                    className="font-medium flex items-center gap-2"
                                                >
                                                    {invoice_line.component_name}
                                                </TableCell>
                                                <TableCell className="text-center">{invoice_line.quantity}</TableCell>
                                                <TableCell className="text-right">{Number(invoice_line.price_per_unit).toLocaleString()}</TableCell>
                                                <TableCell className="text-right">Rp {Number(invoice_line.total_line_amount).toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        <div className="flex justify-end gap-8 font-medium text-lg text-right">
                            <span>Total Amount:</span>
                            <span>Rp {Number(invoice.sum_total_line_amounts).toLocaleString()}</span>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={closeViewModal}>
                            Close
                        </Button>
                        {
                            invoice.status.toLowerCase() === "pending" && (
                                <Button
                                    type="button"
                                    onClick={() => {
                                        closeViewModal()
                                        onEditModal(invoice)
                                    }}
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                            )
                        }
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    } else {
        return (
            <Dialog open={isViewModalOpen} onOpenChange={closeViewModal}>
            <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-full sm:h-[90vh] sm:w-[600px] lg:w-[900px] xl:w-[1200px] flex flex-col">
                <DialogHeader className="flex-shrink-0">
                <DialogTitle className="text-lg sm:text-xl font-bold">Purchase Invoice Detail</DialogTitle>
                <DialogDescription>Invoice #{invoice.purchase_invoice_no}</DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-1 min-h-0">
                <div className="space-y-4 sm:space-y-6 py-4 sm:py-6">
                    <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
                    <div className="space-y-3 sm:space-y-4">
                        <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Invoice Date</h4>
                        <p className="flex items-center text-sm sm:text-base">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                            <span className="break-words">
                            {new Date(invoice.invoice_date).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                            })}
                            </span>
                        </p>
                        </div>
                        <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Supplier</h4>
                        <p className="flex items-center text-sm sm:text-base">
                            <User className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                            <span className="break-words">{invoice.supplier_name}</span>
                        </p>
                        </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                        <Badge className={`${getStatusColor(invoice.status)} text-white text-xs sm:text-sm`}>
                            {invoice.status}
                        </Badge>
                        </div>
                        <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Expected Delivery</h4>
                        <p className="text-sm sm:text-base break-words">
                            {invoice.expected_delivery_date
                            ? new Date(invoice.expected_delivery_date).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                })
                            : "Not Specified"}
                        </p>
                        </div>
                    </div>
                    </div>

                    {invoice.notes && (
                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Notes</h4>
                        <p className="text-sm bg-muted p-3 rounded break-words">{invoice.notes}</p>
                    </div>
                    )}

                    <Separator />

                    <div>
                    <h4 className="font-medium mb-3 text-sm sm:text-base">Products</h4>

                    <div className="sm:hidden">
                        <div className="max-h-[200px] overflow-y-auto space-y-3 pr-2">
                        {invoice.purchase_invoice_lines.map((invoice_line) => (
                            <div key={invoice_line.id} className="border rounded-lg p-3 space-y-2">
                            <div className="font-medium text-sm break-words">{invoice_line.component_name}</div>
                            <div className="space-y-1 text-xs">
                                <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Quantity:</span>
                                <span className="font-medium">{invoice_line.quantity}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Unit Price:</span>
                                <span className="font-medium">Rp {Number(invoice_line.price_per_unit).toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between items-center font-medium text-sm">
                                <span>Total:</span>
                                <span>Rp {Number(invoice_line.total_line_amount).toLocaleString()}</span>
                                </div>
                            </div>
                            </div>
                        ))}
                        </div>
                    </div>

                    <div className="hidden sm:block">
                        <div className="rounded-md border">
                        <div className="max-h-[400px] overflow-y-auto">
                            <Table>
                            <TableHeader className="sticky top-0 bg-background z-10">
                                <TableRow>
                                <TableHead className="min-w-[150px]">Product</TableHead>
                                <TableHead className="text-center min-w-[80px]">Quantity</TableHead>
                                <TableHead className="text-right min-w-[100px]">Unit Price</TableHead>
                                <TableHead className="text-right min-w-[120px]">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoice.purchase_invoice_lines.map((invoice_line) => (
                                <TableRow key={invoice_line.id}>
                                    <TableCell className="font-medium break-words">{invoice_line.component_name}</TableCell>
                                    <TableCell className="text-center">{invoice_line.quantity}</TableCell>
                                    <TableCell className="text-right">
                                    Rp {Number(invoice_line.price_per_unit).toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                    Rp {Number(invoice_line.total_line_amount).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-8 font-medium text-base sm:text-lg">
                    <span className="text-muted-foreground sm:text-foreground">Total Amount:</span>
                    <span className="text-lg sm:text-xl">Rp {Number(invoice.sum_total_line_amounts).toLocaleString()}</span>
                </div>
                </div>

                <DialogFooter className="flex-shrink-0 flex-col sm:flex-row gap-2 sm:gap-0 border-t pt-4 mt-4">
                <Button type="button" variant="outline" onClick={closeViewModal} className="w-full sm:w-auto bg-transparent">
                    Close
                </Button>
                {invoice.status.toLowerCase() === "pending" && (
                    <Button
                    type="button"
                    onClick={() => {
                        closeViewModal()
                        onEditModal(invoice)
                    }}
                    className="w-full sm:w-auto"
                    >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                    </Button>
                )}
                </DialogFooter>
            </DialogContent>
            </Dialog>
        )
    }
}