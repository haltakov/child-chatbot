import { BaseTTSService } from "../base";
import axios from "axios";

export class VoiceRSSTSSService extends BaseTTSService {
    hl: string;

    constructor(language: string = "en") {
        super(language);

        switch (language) {
            case "bg":
                this.hl = "bg-bg";
                break;
            default:
                this.hl = "en-us";
                break;
        }
    }

    async speak(text: string): Promise<ArrayBuffer> {
        const formData = new FormData();
        formData.append("key", process.env.VOICERSS_API_KEY || "");
        formData.append("src", text);
        formData.append("hl", this.hl);
        formData.append("c", "WAV");
        const response = await axios.post("https://api.voicerss.org/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            responseType: "arraybuffer",
        });

        return response.data;

        // const blob = new Blob([response.data], { type: "audio/wav" });
        // return URL.createObjectURL(blob);
    }
}
