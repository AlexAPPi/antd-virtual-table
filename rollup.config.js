import { createRequire } from "module";
import terser from "@rollup/plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import del from "rollup-plugin-delete";
import commonjs from "@rollup/plugin-commonjs";
import importCss from 'rollup-plugin-import-css';

const require = createRequire(import.meta.url);
const packageJson = require("./package.json");

export default [
    {
        input: "src/bundle.ts",
        output: [
            {
                file: packageJson.module,
                format: "esm",
                sourcemap: true
            },
        ],
        plugins: [
            del({ targets: ['dist/*', 'build/*']}),
            peerDepsExternal(),
            resolve(),
            commonjs(),
            typescript({
                tsconfig: "./tsconfig.json",
                sourceMap: true,
                inlineSources: true,
                exclude: [
                    "./src/index.tsx", // react-scripts debug file
                ]
            }),
            importCss({
                output: packageJson.style,
                extract: true,
                minify: true,
            }),
            terser(),
        ],
        external: ["react", "react-dom", "antd", "styled-components"]
    }
];