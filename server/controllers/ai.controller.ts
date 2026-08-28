import { Request, Response } from 'express';
import { generateArchitectureScope } from '../services/gemini.service.ts';

export const generateAiEstimate = async (req: Request, res: Response) => {
  try {
    const result = await generateArchitectureScope(req.body);
    res.json({
      success: true,
      aiGenerated: result.aiGenerated,
      data: result.data
    });
  } catch (error) {
    console.error('AI estimate handler error:', error);
    res.status(500).json({ error: 'Failed to generate technical estimate' });
  }
};
