import { useCallback, useEffect, useMemo, useState } from "react";

const getSupportedMediaType = () => {
    if (MediaRecorder.isTypeSupported("audio/webm")) return "audio/webm";
    else if (MediaRecorder.isTypeSupported("audio/mp4")) return "audio/mp4";
    else if (MediaRecorder.isTypeSupported("audio/wav")) return "audio/wav";
    else throw new Error("This device doesn't support recording ");
};

const useRecording = () => {
    const audioChunks = useMemo(() => [] as Blob[], []);

    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

    const startRecording = useCallback(async () => {
        if (!mediaRecorder || isRecording) return;

        setIsRecording(true);

        audioChunks.splice(0, audioChunks.length);
        mediaRecorder.start();
    }, [audioChunks, isRecording, mediaRecorder]);

    const stopRecording = useCallback(async () => {
        if (!mediaRecorder || !isRecording) return;

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: getSupportedMediaType() });
            setAudioBlob(audioBlob);

            setIsRecording(false);
        };

        mediaRecorder.stop();
    }, [mediaRecorder, isRecording, audioChunks]);

    useEffect(() => {
        (async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, { mimeType: getSupportedMediaType() });

            mediaRecorder.ondataavailable = function (event) {
                audioChunks.push(event.data);
            };

            setMediaRecorder(mediaRecorder);
        })();
    }, [audioChunks]);

    return { isRecording, audioBlob, startRecording, stopRecording, isRecordingReady: !!mediaRecorder };
};

export default useRecording;
