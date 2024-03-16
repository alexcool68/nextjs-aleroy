import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Alexis LEROY - Articles',
    description: 'Blog, CV, Projets - Alexis LEROY'
};

export default function ArticlesLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
