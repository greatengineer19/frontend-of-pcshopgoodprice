"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import RequestLogger from "@/components/payment-load-test/RequestLogger"
import RequestStatusPanel from "@/components/payment-load-test/RequestStatusPanel"

interface LogEntry {
    id: string
    timestamp: string
    message: string
    source: "api1" | "api2" | "system"
}

export default function Page() {
    const [isLoading, setIsLoading] = useState(false)
    const [isCoolingDown, setIsCoolingDown] = useState(false)
    const [cooldownTime, setCooldownTime] = useState(0)
    const [logs, setLogs] = useState<LogEntry[]>([])
    const [api1Status, setApi1Status] = useState<string>("")
    const [api2Status, setApi2Status] = useState<string>("")
    const [completedRequests, setCompletedRequests] = useState<{
        api1?: { time: string; elapsed: string }
        api2?: { time: string; elapsed: string }
    }>({})

    const ws1Ref = useRef<WebSocket | null>(null)
    const ws2Ref = useRef<WebSocket | null>(null)
    const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null)

    // Initialize WebSocket connections
    useEffect(() => {
        const connectWebSockets = () => {
            try {
                ws1Ref.current = new WebSocket("ws://localhost:8000/ws/progress")
                ws1Ref.current.onmessage = (event) => {
                    const data = JSON.parse(event.data)
                    handleApi1Message(data)
                }
                ws1Ref.current.onerror = () => {
                    addLog("Failed to connect to API 1 Websocket", "system")
                }
            } catch (error) {
                addLog("WebSocket connection error for API 1", "system")
            }

            try {
                ws2Ref.current = new WebSocket("ws://localhost:8000/ws/progress")
                ws2Ref.current.onmessage = (event) => {
                    const data = JSON.parse(event.data)
                    handleApi2Message(data)
                }
                ws2Ref.current.onerror = () => {
                    addLog("Failed to connect to API 2 Websocket", "system")
                }
            } catch (error) {
                addLog("WebSocket connection error for API 2", "system")
            }

            connectWebSockets()

            return () => {
                ws1Ref.current?.close()
                ws2Ref.current?.close()
            }
        }
    }, [])

    // Cleanup cooldown timer on unmount
    useEffect(() => {
        return () => {
            if (cooldownTimerRef.current) {
                clearInterval(cooldownTimerRef.current)
            }
        }
    }, [])

    const addLog = (message: string, source: "api1" | "api2" | "system") => {
        const now = new Date()
        const timestamp = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`

        setLogs((prev) => [
            ...prev,
            {
                id: `${Date.now()}-${Math.random()}`,
                timestamp,
                message,
                source
            },
        ])
    }

    const handleApi1Message = (data: any) => {
        if (data.type === "progress") {
            setApi1Status(`Processing: ${data.progress}`)
            addLog(`Progress: ${data.progress}% - ${data.message || "Processing..."}`, "api1")
        } else if (data.type === "complete") {
            const now = new Date()
            const completeTime = `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getFullYear()} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`
            const elapsed = data.elapsed_time || "0s"

            setApi1Status("✓ Completed")
            setCompletedRequests((prev) => ({
                ...prev,
                api1: { time: completeTime, elapsed },
            }))
            addLog(`Request completed on ${completeTime}`, "api1")
            addLog(`Total elapsed time: ${elapsed}`, "api1")
        } else if (data.type === "error") {
            setApi1Status("✗ Error")
            addLog(`Error: ${data.message}`, "api1")
        }
    }

    const handleApi2Message = (data: any) => {
        if (data.type === "progress") {
            setApi2Status(`Processing: ${data.progress}`)
            addLog(`Progress: ${data.progress}% - ${data.message || "Processing..."}`, "api2")
        } else if (data.type === "complete") {
            const now = new Date()
            const completeTime = `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getFullYear()} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`
            const elapsed = data.elapsed_time || "0s"

            setApi2Status("✓ Completed")
            setCompletedRequests((prev) => ({
                ...prev,
                api2: { time: completeTime, elapsed },
            }))
            addLog(`Request completed on ${completeTime}`, "api2")
            addLog(`Total elapsed time: ${elapsed}`, "api2")
        } else if (data.type === "error") {
            setApi2Status("✗ Error")
            addLog(`Error: ${data.message}`, "api2")
        }
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        setLogs([])
        setApi1Status("Pending...")
        setApi2Status("Pending...")
        setCompletedRequests({})

        try {
            const api1Promise = fetch("http://localhost:8000/api/process", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "create_payments", count: 5000 }),
            })

            const api2Promise = fetch("http://localhost:3000/api/process", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "create_payments", count: 5000 }),
            })

            addLog("Sent request to API 1 (FastAPI)", "api1")
            addLog("Sent request to API 2 (Ruby on Rails)", "api2")

            await Promise.all([api1Promise, api2Promise])
        } catch (error) {
            addLog(`Request failed: ${error instanceof Error ? error.message : "Unknown error"}`, "system")
        } finally {
            setIsLoading(false)
            startCooldown()
        }
    }

    const startCooldown = () => {
        setIsCoolingDown(true)
        setCooldownTime(300)

        cooldownTimerRef.current = setInterval(() => {
            setCooldownTime((prev) => {
                if (prev <= 1) {
                    setIsCoolingDown(false)
                    if (cooldownTimerRef.current) {
                        clearInterval(cooldownTimerRef.current)
                    }
                    return 0
                }
                return prev -1
            })
        }, 1000)
    }

    const formatCooldownTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold mb-2">Dual API Request Processor</h1>
                    <p className="text-muted-foreground">
                        Simultaneously trigger payment processing jobs on both FastAPI and Ruby on Rails backends
                    </p>
                </div>

                {/* Primary Action Button */}
                <Card className="mb-6 border-primary/20 bg-card/80 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="text-center">Start Processing</CardTitle>
                        <CardDescription className="text-center">
                            This will create 5,000 payment records on both backends simultaneously
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center gap-4">
                        <Button 
                            onClick={handleSubmit}
                            disabled={isLoading || isCoolingDown}
                            size="lg"
                            className="px-8 py-6 text-lg font-semibold"
                        >
                            { isLoading && "Sending Requests..." }
                            { isCoolingDown && `Cooldown: ${formatCooldownTime(cooldownTime)}`}
                            { !isLoading && !isCoolingDown && "Send Requests to Both APIs" }
                        </Button>
                    </CardContent>
                </Card>

                {/* Request Status Panel */}
                <RequestStatusPanel api1Status={api1Status} api2Status={api2Status} />

                {/* Request Logger */}
                <RequestLogger logs={logs} />
            </div>
        </div>
    )
}