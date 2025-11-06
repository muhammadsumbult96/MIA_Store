'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Collection } from '@/lib/types';

interface CollectionCardProps {
  collection: Collection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <Link href={`/collections/${collection.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <Image
          src={collection.image}
          alt={collection.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-light mb-2">{collection.name}</h3>
          <p className="text-sm text-white/90 font-light">{collection.description}</p>
        </div>
      </div>
    </Link>
  );
}

