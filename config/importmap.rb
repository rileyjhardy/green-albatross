# Pin npm packages by running ./bin/importmap

pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"
# pin_all_from "app/javascript/channels", under: "channels"
pin 'lib/consumer'
pin 'lib/media_connection'
pin 'channels/media_channel'
pin "webrtc-adapter" # @9.0.1
pin "sdp" # @3.2.0
pin "@rails/actioncable", to: "@rails--actioncable.js" # @7.1.3
