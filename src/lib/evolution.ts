import { fileToBase64 } from "../app/functions/transform-base64";
import { Group } from "../types/group";
import { Participant } from "../types/partiicipant";

const EVOLUTION_API_URL = process.env.NEXT_PUBLIC_EVOLUTION_API_URL!;
const EVOLUTION_API_KEY = process.env.NEXT_PUBLIC_EVOLUTION_API_KEY!;

export async function getGroups(instanceName: string): Promise<Group[]> {
  try {
    const response = await fetch(
      `${EVOLUTION_API_URL}/group/fetchAllGroups/${instanceName}?getParticipants=false`,
      {
        headers: {
          apikey: EVOLUTION_API_KEY,
        },
      }
    );

    if (!response.ok) {
      console.log(response);
      throw new Error("Erro ao buscar grupos");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar grupos:", error);
    throw error;
  }
}

export async function getGroupParticipants(
  instanceName: string,
  groupId: string
): Promise<Participant[]> {
  try {
    const response = await fetch(
      `${EVOLUTION_API_URL}/group/participants/${instanceName}?groupJid=${groupId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          apikey: EVOLUTION_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar participantes");
    }

    const data = await response.json();
    console.log(data);
    return data.participants;
  } catch (error) {
    console.error("Erro ao buscar participantes:", error);
    throw error;
  }
}

export async function sendMessageToGroup({
  instanceName,
  groupId,
  message,
  mentionedJidList,
  image,
}: {
  instanceName: string;
  groupId: string;
  message: string;
  mentionedJidList: string[];
  image?: File | null;
}): Promise<void> {
  try {
    if (image) {
      const base64 = await fileToBase64(image);
      const pureBase64 = (base64 as string).split(",")[1];

      const response = await fetch(
        `${EVOLUTION_API_URL}/message/sendMedia/${instanceName}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: EVOLUTION_API_KEY,
          },
          body: JSON.stringify({
            number: groupId,

            mediatype: "image", // image, video or document
            mimetype: image.type,
            caption: message,
            media: pureBase64,
            fileName: "Imagem.png",
          }),
        }
      );

      if (!response.ok) {
        console.log(response);
        throw new Error("Erro ao enviar mensagem");
      }
    } else {
      const response = await fetch(
        `${EVOLUTION_API_URL}/message/sendText/${instanceName}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: EVOLUTION_API_KEY,
          },
          body: JSON.stringify({
            number: groupId,
            text: message,
            mentioned: mentionedJidList,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao enviar mensagem");
      }
    }
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    throw error;
  }
}
