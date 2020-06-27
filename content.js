const URL = window.location.href
var highlighting = false;
var path_ = chrome.extension.getURL('toolbar.html')
var popup = null
var arr = []

let highlighter;

function init() {

    rangy.init();

    highlighter = rangy.createHighlighter();

    highlighter.addClassApplier(rangy.createClassApplier("highlight", {
        ignoreWhiteSpace: true,
        tagNames: ["span", "a"]
    }));


    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                popup = document.createElement("div")
                popup.style.display = "none"
                popup.innerHTML = xhr.responseText
                document.body.appendChild(popup)
                document.getElementById("btn_dostuff").onclick = () => {

                    highlightSelectedText()

                    var data = highlighter.serialize()
                    chrome.storage.local.set({
                        [URL]: data
                    }, () => {
                        console.log('saved', data)
                    })

                }
                chrome.storage.local.get([URL], function (result) {
                    if (!isEmpty(result)) {

                        let data = result[URL]
                        try {

                           highlighter.deserialize(data)

                        } catch (err) {
                            chrome.storage.local.clear()
                        }
                    }
                });
            }
        }
    };
    xhr.open("GET", path_, true);
    xhr.send(null);

};

document.onselectionchange = () => {
    try {
        if (window.getSelection().rangeCount > 0) {
            var selection = window.getSelection().getRangeAt(0).cloneRange();
            var rect = selection.getClientRects();
            if (rect.item(0) != null) {
                popup.style.cssText = `position:fixed; top: ${rect.item(0).top - 50}px; left: ${rect.item(0).left}px;`
                popup.style.display = "block"
            }

            if (selection.toString().length <= 0) {
                popup.style.display = "none"
            }
        }

    } catch (err) {
        console.log(window.getSelection().rangeCount)
        console.log('err', err)
    }
}

function isEmpty(obj) {
    return (Object.keys(obj).length === 0 && obj.constructor === Object)
}


window.onload = init;

function highlightSelectedText() {
    highlighter.highlightSelection("highlight");
}

function removeHighlightFromSelectedText() {
    highlighter.unhighlightSelection();
}