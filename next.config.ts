import { createHash } from "crypto";
import os from "os";
import path from "path";
import type { NextConfig } from "next";

/**
 * Next 16 dev fails to persist `.next/dev` when the project path contains spaces.
 * Putting build output under os.tmpdir() avoids that. See package.json "dev" script.
 */
const distDir = path.join(
  os.tmpdir(),
  `nicethings-next-${createHash("sha256").update(process.cwd()).digest("hex").slice(0, 12)}`,
);

const nextConfig: NextConfig = {
  distDir,
};

export default nextConfig;
