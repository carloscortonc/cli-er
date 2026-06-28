import { defineConfig } from "vitepress";

export default defineConfig({
  title: "cli-er",
  description: "Tool for building advanced type-safe CLI Applications",
  base: "/cli-er/docs/",
  srcDir: "./docs",
  outDir: "./docs-dist",
  cleanUrls: true,

  themeConfig: {
    siteTitle: "cli-er",

    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "Reference", link: "/reference/api" },
      { text: "Examples", link: "/examples/" },
      { text: "Playground", link: "https://carloscortonc.github.io/cli-er/", target: "_blank" },
    ],

    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "Getting Started", link: "/guide/getting-started" },
          { text: "Definition", link: "/guide/definition" },
          { text: "Features", link: "/guide/features" },
        ],
      },
      {
        text: "Reference",
        items: [
          { text: "API", link: "/reference/api" },
          { text: "CLI Options", link: "/reference/cli-options" },
        ],
      },
      {
        text: "Examples",
        link: "/examples/",
        items: [
          { text: "Basic (config)", link: "/examples/basic" },
          { text: "Docker", link: "/examples/docker" },
          { text: "Webpack CLI", link: "/examples/webpack-cli" },
          { text: "TypeScript CLI", link: "/examples/ts-cli" },
          { text: "Hooks", link: "/examples/hooks" },
          { text: "Plugins", link: "/examples/plugin" },
          { text: "Intl", link: "/examples/intl-cli" },
          { text: "Bash Completion", link: "/examples/bash-completion" },
          { text: "Debug Logger", link: "/examples/debug-logger" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/carloscortonc/cli-er" }],

    editLink: {
      pattern: "https://github.com/carloscortonc/cli-er/edit/develop/docs/:path",
      text: "Edit this page on GitHub",
    },

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © Carlos Cortón Cobas",
    },

    search: {
      provider: "local",
    },
  },
});
