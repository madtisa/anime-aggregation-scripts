// ==UserScript==
// @name     FindAnime API
// @version  1.1.0
// @match    https://readmanga.io/*
// @match    https://findanime.net/*
// @grant    GM.xmlHttpRequest
// ==/UserScript==

class FindAnimeApi {
  static domains = {
    anime: new URL('https://findanime.net'),
    manga: new URL('https://readmanga.io'),
    adultManga: new URL('https://mintmanga.live'),
  };

  constructor(domain = FindAnimeApi.domains.anime) {
    this.domain = domain;
  }

  async search(name) {
    const response = await this._fetchJson(`${domain}search/suggestion?query=${encodeURIComponent(name)}`);
    return response.suggestions.map((suggestion) => (
      {
        id: this._extractId(suggestion.link),
        url: domain + suggestion.link,
        names: suggestion.names
      }
    ));
  }

  parseCurrentArticle() {
    const namesWrapper = document.querySelector('.names');

    if (!namesWrapper) return null;

    const namesList = Array.from(namesWrapper.children)
      .map((name) => ({ name: name.innerText, tag: name.classList }));
    const articleUrl = new URL(document.querySelector('meta[itemprop=url]').content);
    const articleId = this._extractId(articleUrl.pathname);

    return {
      id: articleId,
      url: articleUrl,
      names: namesList,
    }
  }

  _fetchJson(url, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: method,
        url: url,
        data: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        },
        responseType: 'json',
        timeout: 3000,
        onabort: () => reject(),
        ontimeout: () => reject(),
        onerror: () => reject(),
        onload: function (xhr) {
          if (xhr.status >= 300) {
            return reject(`${xhr.statusText} (${xhr.status}): ${xhr.finalUrl}`);
          }

          try {
            resolve(xhr.response);
          } catch (error) {
            reject(error);
          }
        }
      });
    });
  }

  _extractId(url) {
    return url.split('/').reverse()[0];
  }
}
