import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '../lib/prisma';

/**
 * AgoroScores AI Intelligence Service
 * Uses Gemini Pro to read raw ingested football articles and generate concise UI-ready summaries.
 */

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export class AIService {
  private model: any;

  constructor() {
    // Requires Gemini 1.5 Pro (or equivalent 3.1 Pro spec as noted in prompt context)
    // Using standard standard naming for typical Google Gen AI setup.
    this.model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-pro-latest',
        generationConfig: {
            temperature: 0.2, // Strict, factual bounds to prevent hallucinations
            topK: 32,
            topP: 1,
            maxOutputTokens: 200,
        }
    });
  }

  /**
   * Processes a raw article string into a precise UI summary and a "Why it matters" context string.
   */
  async summarizeNewsArticle(articleId: string, rawContent: string): Promise<void> {
    const prompt = `
      You are an elite football journalist acting as the AI engine for AgoroScores.
      Your job is to read the following raw news article and provide two extremely concise properties.
      Do NOT invent any facts not present in the text. Do not hallucinate scorelines or transfer fees.

      Format your output STRICTLY as a JSON object:
      {
         "ai_summary": "A 1-sentence summary of the core event.",
         "ai_why_it_matters": "A 1-sentence analytical consequence of this event on the league, player, or team."
      }

      Raw Article:
      """
      ${rawContent}
      """
    `;

    try {
        console.log(`[AIService] Generating summary for Article ${articleId}...`);
        const result = await this.model.generateContent(prompt);
        const responseText = result.response.text();

        // Strip Markdown JSON fences if the model output them
        const cleanedJsonText = responseText.replace(/```json\n|\n```/g, '');
        const payload = JSON.parse(cleanedJsonText);

        await prisma.newsArticle.update({
            where: { id: articleId },
            data: {
                ai_summary: payload.ai_summary,
                ai_why_it_matters: payload.ai_why_it_matters
            }
        });

        console.log(`[AIService] Successfully attached AI summary for Article ${articleId}`);

    } catch (error) {
        console.error(`[AIService] Failed to parse Gemini response for Article ${articleId}:`, error);
        // We log the error but do not delete the article. 
        // The Deep Dive 5 Frontend rules ensure the UI degrades gracefully if `ai_summary` is null.
    }
  }

  /**
   * Translates Admin shorthand reasoning into a polished Premium Betting Tip.
   */
  async formatBettingReasoning(betId: string, rawReasoning: string): Promise<string> {
      const prompt = `
        Rewrite this rough betting analysis into a professional, data-driven paragraph suitable for a premium sportsbook tips feed.
        Maintain all factual claims exactly.
        
        Input Analysis: ${rawReasoning}
      `;

      try {
          const result = await this.model.generateContent(prompt);
          const polishedText = result.response.text().trim();
          
          await prisma.bettingPost.update({
              where: { id: betId },
              data: { ai_explanation_summary: polishedText }
          });
          
          return polishedText;
      } catch (error) {
           console.error(`[AIService] Failed to polish bet reasoning via Gemini.`, error);
           throw error;
      }
  }
}
