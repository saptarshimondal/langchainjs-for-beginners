# Function Calling & Tools

In this chapter, you'll learn how to extend AI capabilities beyond text generation by enabling function calling and tools. You'll discover how LLMs can invoke functions with structured arguments, create type-safe tools using Zod schemas, and build systems where AI can trigger real-world actions like API calls, database queries, or calculations.

**This is a foundational chapter for building AI agents.** Tools are the building blocks that give agents their capabilities—without tools, agents are just text generators. In [Getting Started with Agents](../05-agents/README.md), you'll see how agents use the tools you create here to autonomously make decisions and solve multi-step problems.

## Prerequisites

- Completed [Prompts, Messages, and Structured Outputs](../03-prompts-messages-outputs/README.md)

## 🎯 Learning Objectives

By the end of this chapter, you'll be able to:

- ✅ Understand what function calling is and why it matters
- ✅ Create tools with Zod schemas for type safety
- ✅ Bind tools to chat models
- ✅ Invoke tools and handle responses
- ✅ Build systems with multiple tools
- ✅ Apply best practices for tool design

---

## 📌 About the Code Examples

The code snippets in this README are simplified for clarity. The actual code files in `code/` and `solution/` folders include:

- ✨ **Enhanced error handling** with comprehensive try-catch blocks
- 🎨 **Detailed console output** with step-by-step explanations and formatting
- 🔒 **Security best practices** including input sanitization and validation
- 💡 **Educational comments** explaining the three-step execution pattern
- 📊 **Additional examples** demonstrating edge cases and best practices

When you run the files, expect more detailed output and additional safeguards than shown in the simplified snippets below.

---

## 📖 The Restaurant Staff Analogy

**Imagine you're a restaurant manager coordinating your team.**

When a customer orders "I'd like the daily special with no onions, a side salad, and sparkling water," you don't do everything yourself. Instead:

1. **You understand the request** (what they want)
2. **You delegate to specialists**:
   - 👨‍🍳 Chef: "Make the daily special, no onions" (function: prepareMeal)
   - 🥗 Salad station: "Prepare a side salad" (function: makeSalad)
   - 🍷 Bar: "Serve sparkling water" (function: serveBeverage)
3. **Each specialist confirms** what they're doing
4. **You coordinate the response** back to the customer

**Function calling in AI works exactly the same way!**

