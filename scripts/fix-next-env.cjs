/**
 * Next can emit a broken `import ".//absolute/path/...routes.d.ts"` when distDir
 * is outside the project. Strip that line so TypeScript stays valid.
 */
const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "next-env.d.ts");
if (!fs.existsSync(file)) process.exit(0);

let s = fs.readFileSync(file, "utf8");
const next = s.replace(/^import "\.\/\/.*routes\.d\.ts";\s*\r?\n/m, "");
if (next !== s) fs.writeFileSync(file, next);
