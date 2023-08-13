"use client";

import { useEffect, useMemo, useState } from "react";

export default function Home() {
    const [isRecording, setIsRecording] = useState(false);

    const audioChunks = useMemo(() => [] as Blob[], []);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

    useEffect(() => {
        (async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

            mediaRecorder.ondataavailable = function (event) {
                audioChunks.push(event.data);
                console.log(audioChunks);
            };

            setMediaRecorder(mediaRecorder);
        })();
    }, [audioChunks]);

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
            const audioUrl = URL.createObjectURL(audioBlob);

            const playerRef = document.getElementById("player") as HTMLAudioElement;
            if (playerRef) {
                playerRef.src = audioUrl;
            }

            setIsRecording(false);
        };

        mediaRecorder.stop();
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
        </main>
    );
}
