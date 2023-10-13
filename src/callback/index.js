"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readlineSync = require("readline-sync");
var fs = require("node:fs");
while (true) {
    var input = readlineSync.question("How much you wanna borrow?");
    if (input === "d") {
        break;
    }
    if (!input.includes(" "))
        continue;
    var _a = input.split(" "), name_1 = _a[0], strMoney = _a[1];
    var money = Number(strMoney);
    console.log("added sa lista");
    if (typeof money === "number") {
        fs.writeFile("./callback.txt", input + "\n", { flag: "a+" }, function (err) {
            console.log("Error: ", err.message);
        });
    }
    else {
        console.log("Enter amount");
    }
}
function showDebt() {
    console.log("-".repeat(100));
    console.log("Mga utang");
    fs.readFile("./callback.txt", function (err, data) {
        if (err) {
            throw err;
        }
        console.log(data.toString());
        console.log("-".repeat(100));
    });
}
showDebt();
