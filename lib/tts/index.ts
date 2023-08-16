import { VoiceRSSTSSService } from "./VoiceRSSTSSService";
import { BaseTTSService } from "./base";

export const getTTS = ({
    provider = process.env.NEXT_PUBLIC_TTS_PROVIDER || "",
    language = "bg",
}: {
    provider?: string;
    language?: string;
}): BaseTTSService => {
    switch (provider) {
        case "voicerss":
            return new VoiceRSSTSSService(language);
        default:
            throw new Error("Non existing provider");
    }
};
