import consumer from 'lib/consumer'

const createMediaChannel = function(name, connection) {
  return consumer.subscriptions.create({channel: "MediaChannel", name}, {
    connected() {
      connection.channel = this
      this.send({ type: "TOKEN" })
    },
  
    disconnected() {
      console.log("disconnected")
    },
  
    received(data) {
      switch (data.type) {
        case "TOKEN":
          if (!connection.peerConnection) {
            connection.createPeerConnection(data.servers)
            connection.loadStream()
            connection.createOffer()
          }
          break;
        case "OFFER":
          if (connection.identifier != data.name) {
            let offer = JSON.parse(data.sdp)
            connection.createAnswer(offer)
          }
          break;
        case "ANSWER":
          if (connection.identifier != data.name) {
            let answer = JSON.parse(data.sdp)
            connection.receiveAnswer(answer)
          }
          break;
        case "CANDIDATE":
          if (connection.identifier != data.name) {
            let candidate = JSON.parse(data.sdp)
            connection.addCandidate(candidate)
          }
          break;
        default:
          console.log(`Unknown data type: ${data.type}`)
          break;
      }
    }
  });
}

export default createMediaChannel;
