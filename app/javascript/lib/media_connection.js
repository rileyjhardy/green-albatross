class Connection {
  peerConnection
  videoContainer
  localStream
  channel

  constructor() {
    this.identifier = crypto.randomUUID()
    this.localICECandidates = []
    this.connected = false
  }

  createPeerConnection(servers) {
    console.log("<<< Creating new peer connection")
    this.peerConnection = new RTCPeerConnection({
      iceServers: servers
    });
    this.peerConnection.ontrack = ({ track, streams }) => {
      const newFrame = document.createElement("video")
      newFrame.srcObject = streams[0]
      newFrame.autoplay = true
      
      this.videoContainer.appendChild(newFrame)
      console.log("<<< Received new track")
    }
    this.peerConnection.onicecandidate = ({ candidate }) => {
      if (candidate) {
        console.log(`<<< Received local ICE candidate from STUN/TURN server (${candidate.address})`)
        if (this.connected) {
          console.log(`>>> Sending local ICE candidate (${candidate.address})`)
          this.channel.send({
            type: "CANDIDATE",
            name: this.identifier,
            sdp: JSON.stringify(candidate)
          })
        } else {
          console.log(`>>> Buffer local candidate (${candidate.address})`)
          this.localICECandidates.push(candidate)
        }
      }
    }
  }

  loadStream() {
    for (const track of this.localStream.getTracks()) {
      if (this.peerConnection.getSenders().find(sender => sender.track.kind == track.kind)) {
        console.log("<<< Already added track")
      } else {
        console.log("<<< Adding new track")
        this.peerConnection.addTrack(track, this.localStream)
      }
    }
  }

  async createOffer() {
    let that = this;

    const offer = await this.peerConnection.createOffer();

    if (offer) {
      console.log(">>> Sending offer to receivers")
      that.peerConnection.setLocalDescription(offer)
      that.channel.send({
        type: "OFFER",
        name: that.identifier,
        sdp: JSON.stringify(offer)
      })
    } else {
      console.error(err)
    }
  }

  async createAnswer(offer) {
    console.log("<<< Answering to caller")
    this.connected = true
    let rtcOffer = new RTCSessionDescription(offer);
    let that = this
    this.peerConnection.setRemoteDescription(rtcOffer);
    this.loadStream()

    const answer = await this.peerConnection.createAnswer()
    if (answer) {
      that.peerConnection.setLocalDescription(answer)
      that.channel.send({
        type: "ANSWER",
        name: that.identifier,
        sdp: JSON.stringify(answer)
      })
    } else {
      console.error(err)
    }
  }

  receiveAnswer(answer) {
    console.log(">>> Receive remote answer")
    let rtcAnswer = new RTCSessionDescription(answer);
    let that = this
    this.peerConnection.setRemoteDescription(rtcAnswer)
    this.connected = true
    this.localICECandidates.forEach(candidate => {
      console.log(`>>> Sending local ICE candidate (${candidate.address})`)
      that.channel.send({
        type: "CANDIDATE",
        name: that.identifier,
        sdp: JSON.stringify(candidate)
      })
    })
    this.localICECandidates = []
  }

  addCandidate(candidate) {
    let rtcCandidate = new RTCIceCandidate(candidate);
    console.log(`<<< Adding ICE candidate (${rtcCandidate.address} - ${rtcCandidate.relatedAddress})`)
    this.peerConnection.addIceCandidate(rtcCandidate)
  }
}

export default Connection;
