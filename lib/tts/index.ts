import { AzureTSSService } from "./AzureTTSService";
import { VoiceRSSTSSService } from "./VoiceRSSTSSService";
import { BaseTTSService } from "./base";

export const getTTS = ({
    provider = process.env.TTS_PROVIDER || "",
    language = "bg",
}: {
    provider?: string;
    language?: string;
}): BaseTTSService => {
    switch (provider) {
        case "voicerss":
            return new VoiceRSSTSSService(language);
        case "azure":
            return new AzureTSSService(language);
        default:
            throw new Error("Non existing provider");
    }
};
