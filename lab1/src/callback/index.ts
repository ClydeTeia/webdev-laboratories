import * as readlineSync from "readline-sync";
import * as fs from "node:fs";

while (true) {
  let input: string = readlineSync.question("How much you wanna borrow?");
  if (input === "end") {
    break;
  }

  if (!input.includes(" ")) continue;

  const [name, strMoney] = input.split(" ");
  const money = Number(strMoney);

  console.log(`added sa lista`);

  if (typeof money === "number") {
    fs.writeFile("./callback.txt", input + "\n", { flag: "a+" }, (err: any) => {
      console.log("Error: ", err.message);
    });
  } else {
    console.log("Enter amount");
  }
}

function showDebt() {
  console.log("-".repeat(100));
  console.log("Mga utang");

  fs.readFile("./callback.txt", (err, data) => {
    if (err) {
      throw err;
    }
    console.log(data.toString());
    console.log("-".repeat(100));
  });
}

showDebt();
