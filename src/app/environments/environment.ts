export const environment = {
  production: true,
  apiUrl: '', // Keep empty for relative paths in production too

  // API endpoints
  api: {
    products: '/api/products',
    reservations: '/api/reservations',
    auth: '/auth',
    blogs: '/api/blogs',
    categories: '/api/categories',
    complaints: '/complaints',
    reviews: '/reviews',
    chatbot: '/api/chatbot'
  },

  // Upload paths
  uploads: {
    base: '/uploads',
    products: '/uploads/product-uploads'
  }
};
