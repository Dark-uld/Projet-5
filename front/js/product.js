/**Récuperez Produit  de l'API correspondant à l'url actuel*/
function affichageProduit() {
    fetch ("http://localhost:3000/api/products/")
    .then(function(res) {
        return res.json();
        
    })
    .then(function(data){
        ficheProduit(data);
    })
    .catch(function() {
        alert("Une erreur s'est produite");
    });
}

// Recuperez la fiche Produit

function ficheProduit(data) {
    // Recuperez l'id dans l'url de la page
    let url = window.location.href;
    let newUrl = new URL (url);
    let urlSearch = newUrl.search;
    let urlId = urlSearch.replace(/[^a-zA-Z0-9]/g, '');
    // Fin Recuperez l'id dans l'url de la page

    let img ='';
    let optionColor = '';

    // Modifiez la fiche image selon l'id du produit

    for (let idProduit of data){
        if (idProduit._id == urlId){
            document.querySelector('head>title').innerHTML= `Page - ${idProduit.name}`;
            document.querySelector('.item > article > .item__img').innerHTML= `<img src="${idProduit.imageUrl}" alt="${idProduit.altTxt}">`;
            document.getElementById('title').innerHTML = `${idProduit.name}`;
            document.getElementById('price').innerHTML = `${idProduit.price}`;
            document.getElementById('description').innerHTML = `${idProduit.description}`;

           for (let color of idProduit.colors){
               optionColor += `<option value="${color}">${color}</option> `;
                
            }
             document.getElementById('colors').innerHTML=`<option value="">--SVP, choisissez une couleur --</option> ${optionColor}`;
        }
    }

    // Fin -- Modifiez la fiche image selon l'id du produit
}


// Chargement de la page

window.onload = function() {
    affichageProduit();
    
}

