"use client";

import { useState, useEffect } from "react";
import { storesApi, Store } from "@/lib/api/stores";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const data = await storesApi.getStores();
        setStores(data);
      } catch (error) {
        console.error("Failed to fetch stores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading stores...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Store Locator</h1>

      {stores.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-secondary-600">No stores available at the moment</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <Card key={store.id}>
              <CardHeader>
                <CardTitle>{store.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-secondary-700">
                  <strong>Address:</strong> {store.address}, {store.city}
                </p>
                {store.phone && (
                  <p className="text-secondary-700">
                    <strong>Phone:</strong> {store.phone}
                  </p>
                )}
                {store.email && (
                  <p className="text-secondary-700">
                    <strong>Email:</strong> {store.email}
                  </p>
                )}
                {store.opening_hours && (
                  <p className="text-secondary-700">
                    <strong>Hours:</strong> {store.opening_hours}
                  </p>
                )}
                {store.latitude && store.longitude && (
                  <div className="pt-2">
                    <a
                      href={`https://www.google.com/maps?q=${store.latitude},${store.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 underline"
                    >
                      View on Map
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

