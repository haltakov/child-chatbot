"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";

export default function Home() {
    const [isRecording, setIsRecording] = useState(false);

    const audioChunks = useMemo(() => [] as Blob[], []);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [queryText, setQueryText] = useState<string>("");
    const [answerText, setAnswerText] = useState<string>("");

    useEffect(() => {
        (async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

            mediaRecorder.ondataavailable = function (event) {
                audioChunks.push(event.data);
            };

            setMediaRecorder(mediaRecorder);
        })();
    }, [audioChunks]);

    useEffect(() => {
        if (!audioBlob) return;

        transcribeAudio();
    }, [audioBlob]);

    useEffect(() => {
        if (!queryText) return;

        answerQuestion();
    }, [queryText]);

    useEffect(() => {
        (async () => {
            if (!answerText) return;

            const formData = new FormData();
            formData.append("key", "2d1951beb76d44cebbdb5b379fdf6cde");
            formData.append("src", answerText);
            formData.append("hl", "bg-bg");
            formData.append("c", "OGG");
            const response = await axios.post("https://api.voicerss.org/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                responseType: "arraybuffer",
            });

            const blob = new Blob([response.data], { type: "audio/ogg" });
            const audioUrl = URL.createObjectURL(blob);

            const playerRef = document.getElementById("player2") as HTMLAudioElement;
            if (playerRef) {
                playerRef.src = audioUrl;
                playerRef.play();
            }

            console.log(response);
        })();
    }, [answerText]);

    const startRecording = async () => {
        if (!mediaRecorder || isRecording) return;

        setIsRecording(true);

        audioChunks.splice(0, audioChunks.length);
        mediaRecorder.start();
    };

    const stopRecording = async () => {
        if (!mediaRecorder || !isRecording) return;

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
            setAudioBlob(audioBlob);

            const audioUrl = URL.createObjectURL(audioBlob);

            const playerRef = document.getElementById("player") as HTMLAudioElement;
            if (playerRef) {
                playerRef.src = audioUrl;
            }

            setIsRecording(false);
        };

        mediaRecorder.stop();
    };

    const transcribeAudio = async () => {
        if (!audioBlob) return;

        const formData = new FormData();
        formData.append("audio", audioBlob, "audio.webm");

        const { data } = await axios.post("/api/transcribe", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        setQueryText(data.text);
    };

    const answerQuestion = async () => {
        const { data } = await axios.post("/api/answer", {
            question: queryText,
        });

        setAnswerText(data.answer);
    };

    return (
        <main className="">
            <h1>Leoline</h1>
            <div>
                <button disabled={!mediaRecorder} onClick={() => (isRecording ? stopRecording() : startRecording())}>
                    {isRecording ? "Stop" : "Record"}
                </button>
            </div>
            <div>
                <audio id="player" controls></audio>
            </div>
            <div>
                <p>{queryText}</p>
            </div>
            <div>
                <p>{answerText}</p>
            </div>
            <div>
                <audio id="player2" controls></audio>
            </div>
        </main>
    );
}
