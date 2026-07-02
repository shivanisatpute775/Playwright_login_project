Feature: Login

  Scenario: User opens login page
    Given I open the login page
    Then the page title should contain "Login"


  Scenario: User creates booking
    Given user login into the app
    Then the page title should contain "EventHub — Discover & Book Events"

  @test
  Scenario: User creates a new Event
    Given user login into the app
    When user clicks on Events tab
    And user clicks on add new event button
    And user fills new Event form
    And user clicks on add event button
    Then user validates Event has been created
