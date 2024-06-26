import { Controller } from "@hotwired/stimulus"
import Connection from "lib/media_connection"
import createMediaChannel from "channels/media_channel"

export default class extends Controller {
  static targets = [ "me", "videoContainer"]

  constructor(props) {
    super(props)
    this.connection = new Connection
    this.connection.meTarget = this.meTarget
    this.connection.videoContainer = this.videoContainerTarget
    this.channel = createMediaChannel("media", this.connection)

  }

  connect() {
    this.getUserMedia()
  }

  disconnect() {
    this.connection.peerConnection.close()
    this.connection.peerConnection = null
    this.connection.localICECandidates = []
    this.connection.connected = false
    this.connection.localStream.getTracks().forEach(track => track.stop())
    this.connection.localStream = null
    this.meTarget.srcObject = null
  }

  async getUserMedia() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true
    })    

    this.connection.localStream = stream
    this.meTarget.srcObject = stream
    this.channel.send({type: "TOKEN"})
  }
}
