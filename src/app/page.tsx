'use client';

import Image from "next/image";
import Link from "next/link";
import { fetchUserSuperBuyer, fetchUserDefault } from "@/lib/user-service"
import type { GetUserResponseAPI, UserRole } from "@/types/user"
import { useUser } from "@/hooks/use-user"
import { redirect } from 'next/navigation'

export default function Home() {
  const SECRET_KEY_NAME = 'secret_key';
  const REFRESH_KEY_NAME = 'refresh_key';

  const { setRole, setUser } = useUser()
  
  const loginAsBuyer = async () => {
      const response: GetUserResponseAPI  = await fetchUserSuperBuyer();
      const responseUser = response.user;

      localStorage.setItem(SECRET_KEY_NAME, response.access_token);
      localStorage.setItem(REFRESH_KEY_NAME, response.refresh_token);

      const userRole: UserRole = responseUser.role.toLowerCase() as UserRole;
      setUser(responseUser)
      setRole(userRole)

      window.location.href = '/shop';
  }

  const loginAsSeller = async () => {
      const response: GetUserResponseAPI  = await fetchUserDefault();
      const responseUser = response.user;

      localStorage.setItem(SECRET_KEY_NAME, response.access_token);
      localStorage.setItem(REFRESH_KEY_NAME, response.refresh_token);

      const userRole: UserRole = responseUser.role.toLowerCase() as UserRole;
      setUser(responseUser)
      setRole(userRole)

      window.location.href = '/computer_components';
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Desktop Background */}
      <div className="absolute inset-0 hidden md:block">
        <Image
          src="/seacliffbridge.jpeg?height=1080&width=1920"
          alt="Desktop background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Mobile Background */}
      <div className="absolute inset-0 block md:hidden">
        <Image
          src="/seacliffbridge.jpeg?height=800&width=400"
          alt="Mobile background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8 text-center">
          {/* Logo/Title */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">Welcome</h1>
            <p className="text-lg text-white/90 md:text-xl">Choose your login type</p>
          </div>

          {/* Login Buttons */}
          <div className="space-y-4">
            <button
              onClick={loginAsBuyer}
              className="block w-full rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            >
              Login as Buyer
            </button>

            <button
              onClick={loginAsSeller}
              className="block w-full rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            >
              Login as Seller
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
