import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { topic, additionalInfo } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const prompt = `
      Create a podcast script about "${topic}".
      ${additionalInfo ? `Additional context: ${additionalInfo}` : ""}

      The script should:
      1. Have a catchy introduction that hooks the listener
      2. Include 3-5 main talking points with interesting facts and insights
      3. Have a clear structure with transitions between sections
      4. End with a compelling conclusion and call to action
      5. Be VERY conversational in tone, as if speaking naturally to the listener
      6. Be between 500-800 words in length

      IMPORTANT FORMATTING INSTRUCTIONS:
      - DO NOT use any markdown formatting like asterisks (**), hashtags (#), or other special characters
      - DO NOT include section headers with symbols or formatting
      - Write in a natural, flowing conversational style as if it's being spoken
      - Use natural speech patterns and transitions
      - Separate paragraphs with simple line breaks
      - DO NOT include any timestamps or speaker names
      - DO NOT include prefixes like "Here's the podcast script on..." or "Here is a script about..."
      - Start directly with the script content itself
      - Only return the script content, no additional commentary
      - Avoid phrases like "Welcome to this episode" or "In this podcast" - just speak naturally about the topic
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an expert podcast script writer who creates engaging, well-structured scripts on any topic. Your scripts are written in a natural, conversational tone without any formatting symbols or markdown. You write as people actually speak, with natural flow, pauses, and transitions. Your content is meant to be read aloud, so you avoid any visual formatting that would sound strange when spoken. IMPORTANT: Do not include prefixes like 'Here's the podcast script on...' or 'Here is a script about...'. Start directly with the script content itself.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: process.env.GROQ_MODEL || "llama3-70b-8192",
      temperature: 0.7,
      max_tokens: 2048,
    });

    let scriptContent = completion.choices[0]?.message?.content || "";

    // Clean up any markdown or formatting that might still be present
    scriptContent = cleanupScript(scriptContent);

    return NextResponse.json({ script: scriptContent });
  } catch (error) {
    console.error("Error generating script:", error);
    return NextResponse.json(
      { error: "Failed to generate script" },
      { status: 500 }
    );
  }
}

// Function to clean up any markdown or formatting from the script
function cleanupScript(script: string): string {
  // Remove common LLM response prefixes like "Here's the podcast script on..."
  script = script.replace(
    /^(Here['']s |Here is )?(the |a )?(podcast script|script for a podcast|transcript)( about| on| for)? .*?[:.]/i,
    ""
  );

  // Remove markdown headers (# Header)
  script = script.replace(/^#+\s+(.*)$/gm, "$1");

  // Remove bold/italic markdown (**text** or *text*)
  script = script.replace(/\*\*(.*?)\*\*/g, "$1");
  script = script.replace(/\*(.*?)\*/g, "$1");

  // Remove underscores for emphasis (_text_)
  script = script.replace(/_(.*?)_/g, "$1");

  // Remove section indicators like "Introduction:" or "Conclusion:"
  script = script.replace(/^(Introduction|Conclusion|Section \d+):\s*/gim, "");

  // Remove bullet points and numbered lists
  script = script.replace(/^[\s-]*[-•*]\s+/gm, "");
  script = script.replace(/^\s*\d+\.\s+/gm, "");

  // Remove any remaining special characters that might be read literally
  script = script.replace(/[#\[\]]/g, "");

  // Fix any double spaces
  script = script.replace(/\s{2,}/g, " ");

  // Ensure proper spacing after periods
  script = script.replace(/\.(?=[A-Za-z])/g, ". ");

  // Trim any leading/trailing whitespace
  script = script.trim();

  return script;
}
