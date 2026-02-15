'use client';

import { useEffect, useRef } from 'react';
import { createConsumer } from '@rails/actioncable';

interface UseRailsPaymentChannelOptions {
    onMessage: (data: any) => void;
    channelName?: string;
    room?: string;
}

/**
 * Custom hook for connecting to Rails ActionCable WebSocket
 * Automatically handles environment-based URL configuration
 */
export function useRailsPaymentChannel({
    onMessage,
    channelName = "PaymentProgressChannel",
    room = "general"
}: UseRailsPaymentChannelOptions) {
    const cableRef = useRef<any>(null);
    const subscriptionRef = useRef<any>(null);

    useEffect(() => {
        // Determine WebSocket URL based on environment
        const wsUrl = process.env.NODE_ENV === "development"
            ? "ws://localhost:80/cable"
            : "wss://api.pcshopgoodprice.com/cable";

        console.log(`[RailsPaymentChannel] Connecting to ${wsUrl}`);

        // Create ActionCable consumer
        const cableConnection = createConsumer(wsUrl);
        cableRef.current = cableConnection;

        // Subscribe to the channel
        const subscription = cableConnection.subscriptions.create(
            {
                channel: channelName,
                room: room,
            },
            {
                connected: function () {
                    console.log(`[RailsPaymentChannel] Connected to ${channelName}`);
                },
                disconnected: function () {
                    console.log(`[RailsPaymentChannel] Disconnected from ${channelName}`);
                },
                received: function (data: any) {
                    console.log(`[RailsPaymentChannel] Received data:`, data);
                    onMessage(data);
                }
            }
        );

        subscriptionRef.current = subscription;

        // Cleanup on unmount
        return () => {
            console.log(`[RailsPaymentChannel] Cleaning up connection`);
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
            }
            if (cableRef.current) {
                cableRef.current.disconnect();
            }
        };
    }, [onMessage, channelName, room]);

    return {
        cable: cableRef.current,
        subscription: subscriptionRef.current,
    };
}