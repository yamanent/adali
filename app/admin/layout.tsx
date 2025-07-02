"use client";

import { Inter } from "next/font/google";
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context';
import { UserRole } from '@/types/auth';
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Home,
  Users,
  BarChart4,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  Shield
} from 'lucide-react';

const inter = Inter({ subsets: ["latin"] });

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Login sayfasında değilsek ve giriş yapılmamışsa login sayfasına yönlendir
    if (pathname !== "/admin" && !isAuthenticated) {
      router.push("/admin");
    }
  }, [pathname, router, isAuthenticated]);

  const handleLogout = () => {
    logout();
    router.push("/admin");
  };

  // Login sayfasında navbar gösterme
  if (pathname === "/admin" && !isAuthenticated) {
    return <div className={inter.className}>{children}</div>;
  }

  const navItems = [
    { href: "/admin/dashboard", label: "Ana Panel", icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: "/admin/rezervasyonlar", label: "Rezervasyonlar", icon: <ClipboardList className="w-5 h-5" /> },
    { href: "/admin/takvim", label: "Takvim", icon: <CalendarDays className="w-5 h-5" /> },
    { href: "/admin/odalar", label: "Odalar", icon: <Home className="w-5 h-5" /> },
    { href: "/admin/misafirler", label: "Misafirler", icon: <Users className="w-5 h-5" /> },
    { href: "/admin/istatistikler", label: "İstatistikler", icon: <BarChart4 className="w-5 h-5" /> },
    { href: "/admin/ayarlar", label: "Ayarlar", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className={inter.className}>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar - Desktop */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 bg-white border-r">
            <div className="flex items-center justify-center h-16 border-b">
              <Link href="/admin/dashboard" className="flex items-center py-2">
                <Image 
                  src="/Adali.svg" 
                  alt="Adalı Pansiyon Admin" 
                  width={200}
                  height={60}
                  className="object-contain h-auto"
                  priority
                />
              </Link>
            </div>
            <div className="flex flex-col flex-grow overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      pathname === item.href
                        ? "bg-gray-200 text-gray-900"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Link>
                ))}
              </nav>
              <div className="mt-auto">
                <div className="p-4 border-t border-b">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-sage-100 p-2 rounded-full">
                      {user?.role === 'admin' ? (
                        <Shield className="w-5 h-5 text-sage-600" />
                      ) : (
                        <User className="w-5 h-5 text-sage-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user?.displayName || 'Kullanıcı'}</p>
                      <p className="text-xs text-gray-500">{user?.email || 'kullanici@adali.com'}</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full flex items-center justify-center border-sage-200 hover:bg-sage-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Çıkış Yap
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="md:hidden">
            <div className="flex items-center justify-between bg-white border-b px-4 py-2">
              <Link href="/admin/dashboard" className="flex items-center">
                <Image 
                  src="/Adali.svg" 
                  alt="Adalı Pansiyon Admin" 
                  width={150}
                  height={40}
                  className="object-contain"
                  priority
                />
              </Link>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
              <div className="bg-white border-b">
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="bg-sage-100 p-2 rounded-full">
                      {user?.role === 'admin' ? (
                        <Shield className="w-5 h-5 text-sage-600" />
                      ) : (
                        <User className="w-5 h-5 text-sage-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user?.displayName || 'Kullanıcı'}</p>
                      <p className="text-xs text-gray-500">{user?.email || 'kullanici@adali.com'}</p>
                    </div>
                  </div>
                </div>
                <nav className="px-2 py-3 space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                        pathname === item.href
                          ? "bg-gray-200 text-gray-900"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </Link>
                  ))}
                </nav>
                <div className="p-3 border-t">
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full flex items-center justify-center border-sage-200 hover:bg-sage-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Çıkış Yap
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto bg-gray-100">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
