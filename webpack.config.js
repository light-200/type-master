import { resolve } from 'path';
import DotenvWebpackPlugin from 'dotenv-webpack';

export const mode = 'development';
export const entry = './src/script.js';
export const output = {
    path: resolve(__dirname, 'docs'),
    filename: 'bundle.js'
};
export const plugins = [
    new DotenvWebpackPlugin({
        path: './.env'
    })
];
export const watch = true;