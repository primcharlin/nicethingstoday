import { createHash } from "crypto";
import os from "os";
import path from "path";
import type { NextConfig } from "next";

/**
 * Next 16 dev fails to persist `.next/dev` when the project path contains spaces.
 * Putting build output under os.tmpdir() avoids that during local development,
 * but production builds must keep the default `.next` output for Vercel.
 */
const useTempDistDir =
  process.env.NODE_ENV === "development" &&
  !process.env.VERCEL &&
  process.cwd().includes(" ");

const nextConfig: NextConfig = {
  ...(useTempDistDir
    ? {
        distDir: path.join(
          os.tmpdir(),
          `nicethings-next-${createHash("sha256").update(process.cwd()).digest("hex").slice(0, 12)}`,
        ),
      }
    : {}),
};

export default nextConfig;
