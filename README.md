# Edge TTS Enhanced

**Edge TTS Enhanced** is an improved version of the Edge TTS package that provides access to Microsoft Edge's text-to-speech service without requiring Microsoft Edge, Windows, or an API key. This package is forked and developed from **[Andres Aya's](https://github.com/andresayac)** [edge-tts](https://github.com/andresayac/edge-tts) with significant improvements and enhancements.

## ✨ New Features & Improvements

- **🚀 New API with SynthesisResult Pattern**: `synthesize()` returns an object with convenient methods
- **🔒 Thread-Safe & Immutable**: Synthesis results are not affected by multiple calls
- **📝 Full TypeScript Support**: Complete types for all APIs
- **🧪 Comprehensive Unit Tests**: 100% test coverage with Bun test framework
- **⚡ Better Error Handling**: Clear validation and helpful error messages
- **📊 Audio Metadata**: Direct access to size, format, and buffer information
- **🔄 Backward Compatibility**: Migration support from old API

## 🎯 Original Features

- **Text-to-Speech**: Convert text to natural-sounding speech using Microsoft Edge's TTS capabilities
- **Multiple Voices**: Access a variety of voices to suit your project needs
- **Audio Export Options**: Export synthesized audio in multiple formats (raw, base64, or directly to file)
- **Command-Line Interface**: Simple CLI for easy access to functionality
- **Easy Integration**: Modular structure allows easy integration into existing projects

## 📦 Installation

You can install Edge TTS Enhanced via npm or bun:

```bash
bun add @duyquangnvx/edge-tts
```
```bash
npm install @duyquangnvx/edge-tts
```

### Global Installation (CLI)

```bash
npm install -g @duyquangnvx/edge-tts
```

## 🚀 Usage

### Command-Line Interface

To synthesize speech from text, use the following command:

```bash
edge-tts synthesize -t "Hello, world!" -o hello_world_audio
```

To list available voices:

```bash
edge-tts voice-list
```

### Project Integration

**New API (Recommended - v2.0.0+):**

```typescript
import { EdgeTTS, SynthesisResult } from '@duyquangnvx/edge-tts';

// Initialize EdgeTTS service
const tts = new EdgeTTS();

// Get available voices
const voices = await tts.getVoices();  
console.log(voices);

// Synthesize with new API - returns SynthesisResult object
const result: SynthesisResult = await tts.synthesize("Hello, world!", 'en-US-AriaNeural', {
    rate: 0,          // Speech rate (range: -100 to 100)
    volume: 0,        // Volume (range: -100 to 100)
    pitch: 0          // Voice pitch (range: -100 to 100)
});

// Use result object methods
const base64Audio = result.toBase64();         // Get audio as base64
await result.toFile("output_audio");           // Save audio to file
const rawAudio = result.toRaw();               // Get raw audio buffer
const audioBuffer = result.getBuffer();        // Get Buffer directly
const audioSize = result.getSize();            // Get audio size in bytes
const audioFormat = result.getFormat();        // Get audio format (mp3)

console.log(`Generated audio: ${audioSize} bytes, format: ${audioFormat}`);
```

## 📋 Export Options

The `SynthesisResult` object provides various methods to work with generated audio:

- **`toBase64()`**: Returns audio as a Base64 string
- **`toFile(outputPath)`**: Saves audio to file (automatically adds .mp3 extension)
- **`toRaw()`**: Returns raw audio buffer (identical to toBase64())
- **`getBuffer()`**: Returns Buffer object directly for advanced manipulation
- **`getSize()`**: Returns audio size in bytes
- **`getFormat()`**: Returns audio format (currently 'mp3')

## 🧪 Testing

This package includes comprehensive unit tests with Bun test framework:

```bash
bun test                    # Run all tests
bun test --watch           # Watch mode
bun test --coverage        # Coverage report
```

## 🔄 Migration from Old API

If you're using the old API, here's how to migrate:

```typescript
// ❌ Old API (deprecated)
await tts.synthesize(text, voice, options);
const base64 = tts.toBase64();
await tts.toFile("output");

// ✅ New API (recommended)
const result = await tts.synthesize(text, voice, options);
const base64 = result.toBase64();
await result.toFile("output");
```

## 🙏 Credits & Acknowledgments

### Original Author
Special thanks to **[Andres Aya](https://github.com/andresayac)** - the author of the original [edge-tts](https://github.com/andresayac/edge-tts) who created the excellent foundation for this project. This package is forked and developed based on his work.

### Inspirations
We would also like to extend our gratitude to the developers and contributors of the following projects for their inspiration and groundwork:

* [edge-tts Python](https://github.com/rany2/edge-tts/tree/master/examples)
* [edge-tts util.py](https://github.com/rany2/edge-tts/blob/master/src/edge_tts/util.py)  
* [hass-edge-tts](https://github.com/hasscc/hass-edge-tts/blob/main/custom_components/edge_tts/tts.py)

## 📝 License

This project is licensed under the GNU General Public License v3 (GPLv3), same as the original project.

## 🔗 Related Projects

- **Original Package**: [@andresaya/edge-tts](https://www.npmjs.com/package/@andresaya/edge-tts)
- **PHP Version**: [Edge TTS PHP](https://github.com/andresayac/edge-tts-php)