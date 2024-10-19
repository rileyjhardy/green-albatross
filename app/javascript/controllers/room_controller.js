import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="room"
export default class extends Controller {
  static targets = [ "peerId", "remoteVideo", "localVideo" ]

  constructor(props) {
    super(props);
    this.peer = new Peer();
    this.localStream = null;
  }

  connect() {
    this.peer.on('open', (id) => {
      console.log('My peer ID is: ' + id);
    });

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        this.localStream = stream;
        this.localVideoTarget.srcObject = stream;
      });

    this.peer.on('call', (call) => {
      call.answer(this.localStream);
      call.on('stream', (remoteStream) => {
        this.remoteVideoTarget.srcObject = remoteStream;
      });
    });
  }

  startCall() {
    const call = this.peer.call(this.peerIdTarget.value, this.localStream);
    call.on('stream', (remoteStream) => {
      this.remoteVideoTarget.srcObject = remoteStream;
    });
  }

  disconnect() {
    this.peer.destroy();
    console.log("Goodbye, Stimulus!", this.element);
  }
}
