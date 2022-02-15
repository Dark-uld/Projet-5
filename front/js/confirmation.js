function recupId(){
    let url = window.location.href;
    let newUrl = new URL (url);
    let urlSearch = newUrl.search;
    let urlId = urlSearch.replace(/[^a-zA-Z0-9-]/g, '');
    document
        .getElementById("orderId")
        .innerHTML= urlId;
}

recupId();