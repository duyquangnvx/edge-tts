import { describe, it, expect, mock, beforeEach, afterEach } from 'bun:test';
import { EdgeTTS } from '../src/services/EdgeTTS';
import type { EdgeTTSVoice, SynthesisResult } from '../src/types';

// Mock data for voices
const mockVoices: EdgeTTSVoice[] = [
    {
        Name: 'Microsoft Server Speech Text to Speech Voice (en-US, AriaNeural)',
        DisplayName: 'Aria',
        ShortName: 'en-US-AriaNeural',
        Gender: 'Female' as any,
        Locale: 'en-US',
        VoiceType: 'Neural'
    },
    {
        Name: 'Microsoft Server Speech Text to Speech Voice (en-US, GuyNeural)',
        DisplayName: 'Guy',
        ShortName: 'en-US-GuyNeural',
        Gender: 'Male' as any,
        Locale: 'en-US',
        VoiceType: 'Neural'
    }
];

// Mock WebSocket
class MockWebSocket {
    url: string;
    onopen: ((event: Event) => void) | null = null;
    onmessage: ((event: MessageEvent) => void) | null = null;
    onclose: ((event: CloseEvent) => void) | null = null;
    onerror: ((event: Event) => void) | null = null;

    constructor(url: string) {
        this.url = url;
        // Simulate connection opening
        setTimeout(() => {
            this.onopen?.(new Event('open'));
        }, 10);
    }

    send(data: string | Buffer) {
        // Simulate receiving audio data
        setTimeout(() => {
            // Simulate audio header
            const audioHeader = Buffer.from('Path:audio\r\n');
            const audioData = Buffer.from('fake-audio-data-123');
            const combinedData = Buffer.concat([audioHeader, audioData]);
            this.onmessage?.(new MessageEvent('message', { data: combinedData }));

            // Simulate turn end
            setTimeout(() => {
                const turnEndData = Buffer.from('Path:turn.end');
                this.onmessage?.(new MessageEvent('message', { data: turnEndData }));
            }, 20);
        }, 20);
    }

    close() {
        setTimeout(() => {
            this.onclose?.(new CloseEvent('close'));
        }, 10);
    }

    on(event: string, handler: Function) {
        if (event === 'open') this.onopen = handler as any;
        if (event === 'message') this.onmessage = handler as any;
        if (event === 'close') this.onclose = handler as any;
        if (event === 'error') this.onerror = handler as any;
    }
}

describe('EdgeTTS', () => {
    let edgeTTS: EdgeTTS;
    let originalWebSocket: any;
    let originalFetch: any;

    beforeEach(() => {
        edgeTTS = new EdgeTTS();
        
        // Mock WebSocket
        originalWebSocket = globalThis.WebSocket;
        (globalThis as any).WebSocket = MockWebSocket;
        
        // Mock fetch for getVoices
        originalFetch = globalThis.fetch;
        globalThis.fetch = mock(() => {
            return Promise.resolve({
                json: () => Promise.resolve(mockVoices)
            } as Response);
        }) as any;
    });

    afterEach(() => {
        // Restore original implementations
        if (originalWebSocket) {
            globalThis.WebSocket = originalWebSocket;
        }
        if (originalFetch) {
            globalThis.fetch = originalFetch;
        }
    });

    describe('getVoices', () => {
        it('should fetch and return voices list', async () => {
            const voices = await edgeTTS.getVoices();
            
            expect(voices).toBeDefined();
            expect(voices).toHaveLength(2);
            expect(voices[0].ShortName).toBe('en-US-AriaNeural');
            expect(voices[1].ShortName).toBe('en-US-GuyNeural');
        });

        it('should call fetch with correct URL and token', async () => {
            await edgeTTS.getVoices();
            
            expect(globalThis.fetch).toHaveBeenCalledWith(
                'https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/voices/list?trustedclienttoken=6A5AA1D4EAFF4E9FB37E23D68491D6F4'
            );
        });
    });

    describe('synthesize', () => {
        it('should synthesize text and return SynthesisResult', async () => {
            const result = await edgeTTS.synthesize('Hello world!', 'en-US-AriaNeural');
            
            expect(result).toBeDefined();
            expect(result.toBase64).toBeDefined();
            expect(result.toFile).toBeDefined();
            expect(result.getBuffer).toBeDefined();
            expect(result.getSize).toBeDefined();
            expect(result.getFormat).toBeDefined();
        });

        it('should use default voice when not specified', async () => {
            const result = await edgeTTS.synthesize('Hello world!');
            expect(result).toBeDefined();
        });

        it('should accept synthesis options', async () => {
            const result = await edgeTTS.synthesize('Hello world!', 'en-US-AriaNeural', {
                pitch: 10,
                rate: 5,
                volume: -10
            });
            expect(result).toBeDefined();
        });

        it('should validate pitch parameter', async () => {
            await expect(edgeTTS.synthesize('Hello', 'en-US-AriaNeural', { pitch: 150 }))
                .rejects
                .toThrow('Invalid pitch value. Expected integer between -100 and 100 Hz.');
        });

        it('should validate rate parameter', async () => {
            await expect(edgeTTS.synthesize('Hello', 'en-US-AriaNeural', { rate: -150 }))
                .rejects
                .toThrow('Invalid rate value. Expected integer between -100 and 100%.');
        });

        it('should validate volume parameter', async () => {
            await expect(edgeTTS.synthesize('Hello', 'en-US-AriaNeural', { volume: 200 }))
                .rejects
                .toThrow('Invalid volume value. Expected integer between -100 and 100%.');
        });
    });

    describe('deprecated methods', () => {
        it('should throw error when calling deprecated toFile method', async () => {
            expect(() => edgeTTS.toFile('output'))
                .toThrow('Method toFile() is deprecated. Use synthesize().then(result => result.toFile(outputPath)) instead.');
        });

        it('should throw error when calling deprecated toBase64 method', () => {
            expect(() => edgeTTS.toBase64())
                .toThrow('Method toBase64() is deprecated. Use synthesize().then(result => result.toBase64()) instead.');
        });

        it('should throw error when calling deprecated toRaw method', () => {
            expect(() => edgeTTS.toRaw())
                .toThrow('Method toRaw() is deprecated. Use synthesize().then(result => result.toRaw()) instead.');
        });
    });
}); 