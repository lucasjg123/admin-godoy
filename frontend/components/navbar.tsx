"use client"

import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"


// expensas - recibo - 

export function NavBar() {
  return (
    <NavigationMenu className="bg-black text-white d-flex mx-auto px-35 py-1 rounded-xl">
      <NavigationMenuList className="bg-black">
        <NavigationMenuItem >
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/expensas" className="bg-black">Expensas</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/" className="bg-black">Recibo</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

