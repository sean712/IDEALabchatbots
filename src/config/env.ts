export const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
export const OPENAI_ASSISTANT_ID = import.meta.env.VITE_OPENAI_ASSISTANT_ID;

if (!OPENAI_API_KEY) {
  console.error('Missing OPENAI_API_KEY environment variable');
}

if (!OPENAI_ASSISTANT_ID) {
  console.error('Missing OPENAI_ASSISTANT_ID environment variable');
}