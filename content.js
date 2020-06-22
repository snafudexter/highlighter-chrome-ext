const URL = window.location.href
var highlighting = true;
var path_ = chrome.extension.getURL('toolbar.html')
var popup = null
var arr = []

function init() {
    console.log('init')
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                popup = document.createElement("div")
                popup.style.display = "none"
                popup.innerHTML = xhr.responseText
                document.body.appendChild(popup)
                document.getElementById("btn_dostuff").onclick = () => {
                    var selection = window.getSelection().getRangeAt(0).cloneRange();

                    chrome.storage.local.get([URL], function (result) {
                        if (isEmpty(result)) {
                            var arr = [];
                            arr.push(selection.toString())
                            chrome.storage.local.set({
                                [URL]: arr
                            }, () => {
                                console.log('saved')
                            })
                        } else {
                            var arr = result[URL]
                            arr.push(selection.toString())
                            chrome.storage.local.set({
                                [URL]: arr
                            }, () => {
                                console.log('saved')
                            })
                        }
                        var selectedText = selection.extractContents();
                        var span = document.createElement("span");
                        span.style.backgroundColor = "yellow";
                        span.appendChild(selectedText);
                        selection.insertNode(span);
                        window.getSelection().empty()
                        popup.style.display = "none"
                    });
                }
            }
        }
    };
    xhr.open("GET", path_, true);
    xhr.send(null);
    chrome.storage.local.get([URL], function (result) {
        if (!isEmpty(result)) {
            arr = result[URL]
            var found = window.find(arr.pop())
            if(!found) highlighting = false
        }
    });

};

document.onselectionchange = () => {

    var selection = window.getSelection().getRangeAt(0).cloneRange();
    var rect = selection.getClientRects();
    if (highlighting) {
        var selectedText = selection.extractContents();
        var span = document.createElement("span");
        span.style.backgroundColor = "yellow";
        span.appendChild(selectedText);
        selection.insertNode(span);
        if (arr.length > 0) {
            window.find(arr.pop())
        } else {
            highlighting = false;
        }

    } else {
        if (rect.item(0) != null) {
            popup.style.cssText = `position:absolute; top: ${rect.item(0).top}px; left: ${rect.item(0).left}px;`
            popup.style.display = "block"
        }

        if (selection.toString().length <= 0) {
            console.log('')
            popup.style.display = "none"
        }
    }

}

function isEmpty(obj) {
    return (Object.keys(obj).length === 0 && obj.constructor === Object)
}


window.onload = init;