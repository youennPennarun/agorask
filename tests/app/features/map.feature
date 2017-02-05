Feature: Map
  Search Bar

  Background:
    Given I am on the login screen
    Then I click on Not now


  Scenario: Search
    Given  I am on the map screen
    When I take a screenshot named "map_before_feature"
      And I search for "pub"
      And I hide the keyboard
    Then 29 markers will be visible
      And I take a screenshot named "map_after_search_pub"

  Scenario: Clear search query
    Given  I am on the map screen
    When I search for "pub"
      And I clear the search
    Then the search query should be "Search"