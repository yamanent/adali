"use client";

import { Inter } from "next/font/google";
import { useState, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context';
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
  Shield,
  Newspaper // Blog ikonu eklendi
} from 'lucide-react';

const inter = Inter({ subsets: ["latin"] });

// Navigasyon öğelerini ve rollerini tanımla
const allNavItems = [
  { href: "/admin/dashboard", label: "Ana Panel", icon: <LayoutDashboard className="w-5 h-5" />, roles: ['admin'] },
  { href: "/admin/rezervasyonlar", label: "Rezervasyonlar", icon: <ClipboardList className="w-5 h-5" />, roles: ['admin'] },
  { href: "/admin/takvim", label: "Takvim", icon: <CalendarDays className="w-5 h-5" />, roles: ['admin'] },
  { href: "/admin/odalar", label: "Odalar", icon: <Home className="w-5 h-5" />, roles: ['admin'] },
  { href: "/admin/misafirler", label: "Misafirler", icon: <Users className="w-5 h-5" />, roles: ['admin'] },
  { href: "/admin/istatistikler", label: "İstatistikler", icon: <BarChart4 className="w-5 h-5" />, roles: ['admin'] },
  { href: "/admin/blog", label: "Blog Yönetimi", icon: <Newspaper className="w-5 h-5" />, roles: ['admin', 'blog'] },
  { href: "/admin/ayarlar", label: "Ayarlar", icon: <Settings className="w-5 h-5" />, roles: ['admin'] },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading, logout } = useAuth(); // `loading` state'i kullanılıyor
  const pathname = usePathname();
  const router = useRouter();

  // Kullanıcının rolüne göre gösterilecek navigasyon öğelerini filtrele
  const navItems = useMemo(() => {
    if (!user) return [];
    return allNavItems.filter(item => item.roles.includes(user.role));
  }, [user]);

  useEffect(() => {
    if (loading) {
      return; // Auth durumu kontrol edilirken bekle
    }

    // Giriş yapılmamışsa ve login sayfasında değilse, login'e yönlendir
    if (!user && pathname !== "/admin") {
      router.push("/admin");
      return;
    }

    // Kullanıcı giriş yapmışsa rol bazlı kontrol yap
    if (user) {
      const isAllowed = navItems.some(item => pathname.startsWith(item.href));
      
      // 'blog' rolündeki kullanıcı sadece blog sayfalarına erişebilir
      if (user.role === 'blog' && !isAllowed) {
        router.push('/admin/blog');
        return;
      }
      
      // Genel bir kural olarak, eğer kullanıcı erişemeyeceği bir sayfadaysa
      // (örneğin URL'i manuel yazdıysa), onu kendi ana paneline yönlendir.
      if (!isAllowed && navItems.length > 0) {
         // admin için dashboard, blog için blog sayfası
        const homePage = user.role === 'admin' ? '/admin/dashboard' : '/admin/blog';
        if (pathname !== homePage) {
             router.push(homePage);
        }
      }
    }
  }, [pathname, router, user, loading, navItems]);

  const handleLogout = () => {
    logout();
    router.push("/admin");
  };

  // Login sayfası veya yükleme esnasında layout'u gösterme
  if (loading || (pathname === "/admin" && !user)) {
    return <div className={inter.className}>{children}</div>;
  }
  
  if (!user) {
    return <div className={inter.className}>{children}</div>;
  }

  return (
    <div className={inter.className}>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar - Desktop */}
        {navItems.length > 0 && (
          <div className="hidden md:flex md:flex-shrink-0">
            <div className="flex flex-col w-64 bg-white border-r">
              <div className="flex items-center justify-center h-16 border-b">
                <Link href={user.role === 'admin' ? "/admin/dashboard" : "/admin/blog"} className="flex items-center py-2">
                  <Image 
                    src="/Adali.svg" 
                    alt="Adalı Pansiyon Admin" 
                    width={200}
                    height={60}
                    className="object-contain"
                    style={{ height: 'auto' }}
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
                        pathname.startsWith(item.href)
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
        )}

        {/* Mobile Header & Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {navItems.length > 0 && (
            <div className="md:hidden">
              <div className="flex items-center justify-between bg-white border-b px-4 py-2">
                <Link href={user.role === 'admin' ? "/admin/dashboard" : "/admin/blog"} className="flex items-center">
                  <Image 
                    src="/Adali.svg" 
                    alt="Adalı Pansiyon Admin" 
                    width={150}
                    height={40}
                    className="object-contain"
                    style={{ height: 'auto' }}
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
                          pathname.startsWith(item.href)
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
          )}
          
          {/* Main Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            <div className="container mx-auto px-6 py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
