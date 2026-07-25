import { notFound } from 'next/navigation';
import { allQuestions } from '@/data';
import { QuestionRunner } from '@/components/questions/QuestionRunner';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function QuestionPage({ params }: PageProps) {
  const { id } = await params;
  const question = allQuestions.find((q) => q.id === id);

  if (!question) notFound();

  return <QuestionRunner question={question} />;
}

export async function generateStaticParams() {
  const { allQuestions: questions } = await import('@/data');
  return questions.map((q) => ({ id: q.id }));
}
