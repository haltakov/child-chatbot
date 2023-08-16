import { useCallback, useEffect, useMemo, useState } from "react";

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
            const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
            setAudioBlob(audioBlob);

            setIsRecording(false);
        };

        mediaRecorder.stop();
    }, [mediaRecorder, isRecording, audioChunks]);

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

    return { isRecording, audioBlob, startRecording, stopRecording, isRecordingReady: !!mediaRecorder };
};

export default useRecording;
