const csvToJson = require("csvtojson");
const fs = require("fs");
// CSV to JSON book feed
csvToJson()
  .fromFile("./_data/booklist.csv")
  .then(function (books) {
    fs.writeFile(
      "./_data/books.json",
      JSON.stringify(books, null, 4),
      function (err) {
        if (err) {
          throw err;
        }
        console.log("new books feed created!");
      }
    );
  })
  .catch(function (err) {
    console.log(err);
  });
