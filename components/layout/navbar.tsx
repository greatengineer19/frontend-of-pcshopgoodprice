"use client";

import { useState, useEffect } from "react"
import Image from "next/image";
import Link from "next/link"
import { ChevronDown, ChevronRight, Globe, SwitchCamera, ShoppingBasket, FileText } from "lucide-react"
// import { userContext } from "@/context/user-context"
import { fetchUser, fetchUserDefault } from "@/lib/user-service"
import { fetchCart} from "@/lib/cart-service"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { CartLine } from "@/types/cart"
import { GetUserResponseAPI, User, UserRole } from "@/types/user"
import { useUser } from "@/hooks/use-user"
import { redirect } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { useWindowSize } from "@/lib/window-size";
import { X, Menu } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export function Navbar() {
    const SECRET_KEY_NAME = 'secret_key';
    const REFRESH_KEY_NAME = 'refresh_key';
    const [language, setLanguage] = useState<"English" | "Indonesia">("English")
    const {
        user, role, setRole, setUser, isLoadingUser, cartChanged, setCartChanged
    } = useUser()
    const [cartItemCount, setCartItemCount] = useState(0)
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(true)
    const [openSections, setOpenSections] = useState<string[]>([])

    const toggleSection = (section: string) => {
        setOpenSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
    }

    // Load cart item count
    useEffect(() => {
        const loadCartCount = async () => {
            if (user && role === "buyer") {
                try {
                    const cartLines: CartLine[] = await fetchCart()
                    setCartItemCount(cartLines.length)
                } catch (error) {
                    console.error("Failed to load cart count:", error)
                }
            }
            setCartChanged(false)
        }

        loadCartCount()
    }, [role, cartChanged])

    const toggleManualRole = async (requestRole: string) => {
        let token = localStorage.getItem(SECRET_KEY_NAME);
        let response: GetUserResponseAPI; // Declare response outside the if/else blocks

        if (token) {
            response = await fetchUser(requestRole, token);
        } else {
            response = await fetchUserDefault();
        }
        
        const responseUser = response.user;

        localStorage.setItem(SECRET_KEY_NAME, response.access_token);
        localStorage.setItem(REFRESH_KEY_NAME, response.refresh_token);

        const userRole: UserRole = responseUser.role.toLowerCase() as UserRole;
        setUser(responseUser)
        setRole(userRole)

        if (userRole == "buyer") {
            redirect('/shop')
        } else {
            redirect('/computer_components')
        }
    }
    const toggleRole = async () => {
        let requestRole = role === "seller" ? "buyer" : "seller"
        let token = localStorage.getItem(SECRET_KEY_NAME);
        let response: GetUserResponseAPI; // Declare response outside the if/else blocks

        if (token) {
            response = await fetchUser(requestRole, token);
        } else {
            response = await fetchUserDefault();
        }
        
        const responseUser = response.user;

        localStorage.setItem(SECRET_KEY_NAME, response.access_token);
        localStorage.setItem(REFRESH_KEY_NAME, response.refresh_token);

        const userRole: UserRole = responseUser.role.toLowerCase() as UserRole;
        setUser(responseUser)
        setRole(userRole)

        if (userRole == "buyer") {
            redirect('/shop')
        } else {
            redirect('/computer_components')
        }
    }
    const windowSize = useWindowSize()
    const menuItemsSeller = [
        {
        title: "Computer Components",
        items: [
            { name: "Computer Components", href: "/computer_components", description: "View and manage components" }
        ],
        },
        {
        title: "Procurement",
        items: [
            { name: "Purchase Invoice", href: "/purchase_invoices", description: "Manage purchase invoices" },
            { name: "Inbound Delivery", href: "/inbound_deliveries", description: "Manage inbound deliveries" },
        ],
        },
        {
        title: "Report",
        items: [
            {
            name: "Report Purchase Invoice",
            href: "/report/purchase_invoices",
            description: "View purchase invoice reports",
            },
            {
            name: "Report Inventory Movement",
            href: "/report/inventories",
            description: "View inventory movement reports",
            },
        ],
        },
    ]

    const menuItemsBuyer = [
        {
            title: "Shop Products",
            items: [
                { name: "Listings", href: "/shop", description: "Enjoy your purchase!" },
                { name: "Cart", href: "/cart", description: "Track your cart or saved items" },
                { name: "Orders", href: "/orders", description: "Summary of your purchases & deliveries" }
            ]
        }
    ]

    const menuItems = role === "seller" ? menuItemsSeller : menuItemsBuyer
    
    if (pathname === '/' && windowSize.typeId == 0) {
        return (
            <div className="border-b">
                <div className="container mx-auto flex h-16 items-center justify-start px-4">
                    <Link href="/computer_components" className="flex items-center">
                        <span className="text-xl font-normal" style={{ fontFamily: "'Tinos', serif", fontWeight: 400 }}>
                            PCSHOP GOOD PRICE
                        </span>
                    </Link>
                </div>
            </div>
        )
    } else if (pathname === "/" && windowSize.typeId != 0) {
        return (
            <div className="w-full max-w-[800px] mx-auto">
                <div className="flex items-center justify-between p-1 border-b bg-background">
                    <div className="relative h-24 w-24">
                        <Image
                            src={ "/psgp_logo_with_wording.png" }
                            alt={ "Login page" }
                            fill
                        />
                    </div>
                </div>
            </div>
        )
    } else if (windowSize.typeId != 0) {
        return (
            <div className="w-full max-w-[800px] mx-auto">
                <div className="flex items-center justify-between p-1 border-b bg-background">
                    <div className="relative h-24 w-24">
                        <Image
                            src={ "/psgp_logo_with_wording.png" }
                            alt={ "Login page" }
                            fill
                        />
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="md:hidden">
                        { isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" /> }
                    </Button>
                </div>
                
                {
                    isOpen && (
                        <Card className="border-x-0 border-t-0 rounded-none p-0">
                            <CardContent className="p-0">
                                <div className="p-4 border-b">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-muted-foreground">Switch to:</span>
                                        <div className="flex rounded-md border">
                                            <Button 
                                                variant={role === "buyer" ? "default" : "ghost"}
                                                size="sm"
                                                onClick={() => toggleManualRole("buyer") }
                                                className="rounded-r-none"
                                            >
                                                Buyer
                                            </Button>
                                            <Button
                                                variant={role === "seller" ? "default" : "ghost"}
                                                size="sm"
                                                onClick={() => toggleManualRole("seller")}
                                                className="rounded-l-none"
                                            >
                                                Seller
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="divide-y">
                                    {
                                        menuItems.map((section) => (
                                            <Collapsible
                                                key={section.title}
                                                open={openSections.includes(section.title)}
                                                onOpenChange={() => toggleSection(section.title)}
                                            >
                                                <CollapsibleTrigger asChild>
                                                    <Button variant="ghost" className="w-full justify-between p-4 h-auto font-medium text-left">
                                                        {section.title}
                                                        {
                                                            openSections.includes(section.title) ? (
                                                                <ChevronDown className="h-4 w-4" />
                                                            ) : (
                                                                <ChevronRight className="h-4 w-4" />
                                                            )
                                                        }
                                                    </Button>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                        <div className="bg-muted/30">
                                                            {section.items.map((item) => (
                                                                <Link
                                                                    key={item.href}
                                                                    href={item.href}
                                                                    className="block p-4 pl-8 hover:bg-accent hover:text-accent-foreground transition-colors"
                                                                    onClick={() => setIsOpen(false)}
                                                                >
                                                                    <div className="font-medium text-sm">{item.name}</div>
                                                                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                </CollapsibleContent>
                                            </Collapsible>
                                        ))
                                    }
                                </div>
                            </CardContent>
                        </Card>
                    )
                }
            </div>
        )
    } else {
        return (
            isLoadingUser ? (
                <div className="border-b">
                    <div className="container mx-auto flex h-16 items-center justify-start px-4">
                        <Link href="/computer_components" className="flex items-center">
                            <span className="text-xl font-normal" style={{ fontFamily: "'Tinos', serif", fontWeight: 400 }}>
                                PCSHOP GOOD PRICE
                            </span>
                        </Link>
                        <div className="flex-grow flex items-center justify-center">
                            <div className="text-center text-sm text-muted-foreground"> Loading user data OR pcshopgoodprice.com/test_api to populate 1st time data... </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="border-b">
                    <div className="container mx-auto flex h-16 items-center justify-between px-4">
                        {/* Logo */}
                        <Link href="/computer_components" className="flex items-center">
                        <span className="text-xl font-normal font-serif">PCSHOP GOOD PRICE</span>
                        </Link>

                        {/* Navigation - Different based on role */}
                        {role === "seller" ? (
                        <NavigationMenu>
                            <NavigationMenuList>
                            {/* Computer Components */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="h-10">Computer Components</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                <ul className="grid w-[300px] gap-3 p-4">
                                    <li>
                                    <NavigationMenuLink asChild>
                                        <Link
                                        href="/computer_components"
                                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                        >
                                        <div className="text-sm font-medium">Computer Components</div>
                                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                            View and manage components
                                        </p>
                                        </Link>
                                    </NavigationMenuLink>
                                    </li>
                                </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            {/* Procurement */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="h-10">Procurement</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                <ul className="grid w-[300px] gap-3 p-4">
                                    <li>
                                    <NavigationMenuLink asChild>
                                        <Link
                                        href="/purchase_invoices"
                                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                        >
                                        <div className="text-sm font-medium">Purchase Invoice</div>
                                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                            Manage purchase invoices
                                        </p>
                                        </Link>
                                    </NavigationMenuLink>
                                    </li>
                                    <li>
                                    <NavigationMenuLink asChild>
                                        <Link
                                        href="/inbound_deliveries"
                                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                        >
                                        <div className="text-sm font-medium">Inbound Delivery</div>
                                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                            Manage inbound deliveries
                                        </p>
                                        </Link>
                                    </NavigationMenuLink>
                                    </li>
                                </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            {/* Reports */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="h-10">Reports</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                <ul className="grid w-[320px] gap-3 p-4">
                                    <li>
                                    <NavigationMenuLink asChild>
                                        <Link
                                        href="/report/purchase_invoices"
                                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                        >
                                        <div className="text-sm font-medium">Report Purchase Invoice</div>
                                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                            View purchase invoice reports
                                        </p>
                                        </Link>
                                    </NavigationMenuLink>
                                    </li>
                                    <li>
                                    <NavigationMenuLink asChild>
                                        <Link
                                        href="/report/inventories"
                                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                        >
                                        <div className="text-sm font-medium">Report Inventory Movement</div>
                                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                            View inventory movement reports
                                        </p>
                                        </Link>
                                    </NavigationMenuLink>
                                    </li>
                                </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                        ) : (
                        <NavigationMenu>
                            <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                <Link
                                    href="/shop"
                                    className="flex h-10 w-full items-center justify-between px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                >
                                    Shop Products
                                </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                        )}

                        {/* Right side items */}
                        <div className="flex items-center space-x-4">
                        {/* Language Selector */}
                        <div className="relative">
                            <button
                            className="flex items-center space-x-1 text-sm hover:bg-accent hover:text-accent-foreground rounded-md px-2 py-1 transition-colors"
                            onClick={() => setLanguage(language === "English" ? "Indonesia" : "English")}
                            >
                            <Globe className="h-4 w-4" />
                            <span>{language}</span>
                            <ChevronDown className="h-3 w-3" />
                            </button>
                        </div>

                        {/* Role Switch */}
                        <button
                            onClick={toggleRole}
                            className="text-sm hover:underline cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md px-2 py-1 transition-colors"
                        >
                            Switch to {role === "buyer" ? "Seller" : "Buyer"}
                        </button>

                        {/* Buyer-specific icons */}
                        {role === "buyer" && (
                            <>
                            {/* Shopping Basket */}
                            <Link href="/cart">
                                <Button variant="ghost" size="icon" className="relative">
                                <ShoppingBasket className="h-5 w-5" />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                                    {cartItemCount}
                                    </span>
                                )}
                                </Button>
                            </Link>

                            {/* Orders/Invoices */}
                            <Link href="/orders">
                                <Button variant="ghost" size="icon">
                                <FileText className="h-5 w-5" />
                                </Button>
                            </Link>
                            </>
                        )}
                        </div>
                    </div>
                </div>
            )
        )
    }
}