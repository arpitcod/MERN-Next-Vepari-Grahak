"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const SuperAdminGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    // super_admin_token cookie check
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("super_admin_token="));

    if (!token) {
      // 🔥 redirect to home if no token
      router.push("/");
    }
  }, [router]);

  return <>{children}</>;
};

export default SuperAdminGuard;
