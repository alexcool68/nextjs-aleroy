import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function validateVideoLinkRegex(url: string) {
    const query = '((1fichier\\.com|megadl\\.fr|alterupload\\.com)/\\?[a-zA-Z0-9]{5,30}(&pw=[^&]+)?)';
    const regex = new RegExp(query, 'g');
    // let m;

    // while ((m = regex.exec(url)) !== null) {
    //     // This is necessary to avoid infinite loops with zero-width matches
    //     if (m.index === regex.lastIndex) {
    //         regex.lastIndex++;
    //     }

    //     m.forEach((match, groupIndex) => {
    //         console.log(`Found match, group ${groupIndex}: ${match}`);
    //     });

    // }

    if (regex.exec === null) return null;
    return regex.exec(url);
}
