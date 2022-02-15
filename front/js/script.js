/**Récuperez tous les produits de l'API */

function affichageProduits() {
        fetch ("http://localhost:3000/api/products/")
        .then(function(res) {
            return res.json();
        })
        .then(function(data){
            injectionProduits(data);
        })
        .catch(function() {
            alert("Une erreur s'est produite");
        });
}

// Injection des produits dans la page Index

function injectionProduits(data) {
    let produitConteneur = "";
    // On crée une boucle pour aller récuperer chaque produit de l'API

    for(let product of data){
        produitConteneur += `
        <a href="./product.html?=${product._id}">
            <article>
              <img src="${product.imageUrl}" alt="${product.altTxt}">
              <h3 class="productName">${product.name}</h3>
              <p class="productDescription">${product.description}</p>
            </article>
          </a>
        `
    }

    document.getElementById("items").innerHTML= produitConteneur;
}




// Chargement de la page

window.onload = function() {
    affichageProduits();
}
