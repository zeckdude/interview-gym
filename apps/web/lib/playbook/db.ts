import type { JobSearchCriteria, PlaybookProfile } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { SEEDED_PLAYBOOK_ENTRIES, type SeedSubsection } from '@/lib/playbook/seed-data';
import { SYSTEM_PLAYBOOK_QUESTIONS } from '@/data/playbook-questions';

const RESUME_CHAR_LIMIT = 12_000;
const LINKEDIN_CHAR_LIMIT = 12_000;
const ADDITIONAL_CONTEXT_CHAR_LIMIT = 4_000;

function truncateField(text: string, limit: number, label: string): string {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit)}\n\n[${label} truncated — ${text.length - limit} more characters in profile]`;
}

export function summarizePlaybookProfile(profile: PlaybookProfile | null): string {
  if (!profile) return 'No profile information provided yet.';

  const parts: string[] = [];

  if (profile.resumeText?.trim()) {
    parts.push(
      `=== RESUME (provided by candidate — use for roles, projects, tech, and outcomes) ===\n${truncateField(profile.resumeText.trim(), RESUME_CHAR_LIMIT, 'Resume')}`
    );
  }

  if (profile.linkedInText?.trim()) {
    parts.push(
      `=== LINKEDIN PROFILE TEXT (provided by candidate) ===\n${truncateField(profile.linkedInText.trim(), LINKEDIN_CHAR_LIMIT, 'LinkedIn profile')}`
    );
  }

  const links: string[] = [];
  if (profile.linkedInUrl) links.push(`LinkedIn URL: ${profile.linkedInUrl}`);
  if (profile.portfolioUrl) links.push(`Portfolio: ${profile.portfolioUrl}`);
  if (profile.githubUrl) links.push(`GitHub: ${profile.githubUrl}`);
  if (profile.personalWebsite) links.push(`Website: ${profile.personalWebsite}`);
  if (links.length) parts.push(`=== LINKS ===\n${links.join('\n')}`);

  if (profile.additionalContext?.trim()) {
    parts.push(
      `=== ADDITIONAL CONTEXT ===\n${truncateField(profile.additionalContext.trim(), ADDITIONAL_CONTEXT_CHAR_LIMIT, 'Additional context')}`
    );
  }

  return parts.length > 0 ? parts.join('\n\n') : 'No profile information provided yet.';
}

export function summarizePlaybookEntries(
  entries: Array<{
    title: string;
    category: string;
    summary: string | null;
    questionPrompt: string | null;
  }>
): string {
  if (!entries.length) return 'No playbook entries yet.';

  return entries
    .map((entry) => {
      const bits = [`- **${entry.title}** (${entry.category})`];
      if (entry.summary) bits.push(`Summary: ${entry.summary}`);
      if (entry.questionPrompt) bits.push(`Interview Q: ${entry.questionPrompt}`);
      return bits.join(' — ');
    })
    .join('\n');
}

export function summarizeJobSearchCriteria(criteria: JobSearchCriteria | null): string {
  if (!criteria) return 'No specific job search criteria set.';

  const parts: string[] = [];
  if (criteria.targetRoles.length) parts.push(`Target roles: ${criteria.targetRoles.join(', ')}`);
  if (criteria.targetCompanyStage.length)
    parts.push(`Company stage: ${criteria.targetCompanyStage.join(', ')}`);
  if (criteria.targetIndustries.length)
    parts.push(`Industries: ${criteria.targetIndustries.join(', ')}`);
  if (criteria.preferredStack.length)
    parts.push(`Preferred stack: ${criteria.preferredStack.join(', ')}`);
  if (criteria.locationPreference) parts.push(`Location: ${criteria.locationPreference}`);
  if (criteria.salaryMin || criteria.salaryMax) {
    parts.push(`Salary: $${criteria.salaryMin ?? '?'} – $${criteria.salaryMax ?? '?'}`);
  }
  if (criteria.mustHaves.length) parts.push(`Must-haves: ${criteria.mustHaves.join('; ')}`);
  if (criteria.dealBreakers.length) parts.push(`Deal-breakers: ${criteria.dealBreakers.join('; ')}`);
  if (criteria.additionalNotes) parts.push(`Notes: ${criteria.additionalNotes}`);

  return parts.join('\n');
}

export async function ensurePlaybookProfile(userId: string): Promise<void> {
  await prisma.playbookProfile.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
}

export async function ensurePlaybookInitialized(userId: string): Promise<void> {
  await ensurePlaybookProfile(userId);

  const existingEntries = await prisma.playbookEntry.count({ where: { userId } });
  if (existingEntries > 0) return;

  const systemQuestionCount = await prisma.playbookQuestion.count({
    where: { isSystemDefault: true, userId: null },
  });

  if (systemQuestionCount === 0) {
    await prisma.playbookQuestion.createMany({
      data: SYSTEM_PLAYBOOK_QUESTIONS.map((q) => ({
        category: q.category,
        questionText: q.questionText,
        isSystemDefault: true,
        mostAsked: q.mostAsked,
        userId: null,
      })),
    });
  }

  for (const entry of SEEDED_PLAYBOOK_ENTRIES) {
    await prisma.playbookEntry.create({
      data: {
        userId,
        category: entry.category,
        title: entry.title,
        summary: entry.summary,
        questionPrompt: entry.questionPrompt,
        order: SEEDED_PLAYBOOK_ENTRIES.indexOf(entry),
        isSeeded: true,
        subsections: {
          create: entry.subsections.map((s: SeedSubsection) => ({
            label: s.label,
            textContent: s.textContent,
            order: s.order,
          })),
        },
      },
    });
  }
}

export async function getPlaybookContextForUser(userId: string) {
  const [profile, criteria, entries] = await Promise.all([
    prisma.playbookProfile.findUnique({ where: { userId } }),
    prisma.jobSearchCriteria.findUnique({ where: { userId } }),
    prisma.playbookEntry.findMany({
      where: { userId },
      select: {
        title: true,
        category: true,
        summary: true,
        questionPrompt: true,
      },
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    }),
  ]);

  return {
    profile,
    criteria,
    entries,
    profileSummary: summarizePlaybookProfile(profile),
    criteriaSummary: summarizeJobSearchCriteria(criteria),
    entriesSummary: summarizePlaybookEntries(entries),
  };
}

export interface PickPlaybookQuestionsOptions {
  categories: string[];
  difficulty: 'easy' | 'intermediate' | 'advanced' | 'mixed';
  count: number;
  mostAskedOnly?: boolean;
  customQuestionTexts?: string[];
}

export async function pickPlaybookQuestions(
  userId: string,
  options: PickPlaybookQuestionsOptions
): Promise<{ id: string; questionText: string; category: string }[]> {
  if (options.customQuestionTexts?.length) {
    return options.customQuestionTexts.slice(0, options.count).map((text, i) => ({
      id: `custom-${i}`,
      questionText: text,
      category: 'mixed',
    }));
  }

  const questions = await prisma.playbookQuestion.findMany({
    where: {
      category: { in: options.categories },
      OR: [{ isSystemDefault: true, userId: null }, { userId }],
      ...(options.mostAskedOnly ? { mostAsked: true } : {}),
    },
  });

  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, options.count).map((q) => ({
    id: q.id,
    questionText: q.questionText,
    category: q.category,
  }));
}
