import React from 'react';
import Report from 'bv-react-data-report';

const example =  [
        {
            "id": 0,
            "title": "New",
            "selected": false,
            "key": "File"
        },
        {
            "id": 1,
            "title": "Vessel Wizard",
            "selected": false,
            "key": "File"
        }

    ];


const Component1 = () => (
    <div>
        <Report data={example} />
        <h1>Hello from the other side</h1>
    </div>
);

export default Component1;