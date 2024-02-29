/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'adept-hare-684.convex.cloud'
            }
        ]
    }
};

export default nextConfig;
