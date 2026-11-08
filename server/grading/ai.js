// Optional "Creative Director" notes from Claude. Enabled only when the server
// can find Anthropic credentials (ANTHROPIC_API_KEY in server/.env, or an
// `ant auth login` profile). The rule-based grade never depends on this.
import Anthropic from '@anthropic-ai/sdk';

let client = null;
export const aiEnabled = Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
if (aiEnabled) client = new Anthropic();

function buildPrompt(level, screenIdx, result) {
  const screen = level.rounds[screenIdx];
  const fields = result.fields.map((f, j) => {
    const spec = screen.fields[j];
    return `- ${f.label} (id: ${f.id}, max ${spec.max} chars, brief: "${spec.hint}"): ${f.text ? JSON.stringify(f.text) : '(blank)'}`;
  }).join('\n');

  return `You are a senior UX writing director reviewing a junior writer's work in a training game.

Company: ${level.company}. ${level.business}
Project: ${level.project}
Voice: ${level.tone.label}.
Stakeholders: ${level.stakeholders.map((s) => `${s.name} (${s.role}): "${s.wants}"`).join(' ')}

Screen: ${screen.title}. Goal: ${screen.goal}
The writer's copy:
${fields}

Give a candid, encouraging review. Reply with only JSON in this shape:
{"summary": "2-3 sentences on this screen", "strength": "one specific thing they did well", "focus": "the single habit to work on next", "rewrites": [{"fieldId": "headline", "rewrite": "your improved version, within the character limit", "why": "one short sentence"}]}
Include rewrites only for the 2 weakest pieces of copy.`;
}

function parseJson(text) {
  try { return JSON.parse(text); } catch { /* fall through */ }
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) { try { return JSON.parse(fence[1]); } catch { /* fall through */ } }
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start >= 0 && end > start) return JSON.parse(text.slice(start, end + 1));
  throw new Error('No JSON in response');
}

export async function critique(level, screenIdx, result) {
  if (!client) return null;
  const response = await client.beta.messages.create({
    model: 'claude-opus-5-5',
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'low' },
    messages: [{ role: 'user', content: buildPrompt(level, screenIdx, result) }],
  });
  if (response.stop_reason === 'refusal') return null;
  const text = response.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
  return parseJson(text);
}

// Type Quest: notes on visual hierarchy from the submitted type styles.
export async function critiqueType(level, styles, result) {
  if (!client) return null;
  const rows = level.elements.map((e) => {
    const s = styles?.[e.id] || {};
    return `- "${e.text}" (${e.role}): ${s.size}px, weight ${s.weight}, ${s.tone}${s.upper ? ', uppercase' : ''}${s.tabular ? ', tabular' : ''}`;
  }).join('\n');
  const prompt = `You are a senior product designer specialising in data-dense fintech UI, reviewing a junior designer's typographic hierarchy in a training game. Layout is fixed; they only control size, weight, emphasis, case and tabular numbers.

Screen: ${level.title} for ${level.client}. Brief: ${level.brief} Task: ${level.task}
Their styles:
${rows}
Rule-based score: ${result?.total}/100. Eye path: ${(result?.ranking || []).join(' -> ')}.

Give candid, encouraging feedback grounded in visual hierarchy and Gestalt principles. Reply with only JSON:
{"summary": "2-3 sentences", "strength": "one specific thing done well", "focus": "the single habit to work on next"}`;
  const response = await client.beta.messages.create({
    model: 'claude-opus-5-5', max_tokens: 4000,
    betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default',
    output_config: { effort: 'low' },
    messages: [{ role: 'user', content: prompt }],
  });
  if (response.stop_reason === 'refusal') return null;
  return parseJson(response.content.filter((b) => b.type === 'text').map((b) => b.text).join(''));
}
