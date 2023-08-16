"use client";

import useAnswer from "@/hooks/useAnswer";
import useRecording from "@/hooks/useRecording";
import useSpeech from "@/hooks/useSpeech";
import useTranscription from "@/hooks/useTranscription";
import { useEffect, useRef, useState } from "react";

const Home = () => {
    const [isAdminView, setIsAdminView] = useState(false);

    const speechPlayerRef = useRef<HTMLAudioElement>(null);

    const { isRecording, audioBlob, startRecording, stopRecording, isRecordingReady } = useRecording();
    const { questionText } = useTranscription({ audioBlob });
    const { answerText } = useAnswer({ questionText });
    const { speechUrl } = useSpeech({ text: answerText });

    const handleRecording = () => {
        // Play an empty sound on the first button press to circumvent iOS limitations
        if (!speechUrl) {
            speechPlayerRef.current?.play();
        }

        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    // Play the synthesized speech
    useEffect(() => {
        if (!speechUrl) return;

        if (speechPlayerRef.current) {
            speechPlayerRef.current.src = speechUrl;
            speechPlayerRef.current.play();
        }
    }, [speechUrl]);

    return (
        <main className="bg-cover h-screen bg-center" style={{ backgroundImage: "url('img/leoline.png')" }}>
            <button className="absolute top-1 right-1 text-xs text-white" onClick={() => setIsAdminView(!isAdminView)}>
                A
            </button>

            <div>
                <audio
                    ref={speechPlayerRef}
                    controls
                    className={!isAdminView ? "hidden" : ""}
                    src="data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV"
                ></audio>
            </div>

            {isAdminView && (
                <div className="space-y-4 bg-white bg-opacity-50 p-4">
                    <div>
                        <p>{questionText}</p>
                    </div>
                    <div>
                        <p>{answerText}</p>
                    </div>
                </div>
            )}

            <button
                className="bg-red-600 h-24 w-24 absolute bottom-4 right-4 rounded-full"
                disabled={!isRecordingReady}
                onClick={handleRecording}
            >
                {isRecording ? "..." : "."}
            </button>
        </main>
    );
};

export default Home;
