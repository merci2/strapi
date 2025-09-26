export default ({ env }) => ({
  origin: [
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000', // React dev server alternative
    'https://strapi-kappa-ten.vercel.app', // Deine Vercel URL
    env('CLIENT_URL', 'https://strapi-kappa-ten.vercel.app'),
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
});