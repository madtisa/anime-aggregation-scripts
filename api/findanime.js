// ==UserScript==
// @name     FindAnime API
// @version  1.0.0
// @match https://readmanga.io/*
// @match https://findanime.net/*
// @grant    none
// ==/UserScript==

function parseCurrentArticle() {
  const namesWrapper = document.querySelector('.names');

  if (!namesWrapper) return null;

  const namesList = Array.from(namesWrapper.children)
    .map((name) => ({ name: name.innerText, tag: Array.from(name.classList) }));
  const articleUrl = new URL(document.querySelector('meta[itemprop=url]').content);
  const articleId = articleUrl.pathname.split('/').reverse()[0];

  return {
    id: articleId,
    url: articleUrl,
    names: namesList,
  }
}

