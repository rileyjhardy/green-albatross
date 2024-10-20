class Room < ApplicationRecord
  has_many :sessions

  def remote_sessions
    sessions.where.not(id: Current.session&.id)
  end
end
