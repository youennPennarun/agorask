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
    Then I take a screenshot named "map_after_search_pub"
      And at least 20 markers will be visible

  Scenario: Clear search query
    Given  I am on the map screen
    When I search for "pub"
      And I clear the search
    Then the search query should be "Search"