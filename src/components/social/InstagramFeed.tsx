'use client';

import Image from 'next/image';

const instagramImages = [
  'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400',
  'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
  'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
  'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400',
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400',
];

export function InstagramFeed() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Instagram @mia.vn</h2>
          <p className="text-sm text-gray-600">Follow us for the latest updates</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {instagramImages.map((src, index) => (
            <div key={index} className="relative aspect-square overflow-hidden group cursor-pointer">
              <Image
                src={src}
                alt={`Instagram post ${index + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

