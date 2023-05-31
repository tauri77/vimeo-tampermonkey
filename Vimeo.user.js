// ==UserScript==
// @name         Vimeo Tauri
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Tauri vimeo downloader
// @author       Tauri
// @match        https://player.vimeo.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vimeo.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const regexTitle = /embed_code":".*?"title":"(.*?)"/;
    var title = 'video.mp4';
    var m = '';
    if ((m = regexTitle.exec(document.documentElement.innerHTML)) !== null) {
        title = decodeURIComponent(JSON.parse('"' + m[1].replace(/\"/g, '\\"') + '"')) + '.mp4';
    } else {
        const regexTitle = /embedUrl":".*?"name":"(.*?)"/;
        if ((m = regexTitle.exec(document.documentElement.innerHTML)) !== null) {
            title = decodeURIComponent(JSON.parse('"' + m[1].replace(/\"/g, '\\"') + '"')) + '.mp4';
        }
    }
    window.copyTitle = function() {
        document.getElementById("video_name").select();
        document.execCommand('copy');
    }

    var text = "<div id='div_tau' style='position:fixed;width:350px;z-index:999;top:0;right:0;background: #0005;padding: 10px;color: #fff;border-radius: 3px;text-align: center;'>";
    text +="<button style='position: absolute; top: 3px; right: 3px;' onclick='document.getElementById(\"div_tau\").remove()'>X</button>";
    text +="<h3>Download</h3>";
    text += '<input type="text" id="video_name"><button onclick="window.copyTitle()">Copiar Título</button><br><br>';

    const regex = /playerConfig\s*=\s*([\s\S]*?"mime":\s*"video\/mp4"[^}]*?"url":\s*"([^"]*)"[^}]*"720p"[^\n;]*?})(;|\n|<\/script)/gm;
    while ((m = regex.exec(document.documentElement.innerHTML)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        var json = m[1];
        json = JSON.parse(json);
        var items = json.request.files.progressive;
        for (let x in items) {
            text += '<a style="color:#fff; font-weight: 700; text-decoration: none;" href="' + items[x].url + '" download="' + title + '" target="_blank">' + items[x].quality + '</a>';
            if ( x < items.length - 1 ) {
                text += ' | ';
            }
        }
    }
    text += '</div>';
    var newItem = document.createElement("div");
    newItem.innerHTML=text;
    document.body.prepend(newItem);
    document.getElementById("video_name").value = title;
})();
