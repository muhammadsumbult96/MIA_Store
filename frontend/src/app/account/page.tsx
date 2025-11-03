"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/providers/AuthProvider";
import Button from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Link from "next/link";

export default function AccountPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>
        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-secondary-600">
                  Email
                </label>
                <p className="mt-1 text-secondary-900">{user?.email}</p>
              </div>
              {user?.full_name && (
                <div>
                  <label className="text-sm font-medium text-secondary-600">
                    Full Name
                  </label>
                  <p className="mt-1 text-secondary-900">{user.full_name}</p>
                </div>
              )}
              <div className="pt-4 space-y-2">
                <Link href="/account/orders">
                  <Button variant="outline" className="w-full">
                    View Orders
                  </Button>
                </Link>
                <Button variant="outline" onClick={logout} className="w-full">
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}

