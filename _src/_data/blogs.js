require("dotenv").config();
const { Client } = require("@notionhq/client");
const { NotionToMarkdown } = require("notion-to-md");
const Cache = require('@11ty/eleventy-cache-assets');
const fs = require('fs');
const showdown = require('showdown');

module.exports = async () => {
    const notion = new Client({ auth: process.env.NOTION_API_KEY });
    const n2m = new NotionToMarkdown({ notionClient: notion });
    n2m.setCustomTransformer('embed', async (block) => {
      const {embed} = block;
      if (!embed?.url) return '';
      return `<figure>
      <iframe height="600" style="width: 100%;" scrolling="no" title="Scroll Snap Slides: x mandatory | center" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true" src="${
        embed?.url
      }"></iframe>
      <figcaption>${await n2m.blockToMarkdown(embed?.caption)}</figcaption>
    </figure>`;
    });
    const databaseId = process.env.NOTION_BLOG_DB;
    const db = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: "Date",
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
  
    const blogs = db.results.map((result) => ({
      id: result.id,
      title: result.properties["Title"].title.pop().plain_text,
      pubDate: result.properties["Date"].date?.start,
      tags: result.properties["Tags"].multi_select,
      content: undefined,
      specialTag: 'blog'
    }));
  
    for (i = 0; i < blogs.length; i++) {
      blogs[i].content = await getContent(blogs[i].id);
    }
  
    return blogs
  
};
