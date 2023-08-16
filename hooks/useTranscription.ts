import axios from "axios";
import { useEffect, useState } from "react";

interface Props {
    audioBlob: Blob | null;
}

const useTranscription = ({ audioBlob }: Props) => {
    const [questionText, setQuestionText] = useState<string>("");

    useEffect(() => {
        if (!audioBlob) return;

        (async () => {
            const formData = new FormData();
            formData.append("audio", audioBlob, "audio.mp4");

            const { data } = await axios.post("/api/transcribe", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setQuestionText(data.text);
        })();
    }, [audioBlob]);

    return { questionText };
};

export default useTranscription;
