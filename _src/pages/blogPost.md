---
layout: "layouts/blogPost.njk"
tags:
    - blog
pagination:
    data: blogs
    size: 1
    alias: blog
    addAllPagesToCollections: true
permalink: "blog/{{ blog.title | slug }}/index.html"
eleventyComputed:
    title: "{{ blog.title }}"
    pubDate: "{{ blog.pubDate }}"
---

{{ blog.content }}