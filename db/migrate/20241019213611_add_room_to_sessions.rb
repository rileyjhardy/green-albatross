class AddRoomToSessions < ActiveRecord::Migration[8.0]
  def change
    enable_extension 'pgcrypto'

    add_reference :sessions, :room, foreign_key: true
    add_column :sessions, :uuid, :uuid, default: 'gen_random_uuid()', null: false
  end
end
