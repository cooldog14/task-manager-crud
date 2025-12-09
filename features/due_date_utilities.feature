Feature: Due Date Management
  As a user
  I want to see due date information clearly
  So that I can prioritize my tasks effectively

  Background:
    Given the current date is known

  Scenario: Check if task is overdue
    Given a task with a due date in the past
    When I check if it's overdue
    Then it should be marked as overdue

  Scenario: Check if task is due today
    Given a task with today's due date
    When I check if it's due today
    Then it should be marked as due today

  Scenario: Check if task is due this week
    Given a task with a due date within the current week
    When I check if it's due this week
    Then it should be marked as due this week

  Scenario: Calculate days until due for future dates
    Given a task due in 3 days
    When I calculate days until due
    Then it should return 3

  Scenario: Calculate days until due for past dates
    Given a task that was due 2 days ago
    When I calculate days until due
    Then it should return -2

  Scenario: Format due date as "Due Today"
    Given a task due today
    When I format the due date for display
    Then it should display as "Due Today"

  Scenario: Format due date as "Due Tomorrow"
    Given a task due tomorrow
    When I format the due date for display
    Then it should display as "Due Tomorrow"

  Scenario: Format overdue date
    Given a task with a past due date
    When I format the due date for display
    Then it should display as "Overdue"

  Scenario: Format future due date
    Given a task due on December 25, 2025
    When I format the due date for display
    Then it should display as "Due Dec 25, 2025"

  Scenario: Get overdue status for styling
    Given a task with a past due date
    When I get the due date status
    Then it should return "overdue"

  Scenario: Get due today status for styling
    Given a task due today
    When I get the due date status
    Then it should return "due-today"

  Scenario: Get due tomorrow status for styling
    Given a task due tomorrow
    When I get the due date status
    Then it should return "due-tomorrow"

  Scenario: Get due this week status for styling
    Given a task due this week
    When I get the due date status
    Then it should return "due-this-week"

  Scenario: Get due future status for styling
    Given a task due in the future
    When I get the due date status
    Then it should return "due-future"

  Scenario: Handle tasks with no due date
    Given a task with no due date
    When I format the due date
    Then it should display as "No Due Date"

  Scenario: Handle invalid due dates
    Given a task with an invalid due date
    When I format the due date
    Then it should display as "Invalid Date"