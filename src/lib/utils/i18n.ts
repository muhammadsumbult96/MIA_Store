export type Language = 'en' | 'vi';

export const translations = {
  en: {
    common: {
      search: 'Search',
      cart: 'Cart',
      account: 'Account',
      login: 'Login',
      signup: 'Sign Up',
      home: 'Home',
      products: 'Products',
      newArrivals: 'New Arrivals',
      sale: 'Sale',
      collections: 'Collections',
      accessories: 'Accessories',
      contact: 'Contact',
      about: 'About',
    },
    product: {
      addToCart: 'Add to Cart',
      outOfStock: 'Out of Stock',
      inStock: 'In Stock',
      quickView: 'Quick View',
      viewDetails: 'View Details',
    },
    products: {
      title: 'Products',
      filters: 'Filters',
      search: 'Search',
      searchPlaceholder: 'Search products...',
      category: 'Category',
      allCategories: 'All Categories',
      priceRange: 'Price Range',
      min: 'Min',
      max: 'Max',
      minimumRating: 'Minimum Rating',
      anyRating: 'Any Rating',
      rating4: '4+ Stars',
      rating45: '4.5+ Stars',
      clearFilters: 'Clear Filters',
      sortBy: 'Sort by',
      sortNameAsc: 'Name (A-Z)',
      sortNameDesc: 'Name (Z-A)',
      sortPriceAsc: 'Price (Low to High)',
      sortPriceDesc: 'Price (High to Low)',
      sortRatingDesc: 'Rating (High to Low)',
      noProducts: 'No products found matching your criteria.',
    },
    footer: {
      storeLocator: 'Store Locator',
      customerService: 'Customer Service',
      shipping: 'Shipping',
      returns: 'Returns',
      policies: 'Policies',
      followUs: 'Follow Us',
    },
  },
  vi: {
    common: {
      search: 'Tìm kiếm',
      cart: 'Giỏ hàng',
      account: 'Tài khoản',
      login: 'Đăng nhập',
      signup: 'Đăng ký',
      home: 'Trang chủ',
      products: 'Sản phẩm',
      newArrivals: 'Sản phẩm mới',
      sale: 'Giảm giá',
      collections: 'Bộ sưu tập',
      accessories: 'Phụ kiện',
      contact: 'Liên hệ',
      about: 'Về chúng tôi',
    },
    product: {
      addToCart: 'Thêm vào giỏ',
      outOfStock: 'Hết hàng',
      inStock: 'Còn hàng',
      quickView: 'Xem nhanh',
      viewDetails: 'Xem chi tiết',
    },
    products: {
      title: 'Sản phẩm',
      filters: 'Bộ lọc',
      search: 'Tìm kiếm',
      searchPlaceholder: 'Tìm kiếm sản phẩm...',
      category: 'Danh mục',
      allCategories: 'Tất cả danh mục',
      priceRange: 'Khoảng giá',
      min: 'Tối thiểu',
      max: 'Tối đa',
      minimumRating: 'Đánh giá tối thiểu',
      anyRating: 'Bất kỳ đánh giá',
      rating4: '4+ Sao',
      rating45: '4.5+ Sao',
      clearFilters: 'Xóa bộ lọc',
      sortBy: 'Sắp xếp theo',
      sortNameAsc: 'Tên (A-Z)',
      sortNameDesc: 'Tên (Z-A)',
      sortPriceAsc: 'Giá (Thấp đến Cao)',
      sortPriceDesc: 'Giá (Cao đến Thấp)',
      sortRatingDesc: 'Đánh giá (Cao đến Thấp)',
      noProducts: 'Không tìm thấy sản phẩm phù hợp với tiêu chí của bạn.',
    },
    footer: {
      storeLocator: 'Hệ thống cửa hàng',
      customerService: 'Chăm sóc khách hàng',
      shipping: 'Vận chuyển',
      returns: 'Đổi trả',
      policies: 'Chính sách',
      followUs: 'Theo dõi chúng tôi',
    },
  },
};

export function getTranslation(lang: Language, key: string): string {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) {
      return key;
    }
  }
  
  return typeof value === 'string' ? value : key;
}

export function t(lang: Language, key: string): string {
  return getTranslation(lang, key);
}

