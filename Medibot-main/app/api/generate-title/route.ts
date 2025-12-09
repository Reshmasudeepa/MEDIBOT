import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, previousTitle } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    // Generate a smart title using the message content
    const title = await generateSmartTitle(message, previousTitle);

    return NextResponse.json({ title });
  } catch (error: any) {
    console.error("Error generating title:", error);
    return NextResponse.json(
      { error: "Failed to generate title", details: error.message },
      { status: 500 }
    );
  }
}

async function generateSmartTitle(message: string, previousTitle?: string): Promise<string> {
  try {
    // Clean and prepare the message
    const cleanMessage = message.trim().slice(0, 500); // Limit message length
    
    if (!cleanMessage) {
      return "New Conversation";
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OpenAI API key not configured, using fallback title generation");
      return generateFallbackTitle(cleanMessage);
    }

    // Use AI to generate a contextual title
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant that generates concise, descriptive titles for medical/health chat conversations. 

Rules:
- Generate a title that is 2-5 words maximum
- Focus on the main health topic or concern
- Be specific but concise
- Use proper capitalization
- No quotation marks or special characters
- If it's a medical question, focus on the condition or symptom
- If it's general health advice, use descriptive terms
- Avoid generic terms like "question" or "inquiry" unless necessary

Examples:
- "I have a headache" → "Headache Relief"
- "How to lose weight?" → "Weight Loss"
- "My child has fever" → "Child Fever"
- "Diabetes management tips" → "Diabetes Management"
- "What medication for anxiety?" → "Anxiety Medication"
- "I can't sleep well" → "Sleep Problems"

Generate only the title, nothing else.`
          },
          {
            role: "user",
            content: `Generate a concise title for this health-related message: "${cleanMessage}"`
          }
        ],
        max_tokens: 20,
        temperature: 0.3,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      }),
    });

    if (!response.ok) {
      console.error("OpenAI API error:", response.status, response.statusText);
      return generateFallbackTitle(cleanMessage);
    }

    const data = await response.json();
    const aiTitle = data.choices?.[0]?.message?.content?.trim();

    if (aiTitle && aiTitle.length > 0 && aiTitle.length <= 50) {
      // Clean the AI-generated title
      const cleanTitle = aiTitle
        .replace(/["""'']/g, '') // Remove quotes
        .replace(/[^\w\s-]/g, '') // Remove special chars except hyphens
        .replace(/\s+/g, ' ') // Normalize spaces
        .trim();
      
      if (cleanTitle && cleanTitle !== previousTitle && cleanTitle.length > 0) {
        return cleanTitle;
      }
    }

    // Fallback if AI fails
    return generateFallbackTitle(cleanMessage);

  } catch (error) {
    console.error("Error in AI title generation:", error);
    return generateFallbackTitle(message);
  }
}

function generateFallbackTitle(message: string): string {
  try {
    const lowerMessage = message.toLowerCase().trim();
    
    if (lowerMessage.length === 0) {
      return "New Conversation";
    }

    // Enhanced health-related keyword matching
    const healthKeywords = [
      { keywords: ["headache", "migraine", "head pain"], title: "Headache Relief" },
      { keywords: ["fever", "temperature", "hot", "chills"], title: "Fever Management" },
      { keywords: ["medication", "medicine", "prescription", "pills", "drug"], title: "Medication Help" },
      { keywords: ["diet", "nutrition", "food", "eating", "meal"], title: "Nutrition Advice" },
      { keywords: ["exercise", "workout", "fitness", "gym"], title: "Fitness Guidance" },
      { keywords: ["sleep", "insomnia", "tired", "rest"], title: "Sleep Issues" },
      { keywords: ["stress", "anxiety", "worry", "mental"], title: "Mental Health" },
      { keywords: ["pain", "hurt", "ache", "sore"], title: "Pain Management" },
      { keywords: ["diabetes", "blood sugar", "insulin"], title: "Diabetes Care" },
      { keywords: ["blood pressure", "hypertension", "bp"], title: "Blood Pressure" },
      { keywords: ["weight", "lose", "diet", "fat"], title: "Weight Management" },
      { keywords: ["pregnancy", "pregnant", "baby"], title: "Pregnancy Care" },
      { keywords: ["child", "kid", "baby", "infant"], title: "Child Health" },
      { keywords: ["cold", "flu", "cough", "sneeze"], title: "Cold & Flu" },
      { keywords: ["heart", "cardiac", "chest"], title: "Heart Health" },
      { keywords: ["skin", "rash", "acne", "dermatology"], title: "Skin Concerns" },
      { keywords: ["allergy", "allergic", "reaction"], title: "Allergy Help" },
      { keywords: ["emergency", "urgent", "serious"], title: "Urgent Care" },
    ];

    // Find matching health category
    for (const { keywords, title } of healthKeywords) {
      if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
        return title;
      }
    }

    // Extract key words for a general title
    const words = lowerMessage
      .split(/\s+/)
      .filter((word) => word.length > 2)
      .filter((word) => !["the", "and", "for", "are", "but", "not", "you", "all", "can", "had", "her", "was", "one", "our", "out", "day", "get", "has", "him", "his", "how", "its", "may", "new", "now", "old", "see", "two", "who", "boy", "did", "what", "when", "where", "why", "will", "with", "this", "that", "they", "have", "from", "they", "know", "want", "been", "good", "much", "some", "time", "very", "when", "come", "here", "just", "like", "long", "make", "many", "over", "such", "take", "than", "them", "well", "were"].includes(word))
      .slice(0, 3);

    if (words.length === 0) {
      return "Health Discussion";
    }

    // Create title from key words
    const keyPhrase = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return keyPhrase.length > 30 ? keyPhrase.slice(0, 27) + "..." : keyPhrase;

  } catch (error) {
    console.error("Error in fallback title generation:", error);
    return "Health Chat";
  }
}
