import { GoogleGenAI } from "@google/genai";
import { AirdropItem, SearchResult, WalletType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const identifyWallet = (address: string): WalletType => {
  if (address.startsWith('0x') && address.length === 42) return WalletType.EVM;
  if (address.length > 30 && address.length < 45 && !address.startsWith('0x')) return WalletType.SOLANA; // Basic heuristic
  if (address.startsWith('bc1') || address.startsWith('1') || address.startsWith('3')) return WalletType.BITCOIN;
  if (address.startsWith('cosmos')) return WalletType.COSMOS;
  return WalletType.UNKNOWN;
};

export const analyzeAirdrops = async (address: string): Promise<SearchResult> => {
  const walletType = identifyWallet(address);

  const prompt = `
    Act as a senior cryptocurrency airdrop analyst.
    I have a wallet address: ${address} which appears to be a ${walletType} wallet.

    Goal: Search for CURRENTLY ACTIVE or RECENTLY ANNOUNCED airdrops relevant to this network ecosystem. 
    Do not hallucinate. Use Google Search to find real, live data.

    Please perform the following:
    1. Search for "latest crypto airdrops ${walletType} 2024 2025".
    2. Search for "active claims for ${walletType} users".
    3. Identify 3-5 specific projects that are popular right now for potential eligibility or farming.
    4. Determine the likely category (Layer 2, DeFi, etc.).

    Output Format:
    Provide a JSON object inside \`\`\`json\`\`\` code blocks.
    The structure must be:
    {
      "summary": "A brief overview (in Bulgarian language) of the current airdrop climate for this wallet type.",
      "airdrops": [
        {
          "name": "Project Name",
          "token": "Token Symbol (or TBD)",
          "status": "Active" or "Upcoming" or "Rumor",
          "likelihood": "High" or "Medium" or "Low" (based on general user activity usually required),
          "description": "Short criteria in Bulgarian (e.g. 'Active claim for users who bridged before Dec 2024').",
          "category": "L2" or "DeFi" or "NFT" or "Infrastructure" or "Other",
          "actionUrl": "Official URL if found, otherwise empty string"
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.4,
      },
    });

    const text = response.text || "";
    
    // Extract Grounding Links
    const groundingLinks: string[] = [];
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
            if (chunk.web?.uri) {
                groundingLinks.push(chunk.web.uri);
            }
        });
    }

    // Extract JSON
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    
    if (jsonMatch && jsonMatch[1]) {
      const parsed = JSON.parse(jsonMatch[1]);
      return {
        walletType,
        airdrops: parsed.airdrops || [],
        summary: parsed.summary || "Няма намерена информация.",
        groundingLinks
      };
    } else {
        // Fallback if JSON fails to generate correctly, though usually prompt engineering prevents this.
        // Construct a generic response based on text if needed, but for this demo we throw to handle in UI.
        console.warn("Failed to parse JSON from Gemini response", text);
        return {
            walletType,
            airdrops: [],
            summary: "Не успяхме да структурираме данните автоматично. Моля, опитайте отново.",
            groundingLinks
        };
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Грешка при свързване с AI услугите.");
  }
};