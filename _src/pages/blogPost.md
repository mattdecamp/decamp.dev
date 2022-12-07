---
layout: "layouts/blogPost.njk"
tags:
    - myCollection
pagination:
    data: blogs
    size: 1
    alias: blog
    addAllPagesToCollections: true
permalink: "blog/{{ blog.title | slug }}/index.html"
eleventyComputed:
    title: "{{ blog.title }}"
---

{{ blog.content }}