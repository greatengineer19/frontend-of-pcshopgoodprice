'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { fetchUserSuperBuyer, fetchUserDefault } from "@/lib/user-service"
import type { GetUserResponseAPI, UserRole } from "@/types/user"
import { useUser } from "@/hooks/use-user"

const features = [
  { id: 1, name: "Buyer's Shopping Page", href: "/shop", role: "buyer" },
  { id: 2, name: "Purchase Report and Chat with GPT-4o mini", href: "/report/purchase_invoices", role: "seller" },
  { id: 3, name: "Graph Query Performance Analysis", href: "/report/query_analysis", role: "seller" },
  { id: 4, name: "Items Checkout Payment Integrated with Adyen", href: "/cart", role: "buyer" },
  { id: 5, name: "Seller's Inbound Delivery Page", href: "/inbound_deliveries", role: "seller" },
]

export default function Home() {
  const SECRET_KEY_NAME = 'secret_key';
  const REFRESH_KEY_NAME = 'refresh_key';

  const { setRole, setUser } = useUser()

  const handleFeatureClick = async (e: React.MouseEvent, feature: typeof features[0]) => {
    e.preventDefault();

    try {
      let response: GetUserResponseAPI;

      if (feature.role === "buyer") {
        response = await fetchUserSuperBuyer();
      } else {
        response = await fetchUserDefault();
      }

      const responseUser = response.user;

      localStorage.setItem(SECRET_KEY_NAME, response.access_token);
      localStorage.setItem(REFRESH_KEY_NAME, response.refresh_token);

      const userRole: UserRole = responseUser.role.toLowerCase() as UserRole;
      setUser(responseUser)
      setRole(userRole)

      window.location.href = feature.href;
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <header className="mb-16 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground text-pretty">
          Welcome to Pisgop! Choose a feature you'd like to explore.
        </h1>
        <h2 className="text-l md:text-xl font-bold text-foreground text-pretty">
          Updates Alert! Per 11 January 2026, backend upgraded from Monolithic (FastAPI) to Microservices (FastAPI plus Ruby on Rails)
        </h2>
      </header>

      <div className="w-full max-w-7xl">
        {/* Desktop: Grid layout with 5 columns (squares) */}
        <div className="hidden md:grid grid-cols-5 gap-4 relative">
          {
            features.map((feature) => (
              <a
                key={feature.id}
                href={feature.href}
                onClick={(e) => handleFeatureClick(e, feature)}
                className="h-full"
              >
                <Button
                  className="w-full h-40 text-lg font-semibold hover:scale-105 transition-transform duration-200 whitespace-normal break-words px-2 py-2 text-center leading-tight"
                  variant="default"
                >
                  {feature.name}
                </Button>
              </a>
            ))
          }
        </div>

        {/* Mobile: Stack layout with full width (rectangles) */}
        <div className="md:hidden flex flex-col gap-4 relative">
          <div className="absolute inset-0 -z-10">
            <Image
              src="/bg_stuffs.png?height=1080&width=1920"
              alt="Mobile background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          {
            features.map((feature) => (
              <a
                key={feature.id}
                href={feature.href}
                onClick={(e) => handleFeatureClick(e, feature)}
                className="w-full"
              >
                <Button
                  className="w-full h-16 text-base font-semibold hover:scale-105 transition-transform duration-200 whitespace-normal break-words px-4 text-left"
                  variant="default"
                >
                  {feature.name}
                </Button>
              </a>
            ))
          }
        </div>
      </div>
    </main>
  )
}