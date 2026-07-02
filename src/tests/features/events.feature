Feature: Events
  As a logged-in EventHub user
  I want to view existing events, create new events, and have invalid submissions rejected
  So that the Events module is discoverable, functional, and validates its inputs

  Background:
    Given user login into the app
    When user clicks on Events tab

  @events @TC-EVT-001
  Scenario: User views the Events listing page with complete event details
    Given user is on the Events listing page
    Then the Events tab should be the active navigation item
    And the URL should reflect the Events route
    And user should see at least one event card on the Events listing
    And each event card should display title, category, venue, date, price, seats and status
    And user should see the Add New Event button enabled

  @events @TC-EVT-002
  Scenario: User successfully creates a new event via the Add New Event form
    Given user is on the Events listing page
    When user clicks on add new event button
    Then the Add New Event form should be visible
    When user fills new Event form
    And user clicks on add event button
    Then user should see an event-created success notification

  @events @TC-EVT-003
  Scenario: User sees inline validation errors when submitting an invalid Add New Event form
    Given user is on the Events listing page
    When user clicks on add new event button
    Then the Add New Event form should be visible
    When user submits the Add New Event form with empty fields
    Then the form should not submit and at least one required field should be invalid
    When user submits the Add New Event form with a whitespace-only title
    Then a title validation error should be visible
    When user submits the Add New Event form with an invalid price
    Then a price validation error should be visible
    When user submits the Add New Event form with zero or negative total seats
    Then a total-seats validation error should be visible
    When user fills new Event form
    And user clicks on add event button
    Then user should see an event-created success notification