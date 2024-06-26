class SessionsController < ApplicationController
  def create
    @session = Session.new(room_id: params[:room_id], user_id: current_user.id)

    if @session.save
      redirect_to room_url(@session.room), notice: "Joined room!"
    else
      redirect_to room_url(@session.room), alert: "Failed to join room!"
    end
  end

  def destroy
    @session = Session.find_by(room_id: params[:room_id], user_id: current_user.id)
    @session.destroy!

    redirect_to rooms_url, notice: "Left room!"
  end
end
