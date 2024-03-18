import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

interface footerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Footer({ className }: footerProps) {
    return (
        <footer className={cn('relative text-muted-foreground bottom-2 w-full text-center text-sm', className)}>
            © {new Date().getFullYear()} By{' '}
            <Button variant="link" className="p-0" asChild>
                <a href="#">Alexis LEROY</a>
            </Button>
        </footer>
    );
}
