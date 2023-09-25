/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: './app/api/*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // replace '*' with specific origins if needed
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, x-auth-token',
          },
        ],
      },
    ];
  },

}

module.exports = nextConfig
