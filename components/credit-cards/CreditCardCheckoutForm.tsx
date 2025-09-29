"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardTypeIcon } from "@/components/credit-cards/CardTypeIcon"
import { toast } from "sonner"
import { validateCardNumber, validateExpiryDate, validateCVV, getCardType } from "@/lib/card-validation"

interface CheckoutFormProps {
    amount: number
    onPaymentSuccess: () => void
}

export function CreditCardCheckoutForm({ amount, onPaymentSuccess }: CheckoutFormProps) {
    const [formData, setFormData] = useState({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        nameOnCard: ""
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isProcessing, setIsProcessing] = useState(false)
    const [payLink, setPayLink] = useState("")

    const cardType = getCardType(formData.cardNumber)

    const handleInputChange = (field: string, value: string) => {
        let formattedValue = value

        // Format card number with spaces
        if (field === "cardNumber") {
            formattedValue = value
                .replace(/\s/g, "")
                .replace(/(.{4})/g, "$1 ")
                .trim()
            if (formattedValue.length > 19) return // Max length for formatted card
        }

        // Format expiry date
        if (field === "expiryDate") {
            formattedValue = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2")
            if (formattedValue.length > 5) return
        }

        // Format CVV
        if (field === "cvv") {
            formattedValue = value.replace(/\D/g, "")
            if (formattedValue.length > 4) return
        }

        setFormData((prev) => ({ ...prev, [field]: formattedValue }))

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }))
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string>= {}

        if (!validateCardNumber(formData.cardNumber.replace(/\s/g, ""))) {
            newErrors.cardNumber = "Please enter a valid card number"
        }

        if (!validateExpiryDate(formData.expiryDate)) {
            newErrors.expiryDate = "Please enter a valid expiry date"
        }

        if (!validateCVV(formData.cvv)) {
            newErrors.cvv = "Please enter a valid CVV"
        }

        if (!formData.nameOnCard.trim()) {
            newErrors.nameOnCard = "Please enter the name on card"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsProcessing(true)

        setTimeout(() => {
            setIsProcessing(false)
            try {
                onPaymentSuccess()
            } catch (error) {
                console.error("Failed during credit card payment:", error);
                toast.error("Failed during credit card payment.");
            }
        }, 2000)
    }

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sales-payment/adyen/sessions-credit-card`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "origin": "pcshopgoodprice.com"
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Session data:', data);
            } catch (error) {
                console.error("Failed to load sessions:", error);
                toast.error("Failed to load sessions.");
            }
        };

        fetchSession(); // Actually call the function
    }, []);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <div className="relative">
                            <Input 
                                id="cardnumber"
                                placeholder="1234 5678 9012 3456"
                                value={formData.cardNumber}
                                onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                                className={`pr-12 ${errors.cardnumber ? "border-destructive" : "" }`}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <CardTypeIcon type={cardType} />
                            </div>
                        </div>
                        {errors.cardNumber && <p className="text-sm text-destructive">{errors.cardNumber}</p>}
                    </div>

                    <div className="grid gird-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input 
                                id="expiryDate"
                                placeholder="MM/YY"
                                value={formData.expiryDate}
                                onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                                className={errors.expiryDate ? "border-destructive" : "" }
                            />
                            {errors.expiryDate && <p className="text-sm text-destructive">{errors.expiryDate}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cvv">CVV/CVC</Label>
                            <Input 
                                id="cvv"
                                placeholder="123"
                                value={formData.cvv}
                                onChange={(e) => handleInputChange("cvv", e.target.value)}
                                className={errors.cvv ? "border-destructive" : "" }
                            />
                            {errors.cvv && <p className="text-sm text-destructive">{errors.cvv}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nameOnCard">Name on Card</Label>
                        <Input 
                            id="nameOnCard"
                            placeholder="John Doe"
                            value={formData.nameOnCard}
                            onChange={(e) => handleInputChange("nameOnCard", e.target.value)}
                            className={errors.nameOnCard ? "border-destructive" : ""}
                        />
                        {errors.nameOnCard && <p className="text-sm text-destructive">{errors.nameOnCard}</p>}
                    </div>

                    <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isProcessing}>
                        {isProcessing ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                Processing...
                            </div>
                        ) : (
                            `Pay Rp ${Number(amount).toLocaleString()}`
                        )}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path 
                                fillRule="evenodd"
                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Secured by 256-bit SSL encryption
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}