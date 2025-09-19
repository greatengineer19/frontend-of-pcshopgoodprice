import { ReportData } from "@/types/report";

export const fetchAIAnalyzeReport = async (reportData: ReportData, userInput: string): Promise<string> => {
    const payload = {
        user_input: userInput + ', report body:' + JSON.stringify(reportData.report_body) + ', report_headers: ' + JSON.stringify(reportData.report_headers)
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chatbot/analyze_report`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "origin": "pcshopgoodprice.com"
        },
        body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
        return "System failed to send inquiry to chatGPT"
    }

    const responseData = await response.json();
    const chatgpt_response: string = responseData.chatgpt_response;

    return chatgpt_response
}