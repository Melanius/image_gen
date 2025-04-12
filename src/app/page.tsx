"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import Image from "next/image";
import { ImageStyle, ImageQuality } from "@/lib/openai";

// 다양한 스타일 프리셋 정의
const stylePresets = {
  minimal: "미니멀리스틱 스타일, 깔끔하고 단순한 디자인, 적은 색상",
  realistic: "사실적인 사진, 실제와 같은 디테일, 고해상도",
  illustration: "일러스트레이션 스타일, 밝은 색상, 평면적 디자인",
  painting: "유화 스타일, 두꺼운 붓터치, 예술적 표현",
  sketch: "손으로 그린 스케치, 연필이나 펜 선, 간결한 디자인",
  cartoon: "만화 스타일, 밝은 색상, 과장된 표현",
  anime: "애니메이션 스타일, 일본 애니메이션, 표현적인 눈",
  fantasy: "판타지 스타일, 마법적인 요소, 화려한 색상",
  scifi: "공상과학 스타일, 미래적인 요소, 첨단 기술",
  retro: "복고풍 스타일, 빈티지 요소, 오래된 필름 효과",
  neon: "네온 스타일, 밝게 빛나는 색감, 어두운 배경, 사이버펑크 분위기"
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [size, setSize] = useState<"1024x1024" | "1792x1024" | "1024x1792">("1024x1024");
  const [style, setStyle] = useState<ImageStyle>("vivid");
  const [quality, setQuality] = useState<ImageQuality>("standard");
  const [stylePreset, setStylePreset] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 프롬프트와 스타일을 조합하는 함수
  const getCombinedPrompt = () => {
    if (!stylePreset || stylePreset === "none") return prompt;
    return `${prompt}. ${stylePresets[stylePreset as keyof typeof stylePresets]}`;
  };

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast.error("프롬프트를 입력해주세요");
      return;
    }

    setLoading(true);
    setImageUrl(null);
    setError(null);

    const combinedPrompt = getCombinedPrompt();
    console.log("Combined prompt:", combinedPrompt);

    try {
      console.log("Sending request to generate image with prompt:", combinedPrompt.substring(0, 30) + "...");
      
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          prompt: combinedPrompt, 
          size, 
          style, 
          quality 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || "이미지 생성에 실패했습니다";
        console.error("API error:", data);
        setError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      if (!data.url) {
        throw new Error("API 응답에 이미지 URL이 없습니다");
      }

      console.log("Image generated successfully");
      setImageUrl(data.url);
      toast.success("이미지가 성공적으로 생성되었습니다!");
    } catch (error) {
      console.error("Client error:", error);
      setError("이미지 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
      toast.error("이미지 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        <header className="w-full max-w-4xl text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-green-800 tracking-tight mb-2">DALL-E 이미지 생성기</h1>
          <p className="text-green-600 text-sm md:text-base max-w-2xl mx-auto">
            OpenAI의 DALL-E 3 모델을 활용하여 다양한 스타일의 이미지를 손쉽게 생성하세요
          </p>
        </header>

        <main className="w-full max-w-4xl flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-1/2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-green-100">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="prompt" className="text-sm font-medium text-green-700">
                  프롬프트 입력
                </label>
                <Input
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="자세한 프롬프트를 입력하세요..."
                  disabled={loading}
                  className="border-green-200 focus-visible:ring-green-500 h-[42px]"
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="stylePreset" className="text-sm font-medium text-green-700">
                    스타일 프리셋
                  </label>
                  <Select
                    value={stylePreset}
                    onValueChange={(value) => setStylePreset(value)}
                    disabled={loading}
                  >
                    <SelectTrigger id="stylePreset" className="border-green-200 focus:ring-green-500 h-[42px]">
                      <SelectValue placeholder="스타일 프리셋 선택 (선택사항)" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-green-200">
                      <SelectItem value="none">선택 안함</SelectItem>
                      <SelectItem value="minimal">미니멀리스틱</SelectItem>
                      <SelectItem value="realistic">사실적인 사진</SelectItem>
                      <SelectItem value="illustration">일러스트레이션</SelectItem>
                      <SelectItem value="painting">유화 스타일</SelectItem>
                      <SelectItem value="sketch">스케치</SelectItem>
                      <SelectItem value="cartoon">만화</SelectItem>
                      <SelectItem value="anime">애니메이션</SelectItem>
                      <SelectItem value="fantasy">판타지</SelectItem>
                      <SelectItem value="scifi">공상과학</SelectItem>
                      <SelectItem value="retro">복고풍</SelectItem>
                      <SelectItem value="neon">네온</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="size" className="text-sm font-medium text-green-700">
                    이미지 크기
                  </label>
                  <Select
                    value={size}
                    onValueChange={(value) => setSize(value as "1024x1024" | "1792x1024" | "1024x1792")}
                    disabled={loading}
                  >
                    <SelectTrigger id="size" className="border-green-200 focus:ring-green-500 h-[42px]">
                      <SelectValue placeholder="이미지 크기 선택" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-green-200">
                      <SelectItem value="1024x1024">정사각형 (1024x1024)</SelectItem>
                      <SelectItem value="1792x1024">가로형 (1792x1024)</SelectItem>
                      <SelectItem value="1024x1792">세로형 (1024x1792)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="style" className="text-sm font-medium text-green-700">
                    스타일 (DALL-E 3)
                  </label>
                  <Select
                    value={style}
                    onValueChange={(value) => setStyle(value as ImageStyle)}
                    disabled={loading}
                  >
                    <SelectTrigger id="style" className="border-green-200 focus:ring-green-500 h-[42px]">
                      <SelectValue placeholder="스타일 선택" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-green-200 w-[320px]">
                      <SelectItem value="vivid">생생함 (Vivid) - 강렬하고 드라마틱한 이미지</SelectItem>
                      <SelectItem value="natural">자연스러움 (Natural) - 덜 극적이고 자연스러운 이미지</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="quality" className="text-sm font-medium text-green-700">
                    이미지 품질
                  </label>
                  <Select
                    value={quality}
                    onValueChange={(value) => setQuality(value as ImageQuality)}
                    disabled={loading}
                  >
                    <SelectTrigger id="quality" className="border-green-200 focus:ring-green-500 h-[42px]">
                      <SelectValue placeholder="품질 선택" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-green-200">
                      <SelectItem value="standard">표준 (Standard)</SelectItem>
                      <SelectItem value="hd">고해상도 (HD) - 더 세밀한 디테일</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {stylePreset && stylePreset !== "none" && (
                <div className="bg-green-50 p-3 rounded-md text-xs mt-2 border border-green-100">
                  <p className="font-medium mb-1 text-green-800">적용될 프롬프트:</p>
                  <p className="text-green-700">{getCombinedPrompt()}</p>
                </div>
              )}
              
              <Button 
                onClick={handleGenerateImage} 
                disabled={loading || !prompt.trim()}
                className="mt-2 bg-green-600 hover:bg-green-700 text-white h-[42px] w-full"
              >
                {loading ? "생성 중..." : "이미지 생성하기"}
              </Button>
            </div>
          </div>

          <div className="w-full lg:w-1/2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-green-100 flex flex-col items-center justify-center">
            {loading && (
              <div className="flex flex-col items-center justify-center gap-4 p-12 min-h-[400px]">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
                <p className="text-green-700 text-center">이미지를 생성하는 중입니다...</p>
                <p className="text-green-600 text-sm text-center max-w-xs">DALL-E 3 모델이 프롬프트를 해석하고 이미지를 생성 중입니다</p>
              </div>
            )}

            {error && !loading && (
              <div className="text-red-500 text-center p-8 bg-red-50 rounded-md border border-red-100 min-h-[400px] flex items-center justify-center">
                <div>
                  <p className="font-semibold mb-2">오류가 발생했습니다</p>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {!imageUrl && !loading && !error && (
              <div className="flex flex-col items-center justify-center gap-4 p-8 min-h-[400px] text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                    <path d="M5 21h14"></path><path d="M5 21V7l7-4 7 4v14"></path><path d="M5 12h14"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-green-800">이미지 생성 대기 중</h3>
                <p className="text-green-600 text-sm max-w-xs">
                  프롬프트를 입력하고 스타일과 설정을 조정한 후 &apos;이미지 생성하기&apos; 버튼을 클릭하세요
                </p>
              </div>
            )}

            {imageUrl && !error && (
              <div className="flex flex-col items-center gap-4 w-full">
                <div className="relative w-full aspect-square max-w-xl rounded-lg overflow-hidden border-2 border-green-200">
                  <Image
                    src={imageUrl}
                    alt={prompt}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="text-sm text-green-700 w-full p-4 bg-green-50 rounded-md">
                  <p className="font-medium mb-1">원본 프롬프트:</p>
                  <p className="mb-3">{prompt}</p>
                  {stylePreset && stylePreset !== "none" && (
                    <>
                      <p className="font-medium mb-1">적용된 스타일:</p>
                      <p>{stylePresets[stylePreset as keyof typeof stylePresets]}</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
        
        <footer className="mt-12 text-center text-green-600 text-xs">
          <p className="mb-1">🌱 자연에서 영감을 받은 DALL-E 이미지 생성기 🌱</p>
          <p>이 응용 프로그램은 OpenAI의 DALL-E 3 API를 활용합니다.</p>
        </footer>
      </div>
      <Toaster />
    </div>
  );
}
