#!/usr/bin/env node

import { SynthesizeCommand } from '../commands/SynthesizeCommand';
import { VoiceListCommand } from '../commands/VoiceListCommand';
import { Command } from 'commander';

const program = new Command();

program
    .name('edge-tts')
    .description('Enhanced Edge TTS - Text-to-Speech using Microsoft Edge with improved API')
    .version('2.0.2')
    .addCommand(SynthesizeCommand)
    .addCommand(VoiceListCommand);

try {
    program.parse();
} catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
}
