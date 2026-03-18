import { NextRequest, NextResponse } from 'next/server';
import { callClaude } from '@/lib/anthropic-client';
import { generateSystemPrompt, isOutOfScope } from '@/lib/ai-tutor-prompt';
import { Language } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, language, moduleTitle, stepTitle, stepContent } = body;

    // Validate required fields
    if (!question || !language || !moduleTitle || !stepTitle || !stepContent) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if question is out of scope
    if (isOutOfScope(question, moduleTitle)) {
      const redirectMessage = language === 'zh'
        ? '这是一个很好的问题，可以问您的家人！让我们回到课程。'
        : "That's a great question for your family helper! Let's get back to our lesson.";
      
      return NextResponse.json({ response: redirectMessage });
    }

    // Generate system prompt
    const systemPrompt = generateSystemPrompt({
      language: language as Language,
      moduleTitle,
      stepTitle,
      stepContent,
    });

    // Call Claude API
    const result = await callClaude(
      [{ role: 'user', content: question }],
      systemPrompt
    );

    if (result.error) {
      const errorMessage = language === 'zh'
        ? '我现在遇到了一些问题。请稍后再试。'
        : "I'm having trouble right now. Please try again in a moment.";
      
      return NextResponse.json({ response: errorMessage });
    }

    return NextResponse.json({ response: result.content });
  } catch (error) {
    console.error('AI Tutor API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
