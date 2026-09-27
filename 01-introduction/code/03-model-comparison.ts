/**
 * Model Comparison
 * Run: npx tsx 01-introduction/code/03-model-comparison.ts
 *
 * 🤖 Try asking GitHub Copilot Chat (https://github.com/features/copilot):
 * - "Why do we create a new ChatOpenAI instance inside the loop?"
 * - "How can I add another model to this comparison?"
 */

import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

async function compareModels() {
  console.log("🔬 Comparing AI Models\n");

  const prompt = "Explain recursion in programming in one sentence.";
  const models = ["gemini-3.1-flash-lite", "gemini-3.8-flash"];

  for (const modelName of models) {
    console.log(`\n📊 Testing: ${modelName}`);
    console.log("─".repeat(50));

    // Wait a couple of seconds to respect free-tier rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Override the model for this test
    const model = new ChatOpenAI({
      model: modelName,
      configuration: { baseURL: process.env.AI_ENDPOINT },
      apiKey: process.env.AI_API_KEY,
    });

    const startTime = Date.now();
    const response = await model.invoke(prompt);
    const duration = Date.now() - startTime;

    console.log(`Response: ${response.content}`);
    console.log(`⏱️  Time: ${duration}ms`);
  }

  console.log("\n✅ Comparison complete!");
  console.log("\n💡 Key Observations:");
  console.log("   - gemini-3.8-flash is more capable and detailed for complex reasoning");
  console.log("   - gemini-3.8-flash-lite is faster and well-suited for high-volume tasks");
  console.log("   - Choose based on your needs: speed vs. capability");
}

compareModels().catch(console.error);
