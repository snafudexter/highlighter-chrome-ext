const URL = window.location.href
var highlighting = true;
var path_ = chrome.extension.getURL('toolbar.html')
var popup = null
var arr = []

function init() {
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
                        highlightSelection()
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
            var found = window.find(arr.pop(), false, false, true)
            if (!found || arr.length <= 0) highlighting = false
        }
    });

};

document.onselectionchange = () => {

    var selection = window.getSelection().getRangeAt(0).cloneRange();
    var rect = selection.getClientRects();
    if (highlighting) {
        highlightSelection()
        if (arr.length > 0) {
            var found = false;
            do {
                found = window.find(arr.pop(), false, false, true)
            } while (!found && arr.length > 0)

        } else {
            highlighting = false;
            window.getSelection().empty()
        }

    } else {
        if (rect.item(0) != null) {
            popup.style.cssText = `position:fixed; top: ${rect.item(0).top - 50}px; left: ${rect.item(0).left}px;`
            popup.style.display = "block"
        }

        if (selection.toString().length <= 0) {
            popup.style.display = "none"
        }
    }

}

function highlightSelection() {
    var selection = window.getSelection().getRangeAt(0).cloneRange();
    var selectedText = selection.extractContents();
    var span = document.createElement("span");
    span.style.backgroundColor = "yellow";
    span.appendChild(selectedText);
    selection.insertNode(span);
}

function isEmpty(obj) {
    return (Object.keys(obj).length === 0 && obj.constructor === Object)
}


window.onload = init;