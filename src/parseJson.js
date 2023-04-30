const fs = require("fs");
fs.readFile("../GoalStake/customer.json", "utf8", (err, jsonString) => {
  if (err) {
    console.log("Error reading file from disk:", err);
    return;
  }
  console.log("File data:", jsonString);
  try {
    const customer = JSON.parse(jsonString);
    console.log("Customer address is:", customer.address); // => "Customer address is: Infinity Loop Drive"
    if (typeof customer.address === 'string') {
        console.log('Variable is a string!');
    }
    else {
        console.log('Variable is not a string!');
    }
  } catch (err) {
    console.log("Error parsing JSON string:", err);
  }
});