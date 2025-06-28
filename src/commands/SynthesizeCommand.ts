import { Command } from 'commander';
import { EdgeTTS } from '../services/EdgeTTS';

export const SynthesizeCommand = new Command('synthesize')
  .description('Edge TTS: synthesize text to audio')
  .option('-t, --text <text>', 'Text to convert to audio')
  .option('-v, --voice [voice]', 'Voice to use for the audio synthesis', 'en-US-AriaNeural')
  .option('-r, --rate [rate]', 'Rate of speech', '0%')
  .option('-l, --volume [volume]', 'Volume of speech', '0%')
  .option('-p, --pitch [pitch]', 'Pitch of speech', '0Hz')
  .option('-o, --output [output]', 'Output file name', `output_${Date.now()}`)
  .action(async (options) => {
    const { text, voice, pitch, rate, volume, output } = options;

    if (!text) {
      console.error('Text is required');
      process.exit(1);
    }

    try {
      const tts = new EdgeTTS();
      
      // Use new API: synthesize returns SynthesisResult
      const result = await tts.synthesize(text, voice, { 
        pitch: parseInt(pitch) || 0, 
        rate: parseInt(rate) || 0, 
        volume: parseInt(volume) || 0 
      });
      
      // Use result methods instead of EdgeTTS instance methods
      await result.toFile(`${output}`);
      
      console.log(`Audio file generated: ${output}.mp3`);
      console.log(`File size: ${result.getSize()} bytes`);
      console.log(`Audio format: ${result.getFormat()}`);
    } catch (error) {
      console.error(`Error during synthesis: ${(error as Error).message}`);
      process.exit(1);
    }
  });
