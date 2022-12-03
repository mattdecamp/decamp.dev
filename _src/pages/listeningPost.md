---
layout: "layouts/listeningPost.njk"
pagination:
    data: listens
    size: 1
    alias: listen
permalink: "listening/{{ listen.title | slug }}/index.html"
eleventyComputed:
    title: "{{ listen.title }}"
---

{{ listen.content }}