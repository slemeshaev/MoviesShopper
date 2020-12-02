//# sourceURL=application.js

//
//  application.js
//  MoviesShopper
//
//  Created by Станислав Лемешаев on 02.12.2020.
//

/*
 * This file provides an example skeletal stub for the server-side implementation 
 * of a TVML application.
 *
 * A javascript file such as this should be provided at the tvBootURL that is 
 * configured in the AppDelegate of the TVML application. Note that  the various 
 * javascript functions here are referenced by name in the AppDelegate. This skeletal 
 * implementation shows the basic entry points that you will want to handle 
 * application lifecycle events.
 */

/**
 * @description The onLaunch callback is invoked after the application JavaScript 
 * has been parsed into a JavaScript context. The handler is passed an object 
 * that contains options passed in for launch. These options are defined in the
 * swift or objective-c client code. Options can be used to communicate to
 * your JavaScript code that data and as well as state information, like if the 
 * the app is being launched in the background.
 *
 * The location attribute is automatically added to the object and represents 
 * the URL that was used to retrieve the application JavaScript.
 */
App.onLaunch = function(options) {
    const loading = createActivityIndicator("Loading feed...")
    navigationDocument.pushDocument(loading);
    
    loadData("https://itunes.apple.com/us/rss/topmovies/limit=100/json", parseJson)
}


App.onWillResignActive = function() {

}

App.onDidEnterBackground = function() {

}

App.onWillEnterForeground = function() {
    
}

App.onDidBecomeActive = function() {
    
}


/**
 * This convenience function returns an alert template, which can be used to present errors to the user.
 */
var createAlert = function(title, description) {

    var alertString = `<?xml version="1.0" encoding="UTF-8" ?>
        <document>
          <alertTemplate>
            <title>${title}</title>
            <description>${description}</description>
          </alertTemplate>
        </document>`

    var parser = new DOMParser();

    var alertDoc = parser.parseFromString(alertString, "application/xml");

    return alertDoc
}

function createActivityIndicator(title) {
    
    const markup = `<?xml version="1.0" encoding="UTF-8" ?>
    <document>
    <loadingTemplate>
    <activityIndicator>
    <text>${title}</text>
    </activityIndicator>
    </loadingTemplate>
    </document>`;
    
    return new DOMParser().parseFromString(markup, "application/xml")
}

function loadData(url, callback) {
    // создаем объект запроса
    const request = new XMLHttpRequest();
    // запуск функции обратного вызова, когда у нас есть данные
    request.addEventListner("load", function() { callback(request.response); });
    // конфигурация запроса URL, используя get
    request.open("GET", url)
    // отправка запроса
    request.send();
}

function fixXML(str) {
    return str.replace("&", "amp;");
}

function parseJson(text) {
    // конвертируем текст в массивы и словари
    const json = JSON.parse(text);
    // просматриваем все фильмы, которые нашли
    for (entry of json["feed"]["entry"]) {
        // создаем новый объект фильм
        let movie = {};
        // устанавливаем настройки из JSON, используя fixXML() для безопасности
        movie.title = fixXML(entry["im:name"]["label"]);
        movie.genre = fixXML(entry["category"]["attributes"]["label"]);
        movie.summary = fixXML(entry["summary"]["label"]);
        movie.director = fixXML(entry["im:artist"]["label"]);
        movie.releaseDate = fixXML(entry["im:releaseDate"]["attributes"]["label"]);
        movie.price = fixXML(entry["im:price"]["label"]);
        movie.coverURL = fixXML(entry["im:image"][0]["label"]).replace("60x60", "600x600");
        movie.link = fixXML(entry["link"][0]["attributes"]["href"]);
        movie.trailerURL = fixXML(entry["link"][1]["attributes"]["href"]);
        // распечатываем результат
        console.log(movie)
    }
}
