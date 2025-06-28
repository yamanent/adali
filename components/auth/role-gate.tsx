"use client";

import { ReactNode } from "react";
import { useAuth } from "@/context/auth-context";
import { UserRole } from "@/types/auth";

interface RoleGateProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

/**
 * Rol tabanlı erişim kontrolü için bileşen
 * Kullanıcının belirli bir role sahip olup olmadığını kontrol eder
 * İzin yoksa fallback içeriğini gösterir veya null döner
 */
export default function RoleGate({
  children,
  allowedRoles,
  fallback = null,
}: RoleGateProps) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
