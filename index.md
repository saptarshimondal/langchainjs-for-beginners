---
layout: home

hero:
  name: "LangChain.js"
  text: "for Beginners"
  tagline: "Build AI-powered applications with JavaScript and TypeScript using a modern, agent-first approach."
  image:
    src: ./docs/images/LangChainjs.png
    alt: LangChain.js Course
  actions:
    - theme: brand
      text: Get Started (Chapter 00)
      link: /00-course-setup/README
    - theme: alt
      text: Browse All Chapters
      link: /#course-chapters
    - theme: alt
      text: Course Glossary
      link: /GLOSSARY

features:
  - icon: 🤖
    title: Conversational AI
    details: Build context-aware chatbots with streaming responses, memory, and error handling using LangChain.js chat models.
  - icon: 🛠️
    title: Function Calling & Tools
    details: Teach LLMs to execute real code and extract structured data using type-safe Zod schemas.
  - icon: 🚀
    title: Autonomous Agents
    details: Build ReAct agents that autonomously reason, select tools, and execute multi-step workflows.
  - icon: 🌐
    title: Model Context Protocol (MCP)
    details: Connect AI applications to external services using the open MCP standard with stdio and HTTP transports.
  - icon: 🔍
    title: Documents & Semantic Search
    details: Load documents, create vector embeddings, and search by meaning rather than simple keywords.
  - icon: 🎯
    title: Agentic RAG Systems
    details: Build intelligent Q&A systems where agents autonomously decide when retrieval is necessary.
---

<a id="course-chapters"></a>

## 📚 Course Chapters

This course follows an **agent-first progression** (Tools → Agents → Documents → Agentic RAG), mirroring how modern production AI systems are built.

| # | Chapter | Description | Key Concepts |
|---|---|---|---|
| **00** | [Course Setup](/00-course-setup/README) | Set up your local or cloud development environment | Node.js, Google Gemini, environment variables |
| **01** | [Introduction to LangChain.js](/01-introduction/README) | Understanding the framework and core concepts | LangChain fundamentals, first model invocation |
| **02** | [Chat Models & Interactions](/02-chat-models/README) | Chat models, messages, and multi-turn conversations | Message types, streaming, error handling, temperature |
| **03** | [Prompts, Messages & Outputs](/03-prompts-messages-outputs/README) | Working with prompt templates and type-safe structured outputs | Templates, Zod schemas, structured outputs |
| **04** | [Function Calling & Tools](/04-function-calling-tools/README) | Extending AI capabilities with tools and schemas | Zod schemas, tool binding, type safety |
| **05** | [Autonomous Agents](/05-agents/README) | Building agents that reason and choose tools | ReAct pattern, agent loops, middleware |
| **06** | [Model Context Protocol (MCP)](/06-mcp/README) | Connect AI to external services via the MCP standard | MCP servers, stdio/HTTP transports, tool integration |
| **07** | [Documents, Embeddings & Search](/07-documents-embeddings-semantic-search/README) | Loading documents and building semantic search | Document loading, chunking, embeddings, vector search |
| **08** | [Building Agentic RAG Systems](/08-agentic-rag-systems/README) | Systems where agents decide when to retrieve data | Agentic RAG, retrieval tools, intelligent Q&A |

---

## 🎯 Hands-On Coding

Each chapter includes:
* 📖 **In-depth guide** with real-world analogies
* 💻 **Runnable TypeScript code examples** in `code/`
* 🎯 **Hands-on assignment challenges** in `assignment.md` with complete solutions in `solution/`
* 🔑 **Key takeaways** and best practices
