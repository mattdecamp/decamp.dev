---
title:  "A Quick Guide to Scroll Snap"
date:  2022-04-05
tags:
- article
- tutorial
- scroll snap
- css
- how-to
excerpt: "Scroll snap is a handy, built-in CSS feature that enhances the user experience on the page."
---

Scroll snap is a handy viewport navigation effect that locks focus on a page element. Elements with the scroll effect applied "snap" into view. 

Scroll snap works along both the y and x axes of the viewport. Often, you will see it applied to a series of cards, or used to bring focus onto specific sections of a page. 

## Getting Started

To get up and running with Scroll Snap we will need two properties: `scroll-snap-type` and `snap-scroll-align`.

<aside class="article__aside">
Check out the full list of Scroll Snap properties on <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Scroll_Snap">MDN</a>. 
</aside>

Let's say we have a stack of slides we want to snap into place along the y-axis of the viewport. 

```html
<article id="container">
  <div class="slide"></div>
  <div class="slide"></div>
  <div class="slide"></div>
  <div class="slide"></div>
</article>
```

First, we add the `scroll-snap-type` property to the container element. 

```css
#container {
  scroll-snap-type: y mandatory;
}
```

With this property we have a required first value `y`, followed by an optional second value `mandatory`.

With `y` we are saying the container element can only snap along its y-axis. `mandatory` ensures that whenever the scroll action completes, the browser will snap to the nearest element along the axis.

Next, we need to add `scroll-snap-align` to the elements we want to snap.

```css
.slide {
  scroll-snap-align: start;
}
```

Here we are saying two things:
1. Snap all the child elements with the `slide` class applied.
2. Snap to the `start` of each slide element. 

Let's see this in action:

<p class="codepen" data-height="600" data-default-tab="result" data-slug-hash="mdrKgjP" data-preview="true" data-user="mattdecamp" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/mattdecamp/pen/mdrKgjP">
  Scroll Snap Slides: y mandatory | align start</a> by Matt DeCamp (<a href="https://codepen.io/mattdecamp">@mattdecamp</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

Something to note here: We could have snapped the slides to their `center` or `end`. But, with these full viewport cards, it's hard to see the difference. 

Let's make it  easier to see with a new example which snaps cards to their `end`.

<p class="codepen" data-height="700" data-default-tab="result" data-slug-hash="OJzzLyp" data-preview="true" data-user="mattdecamp" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/mattdecamp/pen/OJzzLyp">
  Scroll Snap Slides: y mandatory | align start</a> by Matt DeCamp (<a href="https://codepen.io/mattdecamp">@mattdecamp</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

Open up the demo yourself, substitute `start` and `center` into the `snap-scroll-align` property, and see how that affects the cards.

## Mandatory vs. Proximity

The `scroll-snap-type` property can take either `mandatory` or `proximity` as its second value. So far we've only touched on `mandatory`. Think of it as the stricter of the two. No matter what the snap aligns to, you will see that visually dramatic snap effect. 

`proximity` on the other hand is a "softer" snap; one that won't take effect until the scroll action is much closer to the `scroll-snap-align` point.

Let's take a look at the difference. And be sure to scroll slowly to make sure you're seeing the effect.

<p class="codepen" data-height="700" data-default-tab="result" data-slug-hash="gOooYKx" data-preview="true" data-user="mattdecamp" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/mattdecamp/pen/gOooYKx">
  Scroll Snap Slides: Small Slides | y mandatory | align end</a> by Matt DeCamp (<a href="https://codepen.io/mattdecamp">@mattdecamp</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

### Horizontal Scroll

Lastly, let's take a quick look at what a scroll along the x-axis looks like. First let's apply our properties.

```css
#container {
  scroll-snap-type: x mandatory
}

.slide {
  scroll-snap-align: center;
}
```

<p class="codepen" data-height="500" data-default-tab="result" data-slug-hash="yLpXQdK" data-preview="true" data-user="mattdecamp" style="height: 500px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; margin-bottom: var(--s-2); padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/mattdecamp/pen/yLpXQdK">
  Scroll Snap Slides - Horizontal</a> by Matt DeCamp (<a href="https://codepen.io/mattdecamp">@mattdecamp</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

Pretty much the same behavior as in our first example, only occuring along the screen's horizontal (x) axis.

## Wrapping Up

At it's most basic two property setting, scroll-snap is pretty easy to set up, eh?

But it *can* be more involved (and you can get much more specific with your settings). I encourage you to take look at [all the scroll-snap properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Scroll_Snap) and consider how they could useful to you in your next project.

Thanks for reading, and happy coding!
