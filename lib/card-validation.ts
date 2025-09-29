export function validateCardNumber(cardNumber: string): boolean {
    const cleanNumber = cardNumber.replace(/\s/g, "")
    if (!/^\d+$/.test(cleanNumber)) return false

    // Check length (13-19 digits for most cards)
    if (cleanNumber.length < 13 || cleanNumber.length > 19) return false

    // Luhn algorithm
    let sum = 0
    let isEven = false

    for (let i = cleanNumber.length - 1; i >= 0; i--) {
        let digit = Number.parseInt(cleanNumber[i])

        if (isEven) {
            digit *= 2
            if (digit > 9) {
                digit -= 9
            }
        }

        sum += digit
        isEven = !isEven
    }

    return sum % 10 === 0
}

export function validateExpiryDate(expiryDate: string): boolean {
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) return false

    const [month, year] = expiryDate.split("/").map((num) => Number.parseInt(num))

    if (month < 1 || month > 12) return false

    const currentDate = new Date()
    const currentYear = currentDate.getFullYear() % 100
    const currentMonth = currentDate.getMonth() + 1

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        return false
    }

    return true
}

export function validateCVV(cvv: string): boolean {
    return /^\d{3,4}$/.test(cvv)
}

export function getCardType(cardNumber: string): string | null {
    const cleanNumber = cardNumber.replace(/\s/g, "")

    // Visa: starts with 4
    if (/^4/.test(cleanNumber)) return "visa";

    // Mastercard: starts with 5[1-5] or 2[2-7]
    if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber)) return "mastercard";

    // American Express: starts with 34 or 37
    if (/^3[47]/.test(cleanNumber)) return "amex";

    // JCB: starts with 35
    if (/^35/.test(cleanNumber)) return "jcb";

    // UnionPay: starts with 62
    if (/^62/.test(cleanNumber)) return "unionpay"

    return null
}