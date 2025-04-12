import { NextResponse } from "next/server";
import { generateImage, ImageStyle, ImageQuality } from "@/lib/openai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, size, style, quality } = body;

    console.log("API Request received:", { 
      prompt: prompt?.substring(0, 100) + "...", 
      size,
      style,
      quality
    });

    // Validate input
    if (!prompt || typeof prompt !== "string") {
      console.log("Invalid prompt:", prompt);
      return NextResponse.json(
        { error: "Valid prompt is required" },
        { status: 400 }
      );
    }

    // Valid sizes for DALL-E-3
    const validSizes = ["1024x1024", "1792x1024", "1024x1792"];
    if (size && !validSizes.includes(size)) {
      console.log("Invalid size:", size);
      return NextResponse.json(
        { error: "Invalid size. Must be one of: 1024x1024, 1792x1024, 1024x1792" },
        { status: 400 }
      );
    }

    // Valid styles for DALL-E-3
    const validStyles = ["natural", "vivid"];
    if (style && !validStyles.includes(style)) {
      console.log("Invalid style:", style);
      return NextResponse.json(
        { error: "Invalid style. Must be one of: natural, vivid" },
        { status: 400 }
      );
    }

    // Valid qualities for DALL-E-3
    const validQualities = ["standard", "hd"];
    if (quality && !validQualities.includes(quality)) {
      console.log("Invalid quality:", quality);
      return NextResponse.json(
        { error: "Invalid quality. Must be one of: standard, hd" },
        { status: 400 }
      );
    }

    // Generate image
    console.log("Calling OpenAI API to generate image...");
    const imageUrl = await generateImage(
      prompt, 
      size as "1024x1024" | "1792x1024" | "1024x1792",
      style as ImageStyle,
      quality as ImageQuality
    );

    console.log("Image generated successfully, URL:", imageUrl?.substring(0, 50) + "...");
    return NextResponse.json({ url: imageUrl });
  } catch (error: unknown) {
    console.error("Error in API route:", error);
    
    let errorMessage = "Failed to generate image";
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        errorMessage = "Invalid or missing API key";
        statusCode = 401;
      } else if (error.message.includes("content policy violation")) {
        errorMessage = "Content policy violation detected in prompt";
        statusCode = 400;
      }
      
      return NextResponse.json(
        { error: errorMessage, details: error.message },
        { status: statusCode }
      );
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}