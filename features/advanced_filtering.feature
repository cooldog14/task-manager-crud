Feature: Advanced Task Filtering
  As a user
  I want to filter tasks with complex criteria
  So that I can find specific tasks efficiently

  Background:
    Given I have a collection of tasks with various properties

  Scenario: Filter tasks by multiple priorities with AND logic
    Given I have tasks with different priority levels
    When I filter by high AND medium priority
    Then only tasks with high or medium priority should be returned

  Scenario: Filter tasks by category and status combination
    Given I have tasks in different categories and statuses
    When I filter by "Work" category AND "pending" status
    Then only pending work tasks should be returned

  Scenario: Filter overdue tasks
    Given I have tasks with due dates in the past
    When I apply the overdue filter
    Then only tasks past their due date should be returned

  Scenario: Filter tasks due today
    Given I have tasks with today's due date
    When I apply the due today filter
    Then only tasks due today should be returned

  Scenario: Filter tasks due this week
    Given I have tasks with due dates within the current week
    When I apply the due this week filter
    Then only tasks due this week should be returned

  Scenario: Combine multiple filter criteria with AND logic
    Given I have tasks with various properties
    When I filter by work category AND high priority AND pending status
    Then only high priority pending work tasks should be returned

  Scenario: Use OR logic for multiple criteria
    Given I have tasks in different categories
    When I filter by work OR personal category
    Then tasks from both work and personal categories should be returned

  Scenario: Search tasks by text
    Given I have tasks with different titles and descriptions
    When I search for "project"
    Then only tasks containing "project" in title or description should be returned

  Scenario: Combine search with other filters
    Given I have tasks with various properties
    When I search for "urgent" AND filter by high priority
    Then only high priority tasks containing "urgent" should be returned

  Scenario: No filters applied returns all tasks
    Given I have a collection of tasks
    When I apply no filters
    Then all tasks should be returned