import WebSocket from 'ws';
import { Constants } from '../config/constants';
import type { EdgeTTSVoice, SynthesisOptions } from '../types';
import { writeFileSync } from 'fs';

export class EdgeTTS {
    private audioStream: Buffer[] = [];
    private readonly audioFormat: string = 'mp3';
    private ws: WebSocket | null = null;

    async getVoices(): Promise<EdgeTTSVoice[]> {
        const response = await fetch(
            `${Constants.VOICES_URL}?trustedclienttoken=${Constants.TRUSTED_CLIENT_TOKEN}`
        );
        const voices: EdgeTTSVoice[] = await response.json();

        return voices.map(voice => ({
            Name: voice.Name,
            DisplayName: voice.DisplayName,
            ShortName: voice.ShortName,
            Gender: voice.Gender,
            Locale: voice.Locale,
            VoiceType: voice.VoiceType,
        }));
    }

    private generateUUID(): string {
        return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
            const random = Math.random() * 16 | 0;
            const value = char === 'x' ? random : (random & 0x3 | 0x8);
            return value.toString(16);
        });
    }

    private validatePitch(pitch: number): number {
        if (!Number.isInteger(pitch) || pitch < -100 || pitch > 100) {
            throw new Error("Invalid pitch value. Expected integer between -100 and 100 Hz.");
        }
        return pitch;
    }

    private validateRate(rate: number): number {
        if (!Number.isInteger(rate) || rate < -100 || rate > 100) {
            throw new Error("Invalid rate value. Expected integer between -100 and 100%.");
        }
        return rate;
    }

    private validateVolume(volume: number): number {
        if (!Number.isInteger(volume) || volume < -100 || volume > 100) {
            throw new Error("Invalid volume value. Expected integer between -100 and 100%.");
        }
        return volume;
    }

    async synthesize(
        text: string,
        voice: string = 'en-US-AnaNeural',
        options: SynthesisOptions = {}
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const requestId = this.generateUUID();
            this.ws = new WebSocket(
                `${Constants.WSS_URL}?trustedclienttoken=${Constants.TRUSTED_CLIENT_TOKEN}&ConnectionId=${requestId}`
            );

            const ssmlText = this.getSSML(text, voice, options);

            this.ws.on('open', () => {
                if (!this.ws) return;

                const configMessage = this.buildTTSConfigMessage();
                this.ws.send(configMessage);

                const speechMessage = this.buildSpeechMessage(requestId, ssmlText);
                this.ws.send(speechMessage);
            });

            this.ws.on('message', (data: Buffer) => {
                this.processAudioData(data);
            });

            this.ws.on('close', () => {
                resolve();
            });

            this.ws.on('error', (error: Error) => {
                reject(error);
            });
        });
    }

    private getSSML(text: string, voice: string, options: SynthesisOptions): string {
        const pitch = this.validatePitch(options.pitch ?? 0);
        const rate = this.validateRate(options.rate ?? 0);
        const volume = this.validateVolume(options.volume ?? 0);

        return `<speak version='1.0' xml:lang='en-US'>
      <voice name='${voice}'>
        <prosody pitch='${pitch}Hz' rate='${rate}%' volume='${volume}%'>
          ${text}
        </prosody>
      </voice>
    </speak>`;
    }

    private buildTTSConfigMessage(): string {
        const timestamp = new Date().toISOString() + 'Z';
        return `X-Timestamp:${timestamp}\r\n` +
            `Content-Type:application/json; charset=utf-8\r\n` +
            `Path:speech.config\r\n\r\n` +
            JSON.stringify({
                context: {
                    synthesis: {
                        audio: {
                            metadataoptions: {
                                sentenceBoundaryEnabled: false,
                                wordBoundaryEnabled: true
                            },
                            outputFormat: 'audio-24khz-48kbitrate-mono-mp3'
                        }
                    }
                }
            });
    }

    private buildSpeechMessage(requestId: string, ssmlText: string): string {
        const timestamp = new Date().toISOString() + 'Z';
        return `X-RequestId:${requestId}\r\n` +
            `Content-Type:application/ssml+xml\r\n` +
            `X-Timestamp:${timestamp}\r\n` +
            `Path:ssml\r\n\r\n${ssmlText}`;
    }

    private processAudioData(data: Buffer): void {
        const needle = Buffer.from('Path:audio\r\n');
        const uint8Data = new Uint8Array(data);
        const startIndex = uint8Data.indexOf(needle[0]);

        if (startIndex !== -1) {
            const audioData = data.subarray(startIndex + needle.length);
            this.audioStream.push(audioData);
        }

        if (data.includes('Path:turn.end')) {
            this.ws?.close();
        }
    }

    async toFile(outputPath: string): Promise<void> {
        if (this.audioStream.length === 0) {
            throw new Error('No audio data available to save.');
        }

        const audioBuffer = Buffer.concat(this.audioStream);
        writeFileSync(`${outputPath}.${this.audioFormat}`, audioBuffer);
    }

    toBase64(): string {
        if (this.audioStream.length === 0) {
            throw new Error('No audio data available.');
        }

        const audioBuffer = Buffer.concat(this.audioStream);
        return audioBuffer.toString('base64');
    }

    // Deprecated: toRaw is identical to toBase64
    toRaw(): string {
        return this.toBase64();
    }
}