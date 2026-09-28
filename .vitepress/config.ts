import { defineConfig } from 'vitepress';
import { withMermaid } from 'vitepress-plugin-mermaid';
import path from 'path';
import fs from 'fs';

// Determine base URL: use GitHub Pages repo subpath in CI, or '/' locally
const base = process.env.GITHUB_ACTIONS ? '/langchainjs-for-beginners/' : '/';

export default withMermaid(
  defineConfig({
  title: 'LangChain.js for Beginners',
  description: 'A beginner-friendly course for learning LangChain.js - Build AI-powered applications with JavaScript and TypeScript',
  base,
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,

  vite: {
    optimizeDeps: {
      include: ['mermaid', 'fastdom', 'fastdom-promised']
    },
    plugins: [
      {
        name: 'resolve-relative-images',
        enforce: 'pre',
        resolveId(source, importer) {
          if (importer) {
            if (source.startsWith('images/')) {
              const target = path.resolve(path.dirname(importer), source);
              if (fs.existsSync(target)) {
                return target;
              }
            }
            if (source.startsWith('docs/images/')) {
              const target = path.resolve(process.cwd(), source);
              if (fs.existsSync(target)) {
                return target;
              }
            }
          }
          return null;
        },
      },
    ],
  },

  srcExclude: [
    'README.md',
    'AGENTS.md',
    '**/node_modules/**',
    '**/scripts/**',
    '**/data/**',
    '**/dist/**',
    '**/.devcontainer/**',
    '**/.github/**',
    '**/.vscode/**',
    'practice.ts',
  ],

  themeConfig: {
    logo: '/docs/images/LangChainjs.png',
    siteTitle: 'LangChain.js Course',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Start Course', link: '/00-course-setup/README' },
      {
        text: 'Chapters',
        items: [
          { text: '00 - Setup', link: '/00-course-setup/README' },
          { text: '01 - Introduction', link: '/01-introduction/README' },
          { text: '02 - Chat Models', link: '/02-chat-models/README' },
          { text: '03 - Prompts & Outputs', link: '/03-prompts-messages-outputs/README' },
          { text: '04 - Function Calling & Tools', link: '/04-function-calling-tools/README' },
          { text: '05 - Autonomous Agents', link: '/05-agents/README' },
          { text: '06 - Model Context Protocol', link: '/06-mcp/README' },
          { text: '07 - Embeddings & Search', link: '/07-documents-embeddings-semantic-search/README' },
          { text: '08 - Agentic RAG Systems', link: '/08-agentic-rag-systems/README' },
        ],
      },
      { text: 'Glossary', link: '/GLOSSARY' },
    ],

    sidebar: [
      {
        text: 'Getting Started',
        collapsed: false,
        items: [
          { text: '00. Course Setup', link: '/00-course-setup/README' },
          {
            text: '01. Introduction',
            collapsed: true,
            items: [
              { text: 'Guide', link: '/01-introduction/README' },
              { text: 'Assignment', link: '/01-introduction/assignment' },
            ],
          },
        ],
      },
      {
        text: 'Core Mechanics',
        collapsed: false,
        items: [
          {
            text: '02. Chat Models & Interactions',
            collapsed: true,
            items: [
              { text: 'Guide', link: '/02-chat-models/README' },
              { text: 'Assignment', link: '/02-chat-models/assignment' },
            ],
          },
          {
            text: '03. Prompts & Structured Outputs',
            collapsed: true,
            items: [
              { text: 'Guide', link: '/03-prompts-messages-outputs/README' },
              { text: 'Assignment', link: '/03-prompts-messages-outputs/assignment' },
            ],
          },
        ],
      },
      {
        text: 'The Agent-First Core',
        collapsed: false,
        items: [
          {
            text: '04. Function Calling & Tools',
            collapsed: true,
            items: [
              { text: 'Guide', link: '/04-function-calling-tools/README' },
              { text: 'Assignment', link: '/04-function-calling-tools/assignment' },
            ],
          },
          {
            text: '05. Autonomous Agents',
            collapsed: true,
            items: [
              { text: 'Guide', link: '/05-agents/README' },
              { text: 'Assignment', link: '/05-agents/assignment' },
            ],
          },
          {
            text: '06. Model Context Protocol (MCP)',
            collapsed: true,
            items: [
              { text: 'Guide', link: '/06-mcp/README' },
              { text: 'Assignment', link: '/06-mcp/assignment' },
            ],
          },
        ],
      },
      {
        text: 'Retrieval & Agentic RAG',
        collapsed: false,
        items: [
          {
            text: '07. Embeddings & Semantic Search',
            collapsed: true,
            items: [
              { text: 'Guide', link: '/07-documents-embeddings-semantic-search/README' },
              { text: 'Assignment', link: '/07-documents-embeddings-semantic-search/assignment' },
            ],
          },
          {
            text: '08. Building Agentic RAG Systems',
            collapsed: true,
            items: [
              { text: 'Guide', link: '/08-agentic-rag-systems/README' },
              { text: 'Assignment', link: '/08-agentic-rag-systems/assignment' },
            ],
          },
        ],
      },
      {
        text: 'Reference & Guides',
        collapsed: false,
        items: [
          { text: 'Course Glossary', link: '/GLOSSARY' },
          { text: 'GitHub Copilot Guide', link: '/docs/copilot' },
        ],
      },
    ],

    search: {
      provider: 'local',
      options: {
        detailedView: true,
      },
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/saptarshimondal/langchainjs-for-beginners' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © Dan Wahlin & Microsoft',
    },
  },
})
);
