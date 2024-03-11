/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'adept-hare-684.convex.cloud'
            },
            {
                hostname: 'img.clerk.com'
            }
        ]
    }
};

export default nextConfig;
