import type { Context, Config } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Parse request body
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "Invalid request: 'text' field is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get Gemini API key from environment variables
    const apiKey = Netlify.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      console.error("GEMINI_API_KEY not found in environment variables");
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Call Gemini AI API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a sommelier AI expert in wine analysis. Analyze the following wine label text and provide detailed information in JSON format with these exact keys: "general_summary", "geographical_region", "cultural_significance", "historical_significance", "food_pairings". Each value should be a comprehensive paragraph (2-4 sentences) that provides educational content relevant to wine appreciation studies. Be specific and informative.

Wine label text:
${text}

Return ONLY valid JSON with no additional text or markdown formatting.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.text();
      console.error("Gemini API error:", errorData);
      return new Response(
        JSON.stringify({ error: "Failed to generate content from Gemini AI" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const geminiData = await geminiResponse.json();

    // Extract the generated text from Gemini's response structure
    const generatedText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      console.error("Unexpected Gemini response structure:", JSON.stringify(geminiData));
      return new Response(JSON.stringify({ error: "Invalid response from Gemini AI" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Try to parse the JSON response from Gemini
    let summaryObj;
    try {
      // Clean up any markdown code blocks or extra text
      const cleaned = generatedText.trim().replace(/```json\n?|```\n?/g, "");
      summaryObj = JSON.parse(cleaned);
    } catch (parseError) {
      // If parsing fails, return the raw text
      console.error("Failed to parse Gemini output as JSON:", parseError);
      return new Response(
        JSON.stringify({
          raw_text: generatedText,
          error: "Could not parse as JSON"
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Return the structured summary
    return new Response(JSON.stringify(summaryObj), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const config: Config = {
  path: "/api/generate-wine-info",
};
