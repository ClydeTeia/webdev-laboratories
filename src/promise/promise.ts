import * as readlineSync from "readline-sync";
import fsPromises = require("fs/promises");

while (true) {
  let input: string = readlineSync.question("How much you wanna borrow?");
  if (input === "end") {
    break;
  }

  if (!input.includes(" ")) continue;

  const [name, strMoney] = input.split(" ");
  const money: number = Number(strMoney);

  console.log(`added sa lista`);

  if (typeof money === "number") {
    fsPromises
      .writeFile("./promise.txt", input + "\n", { flag: "a+" })
      .then(() => {
        console.log("Added");
      })
      .catch((err) => {
        console.error("Error: ", err);
      });
  } else {
    console.log("Input valid amount");
  }
}

async function getDebt() {
  fsPromises
    .readFile("./promise.txt", "utf8")
    .then((data) => {
      console.log("Mga utang: " + "\n", data);
    })
    .catch((err) => {
      console.error("Error in readFile: ", err);
    });
}

getDebt();
