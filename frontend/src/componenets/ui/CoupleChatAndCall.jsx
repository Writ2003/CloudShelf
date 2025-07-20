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
  endCallSignal,
  onEndCallSignal     
}) {
  const [messages, setMessages] = useState([]);
  const [isCalling, setIsCalling] = useState(false);
  const [inCall, setInCall] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const [content, setContent] = useState('');
  const editorRef = useRef();
  const messagesEndRef = useRef(null);

  // ✅ Scroll to latest message
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ Handle WebRTC Incoming Events
  useEffect(() => {
    if (!onOffer || !onAnswer || !onCandidate) return;

    onOffer(handleOffer);
    onAnswer(handleAnswer);
    onCandidate(handleCandidate);
  }, [onOffer, onAnswer, onCandidate]);

  useEffect(() => {
    if (!onEndCallSignal) return;

    onEndCallSignal(() => {
      console.log("📞 Other user ended the call");
      endCall();
    });
  }, [onEndCallSignal]);

  const iceServers = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" }, // free Google STUN server
    ],
  };

  // ✅ Start Call (Caller)
  const startCall = async () => {
    setIsCalling(true);

    localStreamRef.current = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localVideoRef.current.srcObject = localStreamRef.current;

    peerConnectionRef.current = new RTCPeerConnection(iceServers);

    // Add local tracks
    localStreamRef.current.getTracks().forEach((track) => {
      peerConnectionRef.current.addTrack(track, localStreamRef.current);
    });

    // Remote stream
    peerConnectionRef.current.ontrack = (event) => {
      console.log("📹 Remote stream received");
      remoteVideoRef.current.srcObject = event.streams[0];
    };

      // ICE candidates
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        sendCandidate && sendCandidate(event.candidate);
      }
    };

    // Create and send offer
    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);
    sendOffer && sendOffer(offer);

    setInCall(true);
    setIsCalling(false);
  }

  // ✅ Handle Incoming Offer (Receiver)
  const handleOffer = async (offer) => {
    console.log("📞 Incoming call...");
    localStreamRef.current = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localVideoRef.current.srcObject = localStreamRef.current;

    peerConnectionRef.current = new RTCPeerConnection(iceServers);

    localStreamRef.current.getTracks().forEach((track) => {
      peerConnectionRef.current.addTrack(track, localStreamRef.current);
    });

    peerConnectionRef.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        sendCandidate && sendCandidate(event.candidate);
      }
    };

    await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await peerConnectionRef.current.createAnswer();
    await peerConnectionRef.current.setLocalDescription(answer);
    sendAnswer && sendAnswer(answer);

    setInCall(true);
  };

  // ✅ Handle Answer (Caller)
  const handleAnswer = async (answer) => {
    await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
  };

  // ✅ Handle ICE Candidate (Both)
  const handleCandidate = async (candidate) => {
    try {
      await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (e) {
      console.error("ICE candidate error", e);
    }
  };

  // ✅ End Call
  const endCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    setInCall(false);
    setIsCalling(false);

    // ✅ Notify the other side
    endCallSignal && endCallSignal();
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
        <Box className="flex-1 flex flex-col gap-1 max-h-[200px] overflow-auto scroll-smooth no-scrollbar my-2 p-2">
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
          <div ref={messagesEndRef}></div>
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
