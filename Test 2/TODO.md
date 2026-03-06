# Summary

## Description
- Total Marks: 100
- Duration: 80 minutes

This test covers topics on React.js (topic 3 and 4). It is an open book test. You may refer only to materials and practical solutions available on the learning management system.

## Instructions
- Complete 20 multiple-choice questions (20 marks) and 1 coding question (80 marks).
- Use Visual Studio Code for coding.
- Communication of any kind is strictly prohibited during the test.
- Use of any AI tools is strictly prohibited during the test.
- Please ignore the input at the end of the coding question. Submit your code via the submission link.
- You only have one attempt. Once you begin the test, do not close your browser until you have completed and submitted the test.

# Events Web App

The backend Node.js Web API is provided.

## Objective
Develop a React.js web application that performs CRUD (Create, Read, Update, Delete) operations on events via the provided Web API.

## Event Model
- Id (integer): Auto-incremented
- Name (string): Required, maximum 80 characters
- Details (string): Optional, maximum 800 characters
- Event Date (datetime): Accuracy up to the minute; default value is next day with the current hour and minutes set to `00`
- Location (string): Required, maximum 200 characters

## Requirements

### 1. Routing of Pages (10 marks)
Implement client-side routing using React Router to support navigation between:
- Events page
- Add Event page
- Edit Event page (using event ID in the route)

### 2. View Event List with Search (20 marks)
Implement an Events page that:
- Displays a list of events with attribute values
- Allows users to search for events

Tip:
- You may use the Place icon from `@mui/icons-material` to display the event location.

### 3. Create / Update / Delete Event (40 marks)
Implement full event management functionality:

Create Event:
- Add a new event using a form
- Validate user input according to the event constraints

Update Event:
- Load an existing event's data
- Allow editing and updating of the event

Delete Event:
- Allow deletion of an event with user confirmation

### 4. Challenge (10 marks)
Implement combined filtering for the event list. Filtering must work together with search:
- Filter by minimum event date
- Filter by maximum event date

## Evaluation Criteria
- Correctness and completeness of the web application
- Proper integration with the Web API for CRUD operations
- Validation of input data
- Responsive design and user-friendly interface
- Descriptive and meaningful naming conventions
- Code readability and maintainability

## Sample User Interface
See the sample screenshots provided in the test prompt:
- Events page
- Add Event page
- Edit Event page
- Delete confirmation dialog

