---
title: "Connect Notion to Eleventy"
date: 2022-05-01
tags:
  - article
  - tutorial
  - eleventy
  - notion
  - api
  - nunjucks
excerpt: "Integrate Notion data with an Eleventy site using Eleventy Fetch and the Notion API"
---

In this tutorial I will walk through how to connect a Notion database to a site built with Eleventy. 

## Background

I keep a running list of all the books I read, and publish it over on the [books page](/books) of my site. Recently I moved my book data from a CSV file to a Notion database, and needed a way to connect it to Eleventy so that my books page could be maintained.

Thankfully this was possible using [Eleventy Fetch](https://www.11ty.dev/docs/plugins/fetch/) and the [Notion API](https://developers.notion.com/reference/intro).

## Assumptions

You are familiar with:

1. How to [create a database](https://www.notion.so/help/guides/creating-a-database) and [import a CSV file](https://www.notion.so/help/import-data-into-notion) into Notion.
2. [Eleventy Data](https://www.11ty.dev/docs/data-global/)
3. [Async functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
4. Using [.env variables](https://nodejs.dev/learn/how-to-read-environment-variables-from-nodejs) in Javascript

## Step 1: Establish a Notion Integration

To access our book database, we need a way to connect to the Notion API.

### Create a new integration

Go to the [Notion integrations page](https://www.notion.so/my-integrations) and [create a new integration](https://developers.notion.com/docs#step-1-create-an-integration). Be sure to make a note of what you name the Integration. I'm going to call mine 'mattdecamp.com data'.

Copy the **Internal Integration Token**, create a new file in the root of your project called **.env**, and add the token to it.

```bash
NOTION-API-KEY=TheInternalIntegrationToken
```

This token will be the _key_ to accessing our database.

## Step 2: Get the Database ID

Now we are going to need the unique ID of our Notion database. Let's take a look at the url format of a Notion database:

```bash
https://www.notion.so/{workspace_name}/{database_id}?v={view_id}
```

Find the part of your database link that corresponds to **{database_id}** and copy that.

Go back to your **.env** file and add a new variable.

```bash
NOTION-BOOK-DB=YourDatabaseIDString
```

### Share the Database with our Integration

Before we can fetch the data, we need to ensure our Notion Integration can access the book database. We can do this by sharing our database with the integration in the same way we would a team member or colleague.

On the database page in Notion, click on "Share" in the top-right corner. Click on the input field and a drop-down will appear. Select the integration from the list and click the Invite button. Your integration now has the access it needs to read the database.

Great! Now we have what we need to access the Notion API. Next, let's figure out how to get our Eleventy site to talk to it.

## Step 3: Install Eleventy-Fetch

Eleventy's [Fetch plug-in](https://www.11ty.dev/docs/plugins/fetch/) does exactly what you would think and fetches data from a data source, with the added benefit of caching that data for a configurable interval of time.

We are going to use Fetch to connect our site to the Notion API and bring the book data into our site.

Let's install Fetch as a dev dependency in our project.

```bash
npm i -D @11ty/eleventy-fetch
```

We'll need to make sure Fetch can access our environment variables. So let's install [dotenv](https://www.npmjs.com/package/dotenv) as well.

```bash
npm i -D dotenv
```

Before moving ahead, go ahead and create a new file in your project directory called **.cache**. Then add it to your **.gitignore** file. More on what this file is for in the next step.

## Step 4: Coding the fetch

In our project's **\_data** folder let's create a file called **notionBooks.js**. This is where we will write our fetch function. Here's what we want that function to do:

1. [Query](https://developers.notion.com/reference/post-database-query) our Notion book database.
2. Conditionally sort the data (more on this in a bit).
3. Await Fetch based on the options we set.
4. Have Fetch return the data to us in JSON format.

Let's create some variables to get started.

```js
// Require the Fetch plug-in
const EleventyFetch = require("@11ty/eleventy-fetch");

// Grant access to our .env file
require("dotenv").config();

// The Notion Integration Key
const NOTION_API_KEY = process.env.NOTION_API_KEY;

// The Book Database ID
const NOTION_BOOKS_DB = process.env.NOTION_BOOKS_DB;
```

Now, we create a variable for our API database query. Note here that I am using a template literal so we can include our database ID environment variable in the url string.

```js
module.exports = async function () {
  const url = `https://api.notion.com/v1/databases/${NOTION_BOOKS_DB}/query`;
};
```

Notion's database query allows the option to both filter and sort our data based on conditions we supply it. Below I am telling Notion to sort the books based on the dateRead property, and in a descending direction.

Essentially the book data will be returned to us in the order in which the books were read. The most recently read book will appear first, and so on.

<aside class="article__aside">You can set the sort to any property as it applies to your own database. Read more on <a href="https://developers.notion.com/reference/post-database-query-sort">sort</a> and <a href="https://developers.notion.com/reference/post-database-query-filter">filter</a> options.</aside>

```js
module.exports = async function () {
  const url = `https://api.notion.com/v1/databases/${NOTION_BOOKS_DB}/query`;
  const sort = {
    sorts: [
      {
        property: "dateRead",
        direction: "descending",
      },
    ],
  };
};
```
### Fetch Eleventy Fetch!
Now we bring in Fetch to do...the fetching! It will take two arguments: the **url** variable and the **options** we want to include.

First we tell Fetch we want it to store all the cache data in our **.cache** file. Next, we tell it to parse the data as JSON. And then we assign an amount of time until fetch tries to request data again. Here we tell it to wait one day.

```js
module.exports = async function () {
  // ...url and sort code
  let json = await EleventyFetch(url, {
    directory: ".cache",
    type: "json",
    duration: "1d",
  });
};
```

<aside class="article__aside">
More on <a href="https://www.11ty.dev/docs/plugins/fetch/#change-the-cache-duration">changing the cache duration</a>.
</aside>

### fetchOptions
Now we'll add three fetchOptions: method, headers, and body. 

We need to make sure the method is set to POST to ensure we receive our database data (and not just the structure of the database).

For headers, we input the specific headers the Notion API requires for each call. This includes inputting our Integration token to authorize the API access.

The body option tells Fetch to turn the database JSON object into a string and apply the sort we specified earlier.

```js
module.exports = async function () {
  // ...url and sort code
  let json = await EleventyFetch(url, {
    // directory, type, duration...
    fetchOptions: {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_API_KEY}`,
        "Notion-Version": "2022-02-22",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sort),
    },
  });
};
```

Finally, the function returns the data.

```js
module.exports = async function () {
  // ...other code
  return {
    json,
  };
};
```
Now the fetch function is complete! Let's take a look at the all the code put together.

```js
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
        "Notion-Version": "2022-02-22",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sort)
    },
  });
  return {
    json
  }
}
```

## Step 5: Applying the data to our template

The data has been fetched, and now we need to apply it to the book list template. With a little Nunjucks magic we can do just that!

```html
<ul id="bookList">{% raw %}
  {% for book in notionBooks.json.results %}
  <li class="book">
    <div class="bookImageContainer">
      <a href="{{ book.properties.bookBuyUrl.url }}">
        <picture>
          <img
            class="bookImage"
            src="{{ book.properties.bookImage.url }}"
            alt="The book cover for {{ book.properties.bookTitle.rich_text[0].text.content }}"
            loading="lazy"
            height="240"
          />
        </picture>
      </a>
    </div>
    <div class="bookInfo">
      <h4 class="bookTitle">{{ book.properties.bookTitle.rich_text[0].text.content }}</h4>
      {% if book.subTitle %}
      <p class="bookSubTitle">{{ book.properties.subTitle.rich_text[0].text.content }}</p>
      {% endif %}
      <p class="bookAuthor">
        <em>{{book.properties.bookAuthor.rich_text[0].text.content}}</em>
      </p>
      <p class="bookDate">
        {{book.properties.dateRead.date.start.toString() }}
      </p>
    </div>
  </li>
  {% endfor %}{% endraw %}
</ul>
```
Check out the [Books page](/books) to see the final result.

Keep in mind these property values (as with dateRead) are specific to my own book database. Your property values will certainly differ. 

I recommend reading up on the Notion [property value object](https://developers.notion.com/reference/property-value-object) to get an idea of how they are structured and the keys each property value contains. 

### Deployment and Environment Variables

For security purposes, we never want our environment variables pushed to the project repository. However, this database fetch will not work without them.

So, how do we get around this?

Well, Netlify (where I deploy my site) allows you to [store your environment variables](https://docs.netlify.com/configure-builds/environment-variables/) under your site's Deploy Settings. This keeps them safe and still accessible at build time.

Thanks for reading and happy coding! 🏄
