require 'rails_helper'

RSpec.describe 'User signin', type: :system do
  before do
    driven_by(:selenium_chrome_headless)
  end

  it 'allows a user to sign in' do
    visit new_session_path

    expect(page).to have_button('Sign in')
  end
end
