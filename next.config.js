/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'fakestoreapi.com', // Add this for FakeStore API images
        pathname: '/img/**', // Specific path for their images
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'api.escuelajs.co', // For Platzi API images
      },
      {
        protocol: 'https',
        hostname: 'dummyjson.com', // For DummyJSON images if used
      }
    ],
    formats: ['image/webp', 'image/avif'],
  },

  eslint: {
    ignoreDuringBuilds: true,
  }
}

module.exports = nextConfig
