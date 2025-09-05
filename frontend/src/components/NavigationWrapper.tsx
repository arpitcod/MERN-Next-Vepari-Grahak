'use client';

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import SuperAdminNavbar from "@/components/SuperAdminNavbar";

export default function NavigationWrapper() {
  const pathname = usePathname();
  const isSuperAdminRoute = pathname.startsWith("/super-admin") || pathname.startsWith("/vepari-details") ;

  return isSuperAdminRoute ? <SuperAdminNavbar /> : <Navbar />;
}