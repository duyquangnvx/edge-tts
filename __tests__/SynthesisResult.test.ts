import { describe, it, expect, beforeEach, afterEach, mock } from 'bun:test';
import { EdgeTTS } from '../src/services/EdgeTTS';
import type { SynthesisResult } from '../src/types';
import { writeFileSync } from 'fs';
import { existsSync, readFileSync, unlinkSync } from 'fs';

// Mock WebSocket for testing SynthesisResult
class MockWebSocket {
    url: string;
    onopen: ((event: Event) => void) | null = null;
    onmessage: ((event: MessageEvent) => void) | null = null;
    onclose: ((event: CloseEvent) => void) | null = null;
    onerror: ((event: Event) => void) | null = null;

    constructor(url: string) {
        this.url = url;
        setTimeout(() => {
            this.onopen?.(new Event('open'));
        }, 10);
    }

    send(data: string | Buffer) {
        setTimeout(() => {
            // Simulate receiving audio data with specific test content
            const audioHeader = Buffer.from('Path:audio\r\n');
            const audioData = Buffer.from('test-audio-content-for-synthesis-result');
            const combinedData = Buffer.concat([audioHeader, audioData]);
            this.onmessage?.(new MessageEvent('message', { data: combinedData }));

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

describe('SynthesisResult', () => {
    let edgeTTS: EdgeTTS;
    let synthesisResult: SynthesisResult;
    let originalWebSocket: any;
    let originalFetch: any;

    beforeEach(async () => {
        // Setup mocks
        originalWebSocket = globalThis.WebSocket;
        (globalThis as any).WebSocket = MockWebSocket;
        
        originalFetch = globalThis.fetch;
        globalThis.fetch = mock(() => {
            return Promise.resolve({
                json: () => Promise.resolve([])
            } as Response);
        }) as any;

        // Create EdgeTTS instance and get synthesis result
        edgeTTS = new EdgeTTS();
        synthesisResult = await edgeTTS.synthesize('Test audio content', 'en-US-AriaNeural');
    });

    afterEach(() => {
        // Restore original implementations
        if (originalWebSocket) {
            globalThis.WebSocket = originalWebSocket;
        }
        if (originalFetch) {
            globalThis.fetch = originalFetch;
        }

        // Cleanup test files
        const testFiles = ['test-output.mp3', 'test-file-output.mp3'];
        testFiles.forEach(file => {
            if (existsSync(file)) {
                unlinkSync(file);
            }
        });
    });

    describe('toBase64', () => {
        it('should return base64 encoded audio data', () => {
            const base64Result = synthesisResult.toBase64();
            
            expect(base64Result).toBeDefined();
            expect(typeof base64Result).toBe('string');
            expect(base64Result.length).toBeGreaterThan(0);
            
            // Verify it's valid base64
            const decoded = Buffer.from(base64Result, 'base64');
            expect(decoded.length).toBeGreaterThan(0);
        });

        it('should return consistent base64 result on multiple calls', () => {
            const first = synthesisResult.toBase64();
            const second = synthesisResult.toBase64();
            
            expect(first).toBe(second);
        });
    });

    describe('toFile', () => {
        it('should save audio data to file with correct extension', async () => {
            const outputPath = 'test-output';
            
            await synthesisResult.toFile(outputPath);
            
            const filePath = `${outputPath}.mp3`;
            expect(existsSync(filePath)).toBe(true);
            
            const fileContent = readFileSync(filePath);
            expect(fileContent.length).toBeGreaterThan(0);
        });

        it('should save file with same content as buffer', async () => {
            const outputPath = 'test-file-output';
            
            await synthesisResult.toFile(outputPath);
            
            const fileContent = readFileSync(`${outputPath}.mp3`);
            const bufferContent = synthesisResult.getBuffer();
            
            expect(fileContent.equals(bufferContent)).toBe(true);
        });
    });

    describe('toRaw', () => {
        it('should return same result as toBase64', () => {
            const base64Result = synthesisResult.toBase64();
            const rawResult = synthesisResult.toRaw();
            
            expect(rawResult).toBe(base64Result);
        });
    });

    describe('getBuffer', () => {
        it('should return Buffer instance', () => {
            const buffer = synthesisResult.getBuffer();
            
            expect(Buffer.isBuffer(buffer)).toBe(true);
            expect(buffer.length).toBeGreaterThan(0);
        });

        it('should return buffer with expected content', () => {
            const buffer = synthesisResult.getBuffer();
            const base64 = synthesisResult.toBase64();
            const decodedBase64 = Buffer.from(base64, 'base64');
            
            expect(buffer.equals(decodedBase64)).toBe(true);
        });
    });

    describe('getFormat', () => {
        it('should return mp3 format', () => {
            const format = synthesisResult.getFormat();
            
            expect(format).toBe('mp3');
        });
    });

    describe('getSize', () => {
        it('should return positive number for audio size', () => {
            const size = synthesisResult.getSize();
            
            expect(typeof size).toBe('number');
            expect(size).toBeGreaterThan(0);
        });

        it('should return same size as buffer length', () => {
            const size = synthesisResult.getSize();
            const buffer = synthesisResult.getBuffer();
            
            expect(size).toBe(buffer.length);
        });
    });

    describe('immutability', () => {
        it('should return same results after multiple method calls', () => {
            const base64_1 = synthesisResult.toBase64();
            const buffer_1 = synthesisResult.getBuffer();
            const size_1 = synthesisResult.getSize();
            const format_1 = synthesisResult.getFormat();

            // Call methods multiple times
            synthesisResult.toBase64();
            synthesisResult.getBuffer();
            synthesisResult.getSize();
            synthesisResult.getFormat();

            const base64_2 = synthesisResult.toBase64();
            const buffer_2 = synthesisResult.getBuffer();
            const size_2 = synthesisResult.getSize();
            const format_2 = synthesisResult.getFormat();

            expect(base64_1).toBe(base64_2);
            expect(buffer_1.equals(buffer_2)).toBe(true);
            expect(size_1).toBe(size_2);
            expect(format_1).toBe(format_2);
        });
    });
}); 