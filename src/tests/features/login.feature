@login
Feature: EventHub Login
  Verifies the EventHub login flow against the four canonical cases from
  login-testcases.json (TC_001..TC_004). A valid login redirects the user
  to "/" and exposes the "Logout" button in the top navigation. Any invalid
  input keeps the user on "/login".

  Background:
    Given I am on the EventHub login page

  @smoke @regression @login
  Scenario: TC_001 Valid credentials sign the user in and land on the home page
    When the user enters email "manish123@gmail.com" and password "Manish9@@"
    And the user clicks the Sign In button
    Then the user should be redirected to the home page
    And the Logout button should be visible

  @regression @login
  Scenario: TC_002 Invalid password keeps the user on the login page
    When the user enters email "manish123@gmail.com" and password "WrongPass@999"
    And the user clicks the Sign In button
    Then the user remains on the login page
    And the Logout button should not be visible

  @regression @login
  Scenario: TC_003 Empty email and empty password block submission
    When the user clicks the Sign In button without filling the form
    Then the user remains on the login page

  @regression @login
  Scenario: TC_004 SQL injection style input does not bypass authentication
    When the user enters email "' OR '1'='1" and password "' OR '1'='1"
    And the user clicks the Sign In button
    Then the user remains on the login page
    And the Logout button should not be visible
