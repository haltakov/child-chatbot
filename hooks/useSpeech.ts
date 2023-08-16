import axios from "axios";
import { useEffect, useState } from "react";

interface Props {
    text: string;
}

const useSpeech = ({ text }: Props) => {
    const [speechUrl, setSpeechUrl] = useState<string>("");

    useEffect(() => {
        (async () => {
            if (!text) return;

            const { data } = await axios.post(
                "/api/speak",
                {
                    text,
                },
                {
                    responseType: "arraybuffer",
                }
            );

            const blob = new Blob([data], { type: "audio/wav" });
            setSpeechUrl(URL.createObjectURL(blob));
        })();
    }, [text]);

    return { speechUrl };
};

export default useSpeech;
