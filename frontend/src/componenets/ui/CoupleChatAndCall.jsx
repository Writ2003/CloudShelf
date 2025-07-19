import React, { useEffect, useRef, useState } from "react";
import {
  IconButton,
  Box,
  Typography,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Call, CallEnd } from "@mui/icons-material";
import Peer from "simple-peer";
import RichTextEditor from "./RichTextEditor"; // Your editor
import { SendHorizonal } from "lucide-react";
import { coupleSocket } from "../../socket";

export default function CoupleChatAndCall({
  hasCoupleJoined,
  onSendMessage, // (content) => void
  onReceiveMessage, // (callback) => callback(message)
  sendOffer,        // (offer) => void
  onOffer,          // (callback) => callback(offer)
  sendAnswer,       // (answer) => void
  onAnswer,         // (callback) => callback(answer)
  sendCandidate,    // (candidate) => void
  onCandidate,      // (callback) => callback(candidate)
}) {
  const [messages, setMessages] = useState([]);
  const [isCalling, setIsCalling] = useState(false);
  const [inCall, setInCall] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const [content, setContent] = useState('');
  const editorRef = useRef();

  // ✅ Handle Incoming Messages
  useEffect(() => {
    if (!onReceiveMessage) return;
      const handleMessage = (msg) => {
      setMessages((prev) => [...prev, { type: "received", content: msg }]);
    };

    onReceiveMessage(handleMessage);

    return () => {
      coupleSocket.off("couple_receive_message"); // ✅ Cleanup
  };
  }, [onReceiveMessage]);

  // ✅ Handle WebRTC Incoming Events
  useEffect(() => {
    if (!onOffer || !onAnswer || !onCandidate) return;

    onOffer(async (offer) => {
      console.log("📞 Incoming call...");
      await initCall(false, offer);
    });

    onAnswer((answer) => {
      console.log("✅ Call Answered");
      peerRef.current?.signal(answer);
    });

    onCandidate((candidate) => {
      peerRef.current?.signal(candidate);
    });
  }, [onOffer, onAnswer, onCandidate]);

  // ✅ Start Call
  const startCall = async () => {
    setIsCalling(true);
    await initCall(true);
  };

  // ✅ Initialize Call (Caller or Receiver)
  const initCall = async (isCaller, offer = null) => {
    try {
      localStreamRef.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localVideoRef.current.srcObject = localStreamRef.current;
      console.log("Peer created", { isCaller });
      console.log("Local stream attached?", localStreamRef.current);
      const testPeer = new Peer({ initiator: true });
      testPeer.on("signal", console.log);


      /*peer.on("signal", (data) => {
        console.log("SIGNAL DATA:", data); // ✅ Should log offer first
        if (data.type === "offer") sendOffer && sendOffer(data);
        else if (data.type === "answer") sendAnswer && sendAnswer(data);
        else if (data.candidate) sendCandidate && sendCandidate(data);
        console.log('Signalling offer');
      });

      peer.on("stream", (remoteStream) => {
        console.log("📹 Remote stream received");
        remoteVideoRef.current.srcObject = remoteStream;
      });

      peer.on("close", endCall);

      if (!isCaller && offer) {
        peer.signal(offer);
      }

      peerRef.current = peer;*/
      setInCall(true);
      setIsCalling(false);
    } catch (err) {
      console.error("Call Error:", err);
      setIsCalling(false);
    }
  };

  // ✅ End Call
  const endCall = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    setInCall(false);
    setIsCalling(false);
  };

  return (
    <Box className="flex flex-col gap-4 p-3 w-72">
      {/* ✅ Messaging Panel */}
      <Paper
        elevation={3}
        className="flex-1 justify-start flex flex-col rounded-2xl p-3 min-h-[300px] max-h-[500px] overflow-hidden"
      >
        <Typography variant="h6" className="mb-2">
          Chat
        </Typography>
        <Divider />
        <Box className="flex-1 flex flex-col gap-1 overflow-auto no-scrollbar my-2 p-2">
          {messages.map((msg, i) => (
            <Typography
              key={i}
              variant="body2"
              component="div"
              className={`p-2 rounded-xl ${
                msg.type === "sent"
                  ? "bg-blue-100 text-blue-800 self-end"
                  : "bg-gray-200 text-gray-800 self-start"
              }`}
            >
              <div dangerouslySetInnerHTML={{__html: msg.content}}/>
            </Typography>
          ))}
        </Box>
        <Box className='grid grid-cols-5 gap-3 items-center'>
          <div className="col-span-4 rounded-md border border-slate-200">
            <RichTextEditor className={'h-15'} maxCharLimit = {100} ref={editorRef} onChange={setContent} />
          </div>
          <button
            className="flex justify-center items-center mt-3 h-10 w-10 bg-blue-600 text-white rounded-full hover:bg-blue-500 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              const message = editorRef.current?.getHTML();
              setMessages((prev) => [...prev, { type: "sent", content:message }]);
              onSendMessage(message);
              editorRef.current?.clear();
            }}
          >
            <SendHorizonal/>
          </button>
        </Box>
      </Paper>

      {/* ✅ Calling Panel */}
      <Paper
        elevation={3}
        className="flex-1 flex flex-col items-center rounded-2xl p-3"
      >
        <Typography variant="h6">Call</Typography>
        <Divider className="w-full mb-2" />

        <Box className="flex gap-2 w-full justify-center">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-1/2 rounded-xl bg-black"
          />
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-1/2 rounded-xl bg-black"
          />
        </Box>

        <Box className="mt-4 flex gap-4">
          {!inCall ? (
            <IconButton
              color="primary"
              disabled={!hasCoupleJoined || isCalling}
              onClick={startCall}
            >
              {isCalling ? (
                <CircularProgress size={24} />
              ) : (
                <Call fontSize="large" />
              )}
            </IconButton>
          ) : (
            <IconButton color="error" onClick={endCall}>
              <CallEnd fontSize="large" />
            </IconButton>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
