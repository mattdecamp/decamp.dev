---
layout: "layouts/listeningPost.njk"
tags:
    - listen
pagination:
    data: listens
    size: 1
    alias: listen
    addAllPagesToCollections: true
permalink: "listening/{{ listen.title | slug }}/index.html"
eleventyComputed:
    title: "{{ listen.title }}"
---

{{ listen.content }}