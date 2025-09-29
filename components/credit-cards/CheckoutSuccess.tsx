"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface CheckoutSuccessProps {
    amount: number
}

export function CheckoutSuccess({ amount }: CheckoutSuccessProps) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardContent className="pt-8 pb-8 text-center">
                    <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                        style={{ backgroundColor: '#33862c' }}
                    >
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h1>

                    <p className="text-muted-foreground mb-6">
                        Thank you! Your payment of <span className="font-semibold">Rp {Number(amount).toLocaleString()}</span> has been authorized and processed successfully.
                    </p>

                    <div className="space-y-3">
                        <Link href="/orders" className="w-full">
                            <Button className="w-full">
                                Check orders page
                            </Button>
                        </Link>
                    </div>

                    <p className="text-xs text-muted-foreground mt-6">
                        Once payment is captured, you will receive notification at the UI of pcshopgoodprice.com
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}