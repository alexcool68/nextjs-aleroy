import { Button } from '@/components/ui/button';

export function Footer() {
    return (
        <footer className="relative text-muted-foreground bottom-2 w-full text-center text-sm">
            © {new Date().getFullYear()} By{' '}
            <Button variant="link" className="p-0" asChild>
                <a href="#">Alexis LEROY</a>
            </Button>
        </footer>
    );
}
