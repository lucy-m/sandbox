import typescript from "@rollup/plugin-typescript";

/** @type {import('rollup').RollupOptions} */
const options = {
  input: "src/index.ts",
  output: {
    dir: "dist",
  },
  plugins: [typescript()],
};

export default options;
