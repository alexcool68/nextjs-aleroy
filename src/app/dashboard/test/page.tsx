'use client';

import { Input } from '@/components/ui/input';
import { validateVideoLinkRegex } from '@/lib/utils';
import { useEffect, useState } from 'react';
import TitleHeader from '../_components/title-header';

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
            <TitleHeader title="Testing"></TitleHeader>

            <div>
                <Input name="testing" value={inputText} onChange={(e) => setInputText(e.target.value)} />
            </div>

            <p></p>
        </div>
    );
}

export default TestingDashboard;
