import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function validateVideoLinkRegex(url: string) {
    const query = '((1fichier\\.com|megadl\\.fr|alterupload\\.com)/\\?[a-zA-Z0-9]{5,30}(&pw=[^&]+)?)';
    const regex = new RegExp(query, 'g');
    if (regex.exec === null) return null;
    return regex.exec(url);
}

export function truncateLongString(text: string, n: number, separator: string = ' ...') {
    return text.length > n ? text.slice(0, n - 1) + separator : text;
}
