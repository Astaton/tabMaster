//This is a content script. It is injected into pages and runs when 
//selected pages are opened.
// setTimeout(() => {
    // let pTags = document.getElementsByTagName('p');
    // let p = pTags[Math.floor(pTags.length / 2)];
    // alert('the middle p on this page is: ', p.innerText);
    // console.log(p, p.innerText)

// },5000)

//this is listening for messages from the popup.js
chrome.runtime.onMessage.addListener((request) => {
    let pTags = document.getElementsByTagName('p');
    let p = pTags[Math.floor(pTags.length / 2)];
    alert('the middle p on this page is: ', request);
    console.log(p, request)
    alert(request, p.innerText);
})

//sending messages to popup.js
chrome.runtime.sendMessage({
    url: window.location.href
})