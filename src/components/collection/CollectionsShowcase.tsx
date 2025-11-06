'use client';

import Link from 'next/link';
import { Collection } from '@/lib/types';
import { CollectionCard } from './CollectionCard';

interface CollectionsShowcaseProps {
  collections: Collection[];
}

export function CollectionsShowcase({ collections }: CollectionsShowcaseProps) {
  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl md:text-3xl font-light text-gray-900">Our Collections</h2>
          <Link
            href="/collections"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors uppercase tracking-wide"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </div>
    </section>
  );
}

