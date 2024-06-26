import { Controller } from "@hotwired/stimulus"
import Connection from "lib/media_connection"
import createMediaChannel from "channels/media_channel"

export default class extends Controller {
  static targets = [ "main", "remote" ]

  constructor(props) {
    super(props)
    this.connection = new Connection
    this.connection.remoteStreamTarget = this.remoteTarget
    this.channel = createMediaChannel("my-room", this.connection)
  }

  async getUserMedia() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true
    })

    this.connection.localStream = stream
    this.mainTarget.srcObject = stream
  }
}
