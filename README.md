## Top Ten Games Serverless API
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started
Create .env.local file in the root folder:
```
MONGODB_URI=""
JWT_SECRET=""
IGDB_CLIENT_ID=""
IGDB_CLIENT_SECRET=""

```

## Notable changes to library
- Use jose because jwtwebtoken is not working with next.js (The edge runtime does not support Node.js 'crypto' module)
- Use ajv because express-validator is typically designed for express.js app