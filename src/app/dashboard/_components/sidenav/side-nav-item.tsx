import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MenuItemInterface } from '../../_data/menu';

interface SideNavItemProps extends React.HTMLAttributes<HTMLDivElement> {
    data: MenuItemInterface;
    userRole?: string;
}

export default function SideNavItem({ data }: SideNavItemProps) {
    const { href, icon, title } = data;
    const pathname = usePathname();

    return (
        <Button variant={pathname.includes(`${href}`) ? 'secondary' : 'ghost'} className="w-full justify-start" asChild>
            <Link href={href}>
                {icon} {title}
            </Link>
        </Button>
    );
}
