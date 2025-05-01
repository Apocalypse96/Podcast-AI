import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM"; // Default voice ID

    // Check if API key is available
    if (!apiKey) {
      console.warn(
        "ElevenLabs API key is not configured. Using demo endpoint."
      );

      try {
        // Try to use the demo endpoint which doesn't require an API key
        const demoResponse = await axios({
          method: "POST",
          url: "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM/stream",
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            text: text.substring(0, 300), // Limit text length for demo
            model_id: "eleven_monolingual_v1",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
          },
          responseType: "arraybuffer",
        });

        const audioBase64 = Buffer.from(demoResponse.data).toString("base64");

        return NextResponse.json({
          audio: audioBase64,
          format: "mp3",
          demo: true,
        });
      } catch (demoError) {
        console.error("Failed to use demo endpoint:", demoError);
        return NextResponse.json(
          {
            error:
              "ElevenLabs API key is not configured and demo endpoint failed",
          },
          { status: 500 }
        );
      }
    }

    // Log the API key (first few characters for debugging)
    console.log("API Key (first 10 chars):", apiKey?.substring(0, 10));
    console.log("Voice ID:", voiceId);

    // Make a direct request to the Eleven Labs API
    const response = await axios({
      method: "POST",
      url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      data: {
        text: text,
        model_id: "eleven_turbo_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      },
      responseType: "arraybuffer",
    });

    // Convert the audio buffer to base64
    const audioBase64 = Buffer.from(response.data).toString("base64");

    return NextResponse.json({
      audio: audioBase64,
      format: "mp3",
    });
  } catch (error: any) {
    console.error("Error converting text to speech:", error);

    // Provide more detailed error information
    let errorMessage = "Failed to convert text to speech";
    let statusCode = 500;

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorMessage = `API Error: ${error.response.status} - ${error.response.statusText}`;
      statusCode = error.response.status;

      // Try to parse the response data if it's a buffer
      if (error.response.data instanceof Buffer) {
        try {
          const dataString = error.response.data.toString("utf8");
          console.error("Response data (string):", dataString);

          try {
            const jsonData = JSON.parse(dataString);
            console.error("Response data (parsed):", jsonData);

            // Update error message with more details if available
            if (jsonData.detail) {
              errorMessage += ` - ${JSON.stringify(jsonData.detail)}`;
            }
          } catch (e) {
            console.error("Failed to parse response data as JSON");
          }
        } catch (e) {
          console.error("Failed to convert response data to string");
        }
      } else {
        console.error("Response data:", error.response.data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = "No response received from Eleven Labs API";
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message || errorMessage;
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
