'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CartIcon } from '@/components/cart/CartIcon';
import { SearchBar } from '@/components/ui/SearchBar';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useLanguage } from '@/hooks/useLanguage';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navItems = isMounted ? [
    { href: '/', label: t('common.home') },
    { href: '/products?category=new', label: t('common.newArrivals') },
    { href: '/products?category=sale', label: t('common.sale') },
    { href: '/products?category=collections', label: t('common.collections') },
    { href: '/products?category=accessories', label: t('common.accessories') },
  ] : [
    { href: '/', label: 'Home' },
    { href: '/products?category=new', label: 'New Arrivals' },
    { href: '/products?category=sale', label: 'Sale' },
    { href: '/products?category=collections', label: 'Collections' },
    { href: '/products?category=accessories', label: 'Accessories' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex justify-center px-8">
            <Link href="/" className="text-2xl font-bold text-primary-900 tracking-tight">
              MÍA
            </Link>
          </div>

          <div className="flex-1 max-w-md mx-4">
            <SearchBar />
          </div>

          <nav className="hidden lg:flex items-center gap-8 flex-shrink-0">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-primary-900 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            <div className="relative">
              <button
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                className="p-2 text-gray-700 hover:text-primary-900 transition-colors"
                aria-label="Account menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>
              {isAccountMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsAccountMenuOpen(false)}
                  >
                    {isMounted ? t('common.login') : 'Login'}
                  </Link>
                  <Link
                    href="/signup"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsAccountMenuOpen(false)}
                  >
                    {isMounted ? t('common.signup') : 'Sign Up'}
                  </Link>
                </div>
              )}
            </div>
            <CartIcon />
            <button
              className="lg:hidden text-gray-700 hover:text-primary-900"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-gray-700 hover:text-primary-900 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-2 border-t">
                <LanguageSwitcher />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

