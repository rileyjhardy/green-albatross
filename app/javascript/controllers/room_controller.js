import { Controller } from "@hotwired/stimulus";
import consumer from "channels/consumer";

// Connects to data-controller="room"
export default class extends Controller {
  static targets = ["peerId", "remoteVideo", "localVideo"];

  constructor(props) {
    super(props);
    this.peer = null;
    this.localStream = null;
  }

  async connect() {
    this.peer = new Peer(this.localVideoTarget.dataset.peerId);

    this.peer.on("open", () => this.initiateCalls());

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    this.localStream = stream;
    this.localVideoTarget.srcObject = stream;

    this.peer.on("call", (call) => {
      call.answer(this.localStream);
    });
  }

  initiateCalls() {
    for (const remoteVideo of this.remoteVideoTargets) {
      const call = this.peer.call(remoteVideo.dataset.peerId, this.localStream);
      call.on("stream", (remoteStream) => {
        remoteVideo.srcObject = remoteStream;
      });
    }
  }

  disconnect() {
    this.peer.destroy();
  }
}
