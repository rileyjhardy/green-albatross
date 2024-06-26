class Room < ApplicationRecord
  validates :name, presence: true, uniqueness: true

  has_many :sessions, dependent: :destroy
end
