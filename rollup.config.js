import { createRequire } from "module";
import { terser } from "rollup-plugin-minification";
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import del from "rollup-plugin-delete";
import commonjs from "@rollup/plugin-commonjs";
import importCss from 'rollup-plugin-import-css';
import jscc from 'rollup-plugin-jscc';

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
            del({
                targets: ['dist/*', 'build/*']
            }),
            //jscc({values: { _BUILDLIB: 1 }}),
            peerDepsExternal(),
            resolve(),
            commonjs(),
            //sourcemaps(),
            typescript({ tsconfig: "./tsconfig.json" }),
            importCss({
                extract: true,
                minify: true
            }),
            terser(),
        ],
        external: ["react", "react-dom", "antd", "styled-components"]
    },
];