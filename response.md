## How did you prioritize your time? What did you work on?

- Once I got the application running locally, looked at the exising behavior and flow in the code.
- First looked at modifying the firebase data structure so I could store multiple tasks along with status.
- Once I was able to save & retrive the data, looked at the UI changes followed by running a few basic tests.

## What decision points did you come to, especially on the technical side? How did you reach the decision you did? Are there any questions you would have asked if you could?

- Data Model: I wanted to support multiple tasks along with the status on them so decided on updating the backend model to an array of Task objects with status on them.
- UX Flow: This is an area where I had questions which I think can be improved in my implementation. I wanted to make sure it was clear that someone could add individual tasks and so went with an "Add Task" button on the top. These buttons could probably be more prominent along with displaying appropriate icons next to text area along with progress bar to make it easy to understand. I went with a basic approach since I was close to the hour.
- For the UI updates, I wrote a simple Task component where I tried to handle the logic for the different modes to make it re-usable on the screen.

## What would you do in this scenario if there was more time? What would come next? Is there anything you would change if you could do it again?

- Add progress bar (maybe be a pie chart ?) next to each user to track progress.
- Add team level status to give an overall status on all tasks.
- Add ability to assign task to other user or move from "my task list" to someone else.
- If I had more time, I would want to take a look at the overall Layout and flow to make a few UX and style updates to make it easier to use also also try to improve on the look and feel of the screen.
