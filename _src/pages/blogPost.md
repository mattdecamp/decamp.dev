---
layout: "layouts/blogPost.njk"
pagination:
    data: blogs
    size: 1
    alias: blog
permalink: "blog/{{ blog.title | slug }}/index.html"
eleventyComputed:
    title: "{{ blog.title }}"
---

{{ blog.content }}