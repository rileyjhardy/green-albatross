class AddRoomToSessions < ActiveRecord::Migration[8.0]
  def change
    add_reference :sessions, :room, foreign_key: true
  end
end
