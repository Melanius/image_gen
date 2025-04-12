import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type ImageStyle = "natural" | "vivid";
export type ImageQuality = "standard" | "hd";

export async function generateImage(
  prompt: string, 
  size: "1024x1024" | "1792x1024" | "1024x1792" = "1024x1024",
  style: ImageStyle = "vivid",
  quality: ImageQuality = "standard"
) {
  try {
    console.log(`Generating image with prompt: "${prompt}", size: ${size}, style: ${style}, quality: ${quality}`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size,
      style,
      quality,
    });

    console.log('OpenAI response received:', JSON.stringify(response.data));
    
    if (!response.data || !response.data[0] || !response.data[0].url) {
      throw new Error('Invalid response from OpenAI API: Missing image URL');
    }

    return response.data[0].url;
  } catch (error: any) {
    console.error('Error generating image:', error);
    if (error.response) {
      console.error('OpenAI API Error:', {
        status: error.response.status,
        data: error.response.data
      });
    }
    throw error;
  }
} 