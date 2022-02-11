    // Recuperez l'id dans l'url de la page
    let url = window.location.href;
    let newUrl = new URL (url);
    let urlSearch = newUrl.search;
    let urlId = urlSearch.replace(/[^a-zA-Z0-9]/g, '');
    // Fin Recuperez l'id dans l'url de la page


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


    let optionColor = '';

    // Modifiez la fiche produit selon l'id du produit

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

    // Fin -- Modifiez la fiche produit selon l'id du produit
}

// Ajçuter un item dans la panier
function addPanier (event){
    document.getElementById("addToCart").addEventListener("click", ajoutPanier);
    let itemDejaPresent ='';

    // Fonction pour ajouter un item dans localStorage
    function ajoutPanier(event){
        let numberOfItem = Number(document.getElementById('quantity').value);
        let itemColor = document.getElementById('colors').value;
        let item = document.getElementById('title').innerText +" "+itemColor;

        // Ajouter un item non présent dans le panier
        if(!localStorage.getItem(item)) {
            localStorage.setItem(`${item}`, 
                JSON.stringify({
                    id: `${urlId}` , quantity: `${numberOfItem}`, couleur: `${itemColor}`
                })
            );
            // Fin - Ajouter un item non présent dans le panier
        } else {
            // Incrémenter la quantité à un item présent dans le panier
            itemDejaPresent = JSON.parse(localStorage.getItem(item));
            let newQuantityCanap= Number(itemDejaPresent.quantity) + numberOfItem;
            itemDejaPresent.quantity = `${newQuantityCanap}`;
            localStorage.setItem(`${item}`, 
                JSON.stringify(itemDejaPresent)
            );
            // Fin - Incrémenter la quantité à un item présent dans le panier
        }
    }
     // Fin - Fonction pour ajouter un item dans localStorage
    
}
// Fin - Ajçuter un item dans la panier



// Chargement de la page

window.onload = function() {
    affichageProduit();
    addPanier();
}

