import { AudioMetadata } from "../types";

export const Constants = {
    TRUSTED_CLIENT_TOKEN: '6A5AA1D4EAFF4E9FB37E23D68491D6F4',
    WSS_URL: 'wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1',
    VOICES_URL: 'https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/voices/list',
};

export const AUDIO_FORMAT = 'audio-24khz-48kbitrate-mono-mp3';
export const AUDIO_EXTENSION = '.mp3';

export const AUDIO_METADATA: AudioMetadata = {
        format: 'mp3',
        bitrate: '48k',
        sampleRate: 24000,
        channels: 1,
}