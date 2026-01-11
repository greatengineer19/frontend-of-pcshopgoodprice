import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface RequestStatusPanelProps {
    api1Status: string
    api2Status: string
}

export default function RequestStatusPanel({ api1Status, api2Status }: RequestStatusPanelProps) {
    const getStatusColor = (status: string) => {
        if (status.includes("✓")) return "text-green-600 dark:text-green-400"
        if (status.includes("✗")) return "text-red-600 dark:text-red-400"
        if (status.includes("Processing")) return "text-blue-600 dark:text-blue-400"
        return "text-muted-foreground"
    }

    return (
        <Card className="mb-6 border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
                <CardTitle className="text-lg">Request Status</CardTitle>
                <CardDescription>Real-time status updates from both backends</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* API 1 Status */}
                    <div className="p-4 rounded-lg border border-border/40 bg-muted/30">
                        <div className="text-sm font-semibold text-foreground mb-2">FastAPI (API 1)</div>
                        <div className={`text-sm font-medium ${getStatusColor(api1Status)}`}>
                            {api1Status || "Ready to send request"}
                        </div>
                    </div>

                    {/* API 2 Status */}
                    <div className="p-4 rounded-lg border border-border/40 bg-muted/30">
                        <div className="text-sm font-semibold text-foreground mb-2">Ruby on Rails (API 2)</div>
                        <div className={`text-sm font-medium ${getStatusColor(api2Status)}`}>
                            {api2Status || "Ready to send request"}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}