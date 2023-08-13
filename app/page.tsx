"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";

export default function Home() {
    const [isRecording, setIsRecording] = useState(false);

    const audioChunks = useMemo(() => [] as Blob[], []);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [queryText, setQueryText] = useState<string>("");

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
        </main>
    );
}
