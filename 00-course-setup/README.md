# Course Setup

Welcome! Before we dive into building AI applications with LangChain.js, let's get your development environment ready. This chapter walks you through installing Node.js, setting up Microsoft Foundry for AI model access, and configuring your project environment. By the end, you'll have everything you need to start building with LangChain.js.

## Prerequisites

- A GitHub account (free)
- An Azure subscription (for Microsoft Foundry)
- Basic command line knowledge
- Text editor or IDE

## 📋 What You'll Set Up

1. Node.js and npm
2. Microsoft Foundry project, models, and API credentials
3. Project dependencies
4. Environment variables
5. VS Code (recommended IDE)

---

## 📖 The Workshop Analogy

**Just like setting up a workshop before building furniture, you need to prepare your development environment before building AI applications.**

You'll install Node.js, get access to AI models, and configure your tools. This ensures you have a solid foundation and smooth development experience. Let's get your workshop ready—it takes just 15 minutes!

## Setup Options

Choose from one of the following options to set up your development environment:

1. **GitHub Codespaces**: Use a cloud-based development environment.
2. **Local Development**: Set up your environment on your machine.

After Codespaces or local setup, continue with **Microsoft Foundry**, `.env` configuration, and the setup test. Those steps are required for both options.

---

## GitHub Codespaces

If you prefer not to set up your local environment, you can use **GitHub Codespaces** which is a cloud-based development environment that runs in your browser.

