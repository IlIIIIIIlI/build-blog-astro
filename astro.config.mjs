import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node";

import vercel from "@astrojs/vercel/serverless";

export default defineConfig({
  output: "server",
  adapter: vercel({
    functionPerRoute: true,
    maxDuration: 60,
    runtime: "nodejs18.x",
  }),
  site: "https://example.com",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es", "zh"],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  integrations: [
    mdx({
      syntaxHighlight: "shiki",
      shikiConfig: { theme: "dracula" },
      remarkPlugins: [],
      rehypePlugins: [],
      remarkRehype: {
        footnoteLabel: "Footnotes",
        footnoteBackLabel: "Back to content",
      },
      gfm: true,
    }),
    sitemap(),
    tailwind(),
  ],
  markdown: {
    shikiConfig: {
      theme: "dracula",
      wrap: true,
    },
  },
});
