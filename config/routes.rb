Rails.application.routes.draw do
  resources :rooms do
    resources :sessions, as: :sessions, only: %i[ create destroy ]
  end

  resources :messages
  devise_for :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  get '/demo', to: 'rooms#demo'

  # Defines the root path route ("/")
  root "home#index"
end
