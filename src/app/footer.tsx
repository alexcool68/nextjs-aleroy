import Link from 'next/link';

export function Footer() {
    return (
        <div className="flex items-center h-40 bg-background mt-12">
            <div className="container flex justify-between items-center mx-auto">
                <div>Alexis LEROY</div>

                <Link className="text-secondary hover:text-primary" href="#">
                    Privacy Policy
                </Link>
                <Link className="text-secondary hover:text-primary" href="#">
                    Terms of Service
                </Link>
                <Link className="text-secondary hover:text-primary" href="#">
                    About
                </Link>
            </div>
        </div>
    );
}
