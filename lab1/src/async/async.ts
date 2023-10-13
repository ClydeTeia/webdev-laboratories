import * as readlineSync from "readline-sync";
import * as fs from "fs/promises";

async function addDebt() {
  while (true) {
    let input: string = readlineSync.question("Pila gd haw");
    if (input === "d") {
      break;
    }

    if (!input.includes(" ")) continue;

    const [name, strMoney] = input.split(" ");
    const money = Number(strMoney);

    console.log(`added sa lista nga utang, sige pa`);

    if (typeof money === "number") {
      try {
        await fs.appendFile("./async.txt", input + "\n", { flag: "a+" });
      } catch (err: any) {
        console.log("Error: ", err.message);
      }
    } else {
      console.log("Enter a valid amount");
    }
  }
}

async function showDebt() {
  console.log("-".repeat(100));
  console.log("Mga utang");

  try {
    const data = await fs.readFile("./async.txt");
    console.log(data.toString());
  } catch (err) {
    throw err;
  }
  console.log("-".repeat(100));
}

async function main() {
  await addDebt();
  await showDebt();
}

main();
