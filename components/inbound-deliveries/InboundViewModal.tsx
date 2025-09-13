"use client"

import { useState } from "react"
import Image from "next/image"
import { Calendar, User, Package, FileText, ChevronLeft, ChevronRight, X } from "lucide-react"
import type { InboundDelivery } from "@/types/inbound-delivery"

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
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWindowSize } from "@/lib/window-size"

interface ParamsProps {
    inboundDelivery: InboundDelivery | null
    isOpen: boolean
    onClose: () => void
}

export function InboundViewModal({ inboundDelivery, isOpen, onClose }: ParamsProps) {
    const windowSize = useWindowSize();
    const [activeTab, setActiveTab] = useState("details")
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isGalleryOpen, setIsGalleryOpen] = useState(false)

    if (!inboundDelivery) return null

    const imageAttachments = inboundDelivery.inbound_delivery_attachments || []

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % imageAttachments.length)
    }

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + imageAttachments.length) % imageAttachments.length)
    }

    const openGallery = (index: number) => {
        setCurrentImageIndex(index)
        setIsGalleryOpen(true)
    }

    // Original date object with 7 hours added
    const originalDate = new Date(new Date(inboundDelivery.created_at).getTime());

    // Manually format the date
    const day = originalDate.getDate();
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[originalDate.getMonth()];
    const year = originalDate.getFullYear();
    const hours = String(originalDate.getHours()).padStart(2, '0');
    const minutes = String(originalDate.getMinutes()).padStart(2, '0');
    const seconds = String(originalDate.getSeconds()).padStart(2, '0');

    const formattedCreatedAt = `${day} ${month} ${year} at ${hours}:${minutes}:${seconds}`;

    if (windowSize.typeId == 0) {
        return (
            <>
                <Dialog open={isOpen} onOpenChange={onClose}>
                    <DialogContent className="sm:max-w-[1200px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">Inbound Delivery Detail</DialogTitle>
                            <DialogDescription>Inbound #{inboundDelivery.inbound_delivery_no}</DialogDescription>
                        </DialogHeader>

                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-4">
                                <TabsTrigger value="details" className="w-full">Details</TabsTrigger>
                                <TabsTrigger value="attachments" className="w-full">Attachments ({imageAttachments.length})</TabsTrigger>
                            </TabsList>

                            <TabsContent value="details" className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Invoice</h4>
                                        <p className="flex items-center">
                                            <FileText className="h-4 w-4 mr-2 text-mutted-foreground" />
                                            {inboundDelivery.purchase_invoice_no}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                                        <Badge className="bg-green-500 text-white">{inboundDelivery.status.toLocaleUpperCase()}</Badge>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium textt-muted-foreground mb-1">Inbound Delivery Date</h4>
                                        <p className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                            {new Date(inboundDelivery.inbound_delivery_date).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Reference</h4>
                                        <p>{inboundDelivery.inbound_delivery_reference}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Received By</h4>
                                        <p className="flex items-center">
                                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                            {inboundDelivery.received_by}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Created at</h4>
                                        <p>{formattedCreatedAt}</p>
                                    </div>

                                    {
                                        inboundDelivery.notes && (
                                            <div>
                                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Notes</h4>
                                                <p className="text-sm p-2 rounded">{inboundDelivery.notes}</p> 
                                            </div>
                                        )
                                    }
                                </div>

                                <Separator className="my-6" />

                                <div>
                                    <div>
                                        <h4 className="font-medium mb-2">Delivered Items</h4>
                                        <div className="rounded-md border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="min-w-[320px]">Component Name</TableHead>
                                                        <TableHead className="text-center">Qty invoice</TableHead>
                                                        <TableHead className="text-center">Received</TableHead>
                                                        <TableHead className="text-center">Damaged</TableHead>
                                                        <TableHead className="text-right">Price per unit</TableHead>
                                                        <TableHead className="text-right">Total</TableHead>
                                                        <TableHead className="text-right min-w-[150px]">Notes</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {inboundDelivery.inbound_delivery_lines.map((inbound_line) => (
                                                        <TableRow key={inbound_line.id}>
                                                            <TableCell className="font-medium max-w-[200px] break-words whitespace-normal">{inbound_line.component_name}</TableCell>
                                                            <TableCell className="text-center">{inbound_line.expected_quantity}</TableCell>
                                                            <TableCell className="text-center">{inbound_line.received_quantity}</TableCell>
                                                            <TableCell className="text-center">{inbound_line.damaged_quantity}</TableCell>
                                                            <TableCell className="text-right">Rp {Number(inbound_line.price_per_unit).toLocaleString()}</TableCell>
                                                            <TableCell className="text-right">Rp {Number(inbound_line.total_line_amount).toLocaleString()}</TableCell>
                                                            <TableCell className="text-left font-medium max-w-[200px] break-words whitespace-normal">{inbound_line.notes}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-8 font-medium text-lg text-right">
                                        <span>Total Amount:</span>
                                        <span>
                                            Rp {inboundDelivery.inbound_delivery_lines.reduce((total, product) => {
                                                return total + Number(product.price_per_unit) * (product.received_quantity || 0 )
                                            }, 0).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="attachments">
                                {imageAttachments.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md">
                                        No attachments available
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {imageAttachments.length > 0 && (
                                            <div>
                                                <h4 className="font-medium mb-2">Images</h4>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                                    {imageAttachments.map((attachment, index) => (
                                                        <div
                                                            key={attachment.id}
                                                            className="relative aspect-square border rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                                            onClick={() => openGallery(index)}
                                                        >
                                                            <Image 
                                                                src={attachment.file_link || "/placeholder.svg"}
                                                                alt={attachment.file_link}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <h4 className="font-medium mb-2">All Attachments</h4>
                                            <div className="space-y-2">
                                                {imageAttachments.map((attachment, index) => (
                                                    <Card key={attachment.id}>
                                                        <CardContent className="p-4 flex justify-between items-center">
                                                            <div className="flex items-center gap-2">
                                                                <Package className="h-5 w-5 text-muted-foreground" />
                                                                <div>
                                                                    <p className="font-medium">Image {index + 1}</p>
                                                                    <p className="text-sx text-muted-foreground">
                                                                        Uploaded by {attachment.uploaded_by} on {" "}
                                                                        {new Date(new Date(attachment.created_at).getTime()).toLocaleString()}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <a href={attachment.file_link} target="_blank" rel="noopener noreferrer">
                                                                <Button variant="outline" size="sm">
                                                                    Download
                                                                </Button>
                                                            </a>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>

                        <DialogFooter>
                            <Button type="button" onClick={onClose}>
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {isGalleryOpen && imageAttachments.length > 0 && (
                    <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
                        <DialogContent className="sm:max-w-[90vw] max-h-[90vh] p-0 overflow-hidden">
                            <div className="relative h-[80vh] bg-black flex items-center justify-center">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 text-white bg-black/50 hover:bg-black/70 z-10"
                                    onClick={() => setIsGalleryOpen(false)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 z-10"
                                    onClick={prevImage}
                                >
                                    <ChevronLeft className="h-7 w-7" />
                                </Button>

                                <div className="relative w-full h-full">
                                    <Image 
                                        src={imageAttachments[currentImageIndex].file_link || "/placeholder.svg"}
                                        alt={imageAttachments[currentImageIndex].file_link}
                                        fill
                                        className="object-contain"
                                    />
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 z-10"
                                    onClick={nextImage}
                                >
                                    <ChevronRight 
                                        className="h-6 w-6"
                                    />
                                </Button>

                                <div className="absolute bottom-4 left-0 rightt-0 text-center text-white bg-black/50 py-2">
                                    {imageAttachments[currentImageIndex].file_link}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </>
        )
    } else {
        return (
            <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="w-[95vw] max-w-[1200px] max-h-[95vh] overflow-y-auto sm:w-full">
                <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl font-bold">Inbound Delivery Detail</DialogTitle>
                    <DialogDescription>Inbound #{inboundDelivery.inbound_delivery_no}</DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="details" className="w-full text-sm">
                        Details
                    </TabsTrigger>
                    <TabsTrigger value="attachments" className="w-full text-sm">
                        Attachments ({imageAttachments.length})
                    </TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Invoice</h4>
                        <p className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="break-all">{inboundDelivery.purchase_invoice_no}</span>
                        </p>
                        </div>
                        <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                        <Badge className="bg-green-500 text-white">{inboundDelivery.status.toLocaleUpperCase()}</Badge>
                        </div>
                        <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Inbound Delivery Date</h4>
                        <p className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm">
                            {new Date(inboundDelivery.inbound_delivery_date).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                            })}
                            </span>
                        </p>
                        </div>
                        <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Reference</h4>
                        <p className="break-all text-sm">{inboundDelivery.inbound_delivery_reference}</p>
                        </div>
                        <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Received By</h4>
                        <p className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm">{inboundDelivery.received_by}</span>
                        </p>
                        </div>
                        <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Created at</h4>
                        <p className="text-sm">{formattedCreatedAt}</p>
                        </div>

                        {inboundDelivery.notes && (
                        <div className="sm:col-span-2">
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Notes</h4>
                            <p className="text-sm p-2 rounded bg-muted">{inboundDelivery.notes}</p>
                        </div>
                        )}
                    </div>

                    <Separator className="my-6" />

                    <div>
                        <h4 className="font-medium mb-2">Delivered Items</h4>

                        <div className="block sm:hidden space-y-3">
                        {inboundDelivery.inbound_delivery_lines.map((inbound_line: any) => (
                            <Card key={inbound_line.id}>
                            <CardContent className="p-4 space-y-2">
                                <div>
                                <h5 className="font-medium text-sm mb-1">Component Name</h5>
                                <p className="text-sm break-words">{inbound_line.component_name}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                    <span className="text-muted-foreground">Qty Invoice:</span>
                                    <span className="ml-1 font-medium">{inbound_line.expected_quantity}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Received:</span>
                                    <span className="ml-1 font-medium">{inbound_line.received_quantity}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Damaged:</span>
                                    <span className="ml-1 font-medium">{inbound_line.damaged_quantity}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Price/Unit:</span>
                                    <span className="ml-1 font-medium">
                                    Rp {Number(inbound_line.price_per_unit).toLocaleString()}
                                    </span>
                                </div>
                                </div>
                                <div className="pt-2 border-t">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Total:</span>
                                    <span className="font-bold">
                                    Rp {Number(inbound_line.total_line_amount).toLocaleString()}
                                    </span>
                                </div>
                                {inbound_line.notes && (
                                    <div className="mt-2">
                                    <span className="text-xs text-muted-foreground">Notes:</span>
                                    <p className="text-xs mt-1">{inbound_line.notes}</p>
                                    </div>
                                )}
                                </div>
                            </CardContent>
                            </Card>
                        ))}
                        </div>

                        <div className="hidden sm:block rounded-md border overflow-x-auto">
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-[200px]">Component Name</TableHead>
                                <TableHead className="text-center min-w-[100px]">Qty invoice</TableHead>
                                <TableHead className="text-center min-w-[100px]">Received</TableHead>
                                <TableHead className="text-center min-w-[100px]">Damaged</TableHead>
                                <TableHead className="text-right min-w-[120px]">Price per unit</TableHead>
                                <TableHead className="text-right min-w-[120px]">Total</TableHead>
                                <TableHead className="text-right min-w-[150px]">Notes</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {inboundDelivery.inbound_delivery_lines.map((inbound_line: any) => (
                                <TableRow key={inbound_line.id}>
                                <TableCell className="font-medium max-w-[200px] break-words whitespace-normal">
                                    {inbound_line.component_name}
                                </TableCell>
                                <TableCell className="text-center">{inbound_line.expected_quantity}</TableCell>
                                <TableCell className="text-center">{inbound_line.received_quantity}</TableCell>
                                <TableCell className="text-center">{inbound_line.damaged_quantity}</TableCell>
                                <TableCell className="text-right">
                                    Rp {Number(inbound_line.price_per_unit).toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    Rp {Number(inbound_line.total_line_amount).toLocaleString()}
                                </TableCell>
                                <TableCell className="text-left font-medium max-w-[200px] break-words whitespace-normal">
                                    {inbound_line.notes}
                                </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-8 font-medium text-base sm:text-lg mt-4 p-4 bg-muted rounded-md">
                        <span>Total Amount:</span>
                        <span className="font-bold">
                            Rp{" "}
                            {inboundDelivery.inbound_delivery_lines
                            .reduce((total: number, product: any) => {
                                return total + Number(product.price_per_unit) * (product.received_quantity || 0)
                            }, 0)
                            .toLocaleString()}
                        </span>
                        </div>
                    </div>
                    </TabsContent>

                    <TabsContent value="attachments">
                    {imageAttachments.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md">
                        No attachments available
                        </div>
                    ) : (
                        <div className="space-y-4">
                        {imageAttachments.length > 0 && (
                            <div>
                            <h4 className="font-medium mb-2">Images</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                                {imageAttachments.map((attachment, index) => (
                                <div
                                    key={attachment.id}
                                    className="relative aspect-square border rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity active:scale-95"
                                    onClick={() => openGallery(index)}
                                >
                                    <Image
                                    src={attachment.file_link || "/placeholder.svg"}
                                    alt={`Attachment ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    />
                                </div>
                                ))}
                            </div>
                            </div>
                        )}

                        <div>
                            <h4 className="font-medium mb-2">All Attachments</h4>
                            <div className="space-y-2">
                            {imageAttachments.map((attachment, index) => (
                                <Card key={attachment.id}>
                                <CardContent className="p-3 sm:p-4 flex justify-between items-center">
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <Package className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-sm">Image {index + 1}</p>
                                        <p className="text-xs text-muted-foreground truncate">
                                        Uploaded by {attachment.uploaded_by} on{" "}
                                        {new Date(new Date(attachment.created_at).getTime()).toLocaleDateString()}
                                        </p>
                                    </div>
                                    </div>
                                    <a href={attachment.file_link} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" size="sm" className="text-xs bg-transparent">
                                        Download
                                    </Button>
                                    </a>
                                </CardContent>
                                </Card>
                            ))}
                            </div>
                        </div>
                        </div>
                    )}
                    </TabsContent>
                </Tabs>

                <DialogFooter>
                    <Button type="button" onClick={onClose} className="w-full sm:w-auto">
                    Close
                    </Button>
                </DialogFooter>
                </DialogContent>
            </Dialog>

            {isGalleryOpen && imageAttachments.length > 0 && (
                <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
                <DialogContent className="w-[100vw] h-[100vh] sm:w-[95vw] sm:h-[90vh] sm:max-w-[90vw] max-h-[100vh] p-0 overflow-hidden">
                    <div className="relative h-full bg-black flex items-center justify-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-white bg-black/50 hover:bg-black/70 z-10 h-10 w-10 sm:h-8 sm:w-8"
                        onClick={() => setIsGalleryOpen(false)}
                    >
                        <X className="h-5 w-5 sm:h-4 sm:w-4" />
                    </Button>

                    {imageAttachments.length > 1 && (
                        <>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 z-10 h-12 w-12 sm:h-10 sm:w-10"
                            onClick={prevImage}
                        >
                            <ChevronLeft className="h-6 w-6 sm:h-5 sm:w-5" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 z-10 h-12 w-12 sm:h-10 sm:w-10"
                            onClick={nextImage}
                        >
                            <ChevronRight className="h-6 w-6 sm:h-5 sm:w-5" />
                        </Button>
                        </>
                    )}

                    <div className="relative w-full h-full">
                        <Image
                        src={imageAttachments[currentImageIndex].file_link || "/placeholder.svg"}
                        alt={`Image ${currentImageIndex + 1}`}
                        fill
                        className="object-contain"
                        />
                    </div>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-white bg-black/70 py-2 px-4 rounded-md text-sm">
                        {currentImageIndex + 1} of {imageAttachments.length}
                    </div>
                    </div>
                </DialogContent>
                </Dialog>
            )}
            </>
        )
    }
}