import { Newspaper, Bitcoin, Users, Key } from 'lucide-react';

export interface MenuInterface {
    label: string;
    title: string;
    role: string[];
    menu: MenuItemInterface[];
}

export interface MenuItemInterface {
    label: string;
    title: string;
    href: string;
    icon: React.ReactNode;
}

export const MAIN_MENU: MenuInterface[] = [
    {
        label: 'dashboard',
        title: 'Dashboard',
        role: ['superadmin', 'admin'],
        menu: [
            {
                label: 'articles',
                title: 'Articles',
                href: '/dashboard/articles',
                icon: <Newspaper className="h-4 w-4 mr-2" />
            },
            {
                label: 'cryptos',
                title: 'Cryptos',
                href: '/dashboard/cryptos',
                icon: <Bitcoin className="h-4 w-4 mr-2" />
            }
        ]
    },
    {
        label: 'backend',
        title: 'Backend',
        role: ['superadmin'],
        menu: [
            {
                label: 'users',
                title: 'Users',
                href: '/dashboard/users',
                icon: <Users className="h-4 w-4 mr-2" />
            }
        ]
    },
    {
        label: 'tools',
        title: 'Tools',
        role: ['superadmin', 'admin', 'member'],
        menu: [
            {
                label: 'debrid',
                title: 'Debrideur',
                href: '/dashboard/debrid',
                icon: <Key className="h-4 w-4 mr-2" />
            }
        ]
    }
];
