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
        // Recuperez les noms des items dans le local storage dans un tableau
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
                        <h2>Nom: ${product.name}</h2>
                        <p>Couleur: ${itemDansLS.couleur}</p>
                        <p>Prix: ${product.price} €</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${itemDansLS.quantity}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                    </div>
                </article>`
            }
        }
          
    }

    document.getElementById("cart__items").innerHTML= produitConteneur;
    callback1(data);
    callback2(data);
}

function calculTotal(data){
    let prixTotal = 0;
    let nombreDArticle = 0;
    
    for ( let i = 0 ; i < localStorage.length; i++){
        // Recuperez les noms des items dans le local storage dans un tableau
        let keyLocalStorage = localStorage.key(i);
        let itemDansLS = JSON.parse(localStorage.getItem(keyLocalStorage));
        // Fin - Boucle pour récupérez chaque array dans localStorage    

        // Boucle pour calculer le prix total et la quantité
        for(let product of data){
            if(itemDansLS.id == product._id){
                prixTotal += product.price*itemDansLS.quantity;
                nombreDArticle += Number(itemDansLS.quantity);
            }
        }
    }

    // Injectez les valeurs dans le HTML
    document
        .getElementById("totalPrice")
        .innerHTML = prixTotal;
    document
        .getElementById("totalQuantity")
        .innerHTML = nombreDArticle;
    
}

//Recuperez le nom de l'article
function recupNomArticle(event){
    let selectionArticle = event.target.closest('article');
    let nomArticle = selectionArticle.dataset.name+' ' +selectionArticle.dataset.color;
    return nomArticle;
}

// Modifier le nombre d'article
function modifNombreArticle(data){
    let itemSelectionne = document.getElementsByClassName('itemQuantity');
    for (let i =0; i < itemSelectionne.length;i++){
        itemSelectionne[i].addEventListener("change", function(event){
            let dataArticleChoisi= recupNomArticle(event);
            let itemDejaPresent = JSON.parse(localStorage.getItem(dataArticleChoisi));
            if (event.target.value <1 || event.target.value >100) {
                alert('Quantité invalide, choisir une valeur entre 1 et 100');
            } else {
                itemDejaPresent.quantity = event.target.value;
                localStorage.setItem(dataArticleChoisi,  JSON.stringify(itemDejaPresent) );
                location.reload();
            }
            
        })
    }
    calculTotal(data);
}

// Supprimer un item du localStorage
function supprimerItem(data){
    let itemSelectionne = document.getElementsByClassName('deleteItem');
    for (let i =0; i < itemSelectionne.length;i++){
        itemSelectionne[i].addEventListener("click", function(event){
            let dataArticleChoisi= recupNomArticle(event);
            localStorage.removeItem(dataArticleChoisi);
            location.reload();
        });
    }
    calculTotal(data);
}

// Verifier le formulaire 

function verificationFormulaire(){
    // Regle de verification
    let queDesLettres = /^[^@&"()!_$*€£`+=\/;?#\d]+$/;
    let verifAddress = /(?!^\d+$)^[^@&"()!_$*€£`+=\/;?#]+$/;
    let verifMail = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
    // Initialisation des variables associé aux données du formulaire
    let prenom = document.getElementById('firstName');
    let nom = document.getElementById("lastName");
    let addresse = document.getElementById('address');
    let city = document.getElementById("city");
    let email=document.getElementById('email');

    let formulaireValidation = '';

    // verification des valeurs données par l'utilisateur
    prenom.addEventListener("input", function(event){
        if (!verifierInput(event, queDesLettres)){
            document.getElementById("firstNameErrorMsg").innerText="Prénom Incorrect !!";
        } else {
            document.getElementById("firstNameErrorMsg").innerText="";
        }
    })
    nom.addEventListener("input", function(event){
        if (!verifierInput(event, queDesLettres)){
            document.getElementById("lastNameErrorMsg").innerText="Nom Incorrect !!";
        } else {
            document.getElementById("lastNameErrorMsg").innerText="";
        }
    })
    addresse.addEventListener("input", function(event){
        if (!verifierInput(event, verifAddress)){
            document.getElementById("addressErrorMsg").innerText="Adresse Incorrect !!";
        } else {
            document.getElementById("addressErrorMsg").innerText="";
        }
    })
    city.addEventListener("input", function(event){
        if (!verifierInput(event, queDesLettres)){
            document.getElementById("cityErrorMsg").innerText="Nom de ville Incorrect !!";
        } else {
            document.getElementById("cityErrorMsg").innerText="";
        }
    })
    email.addEventListener("input", function(event){
        if (!verifierInput(event, verifMail)){
            document.getElementById("emailErrorMsg").innerText="Email Incorrect !!";
        } else {
            document.getElementById("emailErrorMsg").innerText="";
        } 
    })



}

// Confirmation de la commmande 
function validerFormulaire(){
    let commander = document.getElementById('order');
    let listeProduit = [];
    for ( let i = 0 ; i < localStorage.length; i++){
        // Recuperez les id des items dans le local storage dans un tableau
        let keyLocalStorage = localStorage.key(i);
        let itemDansLS = JSON.parse(localStorage.getItem(keyLocalStorage));
        listeProduit.push(itemDansLS.id);
    }
    console.log(listeProduit)
    commander.addEventListener('click', function(event){
        event.preventDefault();
        let lol = document.getElementsByClassName('cart__order__form__question');
        let formValide = 0;
        for (let item of lol){
           if  (item.lastElementChild.innerHTML =='') {
                formValide++;
           }
        }

        if (formValide < 5){
            alert('Formulaire incomplet ou invalide')
        } else if (listeProduit.length==0){
            alert('Panier vide')
        } else {
            let prenom = document.getElementById('firstName');
            let nom = document.getElementById("lastName");
            let addresse = document.getElementById('address');
            let city = document.getElementById("city");
            let email=document.getElementById('email');
        
        // Création de classe contenant donnée formulaire + tableau avec id d'un produit
            let commandeUser = {
                contact : {
                    firstName : prenom.value,
                    lastName : nom.value,
                    address : addresse.value,
                    city : city.value,
                    email : email.value,
                },
                products : listeProduit,
            };
    
    
            const command = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json', 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(commandeUser)
            };
            // Récuperez l'id pour la commande depuis l'API
            fetch("http://localhost:3000/api/products/order", command)
            .then((response) => response.json())
            .then((data) => {
                localStorage.clear();
                document.location.href = `confirmation.html?=${data.orderId}`;
            })
            .catch((err) => {
                alert ("Problème avec fetch : " + err.message);
            });
        }
 
        
    })

    
}

// Verification de l'input
function verifierInput(event, regle){
    // on renvoie le résultat de la verification
    return event.target.value.match(regle)
}


    let lol = document.getElementsByClassName('cart__order__form__question');
    for (let item of lol){
       console.log( item.lastElementChild.innerHTML)
    }



// Chargement de la page

window.onload = function() {
    affichagePanier();
    verificationFormulaire();
    validerFormulaire();
}


