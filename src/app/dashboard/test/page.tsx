'use client';

import { Input } from '@/components/ui/input';
import { validateVideoLinkRegex } from '@/lib/utils';
import { useEffect, useState } from 'react';

function TestingDashboard() {
    const [inputText, setInputText] = useState('');
    // const query = '((1fichier\\.com|megadl\\.fr)/\\?[a-zA-Z0-9]{5,30}(&pw=[^&]+)?)';
    // const regex = new RegExp(query, 'g');

    useEffect(() => {
        // let m;
        // console.log('input text : ', inputText);

        // while ((m = regex.exec(inputText)) !== null) {
        //     // This is necessary to avoid infinite loops with zero-width matches
        //     if (m.index === regex.lastIndex) {
        //         regex.lastIndex++;
        //     }

        //     // The result can be accessed through the `m`-variable.
        //     m.forEach((match, groupIndex) => {
        //         console.log(`Found match, group ${groupIndex}: ${match}`);
        //     });
        // }
        const testing = validateVideoLinkRegex(inputText);

        // console.log(testing[0]);
    }, [inputText]);

    return (
        <div className="p-5">
            <div className="flex flex-row justify-between items-center border-b pb-5 mb-5">
                <h1 className="text-xl lg:text-3xl font-medium tracking-wider"># Testing</h1>
            </div>

            <div>
                <Input name="testing" value={inputText} onChange={(e) => setInputText(e.target.value)} />
            </div>

            <p></p>
        </div>
    );
}

export default TestingDashboard;
