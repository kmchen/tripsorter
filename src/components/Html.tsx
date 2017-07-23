import * as React from 'react';

interface HtmlProps {
    content?: any;
    storeState?: any;
}

export function Html(props: HtmlProps) {
    return (
        <html >
            <head>
                <meta charSet='utf-8' />
                <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0' />
            </head>
            <body>
                <div id='react-app' dangerouslySetInnerHTML={{__html: props.content}} />
                <script dangerouslySetInnerHTML={{__html: `window.appState=${JSON.stringify(props.storeState)}`}} />
                <script src={`/website-assets/dist/bundle.js`}></script>
            </body>
        </html>
    );
}
