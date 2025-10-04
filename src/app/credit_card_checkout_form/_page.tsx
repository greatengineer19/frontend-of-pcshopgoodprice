"use client"

import { CheckoutPage } from "@/components/credit-cards/CheckoutPage"
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState, Suspense } from 'react';

function CheckoutContent() {
    const searchParams = useSearchParams();
    const [salesQuoteId, setSalesQuoteId] = useState<string | null>(null);

    useEffect(() => {
        const quoteId = searchParams.get('sales_quote_id');
        setSalesQuoteId(quoteId);
    }, [searchParams]);

    return salesQuoteId ? <CheckoutPage sales_quote_id={salesQuoteId} /> : <div>Loading payment details...</div>;
}

export default function CardPage() {
    return (
        <Suspense fallback={<div>Loading payment details...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}