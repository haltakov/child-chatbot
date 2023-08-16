export class BaseTTSService {
    language: string;

    constructor(language: string = "en") {
        this.language = language;
    }

    async speak(text: string): Promise<string> {
        throw new Error("Not implemented");
    }
}
