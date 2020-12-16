const form = document.querySelector('#search-form');
const searchField = document.querySelector('#search-keyword');
let searchedForText;
const responseContainer = document.querySelector('#response-container');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    searchedForText = searchField.value;

    const unsplashReq = new XMLHttpRequest();
    unsplashReq.onload = addImage;
    unsplashReq.onerror = (err) => {
        requestError(err, 'image');
        console.log('error');
    };

    unsplashReq.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
    unsplashReq.setRequestHeader('Authorization', 'Client-ID WQrRnLp_3BfTfJ6PHqyHO5RMes61oXHhWQ7Wc-Gani8');
    unsplashReq.send();

    function addImage () {
        const images = JSON.parse(this.responseText);
        if (images && images.results && images.results[0]) {
            const firstImage = images.results[0];
        responseContainer.innerHTML = `
        <figure>
            <img src="${firstImage.urls.regular}" alt="${firstImage.user.name}">
            <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
        </figure>`;
        } else {
            responseContainer.innerHTML = ` <div class = "error-no-image";>${searchedForText} image is not found !</div>`;
        }
    }
    const articleRequest = new XMLHttpRequest();
    articleRequest.onload = addArticles;
    articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=S5M3XzlqTLG0zCP3NboXn5yiB3tjMyPz`);
    articleRequest.send();

    function addArticles() {
        let htmlContent = '';
        const data = JSON.parse(this.responseText);
        console.log(data);
        if (data.response && data.response.docs && data.response.docs.length > 1) {
            htmlContent ='<ul>' + data.response.docs.map(article => `<li class = 'article'><h2><a href = '${article.web_url}'>${article.headline.main}</a></h2><p>${article.snippet}</p></li>`).join('') + '</ul>';
        } else {
            htmlContent = `<div class = 'error-no-article'>${searchedForText} article is not found !</div>`;
        }
        // console.log(data.response.docs.map());
        responseContainer.insertAdjacentHTML('beforeend', htmlContent);
    }

});

