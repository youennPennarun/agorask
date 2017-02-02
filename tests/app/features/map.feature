Feature: Map
  Search Bar

  Background:
    Given I am on the login screen
    Then I click on Not now
      And I take a screenshot named "map_before_feature"


  Scenario: Search
    Given  I am on the map screen
    When I search for "pub"
    Then 12 markers will be visible

  Scenario: Clear search query
    Given  I am on the map screen
    When I search for "pub"
      And I clear the search
    Then the search query should be "Search"