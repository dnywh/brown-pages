---
title: Home
layout: "base.njk"
---

Hello from the body of the index.md file! Here is the changelog:

{% for post in collections.posts %}

- [{{ post.data.title }}, {{ post.date | niceDate }}]({{ post.url }})
  {% endfor %}

This Eleventy template is the result of Stephanie Eckles’ [Build an 11ty Site in 3 Minutes](https://www.youtube.com/watch?v=BKdQEXqfFA0) video content. I tend to use it to start all my Eleventy projects.

After this point, I might:

Ideas:

{% for idea in ideas %}

- [{{ idea.title }}]({{ idea.url }})
  {% endfor %}
