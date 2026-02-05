// =====================================================
// API CLIENT - Direct API Calls
// =====================================================
// This makes direct calls to OpenAI and Google Gemini APIs
// Configure your API keys in .env.local
// =====================================================

// API Configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const AI_MODELS = {
    // OpenAI Models
    GPT4: 'gpt-4',
    GPT4_TURBO: 'gpt-4-turbo-preview',
    GPT35_TURBO: 'gpt-3.5-turbo',

    // Aliases
    DEFAULT: 'gpt-3.5-turbo',
    PREMIUM: 'gpt-4',
} as const;

interface AIMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface AIRequest {
    messages: AIMessage[];
    model?: string;
    temperature?: number;
    max_tokens?: number;
    response_format?: { type: 'json_object' };
}

interface AIResponse {
    id: string;
    choices: Array<{
        message: {
            content: string;
            role: string;
        };
        finish_reason: string;
    }>;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

/**
 * Call OpenAI API directly
 */
export async function callAI(
    request: AIRequest,
    apiKey: string
): Promise<AIResponse> {
    const model = request.model || AI_MODELS.DEFAULT;

    // Build request body for OpenAI
    const requestBody: any = {
        model,
        messages: request.messages,
        max_tokens: request.max_tokens || 4000,
    };

    // Add temperature if provided
    if (request.temperature !== undefined) {
        requestBody.temperature = request.temperature;
    }

    // Handle JSON output mode
    if (request.response_format) {
        requestBody.response_format = request.response_format;
    }

    const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
    }

    return await response.json();
}

/**
 * Parse resume from file (client-side only)
 */
export async function parseResume(file: File): Promise<string> {
    const fileName = file.name.toLowerCase();

    // Handle text files
    if (fileName.endsWith('.txt')) {
        return await file.text();
    }

    // For PDF and DOCX, we need server-side processing
    // In local mode, we'll just return a placeholder
    if (fileName.endsWith('.pdf') || fileName.endsWith('.docx')) {
        throw new Error(
            'PDF and DOCX parsing requires backend processing. ' +
            'Please use a text file (.txt) or copy/paste your resume text directly.'
        );
    }

    throw new Error('Unsupported file type. Please use .txt, .pdf, or .docx files.');
}

/**
 * Classify job description
 */
export async function classifyJobDescription(
    jdText: string,
    apiKey: string
): Promise<any> {
    const systemPrompt = `You are a career classification expert. Analyze job descriptions to identify:
1. The exact role title (normalize to standard industry titles)
2. Seniority level (IC, Senior IC, Manager, Senior Manager, Director, Senior Director, VP, SVP, C-Level)
3. Industry and sub-industry

Respond ONLY with valid JSON matching this exact schema:
{
  "role_title": "string - the primary normalized role title",
  "role_alternates": ["string array - other valid titles for this role"],
  "seniority_level": "IC | Senior IC | Manager | Senior Manager | Director | Senior Director | VP | SVP | C-Level",
  "industry": "string - primary industry",
  "sub_industry": "string or null - specific sub-industry if applicable",
  "confidence": 0.0-1.0,
  "justification": {
    "role": "why this role title",
    "level": "why this seniority level",
    "industry": "why this industry"
  }
}`;

    const response = await callAI(
        {
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Classify this job description:\n\n${jdText}` },
            ],
            model: AI_MODELS.DEFAULT,
            temperature: 0.3,
            response_format: { type: 'json_object' },
        },
        apiKey
    );

    const content = response.choices[0]?.message?.content;
    if (!content) {
        throw new Error('No response from AI');
    }

    return JSON.parse(content);
}

/**
 * Extract requirements from job description
 */
export async function extractJDRequirements(
    jdText: string,
    apiKey: string
): Promise<any> {
    const systemPrompt = `Extract all requirements from this job description.
Categorize them as: technical_skills, soft_skills, experience, education, certifications, responsibilities.
Return as JSON array with: { category, text, priority: "required" | "preferred" }`;

    const response = await callAI(
        {
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: jdText },
            ],
            model: AI_MODELS.DEFAULT,
            response_format: { type: 'json_object' },
        },
        apiKey
    );

    const content = response.choices[0]?.message?.content;
    return JSON.parse(content || '{"requirements": []}');
}

/**
 * Generate role benchmark
 */
export async function generateRoleBenchmark(
    roleTitle: string,
    seniorityLevel: string,
    industry: string,
    apiKey: string
): Promise<any> {
    const systemPrompt = `Generate a comprehensive benchmark for this role.
Include: typical responsibilities, required skills, experience expectations, and success metrics.
Return as structured JSON.`;

    const userPrompt = `Role: ${roleTitle}\nLevel: ${seniorityLevel}\nIndustry: ${industry}`;

    const response = await callAI(
        {
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            model: AI_MODELS.DEFAULT,
            response_format: { type: 'json_object' },
        },
        apiKey
    );

    const content = response.choices[0]?.message?.content;
    return JSON.parse(content || '{}');
}

/**
 * Analyze resume gaps
 */
export async function analyzeResumeGaps(
    resumeText: string,
    requirements: any[],
    benchmark: any,
    apiKey: string
): Promise<any> {
    const systemPrompt = `Analyze this resume against the job requirements and role benchmark.
Identify gaps, strengths, and provide recommendations.
Return as structured JSON with: { gaps: [], strengths: [], recommendations: [] }`;

    const userPrompt = `Resume:\n${resumeText}\n\nRequirements:\n${JSON.stringify(requirements)}\n\nBenchmark:\n${JSON.stringify(benchmark)}`;

    const response = await callAI(
        {
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            model: AI_MODELS.DEFAULT,
            response_format: { type: 'json_object' },
        },
        apiKey
    );

    const content = response.choices[0]?.message?.content;
    return JSON.parse(content || '{"gaps": [], "strengths": [], "recommendations": []}');
}

/**
 * Rewrite resume section
 */
export async function rewriteSection(
    sectionName: string,
    originalContent: string,
    targetRole: string,
    requirements: any[],
    apiKey: string
): Promise<string> {
    const systemPrompt = `You are an expert resume writer. Rewrite this ${sectionName} section to better align with the target role and requirements.
Maintain truthfulness while optimizing for ATS and impact.
Return only the rewritten content, no explanations.`;

    const userPrompt = `Target Role: ${targetRole}\n\nRequirements:\n${JSON.stringify(requirements)}\n\nOriginal Content:\n${originalContent}`;

    const response = await callAI(
        {
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            model: AI_MODELS.DEFAULT,
            temperature: 0.7,
        },
        apiKey
    );

    return response.choices[0]?.message?.content || originalContent;
}

/**
 * Generate hiring manager critique
 */
export async function generateHiringManagerCritique(
    resumeContent: any,
    jobDescription: string,
    apiKey: string
): Promise<any> {
    const systemPrompt = `You are a hiring manager reviewing this resume for the given role.
Provide honest, constructive feedback on: relevance, impact, clarity, and ATS optimization.
Return as JSON with: { overall_score: 0-100, strengths: [], weaknesses: [], suggestions: [] }`;

    const userPrompt = `Job Description:\n${jobDescription}\n\nResume:\n${JSON.stringify(resumeContent)}`;

    const response = await callAI(
        {
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            model: AI_MODELS.PREMIUM,
            response_format: { type: 'json_object' },
        },
        apiKey
    );

    const content = response.choices[0]?.message?.content;
    return JSON.parse(content || '{"overall_score": 0, "strengths": [], "weaknesses": [], "suggestions": []}');
}