1. **Create a Codespace**: Open the [langchainjs-for-beginners](https://github.com/microsoft/langchainjs-for-beginners) on GitHub and click on the green "Code" button. Select "Open with Codespaces" and "New codespace".
2. **Wait for Initialization**: It will take a few moments to set up your environment.
3. **Access the Terminal**: Once ready, open the terminal in Codespaces (Terminal > New Terminal).
4. **Continue below**: Skip the local Node.js and clone steps. Go to [Set Up Microsoft Foundry](#set-up-microsoft-foundry), then configure `.env` and run the setup test.

---

## Local Development

### Step 1: Install Node.js

You'll need **Node.js LTS (Long Term Support)** to run LangChain.js applications.

#### Check if Node.js is installed:

```bash
node --version
```

If you see an LTS version number (visit [nodejs.org](https://nodejs.org/en/download) to check), you're good! Skip to Step 2.

#### Install Node.js:

1. Visit [nodejs.org](https://nodejs.org/)
2. Follow the install instructions for your operating system
3. Verify installation:

```bash
node --version  # Displays LTS version
npm --version # Displays npm version
```

**Why LTS?** Stable, production-ready, and receives security updates.

---

### Step 2: Clone the Repository

```bash
# Clone the course repository
git clone https://github.com/microsoft/langchainjs-for-beginners

# Navigate to the project
cd langchainjs-for-beginners

# Install dependencies
npm install

# Install tsx globally
npm install -g tsx
```

This will install all required packages including:
- `@langchain/openai` - OpenAI-compatible model integration (used in all chapters)
- `@langchain/core` - Core LangChain functionality
- `langchain` - Main LangChain package with additional utilities
- `dotenv` - Environment variable management for API keys

#### Why install tsx globally?

**tsx** lets you run `.ts` files directly without compiling first.

**Comparison**:
```bash
# Without tsx: compile then run
tsc myfile.ts && node myfile.js

# With tsx: run directly
tsx myfile.ts
```

**Benefits**: Faster development, simpler workflow, no build step needed. Throughout this course, you'll run examples using `tsx filename.ts`.

---

## Set Up Gemini API

This course uses **Google Gemini** for AI models. Since LangChain's OpenAI client supports Gemini via an OpenAI compatibility layer, we can seamlessly use Gemini without needing to rewrite any examples.

### Get Your API Key

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click **Get API key** in the left navigation menu
4. Click **Create API key**
5. Copy the generated API key and save it securely

### Why Gemini?

- ✅ **Free Tier Available**: Generous free tier for developers in most regions
- ✅ **OpenAI Compatibility**: Works seamlessly with LangChain's OpenAI integrations
- ✅ **Powerful Models**: Access to Gemini 3.8 Flash for fast, capable responses

---

## Configure Environment Variables

#### Create `.env` file:

**Mac, Linux, WSL on Windows, or GitHub Codespaces:**

```bash
cp .env.example .env
```

**Windows Command Prompt:**

```bash
# Windows Command Prompt
copy .env.example .env

# Windows PowerShell
Copy-Item .env.example .env
```

#### Edit `.env` file:

Open `.env` in your text editor and add your Gemini credentials. Since we are using Gemini's OpenAI compatibility layer, configure it as follows:

```bash
AI_API_KEY=your_gemini_api_key_here
AI_ENDPOINT=https://generativelanguage.googleapis.com/v1beta/openai/
AI_MODEL=gemini-3.8-flash
AI_EMBEDDING_MODEL=gemini-embedding-2
```

**Replace the API key with your own from Google AI Studio ([aistudio.google.com](https://aistudio.google.com/)).**

---

## Test Your Setup

Let's verify everything works!

#### Run the test:

Run the following command in your terminal from the root of the project:

```bash
tsx scripts/test-setup.ts
```

#### Expected output:

```
🚀 Testing AI provider connection...

✅ SUCCESS! Your AI provider is working!
   Provider: https://your-resource.openai.azure.com/openai/v1
   Model: gpt-5-mini

Model response: Setup successful!

🎉 You're ready to start the course!
```

If you see this, you're all set! If not, check the [troubleshooting](#troubleshooting) section below.

---

## Install VS Code (Recommended)

While you can use any text editor, we recommend **Visual Studio Code** for the best experience. Skip this step if you are using GitHub Codespaces.

#### Install VS Code:

1. Visit [code.visualstudio.com](https://code.visualstudio.com/)
2. Download for your OS
3. Install and launch VS Code

## ✅ Setup Checklist

Before starting the course, make sure you have:

- [ ] Node.js LTS installed (local development) or a Codespace ready
- [ ] Project cloned and dependencies installed (`npm install`) if working locally
- [ ] tsx installed globally (`npm install -g tsx`) if working locally
- [ ] Microsoft Foundry project created with `gpt-5-mini`, `gpt-5`, and `text-embedding-3-small` deployed
- [ ] `.env` file configured with your Microsoft Foundry API key, endpoint, and model names
- [ ] Test script runs successfully
- [ ] VS Code installed (optional but recommended for local development)

---

## 🎯 What's Next?

You're all set! Time to build your first AI application.

**👉 Continue to [Introduction to LangChain.js](../01-introduction/README.md)**

---

## 📚 Additional Resources

- [Microsoft Foundry Documentation](https://learn.microsoft.com/azure/ai-foundry/)
- [Node.js Documentation](https://nodejs.org/docs/latest/api/)
- [Environment Variables Best Practices](https://www.npmjs.com/package/dotenv)

---

## 🗺️ Navigation

[Back to Main](../README.md) | [Next: Introduction to LangChain.js →](../01-introduction/README.md)

---

## 🐛 Troubleshooting

### Issue: "Cannot find module '@langchain/openai'"

**Solution**: Run `npm install` in the project directory

### Issue: "AI_API_KEY not found" or "AI_ENDPOINT not found"

**Solutions**:
1. Make sure `.env` file exists in the project root
2. Check that `.env` contains all required variables:
   - `AI_API_KEY=your_key`
   - `AI_ENDPOINT=your_endpoint_url`
   - `AI_MODEL=gpt-5-mini`
   - `AI_EMBEDDING_MODEL=text-embedding-3-small`
3. No quotes needed around the values
4. No spaces before or after the `=`

### Issue: "401 Unauthorized" or "Invalid API key"

**Solutions**:
1. Copy a fresh API key from your Microsoft Foundry project
2. Make sure you copied the entire key
3. Confirm `AI_ENDPOINT` includes `/openai/v1` at the end
4. Check for extra spaces in the `.env` file

### Issue: Rate limit errors

**Solution**: Microsoft Foundry deployments have rate limits. If you hit them:
- Wait a few minutes and retry
- Check your deployment quota in the Microsoft Foundry portal
- Use `gpt-5-mini` for most examples to stay within limits

---

## 💬 Questions?

If you get stuck or have any questions about building AI apps, join:

[![Microsoft Foundry Discord](https://img.shields.io/badge/Discord-Microsoft_Foundry_Community_Discord-blue?style=for-the-badge&logo=discord&color=5865f2&logoColor=fff)](https://aka.ms/foundry/discord)

If you have product feedback or errors while building visit:

[![Microsoft Foundry Developer Forum](https://img.shields.io/badge/GitHub-Microsoft_Foundry_Developer_Forum-blue?style=for-the-badge&logo=github&color=000000&logoColor=fff)](https://aka.ms/foundry/forum)

If you run into issues with the course materials, please open an issue in the GitHub repo:

[![Course Issues](https://img.shields.io/badge/GitHub-LangChain.js_for_Beginners_Issues-blue?style=for-the-badge&logo=github&color=green&logoColor=fff)](https://github.com/microsoft/langchainjs-for-beginners/issues)
