#!/usr/bin/env node

import { EdgeTTS, EdgeTTSGender, SynthesisResult } from './index';

async function runExamples() {
    console.log('🚀 Starting EdgeTTS Examples...\n');
    
    const tts = new EdgeTTS();
    
    try {
        // Example 1: Basic Text-to-Speech
        console.log('📝 Example 1: Basic Text-to-Speech');
        const basicResult = await tts.synthesize(
            "Hello world! This is a basic text-to-speech example using EdgeTTS Enhanced.",
            'en-US-AriaNeural'
        );
        
        await basicResult.toFile('examples/example1-basic');
        console.log(`✅ Generated: examples/example1-basic.mp3`);
        console.log(`📊 Size: ${basicResult.getSize()} bytes, Format: ${basicResult.getFormat()}\n`);
        
        // Example 2: Different Voice (Male)
        console.log('🎭 Example 2: Different Voice (Male)');
        const maleVoiceResult = await tts.synthesize(
            "This is spoken with a male voice. The voice quality should be different from the previous example.",
            'en-US-GuyNeural'
        );
        
        await maleVoiceResult.toFile('examples/example2-male-voice');
        console.log(`✅ Generated: examples/example2-male-voice.mp3`);
        console.log(`📊 Size: ${maleVoiceResult.getSize()} bytes\n`);
        
        // Example 3: With Synthesis Options
        console.log('⚙️ Example 3: Custom Voice Settings');
        const customResult = await tts.synthesize(
            "This audio has custom settings: slower speed, higher pitch, and louder volume!",
            'en-US-JennyNeural',
            {
                rate: -20,    // Slower speech
                pitch: 15,    // Higher pitch
                volume: 25    // Louder
            }
        );
        
        await customResult.toFile('examples/example3-custom-settings');
        console.log(`✅ Generated: examples/example3-custom-settings.mp3`);
        console.log(`📊 Size: ${customResult.getSize()} bytes\n`);
        
        // Example 4: Vietnamese Voice
        console.log('🇻🇳 Example 4: Vietnamese Voice');
        const vietnameseResult = await tts.synthesize(
            "Xin chào! Đây là ví dụ chuyển đổi tiếng Việt thành giọng nói sử dụng EdgeTTS Enhanced.",
            'vi-VN-HoaiMyNeural'
        );
        
        await vietnameseResult.toFile('examples/example4-vietnamese');
        console.log(`✅ Generated: examples/example4-vietnamese.mp3`);
        console.log(`📊 Size: ${vietnameseResult.getSize()} bytes\n`);
        
        // Example 5: Long Text
        console.log('📚 Example 5: Long Text');
        const longText = `
            The EdgeTTS Enhanced package is a powerful and improved text-to-speech solution.
            It provides access to Microsoft Edge's text-to-speech service without requiring 
            Microsoft Edge, Windows, or an API key. This enhanced version includes a better API design 
            with the SynthesisResult pattern, comprehensive TypeScript support, and full unit test coverage.
            The package is thread-safe, immutable, and provides excellent error handling capabilities.
        `;
        
        const longResult = await tts.synthesize(longText.trim(), 'en-US-AriaNeural');
        await longResult.toFile('examples/example5-long-text');
        console.log(`✅ Generated: examples/example5-long-text.mp3`);
        console.log(`📊 Size: ${longResult.getSize()} bytes\n`);
        
        // Example 6: Test All Export Methods
        console.log('🔧 Example 6: Test All Export Methods');
        const testResult = await tts.synthesize(
            "Testing all export methods of SynthesisResult object.",
            'en-US-AriaNeural'
        );
        
        // Test all methods
        const base64Audio = testResult.toBase64();
        const rawAudio = testResult.toRaw();
        const audioBuffer = testResult.getBuffer();
        const audioSize = testResult.getSize();
        const audioFormat = testResult.getFormat();
        
        // Save to file
        await testResult.toFile('examples/example6-all-methods');
        
        console.log(`✅ Generated: examples/example6-all-methods.mp3`);
        console.log(`📊 Base64 length: ${base64Audio.length}`);
        console.log(`📊 Raw audio length: ${rawAudio.length}`);
        console.log(`📊 Buffer length: ${audioBuffer.length}`);
        console.log(`📊 Size: ${audioSize} bytes`);
        console.log(`📊 Format: ${audioFormat}`);
        console.log(`🔍 Base64 === Raw: ${base64Audio === rawAudio}`);
        console.log(`🔍 Buffer size === Size: ${audioBuffer.length === audioSize}\n`);
        
        // Example 7: Error Handling Test
        console.log('⚠️ Example 7: Error Handling Test');
        try {
            await tts.synthesize(
                "This will test error handling with invalid options.",
                'en-US-AriaNeural',
                {
                    pitch: 150, // Invalid - should be -100 to 100
                    rate: 0,
                    volume: 0
                }
            );
        } catch (error) {
            console.log(`✅ Caught expected error: ${(error as Error).message}\n`);
        }
        
        // Example 8: Get Available Voices
        console.log('🎤 Example 8: Available Voices');
        const voices = await tts.getVoices();
        console.log(`📋 Total voices available: ${voices.length}`);
        
        // Show some voice examples
        const englishVoices = voices.filter(v => v.Locale.startsWith('en-US')).slice(0, 5);
        const vietnameseVoices = voices.filter(v => v.Locale.startsWith('vi-VN')).slice(0, 3);
        
        console.log(`🇺🇸 English (US) voices (first 5):`);
        englishVoices.forEach(voice => {
            console.log(`   - ${voice.ShortName} (${voice.Gender})`);
        });
        
        console.log(`🇻🇳 Vietnamese voices:`);
        vietnameseVoices.forEach(voice => {
            console.log(`   - ${voice.ShortName} (${voice.Gender})`);
        });
        
        console.log('\n🎉 All examples completed successfully!');
        console.log('📁 Check the examples/ folder for generated audio files.');
        
    } catch (error) {
        console.error('❌ Error running examples:', (error as Error).message);
        process.exit(1);
    }
}

// Run examples if this file is executed directly
if (require.main === module) {
    runExamples();
}

export { runExamples };
