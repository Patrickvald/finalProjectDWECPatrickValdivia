document.addEventListener("DOMContentLoaded", function (){
    //Global variables
    const itemsContainer = document.getElementById("items")
    const cart = document.getElementById("lista-carrito")
    const totalCart = document.getElementById("total")
    const btnPay = document.getElementById("tramitar")
    const btnDelete = document.getElementById("borrar")

    //Cart items, I got them from the LS, in case there is no cart in the LS I inicialize it as an empty array
    let cartJSON = JSON.parse(localStorage.getItem("cart")) || []
    //updateCart()

    //Now, I need the data from the database, so I need to do a fetch with the PHP file todos_productos.php

    //I only used Laragon with PHP so I had to look how to start a php server in the browser => php -S localhost:8000 in one terminal
    
    fetch("http://localhost:8000/php/todos_productos.php")
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                const itemDiv = document.createElement("div")
                itemDiv.classList.add("producto")
                itemDiv.innerHTML = `
                    <h3>${item.nombre}</h3>
                    <img src="../img/${item.foto}" alt="${item.nombre}" width="100">
                    <p>Precio: ${item.precio}€</p>
                    <div>
                        <span>Cantidad: 1</span>
                        <button class="add" data-id="${item.id}" data-nombre="${item.nombre}" data-precio="${item.precio}">+</button>
                    </div>
                    `
                    itemsContainer.appendChild(itemDiv)
            })
        })

        //Add a product to the cart with the + button
        itemsContainer.addEventListener("click", e => {
            if(e.target.classList.contains("add")){
                const id = e.target.dataset.id
                const name = e.target.dataset.nombre
                const price = parseFloat(e.target.dataset.precio)
                const productInCart = cartJSON.find(item => item.id === id)

                if(productInCart){
                    productInCart.cantidad++
                }else{
                    cartJSON.push({id, name, price, cantidad: 1})
                }
                updateCart()
            }
        })

        //Function to update the cart in the interface and in the LS
        function updateCart(){
            cart.innerHTML = ""
            let total = 0
            cartJSON.forEach(item => {
                total += item.price * item.cantidad
                const li = document.createElement("li")
                li.innerHTML = `
                    ${item.name} - ${item.cantidad} x ${item.price}€
                    <button class="delete" data-id="${item.id}">x</button>
                `
                cart.appendChild(li)
            })
            totalCart.textContent = total.toFixed(2)
            localStorage.setItem("cart", JSON.stringify(cartJSON))
        }

        //Delete a product from the cart with the x buton
        cart.addEventListener("click", e => {
            if(e.target.classList.contains("delete")){
                const id = e.target.dataset.id
                cartJSON = cartJSON.filter(product => product.id !== id)
                updateCart()
            }
        })

        //Function to pay the cart content and clean the cart
        btnPay.addEventListener("click", () =>{
            if(cartJSON.length === 0) {
                alert("Your cart is empty") 
                return
            }
            console.log(cartJSON)
            alert("We are going to pay the cart...")
            //Here I got one problem to send the data with the POST method in PHP, my php file uses the $_POST variable, so I cannot send it as a normal fetch, I need to change the body to send it as a form result.

            //My other option was to change the php file to use file_get_contents("php://input") to get the data from the body.
            /*$inputJSON = file_get_contents("php://input");
            $input = json_decode($inputJSON, true); // Convertir JSON a array PHP

            if(isset($input["carrito"])) {
                $carrito = $input["carrito"];
                echo json_encode("ok");
            } else {
                echo json_encode(["error" => "No se recibió el carrito"]);
            }
            With this method, I can send a normal body and read it from the body of the petition in the php file.
            */


            /* fetch("http://localhost:8000/php/tramito_carrito.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ carrito: cartJSON })
            }) */
            const formData = new URLSearchParams();
            formData.append("carrito", JSON.stringify(cartJSON)); 
            
            fetch("http://localhost:8000/php/tramito_carrito.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: formData.toString()
            })
            .then(response => response.json())
            .then(data => {
                if(data === "ok"){
                    alert("Payment done")
                    cartJSON = []
                    localStorage.removeItem("cart")
                    updateCart()
                }
            })
        })

        //Clean the cart
        btnDelete.addEventListener("click", () => {
            cartJSON = []
            localStorage.removeItem("cart")
            updateCart()
        })
                
})