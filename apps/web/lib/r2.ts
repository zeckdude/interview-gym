import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID?.trim() &&
      process.env.R2_ACCESS_KEY_ID?.trim() &&
      process.env.R2_SECRET_ACCESS_KEY?.trim() &&
      process.env.R2_BUCKET_NAME?.trim()
  );
}

function getR2Client(): S3Client {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

function extensionForContentType(contentType: string): string {
  const normalized = contentType.split(';')[0].trim().toLowerCase();
  if (normalized.includes('mp4') || normalized.includes('m4a')) return 'mp4';
  if (normalized.includes('mpeg') || normalized.includes('mp3')) return 'mp3';
  if (normalized.includes('wav')) return 'wav';
  return 'webm';
}

export async function uploadAudioClip(
  audioBuffer: Buffer,
  userId: string,
  sessionId: string,
  exchangeOrder: number,
  contentType = 'audio/webm'
): Promise<string> {
  const ext = extensionForContentType(contentType);
  const key = `voice-interviews/${userId}/${sessionId}/answer-${exchangeOrder}.${ext}`;

  if (!isR2Configured()) {
    const base64 = audioBuffer.toString('base64');
    const mime = contentType.split(';')[0].trim() || 'audio/webm';
    return `data:${mime};base64,${base64}`;
  }

  const r2 = getR2Client();
  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: audioBuffer,
      ContentType: contentType.split(';')[0].trim() || 'audio/webm',
    })
  );

  const publicUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, '');
  if (publicUrl) {
    return `${publicUrl}/${key}`;
  }

  return key;
}

export async function uploadPlaybookAudio(
  audioBuffer: Buffer,
  userId: string,
  entryId: string,
  subsectionId: string,
  contentType = 'audio/webm'
): Promise<string> {
  const ext = extensionForContentType(contentType);
  const key = `playbook/${userId}/${entryId}/${subsectionId}.${ext}`;

  if (!isR2Configured()) {
    const base64 = audioBuffer.toString('base64');
    const mime = contentType.split(';')[0].trim() || 'audio/webm';
    return `data:${mime};base64,${base64}`;
  }

  const r2 = getR2Client();
  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: audioBuffer,
      ContentType: contentType.split(';')[0].trim() || 'audio/webm',
    })
  );

  const publicUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, '');
  if (publicUrl) {
    return `${publicUrl}/${key}`;
  }

  return key;
}
