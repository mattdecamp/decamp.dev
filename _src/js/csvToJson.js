const csvToJson = require("csvtojson");
const fs = require("fs");
// CSV to JSON book feed
csvToJson()
  .fromFile("./_src/_data/booklist.csv")
  .then(function (books) {
    fs.writeFile(
      "./_src/_data/books.json",
      JSON.stringify(books, null, 4),
      function (err) { 
        if (err) {
          throw err;
        }
        console.log("The book list has been updated !");
      }
    );
  })
  .catch(function (err) {
    console.log(err);
  });
