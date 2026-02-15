'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { fetchUserSuperBuyer, fetchUserDefault } from "@/lib/user-service"
import type { GetUserResponseAPI, UserRole } from "@/types/user"
import { useUser } from "@/hooks/use-user"
import { ShoppingCart, FileText, BarChart3, CreditCard, Package } from "lucide-react"

const features = [
  {
    id: 1,
    name: "Shopping Experience",
    description: "Browse and purchase items with ease",
    href: "/shop",
    role: "buyer",
    icon: ShoppingCart,
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    name: "Purchase Analytics",
    description: "AI-powered insights with GPT-4o mini",
    href: "/report/purchase_invoices",
    role: "seller",
    icon: FileText,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: 3,
    name: "Performance Metrics",
    description: "Advanced query and performance analysis",
    href: "/report/query_analysis",
    role: "seller",
    icon: BarChart3,
    gradient: "from-orange-500 to-red-500"
  },
  {
    id: 4,
    name: "Secure Payments",
    description: "Checkout powered by Adyen",
    href: "/cart",
    role: "buyer",
    icon: CreditCard,
    gradient: "from-green-500 to-emerald-500"
  },
  {
    id: 5,
    name: "Delivery Management",
    description: "Streamlined inbound logistics",
    href: "/inbound_deliveries",
    role: "seller",
    icon: Package,
    gradient: "from-indigo-500 to-blue-500"
  },
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
        {/* Header Section */}
        <header className="mb-12 md:mb-20 text-center max-w-4xl animate-fade-in">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 rounded-full">
            <span className="text-sm font-semibold text-blue-700">Solo Project done by Juan Andrew, Senior Software Engineer at Runchise</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-transparent bg-clip-text">
              Pisgop
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Your all-in-one commerce solution with integrated payments, analytics, and intelligent automation
          </p>
        </header>

        {/* Features Grid */}
        <div className="w-full max-w-7xl">
          {/* Desktop: Enhanced grid layout */}
          <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <a
                  key={feature.id}
                  href={feature.href}
                  onClick={(e) => handleFeatureClick(e, feature)}
                  className="group h-full transform transition-all duration-300 hover:scale-105"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  <div className="relative h-full min-h-[280px] bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200">
                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                    {/* Content */}
                    <div className="relative p-6 h-full flex flex-col">
                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      {/* Text */}
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {feature.name}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-grow">
                        {feature.description}
                      </p>

                      {/* Arrow indicator */}
                      <div className="flex items-center text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                        Explore
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Mobile: Enhanced stack layout */}
          <div className="md:hidden flex flex-col gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <a
                  key={feature.id}
                  href={feature.href}
                  onClick={(e) => handleFeatureClick(e, feature)}
                  className="group"
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                  }}
                >
                  <div className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200">
                    {/* Gradient accent */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${feature.gradient}`} />

                    <div className="p-5 pl-6">
                      <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>

                        {/* Text */}
                        <div className="flex-grow min-w-0">
                          <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {feature.name}
                          </h3>
                          <p className="text-sm text-slate-600">
                            {feature.description}
                          </p>
                        </div>

                        {/* Arrow */}
                        <div className="flex-shrink-0 text-blue-600 group-hover:translate-x-1 transition-transform">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Footer Section */}
        <footer className="mt-16 text-center">
          <p className="text-sm text-slate-500">
            Powered by cutting-edge technology • Secured by Adyen • Enhanced with AI
          </p>
        </footer>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        .delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </main>
  )
}