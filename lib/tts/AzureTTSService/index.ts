import { BaseTTSService } from "../base";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

export class AzureTSSService extends BaseTTSService {
    synthesizer: sdk.SpeechSynthesizer;

    constructor(language: string = "en") {
        super(language);

        const speechConfig = sdk.SpeechConfig.fromSubscription(
            process.env.AZURE_SPEECH_KEY || "",
            process.env.AZURE_SPEECH_REGION || ""
        );

        const audioConfig = sdk.AudioConfig.fromAudioFileOutput("speech.wav");

        switch (language) {
            case "bg":
                // speechConfig.speechSynthesisVoiceName = "bg-BG-BorislavNeural";
                speechConfig.speechSynthesisVoiceName = "bg-BG-KalinaNeural";
                break;
            default:
                speechConfig.speechSynthesisVoiceName = "en-US-JennyMultilingualNeural";
                break;
        }

        this.synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
    }

    async speak(text: string): Promise<ArrayBuffer> {
        // Return a promise that resolves when utterance playback is finished
        return new Promise((resolve, reject) => {
            this.synthesizer.speakTextAsync(
                text,
                (result) => {
                    if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                        resolve(result.audioData);
                    } else {
                        console.error("Speech synthesis canceled, " + result.errorDetails);
                        reject(result.errorDetails);
                    }
                },
                (err) => {
                    console.trace("Speech synthesis error, " + err);
                    reject(err);
                }
            );
        });
    }
}
