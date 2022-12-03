require("dotenv").config();
const { Client } = require("@notionhq/client");
const { NotionToMarkdown } = require("notion-to-md");

module.exports = async () => {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const n2m = new NotionToMarkdown({ notionClient: notion });

  const databaseId = process.env.NOTION_LISTENING_TO_DB;
  const db = await notion.databases.query({
    database_id: databaseId,
    sorts: [
      {
        property: "Post Date",
        direction: "descending",
      },
    ],
    filter: {
      and: [
        {
          property: "Status",
          status: {
            equals: "Published",
          },
        },
      ],
    },
  });

  const getContent = async (id) => {
    const mdblocks = await n2m.pageToMarkdown(id);
    return n2m.toMarkdownString(mdblocks);
  };

  const listens = db.results.map((result) => ({
    id: result.id,
    title: result.properties["Title"].title.pop()?.plain_text,
    date: result.properties["Post Date"].date?.start,
    artist: result.properties["Artist"].rich_text[0]?.text.content,
    album: result.properties["Album Title"].rich_text[0]?.text.content,
    track: result.properties["Track Title"].rich_text[0]?.text.content,
    art: result.properties["Art"]?.url,
    content: undefined,
  }));

  for (i = 0; i < listens.length; i++) {
    listens[i].content = await getContent(listens[i].id);
  }

  return listens;
};
