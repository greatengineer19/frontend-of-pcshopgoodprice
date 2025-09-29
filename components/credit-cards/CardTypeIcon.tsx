interface CardTypeIconProps {
    type: string | null
}

export function CardTypeIcon({ type }: CardTypeIconProps) {
    if (!type) return null

    const iconProps = {
        className: "w-8 h-5",
        viewBox: "0 0 32 20"
    }

    switch (type) {
    case "visa":
      return (
        <svg {...iconProps}>
          <rect width="32" height="20" rx="3" fill="#1A1F71" />
          <path
            d="M13.3 6.5h-2.8L8.9 13.5h1.6l.4-1.2h2.4l.4 1.2h1.8L13.3 6.5zm-2.1 4.7l.8-2.3.8 2.3h-1.6z"
            fill="white"
          />
          <path
            d="M18.8 6.5h-1.5l-2.2 7h1.6l.4-1.1h.9c1.2 0 2.1-.9 2.1-2.1v-1.7c0-1.2-.9-2.1-2.1-2.1h-.2zm-.3 4.7h-.6l.6-1.7h.6c.3 0 .6.3.6.6v.5c0 .3-.3.6-.6.6z"
            fill="white"
          />
        </svg>
      )
    case "mastercard":
      return (
        <svg {...iconProps}>
          <rect width="32" height="20" rx="3" fill="#EB001B" />
          <circle cx="12" cy="10" r="6" fill="#FF5F00" />
          <circle cx="20" cy="10" r="6" fill="#F79E1B" />
        </svg>
      )
    case "amex":
      return (
        <svg {...iconProps}>
          <rect width="32" height="20" rx="3" fill="#006FCF" />
          <path d="M8.5 7.5h3v1h-3v-1zm0 2h3v1h-3v-1zm0 2h2v1h-2v-1z" fill="white" />
          <path d="M20.5 7.5h3v1h-3v-1zm0 2h3v1h-3v-1zm0 2h2v1h-2v-1z" fill="white" />
        </svg>
      )
    case "jcb":
      return (
        <svg {...iconProps}>
          <rect width="32" height="20" rx="3" fill="#0E4C96" />
          <path d="M8 8h2v4H8V8zm4 0h2v4h-2V8zm4 0h2v4h-2V8z" fill="white" />
        </svg>
      )
    case "unionpay":
      return (
        <svg {...iconProps}>
          <rect width="32" height="20" rx="3" fill="#E21836" />
          <path d="M8 8h16v4H8V8z" fill="white" />
          <path d="M10 9h12v2H10V9z" fill="#E21836" />
        </svg>
      )
    default:
      return (
        <svg {...iconProps}>
          <rect width="32" height="20" rx="3" fill="#6B7280" stroke="#9CA3AF" />
          <path d="M8 8h16v1H8V8zm0 2h12v1H8v-1zm0 2h8v1H8v-1z" fill="#9CA3AF" />
        </svg>
      )
  }
}