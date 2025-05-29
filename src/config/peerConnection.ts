// src/utils/peerConnection.ts

import type { Socket } from "socket.io-client";

const configuration: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" }, // public STUN server
  ],
};

export function createPeerConnection(
  socket: Socket,
  remoteUserId: string,
  onTrack: (event: RTCTrackEvent) => void
): RTCPeerConnection {
  const peer = new RTCPeerConnection(configuration);

  // Forward ICE candidates
  peer.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice-candidate", {
        to: remoteUserId,
        candidate: event.candidate,
      });
    }
  };

  // Remote stream
  peer.ontrack = onTrack;

  return peer;
}

export function cleanupPeerConnection(peer: RTCPeerConnection): void {
  try {
    // Close all transceivers
    peer.getTransceivers().forEach((transceiver) => {
      transceiver.stop();
    });

    // Close the connection
    peer.close();

    // Cleanup event handlers
    peer.onicecandidate = null;
    peer.ontrack = null;
    peer.onconnectionstatechange = null;
    peer.oniceconnectionstatechange = null;
  } catch (error) {
    console.error("Error cleaning up peer connection:", error);
  }
}

export function cleanupAllPeers(
  peers: Record<string, RTCPeerConnection>,
  setPeers: React.Dispatch<
    React.SetStateAction<Record<string, RTCPeerConnection>>
  >
): void {
  Object.values(peers).forEach((peer) => {
    cleanupPeerConnection(peer);
  });
  setPeers({});
}