The LLM:
- **Understands** the user's request
- **Generates structured function calls** with proper arguments
- **Returns** the function details (but doesn't execute them)
- **Processes** the function results to form a response

The key: The LLM doesn't *do* the actions itself. Instead, it *describes* which functions to call and with what parameters. Your code executes them.

<img src="images/restaurant-staff-analogy.png" alt="Restaurant Staff Analogy" width="800"/>

*Function calling works like a restaurant manager delegating to specialists - LLM generates function calls, your code executes them*

---

## 🎯 What is Function Calling?

[Function calling](../GLOSSARY.md#function-calling) transforms LLMs from text generators into action coordinators. Instead of just producing text, LLMs can trigger real-world operations—checking weather, querying databases, calling APIs, and more.

### The Paradigm Shift

**Before**: LLMs could only generate text. "What's the weather in Seattle?" → "I cannot access real-time weather data..."

**After**: LLMs can request external operations. "What's the weather in Seattle?" → LLM generates `{ function: "getWeather", args: { city: "Seattle" } }`, your code executes it, LLM responds "It's currently 62°F and cloudy in Seattle."

### Understanding the Execution Model

**Critical concept: The LLM never executes functions directly.** Here's what actually happens:

**1. LLM's Role (Planning)**:
- Analyzes user request
- Determines which function(s) to call
- Generates structured function calls with arguments
- Returns this as JSON (doesn't execute anything)

**2. Your Code's Role (Doing)**:
- Receives function call descriptions
- Actually executes the functions
- Gets real results (API calls, calculations, etc.)
- Sends results back to LLM

**3. LLM's Role Again (Communicating)**:
- Incorporates function results into natural response
- Returns helpful answer to user

### Why This Separation Matters

**Security & Control**: Your code decides what functions exist and controls execution. You can reject dangerous operations.

<img src="images/execution-flow.png" alt="Function Calling Execution Flow" width="800"/>

*The 3-step execution model: LLM plans (generates calls), your code executes (does the work), LLM responds (natural language)*

**Example Flow**: "What's the weather in Tokyo and Paris?"
```typescript
// 1. LLM generates (doesn't execute):
{ tool_calls: [
  { name: "getWeather", args: { city: "Tokyo" } },
  { name: "getWeather", args: { city: "Paris" } }
]}

// 2. Your code executes:
const tokyo = await getWeather("Tokyo");   // → "24°C, sunny"
const paris = await getWeather("Paris");   // → "18°C, rainy"

// 3. LLM responds:
"Tokyo is 24°C and sunny. Paris is 18°C and rainy."
```

### Key Characteristics

- ✅ LLM generates function calls (describes what to do)
- ✅ Your code executes functions (does the actual work)
- ✅ You maintain control over security and validation
- ✅ LLM handles reasoning about when to use functions

---

## 🛠️ Creating Tools with Zod

In LangChain.js, [tools](../GLOSSARY.md#tool) are created using the `tool()` function with Zod schemas for type safety.

If you're new to Zod, it's a TypeScript-first schema validation library that lets you define the shape and constraints of your data. Think of it as a way to describe what valid input looks like—for example, "this parameter must be a string" or "this number must be between 1 and 100." Zod validates data at runtime and provides excellent TypeScript type inference, making your code both safer and more maintainable. [Learn more about Zod](https://zod.dev/).

**You want to give your AI real-time calculator capabilities.** Without tools, the AI can only guess at calculations or say "I can't do math." With a calculator tool, the AI can recognize when a calculation is needed and request execution of the actual computation.

### Example 1: Simple Calculator Tool

Let's see how to create a tool using the `tool()` function with a Zod `schema` for type-safe parameters.

**Key code you'll work with:**

```typescript
// Define calculator tool with tool() function
const calculatorTool = tool(
  async (input) => {
    const result = evaluate(input.expression);  // Execute math safely
    return `The result is: ${result}`;
  },
  {
    name: "calculator",  // How LLM refers to this tool
    description: "Useful for performing mathematical calculations...",  // Helps LLM decide when to use it
    schema: z.object({  // Zod schema for type-safe parameters
      expression: z.string().describe("The mathematical expression to evaluate, e.g., '25 * 4'"),
    }),
  }
);
```

**Code**: [`code/01-simple-tool.ts`](./code/01-simple-tool.ts)  
**Run**: `tsx 04-function-calling-tools/code/01-simple-tool.ts`

**Example code:**

```typescript
import { tool } from "langchain";
import * as z from "zod";
import { evaluate } from "mathjs";
import "dotenv/config";

// Define calculator tool
const calculatorTool = tool(
  async (input) => {
    // Use mathjs to safely evaluate mathematical expressions
    // mathjs is safer than Function() or eval() as it restricts execution to math operations
    try {
      const result = evaluate(input.expression);
      return `The result is: ${result}`;
    } catch (error) {
      return `Error evaluating expression: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
  {
    name: "calculator",
    description: "Useful for performing mathematical calculations. Use this when you need to compute numbers.",
    schema: z.object({
      expression: z.string().describe("The mathematical expression to evaluate, e.g., '25 * 4'"),
    }),
  }
);

console.log("Tool created:", calculatorTool.name);
console.log("Schema:", calculatorTool.schema);
```

> **🤖 Try with [GitHub Copilot](../docs/copilot.md) Chat:** Want to explore this code further? Open this file in your editor and ask Copilot:
> - "Why do we need to sanitize the input expression before evaluating it?"
> - "How does the Zod schema help with type safety in this calculator tool?"

### Expected Output

When you run this example with `tsx 04-function-calling-tools/code/01-simple-tool.ts`, you'll see:

```
Tool created: calculator
Schema: ZodObject {
  shape: {
    expression: ZodString { ... }
  }
}
```

### How It Works

**What's happening**:
1. **Define the tool implementation**: The async function that performs the calculation
2. **Execute calculation**: Use the mathjs library's `evaluate()` function to safely compute mathematical expressions
3. **Return result**: String describing the result

> **Security Note**: The code examples use the `mathjs` library's `evaluate()` function instead of JavaScript's `Function()` constructor or `eval()`. The mathjs `evaluate()` function is specifically designed for mathematical expressions and provides better security by restricting execution to math operations only, preventing arbitrary code execution.

**Key Components**:
- **Implementation function**: What the tool actually does (`async (input) => {...}`)
- **Name**: How the LLM refers to the tool (`"calculator"`)
- **Description**: Helps the LLM decide when to use it (tells AI this is for math)
- **Schema**: Zod object defining parameters (`z.object({ expression: z.string() })`)

**Important**: At this stage, we've only *created* the tool. We haven't connected it to an LLM yet - that comes in Example 2!

---

## 🔗 Binding Tools to Models

Use `bindTools()` to make tools available to the LLM.

**You've created a calculator tool, but how does the AI know it exists?** The tool sits in your code, disconnected from the AI. You need to tell the AI "here are the tools you can use" and let the AI decide when to call them. That's where `.bindTools()` comes in—it connects tools to the model so the AI can intelligently choose when to use them.

<img src="images/tool-binding.png" alt="Tool Binding" width="800"/>

*bindTools() connects your tools to the model, making them available for the LLM to use*

### Example 2: Binding and Invoking Tools

Let's see how to use `.bindTools()` to make tools available and observe how the AI generates structured `tool_calls`.

> [!NOTE]
> For function calling and tool execution with Google Gemini (including thinking models), use **`ChatGoogleGenerativeAI`** from `@langchain/google-genai` rather than the OpenAI compatibility layer, ensuring native and reliable tool call schemas.

**Key code you'll work with:**

```typescript
// Create model and bind tools to it
const model = new ChatGoogleGenerativeAI({
  model: process.env.AI_MODEL!,
  apiKey: process.env.AI_API_KEY,
  temperature: 0,
});

const modelWithTools = model.bindTools([calculatorTool]);  // Make tool available to LLM

// LLM generates tool call (doesn't execute!)
const response = await modelWithTools.invoke("What is 25 * 17?");
console.log(response.tool_calls);  // [{name: "calculator", args: {expression: "25 * 17"}}]
```

**Code**: [`code/02-tool-calling.ts`](./code/02-tool-calling.ts)  
**Run**: `tsx 04-function-calling-tools/code/02-tool-calling.ts`

**Example code:**

```typescript
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tool } from "langchain";
import * as z from "zod";
import { evaluate } from "mathjs";
import "dotenv/config";

const calculatorTool = tool(
  async (input) => {
    // Use mathjs for safe mathematical evaluation
    const result = evaluate(input.expression);
    return `${result}`;
  },
  {
    name: "calculator",
    description: "Perform mathematical calculations",
    schema: z.object({
      expression: z.string().describe("Math expression to evaluate"),
    }),
  }
);

// Create model and bind tools
const model = new ChatGoogleGenerativeAI({
  model: process.env.AI_MODEL!,
  apiKey: process.env.AI_API_KEY,
  temperature: 0,
});

const modelWithTools = model.bindTools([calculatorTool]);

// Invoke with a question
const response = await modelWithTools.invoke("What is 25 * 17?");

console.log("Response:", response);
console.log("\nTool calls:", response.tool_calls);

// The LLM returns structured tool calls:
// {
//   "name": "calculator",
//   "args": {
//       "expression": "25 * 17"
//   },
//   "type": "tool_call",
//   "id": "call_abc123"
// }
```

> **🤖 Try with [GitHub Copilot](../docs/copilot.md) Chat:** Want to explore this code further? Open this file in your editor and ask Copilot:
> - "What's in the response.tool_calls array and how does it differ from response.content?"
> - "Why does the LLM return structured tool calls instead of executing the function?"

### Expected Output

When you run this example with `tsx 04-function-calling-tools/code/02-tool-calling.ts`, you'll see:

```
🤖 Asking: What is 25 * 17?

Response content: 

Tool calls: [
  {
    "name": "calculator",
    "args": {
      "expression": "25 * 17"
    },
    "type": "tool_call",
    "id": "call_6lyhZzefMJnbOXvplEFsuSsY"
  }
]
```

### How It Works

**What Happens**:
1. **LLM sees the tool description**: When we bind the calculator tool, the LLM learns about it
2. **LLM analyzes the query**: "What is 25 * 17?" → This needs the calculator tool
3. **LLM generates a tool call**: Returns structured data with tool name, arguments, and ID
4. **Your code receives the tool call**: `response.tool_calls[0]` contains the structured call
5. **Next step** (not shown here): You execute the tool with those arguments

**Important**: The LLM doesn't actually calculate anything! It only *describes* which tool to call and with what arguments. Your code must execute the tool (see Example 3).

> **💡 Tip: Model Profiles (Beta)** - Not all models support tool calling. Before binding tools, you can check a model's capabilities using the `.profile` getter (note: this feature is in beta and subject to change):
>
> ```typescript
> const model = new ChatGoogleGenerativeAI({ /* config */ });
>
> // Check what the model supports before binding tools
> if (model.profile.toolCalling) {
>   const modelWithTools = model.bindTools([calculatorTool]);
>   // Use the model with tools...
> } else {
>   // Fall back to a different approach or model
>   console.log("This model doesn't support tool calling");
> }
> ```
>
> The profile includes capabilities like `toolCalling`, `structuredOutput`, `imageInputs`, and more. This can be useful when your application needs to work with different models that may have varying capabilities. [Learn more about Model Profiles](https://docs.langchain.com/oss/javascript/langchain/models#model-profiles).

---

## 🔄 Handling Tool Execution

### Example 3: Complete Tool Call Loop

In this example, you'll see the complete flow: LLM generates tool call, your code executes the tool, and results return to LLM for the final response.

<img src="images/tool-call-loop.png" alt="Complete Tool Call Loop" width="800"/>

*The complete cycle: user request → LLM generates call → code executes → result sent back → LLM responds*

**Key code you'll work with:**

```typescript
// Step 1: LLM generates tool call (Planning)
const response1 = await modelWithTools.invoke([new HumanMessage(query)]);
const toolCall = response1.tool_calls[0];  // {name: "getWeather", args: {city: "Seattle"}}

// Step 2: YOUR code executes the tool (Doing)
const toolResult = await weatherTool.invoke(weatherTool.schema.parse(toolCall.args));

// Step 3: Send result back to LLM (Communicating)
const messages = [
  new HumanMessage(query),
  new AIMessage({ content: response1.content, tool_calls: response1.tool_calls }),
  new ToolMessage({ content: String(toolResult), tool_call_id: toolCall.id }),
];
const finalResponse = await model.invoke(messages);  // "The current temperature in Seattle is 62°F..."
```

**Code**: [`code/03-tool-execution.ts`](./code/03-tool-execution.ts)  
**Run**: `tsx 04-function-calling-tools/code/03-tool-execution.ts`

**Example code:**

```typescript
const weatherTool = tool(
  async (input) => {
    // Simulate API call
    const temps = { Seattle: 62, Paris: 18, Tokyo: 24 };
    const temp = temps[input.city] || 72;
    return `Current temperature in ${input.city}: ${temp}°F`;
  },
  {
    name: "getWeather",
    description: "Get current weather for a city",
    schema: z.object({
      city: z.string().describe("City name"),
    }),
  }
);

// Initialize model and bind tools
const model = new ChatGoogleGenerativeAI({
  model: process.env.AI_MODEL!,
  apiKey: process.env.AI_API_KEY,
  temperature: 0,
});

const modelWithTools = model.bindTools([weatherTool]);

// Step 1: Get tool call from LLM
const response1 = await modelWithTools.invoke("What's the weather in Seattle?");
console.log("Tool call:", response1.tool_calls[0]);

// Step 2: Execute the tool
const toolCall = response1.tool_calls[0];
const toolResult = await weatherTool.invoke(weatherTool.schema.parse(toolCall.args));
console.log("Tool result:", toolResult);

// Step 3: Send result back to LLM
const messages = [
  { role: "user", content: "What's the weather in Seattle?" },
  response1, // LLM's tool call
  { role: "tool", content: toolResult, tool_call_id: toolCall.id },
];

const finalResponse = await model.invoke(messages);
console.log("Final answer:", finalResponse.content);
```

> **🤖 Try with [GitHub Copilot](../docs/copilot.md) Chat:** Want to explore this code further? Open this file in your editor and ask Copilot:
> - "Why do we need to send tool results back to the LLM in step 3?"
> - "How would I handle errors that occur during tool execution?"

### Expected Output

When you run this example with `tsx 04-function-calling-tools/code/03-tool-execution.ts`, you'll see:

```
User: What's the weather in Seattle?

Step 1: LLM generates tool call...
  Tool: getWeather
  Args: { city: 'Seattle' }
  ID: call_fuStirimy94aGqS9KM0arXcU

Step 2: Executing tool...
  Result: Current temperature in Seattle: 62°F, partly cloudy

Step 3: Sending result back to LLM...

Final answer: The current temperature in Seattle is 62°F and it's partly cloudy.
```

### How It Works

**The Complete Flow**:
1. **Step 1 - LLM generates tool call**:
   - User asks "What's the weather in Seattle?"
   - LLM decides to use `getWeather` tool with `{ city: "Seattle" }`
2. **Step 2 - Execute the tool**:
   - Your code calls `weatherTool.invoke(weatherTool.schema.parse(toolCall.args))`
   - Tool returns: "Current temperature in Seattle: 62°F"
3. **Step 3 - Send result back to LLM**:
   - Build conversation history: user message + AI tool call + tool result
   - LLM receives the weather data
   - LLM generates natural language response: "The current temperature in Seattle is 62°F and it's partly cloudy."

**Key insight**: This three-step pattern (generate → execute → respond) is the core of function calling!

---

## 🎛️ Multiple Tools

LLMs can choose from multiple tools based on the query.

**You're building an AI assistant that needs different capabilities—math calculations, web searches, and weather lookups.** Instead of creating separate AI instances or complex routing logic, you want one AI that intelligently chooses the right tool for each task. The AI should automatically pick the calculator for "What is 25 * 4?", search for "What's the capital of France?", and weather for "How's the weather in Tokyo?"

### Example 4: Multi-Tool System

Let's see how to bind multiple tools using `.bindTools([tool1, tool2, tool3])` and let the AI choose which one to call.

**Key code you'll work with:**

```typescript
// Bind multiple tools - LLM automatically picks the right one
const modelWithTools = model.bindTools([calculatorTool, searchTool, weatherTool]);

const queries = [
  "What is 125 * 8?",           // LLM chooses: calculatorTool
  "What's the capital of France?", // LLM chooses: searchTool
  "What's the weather in Tokyo?",  // LLM chooses: weatherTool
];

for (const query of queries) {
  const response = await modelWithTools.invoke(query);
  console.log(response.tool_calls[0]?.name);  // Shows which tool LLM selected
}
```

**Code**: [`code/04-multiple-tools.ts`](./code/04-multiple-tools.ts)  
**Run**: `tsx 04-function-calling-tools/code/04-multiple-tools.ts`

**Example code:**

```typescript
const calculatorTool = tool(
  async (input) => {
    // Use mathjs for safe mathematical evaluation
    const result = evaluate(input.expression);
    return String(result);
  },
  {
    name: "calculator",
    description: "Perform mathematical calculations",
    schema: z.object({ expression: z.string() }),
  }
);

const searchTool = tool(
  async (input) => {
    const results: Record<string, string> = {
      "capital of France": "Paris",
      "population of Tokyo": "14 million",
    };
    return results[input.query.toLowerCase()] || "No results found";
  },
  {
    name: "search",
    description: "Search for factual information",
    schema: z.object({ query: z.string() }),
  }
);

const weatherTool = tool(
  async (input) => `Weather in ${input.city}: 72°F, sunny`,
  {
    name: "getWeather",
    description: "Get current weather for a city",
    schema: z.object({ city: z.string() }),
  }
);

// Initialize model with tools
const model = new ChatGoogleGenerativeAI({
  model: process.env.AI_MODEL!,
  apiKey: process.env.AI_API_KEY,
  temperature: 0,
});

const modelWithTools = model.bindTools([calculatorTool, searchTool, weatherTool]);

// The LLM will choose the appropriate tool
const queries = [
  "What is 125 * 8?",
  "What's the capital of France?",
  "What's the weather in Tokyo?",
];

for (const query of queries) {
  const response = await modelWithTools.invoke(query);
  console.log(`\nQuery: ${query}`);
  console.log("Chosen tool:", response.tool_calls[0]?.name);
  console.log("Args:", response.tool_calls[0]?.args);
}
```

> **🤖 Try with [GitHub Copilot](../docs/copilot.md) Chat:** Want to explore this code further? Open this file in your editor and ask Copilot:
> - "How does the LLM decide which tool to use for each query?"
> - "Can I prioritize certain tools over others by adjusting their descriptions?"

### Expected Output

When you run this example with `tsx 04-function-calling-tools/code/04-multiple-tools.ts`, you'll see:

> **⚠️ Note on Tool Calling Behavior:** Tool calling is probabilistic and varies by model. Some models may respond directly for simple queries (like math) instead of calling tools. The weather tool typically calls most consistently. To improve reliability, use more explicit prompts like "Use the calculator tool to compute..." or consider the `tool_choice` parameter.

```
Query: "What is 125 * 8?"
  ℹ️ May respond directly or call calculator tool

Query: "What's the capital of France?"
  ℹ️ May respond directly or call search tool

Query: "What's the weather in Tokyo?"
  ✓ Chose tool: getWeather
  ✓ Args: { city: 'Tokyo' }
```

### How It Works

**What's happening**:
1. **Bind multiple tools**: All three tools (calculator, search, weather) are available to the LLM
2. **LLM reads tool descriptions**:
   - calculator: "Perform mathematical calculations"
   - search: "Search for factual information"
   - getWeather: "Get current weather"
3. **LLM chooses appropriate tool** for each query:
   - Math question → calculator
   - Factual question → search
   - Weather question → getWeather
4. **LLM generates correct arguments** for each tool

**Key insight**: The LLM automatically selects the right tool based on:
- Tool name
- Tool description
- Parameter schema
- The user's question

**Best practice**: Write clear, specific tool descriptions so the LLM can make the right choice!

---

## ✅ Best Practices

### 1. Clear Tool Descriptions

```typescript
// ❌ Poor
description: "Does weather stuff"

// ✅ Good
description: "Get current weather for a specific city. Returns temperature, conditions, and humidity."
```

### 2. Descriptive Parameter Names

```typescript
// ❌ Poor
schema: z.object({
  x: z.string(),
  y: z.number(),
})

// ✅ Good
schema: z.object({
  city: z.string().describe("The city name, e.g., 'Paris' or 'Tokyo'"),
  units: z.enum(["celsius", "fahrenheit"]).describe("Temperature unit to return"),
})
```

### 3. Error Handling

```typescript
const safeTool = tool(
  async (input) => {
    try {
      const result = await dangerousOperation(input);
      return result;
    } catch (error) {
      return `Error: ${error.message}. Please try again with different parameters.`;
    }
  },
  {
    name: "safeTool",
    description: "Performs operation with error handling",
    schema: z.object({ param: z.string() }),
  }
);
```

### 4. Validation

```typescript
const emailTool = tool(
  async (input) => {
    // Zod validates this automatically
    if (!input.email.includes("@")) {
      throw new Error("Invalid email format");
    }
    return `Email sent to ${input.email}`;
  },
  {
    name: "sendEmail",
    description: "Send an email",
    schema: z.object({
      email: z.string().email().describe("Valid email address"),
      subject: z.string().min(1).describe("Email subject"),
      body: z.string().describe("Email body content"),
    }),
  }
);
```

---

## 🌐 Provider Built-in Tools

So far, you've created custom tools using the `tool()` function. But AI providers like OpenAI and Anthropic also offer **built-in tools** that are optimized for their models—no custom implementation required.

### What Are Provider Built-in Tools?

Provider built-in tools are pre-configured capabilities that AI providers offer natively:

| Provider | Built-in Tools |
|----------|---------------|
| **OpenAI** | Web search, file search, code interpreter, image generation |
| **Anthropic** | Web search, web fetch, text editor, computer use |

These tools are managed by the provider and don't require you to implement the execution logic.

### Example: OpenAI Web Search

```typescript
import { ChatOpenAI, tools } from "@langchain/openai";

const model = new ChatOpenAI({ model: "gpt-5-mini" });

// Use OpenAI's built-in web search tool
const response = await model.invoke(
  "What are the latest TypeScript 5.9 features?",
  { tools: [tools.webSearch()] }
);

console.log(response.content);
// Response includes up-to-date information from the web
```

### Example: Anthropic Web Search

```typescript
import { ChatAnthropic, tools } from "@langchain/anthropic";

const model = new ChatAnthropic({ model: "claude-sonnet-4-5-20250929" });

// Use Anthropic's built-in web search tool
const response = await model.invoke(
  "What is the current weather in Seattle?",
  { tools: [tools.webSearch_20250305()] }
);

console.log(response.content);
// Response includes real-time web data with source citations
```

### Custom Tools vs Provider Built-in Tools

| Aspect | Custom Tools | Provider Built-in Tools |
|--------|-------------|------------------------|
| **Implementation** | You write the logic | Provider handles it |
| **Flexibility** | Full control | Limited configuration |
| **Use case** | Business-specific logic | Common capabilities (search, files) |
| **Execution** | Your code executes | Provider executes |

**When to use which:**
- **Custom tools**: When you need specific business logic, API integrations, or database access
- **Provider built-in tools**: When you need common capabilities like web search without managing infrastructure

> **📚 Learn More**: See the [OpenAI Tools Documentation](https://docs.langchain.com/oss/javascript/integrations/tools/openai) and [Anthropic Tools Documentation](https://docs.langchain.com/oss/javascript/integrations/tools/anthropic) for all available built-in tools and configuration options.

---

## 🗺️ Concept Map

This chapter taught you the complete function calling workflow:

```mermaid
graph LR
    A[Query] --> B[LLM Plans]
    B --> C[Generate Tool Call]
    C --> D[Execute Tool]
    D --> E[Get Result]
    E --> F[LLM Responds]
```

*The LLM plans, your code executes, and the LLM communicates the results.*

---

## 🎓 Key Takeaways

- **Function calling** connects LLMs to real-world actions (via your code)
- **LLMs generate** function calls, but don't execute them - your code does
- **Tools** are created with `tool()` and Zod schemas
- **bindTools()** makes tools available to the model
- **Type safety** with Zod prevents errors
- **Clear descriptions** help LLMs choose the right tool
- **Error handling** makes tools robust
- **Multiple tools** enable complex capabilities
- **Provider built-in tools** offer pre-configured capabilities like web search without custom implementation
- **Tools are the foundation for agents** - Next, you'll see how agents use tools to autonomously solve problems

---

## 🏆 Assignment

Ready to practice? Complete the challenges in [assignment.md](./assignment.md)!

The assignment includes:
1. **Weather Tool with Complete Execution Loop** - Build a weather tool and implement the complete 3-step execution pattern
2. **Multi-Tool Travel Assistant** (Bonus) - Build a system with multiple tools where the LLM automatically selects the appropriate tool

---

## 📚 Additional Resources

- [Tool Calling Documentation](https://js.langchain.com/docs/how_to/tool_calling/)
- [Custom Tools Guide](https://js.langchain.com/docs/how_to/custom_tools/)
- [Zod Documentation](https://zod.dev/)

---

## 🚀 What's Next?

Great work! You've learned how to create **tools** that LLMs can call to perform real-world actions—but you still had to manually handle the execution loop (invoke model → execute tools → invoke again).

### From Manual Tools to Autonomous Agents

**What if the LLM could decide which tools to use and when, without you writing the control flow?** 

Next, you'll learn how agents autonomously decide which tools to use and orchestrate complex multi-step workflows—transforming your tools into truly intelligent systems!

---

## 🗺️ Navigation

[← Previous: Prompts, Messages, and Structured Outputs](../03-prompts-messages-outputs/README.md) | [Back to Main](../README.md) | [Next: Getting Started with Agents →](../05-agents/README.md)

---

## 💬 Questions or stuck?
If you have product feedback or errors while building visit:

[![Google Gemini Developer Forum](https://img.shields.io/badge/GitHub-Google_Gemini_Developer_Forum-blue?style=for-the-badge&logo=github&color=000000&logoColor=fff)](https://discuss.ai.google.dev/)
