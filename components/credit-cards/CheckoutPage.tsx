"use client"

import { useState } from "react"
import { CreditCardCheckoutForm } from "@/components/credit-cards/CreditCardCheckoutForm"
import { CheckoutSuccess } from "@/components/credit-cards/CheckoutSuccess"
import { OrderSummary } from "@/components/credit-cards/OrderSummary"

export function CheckoutPage() {
    const [isPaymentComplete, setIsPaymentComplete] = useState(false)
    const [paymentAmount] = useState(5000000.0)

    const handlePaymentSuccess = () => {
        setIsPaymentComplete(true)
    }

    if (isPaymentComplete) {
        return <CheckoutSuccess amount={paymentAmount} />
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">Complete your purchase</h1>
                        <p className="text-muted-foreground">Secure checkout powered by adyen (advanced encryption)</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="order-2 lg:order-1">
                            <CreditCardCheckoutForm amount={paymentAmount} onPaymentSuccess={handlePaymentSuccess} />
                        </div>

                        <div className="order-1 lg:order-2">
                            <OrderSummary amount={paymentAmount} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}