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