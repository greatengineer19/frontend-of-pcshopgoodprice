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
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || ""
      const response = await fetch(`${baseUrl}/api/purchase_invoices_query_analysis`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      setData(
        result.data.map((dataPoint: DataPoint) => ({
          data_count: String(dataPoint.data_count / 1000) + "k",
          query_time1: dataPoint.query_time1,
          query_time2: dataPoint.query_time2,
          query_time3: dataPoint.query_time3,
        })),
      )
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
      [algorithmId]: !prev[algorithmId],
    }))
  }

  const algorithms = [
    {
      id: "q1-limit-offset",
      name: "Query 1: using Limit and Offset",
      color: "#3b82f6",
      code: `Repeat offset from 0 to 900000, increment by 100000
            
                    EXPLAIN ANALYZE select pi.* 
                    FROM purchase_invoices pi
                    JOIN purchase_invoice_lines pil ON pil.purchase_invoice_id  = pi.id
                    WHERE invoice_date between '2025-08-01 00:00' AND '2025-08-31 23:59'
                    ORDER BY pi.created_at DESC, id ASC
                    LIMIT 100000 offset 0;
                    
                    CREATE UNIQUE INDEX purchase_invoices_pkey ON public.purchase_invoices USING btree (id);
                    CREATE UNIQUE INDEX purchase_invoices_purchase_invoice_no_key ON public.purchase_invoices USING btree (purchase_invoice_no);
                    CREATE UNIQUE INDEX purchase_invoice_lines_pkey ON public.purchase_invoice_lines USING btree (id);
                    CREATE INDEX pi_pi_report_index1 ON public.purchase_invoices USING btree (created_at, invoice_date);
                    CREATE INDEX pil_pi_report_index1 ON public.purchase_invoice_lines USING btree (component_name);
                    CREATE INDEX idx_purchase_invoice_lines_invoice_id ON public.purchase_invoice_lines USING btree (purchase_invoice_id);`,
    },
    {
      id: "q2-keyset-pagination",
      name: "Query 2: using Limit and Keyset Pagination",
      color: "#10b981",
      code: `Store ID of the last query, and perform next query by using id as lower limit
                    e.g (899986, 799986, 699986, 599986, 499986, 399986, 299986, 199986, 99986, 1)

                    EXPLAIN ANALYZE select pi.*
                    FROM purchase_invoices pi
                    JOIN purchase_invoice_lines pil ON pil.purchase_invoice_id  = pi.id
                    WHERE invoice_date between '2025-08-01 00:00' AND '2025-08-31 23:59'
                    AND pi.id >= 299986
                    ORDER BY pi.created_at DESC, id ASC
                    LIMIT 100000;
                    
                    CREATE UNIQUE INDEX purchase_invoices_pkey ON public.purchase_invoices USING btree (id);
                    CREATE UNIQUE INDEX purchase_invoices_purchase_invoice_no_key ON public.purchase_invoices USING btree (purchase_invoice_no);
                    CREATE UNIQUE INDEX purchase_invoice_lines_pkey ON public.purchase_invoice_lines USING btree (id);
                    CREATE INDEX pi_pi_report_index1 ON public.purchase_invoices USING btree (created_at, invoice_date);
                    CREATE INDEX pil_pi_report_index1 ON public.purchase_invoice_lines USING btree (component_name);
                    CREATE INDEX idx_purchase_invoice_lines_invoice_id ON public.purchase_invoice_lines USING btree (purchase_invoice_id);`,
    },
    {
      id: "q3-no-index",
      name: "Query 3: no index",
      color: "#f59e0b",
      code: `same with query 1, but no index applied`,
    },
  ]

  return (
    <div className="min-h-screen bg-black p-3 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        <div className="text-center space-y-2 px-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-balance">
            Query Performance Analysis
          </h1>
          <p className="text-sm sm:text-base text-gray-300 text-pretty">
            Interactive line graph showing query time vs data count comparison
          </p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-1">
                <CardTitle className="text-lg sm:text-xl">Performance Metrics</CardTitle>
                <CardDescription className="text-sm text-pretty">
                  Comparing query performance across three queries, 1st & 2nd is using index, while 3rd query have no
                  index
                </CardDescription>
              </div>
              <Badge className={`${getStatusColor()} self-start sm:self-center`}>{getStatusText()}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-center">
              <Button
                onClick={handleRun}
                disabled={status === "running"}
                className="w-full sm:w-auto sm:min-w-24 h-10 sm:h-9"
              >
                {status === "running" ? "Running..." : "Run"}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                disabled={status === "running"}
                className="w-full sm:w-auto sm:min-w-24 h-10 sm:h-9 bg-transparent"
              >
                Reset
              </Button>
            </div>

            {/* Progress Indicator */}
            {status === "running" && (
              <div className="text-center text-sm text-gray-300">Animation Progress: {animationProgress}%</div>
            )}

            <div className="h-64 sm:h-80 lg:h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={getAnimatedData()}
                  margin={{
                    top: 20,
                    right: 10,
                    left: 20,
                    bottom: 40,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="data_count"
                    label={{
                      value: "Data Count",
                      position: "insideBottom",
                      offset: -5,
                      style: { textAnchor: "middle", fontSize: "12px" },
                    }}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    label={{
                      value: "Query Time (s)",
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: "middle", fontSize: "12px" },
                    }}
                    ticks={[0.5, 1, 1.5, 2, 20, 40, 50, 60, 80]}
                    tick={{ fontSize: 12 }}
                    width={40}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [`${value}s`, name.replace("queryTime", "Query ")]}
                    labelFormatter={(label: string) => `Data Count: ${label}`}
                    contentStyle={{ fontSize: "12px" }}
                  />
                  <Legend
                    formatter={(value: string) => value.replace("queryTime", "Query ")}
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="query_time1"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 3 }}
                    name="Query 1"
                    activeDot={{ r: 5, fill: "#3b82f6" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="query_time2"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
                    name="Query 2"
                    activeDot={{ r: 5, fill: "#10b981" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="query_time3"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ fill: "#f59e0b", strokeWidth: 2, r: 3 }}
                    name="Query 3"
                    activeDot={{ r: 5, fill: "#f59e0b" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 text-sm mb-4 sm:mb-8">
              {algorithms.map((algorithm) => (
                <div key={algorithm.id} className="space-y-3 border rounded-lg p-4 bg-card">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-1 rounded-full flex-shrink-0"
                      style={{ backgroundColor: algorithm.color }}
                    ></div>
                    <span className="text-foreground font-medium text-pretty leading-tight">{algorithm.name}</span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleAlgorithm(algorithm.id)}
                    className="flex items-center gap-2 h-9 px-3 w-full sm:w-auto text-muted-foreground hover:text-foreground justify-start"
                  >
                    {expandedAlgorithms[algorithm.id] ? (
                      <ChevronDown className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 flex-shrink-0" />
                    )}
                    <span className="text-sm">{expandedAlgorithms[algorithm.id] ? "Hide Code" : "Show Code"}</span>
                  </Button>

                  {expandedAlgorithms[algorithm.id] && (
                    <div className="mt-3 p-3 sm:p-4 bg-muted rounded-lg border">
                      <div className="overflow-x-auto">
                        <pre className="text-xs sm:text-sm font-mono text-muted-foreground whitespace-pre-wrap min-w-0 select-text leading-relaxed">
                          <code
                            className="break-words text-justify hyphens-auto"
                            style={{
                              textAlignLast: "left",
                              wordSpacing: "0.1em",
                              letterSpacing: "0.02em",
                            }}
                          >
                            {algorithm.code}
                          </code>
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
