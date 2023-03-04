# the-key-tech-task

- clone the repository
- the frontend code is located in the "the-key-tech-task" directory
- the backend code is located in the "the-key-tech-task-backend" directory
- run "npm install" in both directories to initialize the project
- run "npm test" respectively in both directories to run the implemented tests
- run "npm start" first in the backend-directory terminal and then inside the frontend-directory terminal
- if a webpage is not opened automatically, open the link shown in the terminal
  -> on the webpage, charts should now be displayed, visually representing the word-counts of blog posts fetched from "https://www.thekey.academy/"

-> IMPORTANT NOTE 1: in order to make it more interesting and realistic, not all posts are shown immediately, but instead there will be 1 additional post every 5 seconds, until all posts are displayed (definded in the API_FETCH_INTERVAL variable inside utils.js in the backend).
This logic is implemented inside the index.js file lines 30-34 with instructions on how to not simulate successive updates.

-> IMPORTANT NOTE 2: all console logs are left inside the code on purpose, in order to make testing more comprehensible. I am aware that this should not be done in actual production code.

-> NOTE 3: I actually tried implementing the server-side using event-based processing (see eventBased-index.js) but failed due to CORS issues which I could not resolve. The file is just there to show my approach.
