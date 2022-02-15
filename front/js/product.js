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
        ficheProduit(data, addPanier);
    })
    .catch(function() {
        alert("Une erreur s'est produite");
    });
}

// Recuperez la fiche Produit

function ficheProduit(data, callback) {


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
    callback();
}

// Ajçuter un item dans la panier
function addPanier (){
    document.getElementById("addToCart").addEventListener("click", ajoutPanier);
    let itemDejaPresent ='';

    // Fonction pour ajouter un item dans localStorage
    function ajoutPanier(){
        let numberOfItem = Number(document.getElementById('quantity').value);
        let itemColor = document.getElementById('colors').value;
        let item = document.getElementById('title').innerText +" "+itemColor;
        // Verification couleur etuantité avant ajout dans panier
        if (itemColor == '' & (numberOfItem < 1 || numberOfItem > 100)){
            alert("Choississez un coloris et une quantité entre 1 et 100");
        } else if (!itemColor){
            alert("Choississez un coloris");
        } else if(numberOfItem < 1 || numberOfItem > 100){
            if (numberOfItem > 100){
                alert("Choississez une quantité entre 1 et 100");
            } else if(numberOfItem < 1){
                alert("Choississez une quantité correct");
            }
        }else{
            // Ajouter un item non présent dans le panier
            if(!localStorage.getItem(item)) {
                localStorage.setItem(`${item}`, 
                    JSON.stringify({
                        id: `${urlId}` , quantity: `${numberOfItem}`, couleur: `${itemColor}`
                    })
                );
                alert('Article ajouté dans le panier')
            // Fin - Ajouter un item non présent dans le panier
            } else {
            // Incrémenter la quantité à un item présent dans le panier
                itemDejaPresent = JSON.parse(localStorage.getItem(item));
                let newQuantityCanap= Number(itemDejaPresent.quantity) + numberOfItem;
                if (newQuantityCanap>100){
                    alert ("Quantité dans le panier de supérieur à 100")
                } else {
                    itemDejaPresent.quantity = `${newQuantityCanap}`;
                    localStorage.setItem(`${item}`, 
                        JSON.stringify(itemDejaPresent)
                    );
                    alert('Article ajouté dans le panier')
                }
                

             // Fin - Incrémenter la quantité à un item présent dans le panier
            }
        }
    }
     // Fin - Fonction pour ajouter un item dans localStorage
}
// Fin - Ajçuter un item dans la panier



// Chargement de la page

window.onload = function() {
    affichageProduit();
}

