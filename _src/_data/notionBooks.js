require("dotenv").config();
const EleventyFetch = require("@11ty/eleventy-fetch");
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_BOOKS_DB = process.env.NOTION_BOOKS_DB;

module.exports = async function () {
  const url = `https://api.notion.com/v1/databases/${NOTION_BOOKS_DB}/query`;
  const sort = {
    "sorts": [
      {
        "property": "dateRead",
        "direction": "descending",
      }
    ],
  };
  let json = await EleventyFetch(url, {
    directory: ".cache",
    duration: "1d",
    type: "json",
    fetchOptions: {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sort)
    },
  });
  return {
    json
  }
}