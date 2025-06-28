"use client";

import { ReactNode } from "react";
import { useAuth } from "@/context/auth-context";

interface PermissionGateProps {
  children: ReactNode;
  permissionNeeded: string;
  fallback?: ReactNode;
}

/**
 * İzin tabanlı erişim kontrolü için bileşen
 * Kullanıcının belirli bir izne sahip olup olmadığını kontrol eder
 * İzin yoksa fallback içeriğini gösterir veya null döner
 */
export default function PermissionGate({
  children,
  permissionNeeded,
  fallback = null,
}: PermissionGateProps) {
  const { hasPermission } = useAuth();

  if (!hasPermission(permissionNeeded)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
