'use server';

import { aiChatAssistant } from '@/ai/flows/ai-chat-assistant';
import { generateImage } from '@/ai/flows/generate-image';

export async function getAiResponse(message: string) {
  if (message.startsWith('/imagine ')) {
    const prompt = message.replace('/imagine ', '');
    try {
      const result = await generateImage({ prompt });
      // Return the image URL in a format the client can understand
      return { success: true, response: `image:${result.imageUrl}` };
    } catch (error) {
      console.error(error);
      return { success: false, response: "Sorry, I couldn't generate that image. Please try again." };
    }
  }

  try {
    const response = await aiChatAssistant({ message });
    return { success: true, response: response.response };
  } catch (error) {
    console.error(error);
    return { success: false, response: "Sorry, I couldn't process that. Please try again." };
  }
}
