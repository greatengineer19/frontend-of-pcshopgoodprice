"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { X, MessageSquare, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ReportData } from "@/types/report"
import { fetchAIAnalyzeReport } from "@/lib/chatbot-service"

interface Message {
    id: string
    content: string
    sender: "user" | "ai"
    timestamp: Date
}

interface MiniChatRoomProps {
    reportData: ReportData
    className?: string
}

export function MiniChatRoom({ reportData, className }: MiniChatRoomProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [inputValue, setInputValue] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    const handleSendMessage = async () => {
        const userInput = inputValue.trim()
        if (!userInput || isLoading) return

        const responseFromChatGPT = await fetchAIAnalyzeReport(reportData, userInput)
        const userMessageObject: Message = {
            id: Date.now().toString(),
            content: userInput,
            sender: "user",
            timestamp: new Date()
        }

        setMessages((prev) => [...prev, userMessageObject])
        setInputValue("")
        setIsLoading(true)

        setTimeout(() => {
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: responseFromChatGPT,
                sender: "ai",
                timestamp: new Date()
            }
            setMessages((prev) => [...prev, aiMessage])
            setIsLoading(false)
        }, 2000)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const LoadingDots = () => (
        <div className="flex space-x-1 p-3">
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
        </div>
    )

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className={cn(
                    "fixed bottom-6 right-6 h-12 px-4 shadown-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90",
                    className,
                )}
            >
                <MessageSquare className="w-5 h-5 mr-2" />
                Analyze Report with AI
            </Button>
        )
    }

    return (
        <Card className={cn("fixed bottom-6 right-6 w-80 h-96 flex flex-col shadow-2xl border-0 overflow-hidden transition-all duration-300 animate-in slide-in-from-bottom-4",
            className
        )}>
            {/* Header */}
            <div className="chat-gradient-bg p-4 flex items-center justify-between text-white">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <h3 className="font-semibold text-sm">AI Report Analyst</h3>
                </div>
                <div className="flex items-center space-x-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsOpen(false)}
                        className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full"
                        title="Hide Chat"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-background to-muted/20">
                {
                    messages.length === 0 && (
                        <div className="text-center text-muted-foreground text-sm py-8">
                            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>Ask me to analyze your reports</p>
                            <p className="text-xs mt-1">I'll provide insights and recommendations</p>
                        </div>
                    )
                }

                {
                    messages.map((message) => (
                        <div key={message.id} className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}>
                            <div className={cn(
                                "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                                message.sender === "user" ? "chat-bubble-user text-white" : "chat-bubble-ai text-foreground", 
                            )}>
                                {message.content}
                            </div>
                        </div>
                    ))
                }

                {
                    isLoading && (
                        <div className="flex justify-start">
                            <div className="chat-bubble-ai rounded-lg">
                                <LoadingDots />
                            </div>
                        </div>
                    )
                }

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-card">
                <div className="flex space-x-2">
                    <Input 
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Ask about your report..."
                        className="flex-1 text-sm"
                        disabled={isLoading}
                    />
                    <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading} size="sm" className="px-3">
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </Card>
    )
}