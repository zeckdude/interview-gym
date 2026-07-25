/** Downsample mono float32 audio to 16 kHz int16 PCM for Deepgram Flux. */
export function float32ToLinear16(input: Float32Array, inputSampleRate: number): ArrayBuffer {
  const targetRate = 16000;
  if (inputSampleRate === targetRate) {
    return encodeLinear16(input);
  }

  const ratio = inputSampleRate / targetRate;
  const outputLength = Math.floor(input.length / ratio);
  const output = new Float32Array(outputLength);

  for (let i = 0; i < outputLength; i += 1) {
    const position = i * ratio;
    const index = Math.floor(position);
    const fraction = position - index;
    const sampleA = input[index] ?? 0;
    const sampleB = input[index + 1] ?? sampleA;
    output[i] = sampleA + (sampleB - sampleA) * fraction;
  }

  return encodeLinear16(output);
}

function encodeLinear16(samples: Float32Array): ArrayBuffer {
  const buffer = new ArrayBuffer(samples.length * 2);
  const view = new DataView(buffer);

  for (let i = 0; i < samples.length; i += 1) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(i * 2, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
  }

  return buffer;
}

export function measureAudioLevel(analyser: AnalyserNode, buffer: Float32Array): number {
  analyser.getFloatTimeDomainData(buffer as Float32Array<ArrayBuffer>);
  let sum = 0;
  for (let i = 0; i < buffer.length; i += 1) {
    sum += buffer[i] * buffer[i];
  }
  return Math.sqrt(sum / buffer.length);
}
