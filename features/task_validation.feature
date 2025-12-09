Feature: Task Validation
  As a user
  I want task data to be validated
  So that I can ensure data integrity and prevent errors

  Background:
    Given the task validation system is initialized

  Scenario: Valid task data passes validation
    Given I have valid task data with all required fields
    When I validate the task
    Then validation should pass with no errors

  Scenario: Task with empty title fails validation
    Given I have task data with an empty title
    When I validate the task
    Then validation should fail
    And the error should mention "Title is required and cannot be empty"

  Scenario: Task with title too long fails validation
    Given I have task data with a title longer than 100 characters
    When I validate the task
    Then validation should fail
    And the error should mention "Title must be 100 characters or less"

  Scenario: Task with description too long fails validation
    Given I have task data with a description longer than 500 characters
    When I validate the task
    Then validation should fail
    And the error should mention "Description must be 500 characters or less"

  Scenario: Task with invalid priority fails validation
    Given I have task data with an invalid priority value
    When I validate the task
    Then validation should fail
    And the error should mention valid priority options

  Scenario: Task with invalid status fails validation
    Given I have task data with an invalid status value
    When I validate the task
    Then validation should fail
    And the error should mention valid status options

  Scenario: Task with invalid due date fails validation
    Given I have task data with an invalid due date format
    When I validate the task
    Then validation should fail
    And the error should mention "Due date must be a valid date"

  Scenario: Task with past due date fails validation
    Given I have task data with a due date in the past
    When I validate the task
    Then validation should fail
    And the error should mention "Due date cannot be in the past"

  Scenario: Task with multiple validation errors
    Given I have task data with multiple invalid fields
    When I validate the task
    Then validation should fail
    And multiple error messages should be returned