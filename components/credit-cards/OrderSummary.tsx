import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface OrderSummaryProps {
    amount: number
}

export function OrderSummary({ amount }: OrderSummaryProps) {
    const tax = 0
    const total = amount + tax

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Order Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Product Cost</span>
                        <span className="font-medium">Rp {Number(amount).toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax</span>
                        <span className="font-medium">-</span>
                    </div>

                    <div className="border-t pt-3">
                        <div className="flex justify-between text-lg font-semibold">
                            <span>Total</span>
                            <span>Rp {Number(total).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">What's included:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Powered by adyen</li>
                        <li>• 24/7 Premium Support</li>
                        <li>• Priority Processing, Advanced Security</li>
                        <li>• 30-day Money Back Guarantee</li>
                    </ul>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path 
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                    30-day money-back guarantee
                </div>
            </CardContent>
        </Card>
    )
}