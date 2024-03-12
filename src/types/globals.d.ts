// Create a type for the roles
export type Roles = 'superadmin' | 'admin' | 'member';

declare global {
    interface CustomJwtSessionClaims {
        metadata: {
            role?: Roles;
        };
    }
}

export {};
