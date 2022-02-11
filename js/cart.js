/**Récuperez tous les produits de l'API */
function affichagePanier() {
    fetch ("http://localhost:3000/api/products/")
    .then(function(res) {
        return res.json();
    })
    .then(function(data){
        injectionItemPanier(data, supprimerItem, modifNombreArticle);
    })
    .catch(function() {
        alert("Une erreur s'est produite");
    });
}

// Injection des items dans le panier dans la page Cart

function injectionItemPanier(data, callback1, callback2) {

    let produitConteneur = "";
    //Boucle pour récupérez chaque item de l'API étant dans le panier
    for ( let i = 0 ; i < localStorage.length; i++){
        let keyLocalStorage = localStorage.key(i);
        let itemDansLS = JSON.parse(localStorage.getItem(keyLocalStorage));
        // Fin - Boucle pour récupérez chaque array dans localStorage    

        // Boucle pour injecter les items dans la page cart
        for(let product of data){
            if(itemDansLS.id == product._id) {
                produitConteneur += `
                <article class="cart__item" data-name="${product.name}" data-color="${itemDansLS.couleur}">
                    <div class="cart__item__img">
                    <img src="${product.imageUrl}" alt="${product.altTxt}">
                    </div>
                    <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${product.name}</h2>
                        <p>${itemDansLS.couleur}</p>
                        <p>${product.price} €</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${itemDansLS.quantity}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem" id="${product.name} ${itemDansLS.couleur}">Supprimer</p>
                        </div>
                    </div>
                    </div>
                </article>`
            }
        }
          
    }

    document.getElementById("cart__items").innerHTML= produitConteneur;
    callback1();
    callback2();
}


//Recuperez le nom de l'article
function recupNomArticle(event){
    let selectionArticle = event.target.closest('article');
    let nomArticle = selectionArticle.dataset.name+' ' +selectionArticle.dataset.color;
    return nomArticle;
}

// Modifier le nombre d'article
function modifNombreArticle(){
    let itemSelectionne = document.getElementsByClassName('itemQuantity');
    for (let i =0; i < itemSelectionne.length;i++){
        itemSelectionne[i].addEventListener("change", function(event){
            let dataArticleChoisi= recupNomArticle(event);
            let itemDejaPresent = JSON.parse(localStorage.getItem(dataArticleChoisi));
            itemDejaPresent.quantity = event.target.value;
            localStorage.setItem(dataArticleChoisi,  JSON.stringify(itemDejaPresent) );
        })
    }
}

// Supprimer un item du localStorage
function supprimerItem(){
    let itemSelectionne = document.getElementsByClassName('deleteItem');
    for (let i =0; i < itemSelectionne.length;i++){
        itemSelectionne[i].addEventListener("click", function(event){
            let dataArticleChoisi= recupNomArticle(event);
            localStorage.removeItem(dataArticleChoisi);
            location.reload();
        });
    }
}

// Verifier le formulaire 

function verificationFormulaire(){
    // Regle de verification
    let queDesLettres = /^([\w\p{L} ]+)$/;
    let verifAddress = /^[\d]+\s*[\w\p{L} .-]+$/;
    let verifMail = /^[\d\w-_\p{L}]+[@]+[\d\w-_\p{L}]+[.]+[\w]+$/;

    let prenom = document.getElementById('firstName');
    let nom = document.getElementById("lastName");
    let addresse = document.getElementById('address');
    let city = document.getElementById("city");
    let email=document.getElementById('email');

    prenom.addEventListener("change", function(event){
        if (!verifierInput(event, queDesLettres)){
            document.getElementById("firstNameErrorMsg").innerText="Prénom Incorrect !!";
        } else {
            document.getElementById("firstNameErrorMsg").innerText="Prénom Correct";
        }
    })
    nom.addEventListener("change", function(event){
        if (!verifierInput(event, queDesLettres)){
            document.getElementById("lastNameErrorMsg").innerText="Nom Incorrect !!";
        } else {
            document.getElementById("lastNameErrorMsg").innerText="Nom Correct";
        }
    })
    addresse.addEventListener("change", function(event){
        if (!verifierInput(event, verifAddress)){
            document.getElementById("addressErrorMsg").innerText="Adresse Incorrect !!";
        } else {
            document.getElementById("addressErrorMsg").innerText="Adresse Correct";
        }
    })
    city.addEventListener("change", function(event){
        if (!verifierInput(event, queDesLettres)){
            document.getElementById("cityErrorMsg").innerText="Nom de ville Incorrect !!";
        } else {
            document.getElementById("cityErrorMsg").innerText="Nom de ville Correct";
        }
    })
    email.addEventListener("change", function(event){
        if (!verifierInput(event, verifMail)){
            document.getElementById("emailErrorMsg").innerText="Email Incorrect !!";
        } else {
            document.getElementById("emailErrorMsg").innerText="Email Correct";
        }
    })

}

// Verification de l'input
function verifierInput(event, regle){
    return event.target.value.match(regle)
}

// Chargement de la page

window.onload = function() {
    affichagePanier();
    verificationFormulaire()
}

