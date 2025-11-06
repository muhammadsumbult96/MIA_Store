'use client';

import { useState } from 'react';
import { Review } from '@/lib/types';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
  averageRating: number;
}

export function ProductReviews({ productId, reviews, averageRating }: ProductReviewsProps) {
  const { t, language } = useLanguage();

  const getVietnameseComment = (comment: string): string => {
    const translations: Record<string, string> = {
      'Absolutely love this dress! Perfect fit and the quality is amazing. Highly recommend!': 'Tôi rất thích chiếc váy này! Vừa vặn hoàn hảo và chất lượng tuyệt vời. Rất khuyến khích!',
      'Beautiful dress, great quality. The only thing is it runs a bit small, so I would size up.': 'Váy đẹp, chất lượng tốt. Chỉ có điều hơi nhỏ một chút, nên tôi sẽ chọn size lớn hơn.',
      'Stunning dress! Got so many compliments. The material is luxurious and the fit is perfect.': 'Chiếc váy tuyệt đẹp! Nhận được rất nhiều lời khen. Chất liệu sang trọng và vừa vặn hoàn hảo.',
      'Best leather jacket I\'ve ever owned. Great quality and style. Worth every penny!': 'Chiếc áo khoác da tốt nhất tôi từng sở hữu. Chất lượng và phong cách tuyệt vời. Đáng từng đồng!',
      'Good quality leather, fits well. The only downside is it\'s a bit heavy, but that\'s expected for genuine leather.': 'Da chất lượng tốt, vừa vặn. Chỉ có nhược điểm là hơi nặng một chút, nhưng đó là điều bình thường với da thật.',
      'Perfect fit, very comfortable. The stretch material makes it easy to move around.': 'Vừa vặn hoàn hảo, rất thoải mái. Chất liệu co giãn giúp dễ di chuyển.',
      'Great jeans, good quality. The wash is nice and the fit is true to size.': 'Quần jeans tuyệt vời, chất lượng tốt. Màu rửa đẹp và size vừa đúng.',
      'Excellent trench coat! Great quality and perfect fit. Very versatile piece.': 'Áo khoác trench tuyệt vời! Chất lượng tốt và vừa vặn hoàn hảo. Món đồ rất linh hoạt.',
      'Beautiful silk blouse, feels luxurious. The quality is outstanding!': 'Áo blouse lụa đẹp, cảm giác sang trọng. Chất lượng xuất sắc!',
      'Very cozy and warm cardigan. Perfect for layering. Great quality wool.': 'Áo cardigan rất ấm áp và thoải mái. Hoàn hảo để mặc lớp. Chất lượng len tuyệt vời.',
      'Love this skirt! The pleats are perfect and it sits beautifully. Highly recommend!': 'Tôi yêu chiếc váy này! Các nếp gấp hoàn hảo và vừa vặn đẹp mắt. Rất khuyến khích!',
      'Best suit I\'ve ever purchased. Perfect tailoring and professional look.': 'Bộ suit tốt nhất tôi từng mua. Cắt may hoàn hảo và vẻ ngoài chuyên nghiệp.',
      'Beautiful scarf, lightweight and elegant. Perfect accessory!': 'Khăn quàng đẹp, nhẹ và thanh lịch. Phụ kiện hoàn hảo!',
    };
    return translations[comment] || comment;
  };
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [localReviews, setLocalReviews] = useState(reviews);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !rating || !comment) return;

    const newReview: Review = {
      id: `review-${Date.now()}`,
      userId: `user-${Date.now()}`,
      userName,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
      productId,
    };

    setLocalReviews([newReview, ...localReviews]);
    setUserName('');
    setRating(0);
    setComment('');
    setIsFormOpen(false);
  };

  return (
    <section className="border-t pt-8 mt-12 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 uppercase">{t('product.reviews')}</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(averageRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {t('product.averageRating')}: {averageRating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500">({localReviews.length} {t('product.reviews')})</span>
          </div>
        </div>
        <Button variant="outline" onClick={() => setIsFormOpen(!isFormOpen)}>
          {t('product.addReview')}
        </Button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 rounded-lg animate-fadeIn">
          <h3 className="text-lg font-semibold mb-4">{t('product.writeReview')}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('product.yourName')}
              </label>
              <Input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                placeholder={t('product.yourName')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('product.yourRating')}
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <svg
                      className={`w-8 h-8 ${
                        star <= (hoveredRating || rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('product.yourComment')}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder={t('product.yourComment')}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" variant="primary">
                {t('product.submitReview')}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </form>
      )}

      {localReviews.length === 0 ? (
        <p className="text-gray-500 text-center py-8">{t('product.noReviews')}</p>
      ) : (
        <div className="space-y-6">
          {localReviews.map((review, index) => (
            <div
              key={review.id}
              className="border-b pb-6 last:border-b-0 animate-fadeIn"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900">{review.userName}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(review.date).toLocaleDateString(
                      t('product.yourRating') === 'Your Rating' ? 'en-US' : 'vi-VN',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </p>
                </div>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {language === 'vi' ? getVietnameseComment(review.comment) : review.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

