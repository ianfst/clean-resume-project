# API Setup Guide - Running Without Supabase

## Overview
This application now makes **direct API calls** to external services instead of using Supabase Edge Functions. All Supabase functionality has been removed and replaced with:

1. **Local Storage** - For data persistence (auth, database)
2. **Direct API Calls** - To Lovable AI Gateway (OpenAI, Gemini)

## What You Need

### 1. Lovable AI API Key
The app uses the Lovable AI Gateway to access OpenAI and Google Gemini models.

**Get your API key:**
1. Go to [https://lovable.dev](https://lovable.dev)
2. Sign up or log in
3. Navigate to your workspace settings
4. Copy your API key

**Cost:** Pay-as-you-go pricing based on token usage
- Gemini Flash: ~$0.30 per 1M input tokens
- GPT-5: ~$10 per 1M input tokens
- See full pricing in `src/lib/apiClient.ts`

## Setup Instructions

### Option 1: Environment Variable (Recommended)

1. Open `.env.local` in the project root
2. Replace `your_lovable_api_key_here` with your actual API key:
   ```
   VITE_LOVABLE_API_KEY=your_actual_key_here
   ```
3. Save the file
4. Restart the dev server if it's running

### Option 2: Browser localStorage

If you don't want to use environment variables:

1. Start the app: `npm run dev`
2. Open browser DevTools (F12)
3. Go to Console tab
4. Run this command:
   ```javascript
   localStorage.setItem('lovable_api_key', 'your_actual_key_here')
   ```
5. Refresh the page

## How It Works

### Architecture

```
Frontend (React)
    ↓
Local Database (localStorage)
    ↓
API Client (src/lib/apiClient.ts)
    ↓
Lovable AI Gateway
    ↓
OpenAI / Google Gemini
```

### API Functions Implemented

The following edge functions have been replaced with direct API calls:

✅ **parse-resume** - Extract text from resume files (TXT only in local mode)
✅ **rb-classify-jd** - Classify job descriptions (role, level, industry)
✅ **rb-extract-jd-requirements** - Extract requirements from JD
✅ **rb-generate-benchmark** - Generate role benchmarks
✅ **analyze-resume-gaps** - Analyze resume vs requirements
✅ **rb-rewrite-section** - Rewrite resume sections
✅ **rb-hiring-manager-critique** - Generate hiring manager feedback

### Functions NOT Implemented

The following functions require additional setup or are not available in local mode:

❌ **PDF/DOCX Parsing** - Requires server-side processing
❌ **Email Functions** - No email service configured
❌ **Stripe/Payment** - No payment processing
❌ **Database Triggers** - No server-side logic
❌ **Real-time Subscriptions** - Mocked but non-functional

## Testing the Setup

### 1. Verify API Key

Open browser console and run:
```javascript
console.log(import.meta.env.VITE_LOVABLE_API_KEY || localStorage.getItem('lovable_api_key'))
```

You should see your API key (not "your_lovable_api_key_here").

### 2. Test API Call

Try using any AI feature in the app:
- Upload a resume (use .txt file)
- Paste a job description
- Click "Analyze" or "Generate"

Check the browser console for:
- `[LocalDB] Edge function called: [function-name]`
- API responses or errors

### 3. Monitor API Usage

Watch the console for:
```
[LocalDB] Edge function called: rb-classify-jd
```

If you see an error about API key, check your setup.

## Troubleshooting

### "API key not configured"

**Problem:** The app can't find your API key.

**Solutions:**
1. Check `.env.local` has the correct key
2. Restart the dev server after changing `.env.local`
3. Try localStorage method instead
4. Make sure the key starts with `VITE_` in the env file

### "AI API error (401)"

**Problem:** Invalid or expired API key.

**Solutions:**
1. Verify your key is correct
2. Check if your Lovable account is active
3. Generate a new API key from Lovable dashboard

### "AI API error (402)"

**Problem:** No credits remaining.

**Solutions:**
1. Add credits to your Lovable workspace
2. Check your billing settings at lovable.dev

### "AI API error (429)"

**Problem:** Rate limit exceeded.

**Solutions:**
1. Wait a moment and try again
2. The app will automatically retry
3. Consider upgrading your Lovable plan

### "Function not implemented in local mode"

**Problem:** You're trying to use a function that hasn't been implemented yet.

**Solutions:**
1. Check the "Functions NOT Implemented" list above
2. Some features require backend infrastructure
3. You can add implementations in `src/lib/localDatabase.ts`

## Adding More API Functions

To add support for additional edge functions:

1. **Add the API logic** in `src/lib/apiClient.ts`:
   ```typescript
   export async function myNewFunction(params: any, apiKey: string) {
       const response = await callAI({
           messages: [
               { role: 'system', content: 'Your prompt' },
               { role: 'user', content: params.input }
           ],
           model: AI_MODELS.DEFAULT,
       }, apiKey);
       
       return JSON.parse(response.choices[0].message.content);
   }
   ```

2. **Add the route** in `src/lib/localDatabase.ts` functions.invoke:
   ```typescript
   case 'my-new-function':
       if (body.input) {
           const result = await myNewFunction(body, apiKey);
           return { data: result, error: null };
       }
       return { data: null, error: new Error('Missing input') };
   ```

3. **Test it** by calling `supabase.functions.invoke('my-new-function', { body: {...} })`

## Cost Management

### Monitoring Costs

The app logs token usage to the console:
```
Tokens: 1234, Cost: $0.001234
```

### Reducing Costs

1. **Use cheaper models** - Gemini Flash instead of GPT-5
2. **Shorter prompts** - Be concise in your inputs
3. **Cache results** - Store API responses in localStorage
4. **Batch requests** - Combine multiple operations

### Model Selection

Edit `src/lib/apiClient.ts` to change default models:
```typescript
export const AI_MODELS = {
    DEFAULT: 'google/gemini-2.5-flash',  // Cheapest
    PREMIUM: 'openai/gpt-5',              // Best quality
    // ... etc
}
```

## Security Notes

### API Key Security

⚠️ **Important:** Your API key is exposed in the browser!

- **Local development:** This is fine
- **Production:** You MUST use a backend proxy
- **Never commit** your API key to git

### Protecting Your Key

For production deployment:
1. Create a backend API proxy
2. Store the API key on the server
3. Frontend calls your backend
4. Backend calls Lovable AI

Example backend proxy (Node.js/Express):
```javascript
app.post('/api/ai', async (req, res) => {
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.LOVABLE_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
    });
    res.json(await response.json());
});
```

## Next Steps

1. ✅ Get your Lovable API key
2. ✅ Add it to `.env.local` or localStorage
3. ✅ Run `npm install` (if you haven't)
4. ✅ Run `npm run dev`
5. ✅ Test the app with a simple resume analysis
6. ✅ Monitor console for API calls and costs

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify API key is set correctly
3. Check Lovable dashboard for API status
4. Review the troubleshooting section above

---

**Remember:** This setup is for local development and testing. For production, implement proper backend infrastructure with API key protection.
