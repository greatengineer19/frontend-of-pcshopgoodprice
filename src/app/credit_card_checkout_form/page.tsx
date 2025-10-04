"use client"

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function RedirectContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState('Loading...');

    useEffect(() => {
        const fetchAdyenSession = async () => {
            try {
                const quoteId = searchParams.get('sales_quote_id');
                
                if (!quoteId) {
                    setStatus('Missing sales_quote_id parameter');
                    return;
                }

                setStatus('Creating payment session...');

                const payload = {
                    id: Number(quoteId)
                };

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sales-payment/adyen/sessions-credit-card`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "origin": "pcshopgoodprice.com"
                    },
                    body: JSON.stringify(payload)
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // If the URL is in the response body
                const data = await response.json();
                const redirectUrl = data.url || data.redirectUrl || data.sessionUrl;
                
                if (redirectUrl) {
                    setStatus('Redirecting to payment page...');
                    window.location.href = redirectUrl;
                } else {
                    throw new Error('No redirect URL found in response');
                }
                
            } catch (error) {
                console.error("Failed to create Adyen session:", error);
                setStatus('Failed to create payment session. Please try again.');
            }
        };

        fetchAdyenSession();
    }, [searchParams]);

    return <div>{status}</div>;
}

export default function CardPage() {
    return (
        <Suspense fallback={<div>Loading payment details...</div>}>
            <RedirectContent />
        </Suspense>
    );
}