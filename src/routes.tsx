import * as React from 'react';
import { Index } from './index';

export const getRoutes = (store) => {
    return [
        {
            path: '*',
            action: (context) => {
                const {path, params, route, baseUrl} = context;
                return {component: <Index />, context};
            }
        }
    ];
};
