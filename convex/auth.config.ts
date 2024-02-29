export default {
    providers: [
        {
            // domain: 'https://thorough-killdeer-15.clerk.accounts.dev',
            domain: process.env.CLERK_JWT_INSSUER,
            applicationID: 'convex'
        }
    ]
};
