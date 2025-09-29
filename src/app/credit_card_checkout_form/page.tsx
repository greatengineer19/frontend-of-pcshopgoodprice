"use client"

import { CheckoutPage } from "@/components/credit-cards/CheckoutPage"
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function CardPage() {
    const searchParams = useSearchParams();
    const [salesQuoteId, setSalesQuoteId] = useState<string | null>(null);

    useEffect(() => {
        // Get sales_quote_id from URL query parameters
        const quoteId = searchParams.get('sales_quote_id');
        setSalesQuoteId(quoteId);
    }, [searchParams]);

    return salesQuoteId ? <CheckoutPage sales_quote_id={salesQuoteId} /> : <div>Loading payment details...</div>;
}