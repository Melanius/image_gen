import OpenAI from 'openai';

// API 키 유효성 확인
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.warn('Warning: OPENAI_API_KEY is not set in environment variables.');
}

const openai = new OpenAI({
  apiKey: apiKey || 'dummy_key_for_build_process', // 빌드 프로세스를 위한 더미 키
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
    // API 키가 없을 경우 친절한 오류 메시지 반환
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured. Please add it to your environment variables.');
    }
    
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
  } catch (error: unknown) {
    console.error('Error generating image:', error);
    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = error as { response: { status: number; data: unknown } };
      console.error('OpenAI API Error:', {
        status: apiError.response.status,
        data: apiError.response.data
      });
    }
    throw error;
  }
} 