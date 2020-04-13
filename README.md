This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### `npm i`
install dependencies.

### `npm run start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### UX/UI
I made some changes about the UI, I saw that it is better to behave like Google search bar, just pick a few items (10 in this case) and put it in the list, there is no need to make a pagination of hundreds of cities, the goal is to search and select cities, probably the user already knows which place to look up for and user will type in the input.
Also I think it is bad to send api requests each time I select or deselect an item from the list, I store everything with useState and when I click on the Save button it calls the api. Also it would be better if I could send an array of IDs instead of sending requests for each one item's id (get cities by ID).
Every time there is a backend error I display a message, I do not re-try again, I only advice the user.

### Notes / Improvements

There are some improvements that can be done in the future, for example when the api is looking for some city by ID and it fails I should have a fallback by saving those cities in localStorage (so maybe if next time when I reload and it fails I'll go get the city from localStorage and show it in the Tag render).
Also I could use Redux to dispatch some actions, I prefered in this case just usings React Hooks.
Another one is to make a better mobile version, nowadays it is responsive and you can only see the selection of cities, still works though...