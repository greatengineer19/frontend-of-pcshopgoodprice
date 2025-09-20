"use client"

import { useState, useEffect, useCallback } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight } from "lucide-react"

interface DataPoint {
    data_count: number
    query_time1: number
    query_time2: number
    query_time3: number
}

type Status = "idle" | "running" | "done"

export default function ReportQueryAnalysis() {
    const [data, setData] = useState<DataPoint[]>([])
    const [animationProgress, setAnimationProgress] = useState(0)
    const [status, setStatus] = useState<Status>("idle")

    const fetchData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/purchase_invoices_query_analysis`)
            const result = await response.json()

            setData(result.data.map((dataPoint: DataPoint) => (
                {
                    data_count: String(dataPoint.data_count / 1000) + "k",
                    query_time1: dataPoint.query_time1,
                    query_time2: dataPoint.query_time2,
                    query_time3: dataPoint.query_time3,
                }
            )))
        } catch (error) {
            console.error("Failed to fetch data:", error)
        }
    }

    const handleReset = useCallback(() => {
        setAnimationProgress(0)
        setStatus("idle")
    }, [])

    const handleRun = useCallback(async () => {
        if (data.length === 0) {
            await fetchData()
        }

        setStatus("running")
        setAnimationProgress(0)
    }, [data.length])

    useEffect(() => {
        if (status === "running" && data.length > 0 && animationProgress < 100) {
            const timer = setTimeout(() => {
                setAnimationProgress((prev) => Math.min(prev + 5, 100))
            }, 100)

            return () => clearTimeout(timer)
        } else if (status === "running" && animationProgress >= 100) {
            setStatus("done")
        }
    }, [status, data.length, animationProgress])

    useEffect(() => {
        fetchData()
    }, [])

    const getAnimatedData = () => {
        if (animationProgress === 0) return []
        const pointsToShow = Math.ceil((data.length * animationProgress) / 100)
        return data.slice(0, pointsToShow)
    }

    const getStatusColor = () => {
        switch (status) {
            case "running":
                return "bg-yellow-500"
            case "done":
                return "bg-green-500"
            default:
                return "bg-gray-500"
        }
    }

    const getStatusText = () => {
        switch (status) {
            case "running":
                return "In Progress"
            case "done":
                return "Done"
            default:
                return "Ready"
        }
    }

    const [expandedAlgorithms, setExpandedAlgorithms] = useState<{ [key: string]: boolean }>({})
    const toggleAlgorithm = (algorithmId: string) => {
        setExpandedAlgorithms((prev) => ({
            ...prev,
            [algorithmId]: !prev[algorithmId]
        }))
    }

    const algorithms = [
        {
            id: "linear-search",
            name: "Algorithm 1: Linear Search",
            color: "#3b82f6",
            code: `select * from purchase_invoices
                   query #1`,
        },
        {
            id: "binary-search",
            name: "Algorithm 2: Binary Search",
            color: "#10b981",
            code: `select * from purchase_invoices
                   query #2`,
        },
        {
            id: "hash-table",
            name: "Algorithm 3: Hash Table",
            color: "#f59e0b",
            code: `select * from purchase_invoices
                   query #2`,
        },
    ]

    return (
        <div className="min-h-screen bg-black p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-white">Query Performance Analysis</h1>
                    <p className="text-gray-300">Interactive line graph showing query time vs data count comparison</p>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Performance Metrics</CardTitle>
                                <CardDescription>Comparing query performance accross three different algorithms</CardDescription>
                            </div>
                            <Badge className={getStatusColor()}>{getStatusText()}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Control Buttons */}
                            <div className="flex gap-4 justify-center">
                                <Button onClick={handleRun} disabled={status === "running"} className="min-w-24">
                                    { status === "running" ? "Running..." : "Run" }
                                </Button>
                                <Button 
                                    onClick={handleReset}
                                    variant="outline"
                                    disabled={status === "running"}
                                    className="min-w-24 bg-transparent"
                                >
                                    Reset
                                </Button>
                            </div>

                            {/* Progress Indicator */}
                            {
                                status === "running" && (
                                    <div className="text-center text-sm text-gray-300">Animation Progress: {animationProgress}%</div>
                                )
                            }

                            {/* Chart */}
                            <div className="h-96 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={getAnimatedData()}
                                        margin={{
                                            top: 20,
                                            right: 30,
                                            left: 60,
                                            bottom: 60
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                        <XAxis 
                                            dataKey="data_count"
                                            label ={{
                                                value: "Data Count",
                                                position: "insideBottom",
                                                offset: -5,
                                                style: { textAnchor: "middle"}
                                            }}
                                        />
                                        <YAxis 
                                            label={{
                                                value: "Query Time (ms)",
                                                angle: -90,
                                                position: "insideLeft",
                                                style: { textAnchor: "middle" }
                                            }}
                                        />
                                        <Tooltip 
                                            formatter={(value: number, name: string) => [
                                                `${value}ms`,
                                                name.replace("queryTime", "Algorithm ")
                                            ]}
                                            labelFormatter={(label: string) => `Data Count: ${label}`}
                                        />
                                        <Legend formatter={(value: string) => value.replace("queryTime", "Algorithm ")} />
                                        <Line 
                                            type="monotone"
                                            dataKey="query_time1"
                                            stroke="#3b82f6"
                                            strokeWidth={3}
                                            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 5 }}
                                            name="Algorithm 1"
                                            activeDot={{ r: 7, fill: "#3b82f6"}}
                                        />
                                        <Line 
                                            type="monotone"
                                            dataKey="query_time2"
                                            stroke="#10b981"
                                            strokeWidth={3}
                                            dot={{ fill: "#10b981", strokeWidth: 2, r: 5 }}
                                            name="Algorithm 2"
                                            activeDot={{ r: 7, fill: "#10b981"}}
                                        />
                                        <Line 
                                            type="monotone"
                                            dataKey="query_time3"
                                            stroke="#f59e0b"
                                            strokeWidth={3}
                                            dot={{ fill: "#f59e0b", strokeWidth: 2, r: 5 }}
                                            name="Algorithm 3"
                                            activeDot={{ r: 7, fill: "#f59e0b"}}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Legend Info */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-8">
                                {
                                    algorithms.map((algorithm) => (
                                        <div key={algorithm.id} className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-0.5" style={{ backgroundColor: algorithm.color }}></div>
                                                <span className="text-foreground">{algorithm.name}</span>
                                            </div>

                                            {/* Toggle Button */}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleAlgorithm(algorithm.id)}
                                                className="flex items-center gap-2 h-8 px-2 text-muted-foreground hover:text-foreground"
                                            >
                                                {
                                                    expandedAlgorithms[algorithm.id] ? (
                                                        <ChevronDown className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronRight className="h-4 w-4" />
                                                    )
                                                }
                                                {
                                                    expandedAlgorithms[algorithm.id] ? "Hide Code" : "Show Code"
                                                }
                                            </Button>

                                            {/* Expandable Code Section */}
                                            {
                                                expandedAlgorithms[algorithm.id] && (
                                                    <div className="mt-2 p-4 bg-muted rounded-lg border">
                                                        <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap overflow-x-auto select-text">
                                                            <code>{algorithm.code}</code>
                                                        </pre>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}