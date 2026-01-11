"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useRef } from "react"

interface LogEntry {
    id: string
    timestamp: string
    message: string
    source: "api1" | "api2" | "system"
}

interface RequestLoggerProps {
    logs: LogEntry[]
}

export default function RequestLogger({ logs }: RequestLoggerProps) {
    const logEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [logs])

    const getSourceColor = (source: string) => {
        switch (source) {
            case "api1":
                return "text-blue-600 dark:text-blue-400"
            case "api2":
                return "text-purple-600 dark:text-purple-400"
            case "system":
                return "text-gray-600 dark:text-gray-400"
            default:
                return "text-foreground"
        }
    }

    const getSourceLabel = (source: string) {
        switch (source) {
            case "api1":
                return "FastAPI"
            case "api2":
                return "Rails"
            case "system":
                return "System"
            default:
                return source
        }
    }

    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
                <CardTitle className="text-lg">Progress Log</CardTitle>
                <CardDescription>Real-time updates from both API backends</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto">
                    {
                        logs.length === 0 ? (
                            <div className="text-muted-foreground text-center py-8">
                                Click "Send Requests to Both APIs" to start processing and see logs here
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {
                                    logs.map((log) => (
                                        <div key={log.id} className="flex gap-3 py-1 text-xs">
                                            <span className="text-muted-foreground min-w-fit">[{log.timestamp}]</span>
                                            <span className={`min-w-fit font-semibold ${getSourceColor(log.source)}`}>
                                                {getSourceLabel(log.source)}
                                            </span>
                                            <span className="text-foreground break-words">{log.message}</span>
                                        </div>
                                    ))
                                }
                                <div ref={logEndRef} />
                            </div>
                        )
                    }
                </div>
            </CardContent>
        </Card>
    )
}