'use client';
import { useAuth } from "@/app/context/authContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return; // Wait for auth to load

    // If not logged in and not on login page, redirect to login
    if (!user && pathname !== "/authentication") {
      router.replace("/authentication");
    }
    // If logged in and on login page, redirect to home
    if (user && pathname === "/authentication") {
      router.replace("/");
    }
    // If logged in and NOT on login page, do nothing (allow navigation)
  }, [user, loading, pathname, router]);

  // Optionally, show nothing or a loading spinner while checking auth
  if (loading || (!user && pathname !== "/authentication")) return null;

  return <>{children}</>;
}