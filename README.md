# DALL-E 이미지 생성기

OpenAI의 DALL-E 3 모델을 활용한 이미지 생성 웹 애플리케이션입니다.

## 설치 및 실행 방법

1. 저장소 클론
```bash
git clone <repository-url>
cd dallespace
```

2. 의존성 설치
```bash
npm install
```

3. 환경변수 설정
`.env.local` 파일에 OpenAI API 키를 설정합니다:
```
OPENAI_API_KEY=your_openai_api_key_here
```
OpenAI API 키는 [OpenAI 플랫폼](https://platform.openai.com/account/api-keys)에서 생성할 수 있습니다.

4. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 앱을 사용할 수 있습니다.

## 사용 방법

1. 프롬프트 입력 필드에 생성하고 싶은 이미지에 대한 자세한 설명을 입력합니다.
2. 이미지 크기 선택기에서 원하는 크기를 선택합니다:
   - 정사각형 (1024x1024)
   - 가로형 (1792x1024)
   - 세로형 (1024x1792)
3. "이미지 생성하기" 버튼을 클릭합니다.
4. 생성된 이미지는 화면에 표시됩니다.

## 기술 스택

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [OpenAI API](https://platform.openai.com/)
- [Sonner](https://sonner.emilkowal.ski/)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
