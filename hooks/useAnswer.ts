import axios from "axios";
import { useEffect, useState } from "react";

interface Props {
    questionText: string;
}

const useAnswer = ({ questionText }: Props) => {
    const [answerText, setAnswerText] = useState<string>("");

    useEffect(() => {
        if (!questionText) return;

        (async () => {
            const { data } = await axios.post("/api/answer", {
                question: questionText,
            });

            setAnswerText(data.answer);
        })();
    }, [questionText]);

    return { answerText };
};

export default useAnswer;
