"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/react";
import EquipmentDropdown from "./equipment-dropdown";

const menuItems = ["About Us", "Services", "Testimonials", "Service Area"];

export const AppNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navbarRef = useRef<HTMLElement>(null);

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Navbar
      ref={navbarRef}
      maxWidth="full"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent>
        <NavbarBrand>
          <Link href="/" className="nav-link">
            <Image
              src="/nhservices-logo-svg.svg"
              alt="NH Services"
              width={140}
              height={48}
              style={{ height: "auto" }}
              priority
            />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarMenuToggle aria-label="Toggle menu" className="sm:hidden" />

      <NavbarMenu className="w-3/4 sm:w-auto">
        <div className="flex flex-col items-start">
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={index}>
              <Link
                href={`/#${item.toLowerCase().replace(/\s+/g, "")}`}
                className="w-full text-lg nav-link"
                onClick={closeMenu}
              >
                {item}
              </Link>
            </NavbarMenuItem>
          ))}
          <EquipmentDropdown />
          <Link
            href="/gallery"
            className="w-full text-lg nav-link"
            onClick={closeMenu}
          >
            Gallery
          </Link>
        </div>
      </NavbarMenu>

      <NavbarContent className="hidden sm:flex gap-4 justify-center items-center">
        {menuItems.map((item, index) => (
          <NavbarItem key={index}>
            <Link
              href={`/#${item.toLowerCase().replace(/\s+/g, "")}`}
              className="nav-link"
            >
              {item}
            </Link>
          </NavbarItem>
        ))}
        <EquipmentDropdown />
        <Link href="/gallery" className="w-full text-md nav-link">
          Gallery
        </Link>
      </NavbarContent>

      <NavbarContent justify="end" className="hidden md:flex">
        <NavbarItem>
          <div className="flex flex-col items-center text-gray-500">
            <span className="text-md text-center">
              Call for a <span className="underline font-bold">FREE</span>{" "}
              estimate:
            </span>
            <a href="tel:3039051470" className="nav-link">
              <span className="text-lg font-bold text-gradient">
                (303) 905-1470
              </span>
            </a>
          </div>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default AppNavbar;
