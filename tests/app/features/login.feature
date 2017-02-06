Feature: Login
  Login Screen

  Scenario: Skip the login screen
    Given   I am on the login screen
    When I take a screenshot named "login_empty"
      And I click on Not now
      And I take a screenshot named "map"
    Then I am on the map screen


  Scenario: Invalid credentials
    Given   I am on the login screen
    When    I fill the username with "hello"
      And   I fill the password with "password"
      And   I click on login
      And I hide the keyboard
      And I take a screenshot named "login_filled"
    Then I should see an error that say "Invalid credentials"