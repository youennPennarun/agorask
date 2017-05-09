Feature: Map
  Search Bar

  Background:
    Given I am on the login screen
    Then I click on Not now


  Scenario: Search
    Given  I am on the map screen
    When I search for "pub"
    Then I hide the keyboard
#      And wait 5000 ms
#    Then at least 20 markers will be visible

  Scenario: Clear search query
    Given  I am on the map screen
    When I search for "pub"
      And I clear the search
    Then the search query should be "Search"
