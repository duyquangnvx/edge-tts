# Edge TTS

**Edge TTS** is a powerful Text-to-Speech (TTS) package that leverages Microsoft's Edge capabilities. This package allows you to synthesize speech from text and manage voice options easily through a command-line interface (CLI).

## Features

- **Text-to-Speech**: Convert text into natural-sounding speech using Microsoft Edge's TTS capabilities.
- **Multiple Voices**: Access a variety of voices to suit your project's needs.
- **Audio Export Options**: Export synthesized audio in different formats (raw, base64, or directly to a file).
- **Command-Line Interface**: Use a simple CLI for easy access to functionality.
- **Easy Integration**: Modular structure allows for easy inclusion in existing projects.

## Installation

You can install Edge TTS via npm. Run the following command in your terminal:

```bash
bun add @andresaya/edge-tts
```
```bash
npm install @andresaya/edge-tts
```


## Usage
Command-Line Interface

You can install Edge TTS via npm. bun  Run the following command in your terminal:

```bash
npm install -g @andresaya/edge-tts
```

To synthesize speech from text, use the following command:
```bash
edge-tts synthesize -t "Hello, world!" -o hello_world_audio
```

To list available voices, run:

```bash
edge-tts voice-list
```

Integration into Your Project
To use Edge TTS in your Bun project, you can import it like this:

```js
import { EdgeTTS } from '@andresaya/edge-tts';

// Initialize the EdgeTTS service
const tts = new EdgeTTS();

// Get voices
const voices = await tts.getVoices();  
console.log(voices);  // Display available voices

// Synthesize text with options for voice, rate, volume, and pitch
// NEW API: synthesize() now returns a SynthesisResult object
const result = await tts.synthesize("Hello, world!", 'en-US-AriaNeural', {
    rate: 0,          // Speech rate (range: -100 to 100)
    volume: 0,        // Speech volume (range: -100 to 100)
    pitch: 0          // Voice pitch (range: -100 to 100)
});

// Export synthesized audio using result methods
const base64Audio = result.toBase64();   // Get audio as base64
await result.toFile("output_audio");     // Save audio to file
const rawAudio = result.toRaw();         // Get raw audio buffer (same as base64)

// Additional result methods
const audioBuffer = result.getBuffer();  // Get Buffer directly
const audioSize = result.getSize();      // Get audio size in bytes
const audioFormat = result.getFormat();  // Get audio format (mp3)

console.log(`Generated audio: ${audioSize} bytes, format: ${audioFormat}`);
```

## Export Options
The `SynthesisResult` object provides various methods to work with the generated audio:

- `toBase64()`: Returns the audio as a Base64 string.
- `toFile(outputPath)`: Saves the audio to a specified file (automatically adds .mp3 extension).
- `toRaw()`: Returns the raw audio buffer (identical to toBase64()).
- `getBuffer()`: Returns the Buffer object directly for advanced manipulation.
- `getSize()`: Returns the audio size in bytes.
- `getFormat()`: Returns the audio format (currently 'mp3').

## PHP Version
If you want to use Edge TTS with PHP, you can check out the PHP version of this package, [Edge TTS PHP](https://github.com/andresayac/edge-tts-php)


## License
This project is licensed under the GNU General Public License v3 (GPLv3).

## Acknowledgments

We would like to extend our gratitude to the developers and contributors of the following projects for their inspiration and groundwork:

* https://github.com/rany2/edge-tts/tree/master/examples
* https://github.com/rany2/edge-tts/blob/master/src/edge_tts/util.py
* https://github.com/hasscc/hass-edge-tts/blob/main/custom_components/edge_tts/tts.py