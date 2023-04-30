const fs = require("fs");

// Write a json file with the variables for the pass goal function, user_id & goal_id
const passgoal_info = {
    user_id_info: "3",
    goal_id_info: "4",
  }
  const jsonString = JSON.stringify(passgoal_info)
  fs.writeFile('../GoalStake/api.json', jsonString, err => {
     if (err) {
        console.log('Error writing passgoal json file', err)
     } else {
        console.log('Successfully wrote passgoal json file')
     }
  })

  // Wait 3 seconds 
  new Promise(resolve => setTimeout(() => resolve(), 3000));

  // Parse Data from api.json into the pass goal function in the smart contract
  fs.readFile("../GoalStake/api.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("Error reading file from disk:", err);
      return;
    }
    console.log("File data:", jsonString);
    try {
      const api = JSON.parse(jsonString);
      console.log("User Id is", api.user_id_info); 
      if (typeof api.user_id_info === 'string') {
          console.log('Variable is a string!');
      }
      else {
          console.log('Variable is not a string!');
      }
      console.log("Goal Id is", api.goal_id_info); 
      if (typeof api.goal_id_info === 'string') {
          console.log('Variable is a string!');
      }
      else {
          console.log('Variable is not a string!');
      }
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });