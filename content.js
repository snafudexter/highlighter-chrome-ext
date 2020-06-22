console.log('heelo')

var popup = null
var visible = false
function dostuff()
{
    console.log('doing stuff')
}

document.onselectionchange = () => {  
    // try{
        
    //     document.body.removeChild(popup)
    // } catch(e)
    // {
    //     console.log(e)
    // }
    popup = document.createElement("div")
    var selection= window.getSelection().getRangeAt(0).cloneRange();
    var rect = selection.getClientRects();
    popup.style.cssText = `position:absolute; top: ${rect.item(0).top - 50}px; left: ${rect.item(0).left}px;`

    var path_ = chrome.extension.getURL('toolbar.html')

    var xhr = new XMLHttpRequest();
	xhr.onreadystatechange=function()
	{ 
		if(xhr.readyState == 4)
		{
			if(xhr.status == 200)
			{
                popup.insertAdjacentHTML('beforeend', xhr.responseText)
                if(!visible)
                {
                    document.body.appendChild(popup)
                    visible = true;
                }
                    
			}
		} 
	}; 

	xhr.open("GET", path_ , true);
	xhr.send(null); 
    
    

    // var selectedText = selection.extractContents();
    // var span= document.createElement("span");
    // span.style.backgroundColor = "yellow";
    // span.appendChild(selectedText);
    // selection.insertNode(span);
}

