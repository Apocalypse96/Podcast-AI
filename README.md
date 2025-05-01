# Podcast AI

Podcast AI is a web application that generates podcast scripts and converts them to lifelike audio using AI. It uses Groq API for script generation and Eleven Labs for text-to-speech conversion.

## Features

- Generate podcast scripts on any topic
- Convert scripts to lifelike audio
- Sleek, futuristic UI
- No backend required - uses API calls directly from the frontend

## Technologies Used

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **AI Services**:
  - Groq API for script generation
  - Eleven Labs for text-to-speech conversion
- **Other Libraries**:
  - React Icons for UI icons
  - Sonner for toast notifications

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Groq API key
- Eleven Labs API key

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Apocalypse96/podcast-ai.git
   cd podcast-ai
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with your API keys:

   ```
   GROQ_API_KEY=your-groq-api-key
   ELEVENLABS_API_KEY=your-elevenlabs-api-key
   GROQ_MODEL=llama3-70b-8192
   ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter a podcast topic in the form
2. Add any additional information or context (optional)
3. Click "Generate Podcast" to create a script
4. Once the script is generated, click "Generate Audio" to convert it to speech
5. Use the audio player to listen to your podcast or download it

## Deployment

This application can be easily deployed to Vercel:

```bash
npm install -g vercel
vercel
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Groq](https://groq.com/) for providing the AI script generation API
- [Eleven Labs](https://elevenlabs.io/) for the text-to-speech API
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
