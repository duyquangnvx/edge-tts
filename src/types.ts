export enum EdgeTTSGender {
    MALE = 'Male',
    FEMALE = 'Female',
    NEUTRAL = 'Neutral'
}

export interface EdgeTTSVoice {
    Name: string;
    DisplayName: string;
    ShortName: string;
    Gender: EdgeTTSGender;
    Locale: string;
    VoiceType: string;
}

export interface SynthesisOptions {
    pitch?: number; // Hz, -100 to 100
    rate?: number;  // Percentage, -100 to 100
    volume?: number; // Percentage, -100 to 100
}

export interface AudioMetadata {
    format: string;
    bitrate: string;
    sampleRate: number;
    channels: number;
}

export interface SynthesisResult {
    /**
     * Convert audio data to Base64 string
     */
    toBase64(): string;
    
    /**
     * Save audio data to file
     * @param outputPath - Output file path (without extension)
     */
    toFile(outputPath: string): Promise<void>;
    
    /**
     * Get raw audio buffer (identical to toBase64)
     * @deprecated Use toBase64() instead
     */
    toRaw(): string;
    
    /**
     * Get audio buffer directly
     */
    getBuffer(): Buffer;
    
    /**
     * Get audio format
     */
    getFormat(): string;

    /**
     * Get audio metadata
     */
    getMetadata(): AudioMetadata;
    
    /**
     * Get audio size in bytes
     */
    getSize(): number;
}  