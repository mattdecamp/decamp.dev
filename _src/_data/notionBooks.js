require("dotenv").config();
const Cache = require("@11ty/eleventy-cache-assets");
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_BOOKS_DB = process.env.NOTION_BOOKS_DB;
module.exports = async function () {
  let url = `https://api.notion.com/v1/databases/${NOTION_BOOKS_DB}/query`;
  const filter = {
    "sorts": [
      {
        "property": "dateRead",
        "direction": "descending",
      }
    ],
  };
  let json = await Cache(url, {
    duration: "5s",
    type: "json",
    fetchOptions: {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NOTION_API_KEY}`,
        "Notion-Version": "2022-02-22",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filter)
    },
  });
  return {
    json
  }
}


