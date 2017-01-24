Feature: Login
  Login Screen

  Scenario: Skip the login screen
    Given   I am on the login screen
    When    I click on Not now
    Then the map will show


  Scenario: Invalid credentials
    Given   I am on the login screen
    When    I fill the username with "hello"
      And   I fill the password with "password"
      And   I click on login
    Then I should see an error that say "Invalid credentials"