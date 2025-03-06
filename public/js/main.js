const socket = io();

const prodductlist = document.getElementById("products");



socket.on("init", (products) => {
    
    prodductlist.innerHTML = "";

    products.forEach((product) => {
        const li = createProduct(product);
        prodductlist.appendChild(li);
    });
});

socket.on("newProduct", (product) => {
    console.log("New product received:", product);
    const li = createProduct(product);
    prodductlist.appendChild(li);
});

function createProduct(product) {
    const li = document.createElement("li");
    li.innerHTML = `${product.title} - $${product.price}`;
    li.className = "list-group-item";
    return li;
}

usermodel.addEventListener("submit", (event) => {
    event.preventDefault();
    const user = {
        name: usermodel.name.value,
        email: usermodel.email.value,
        password: usermodel.password.value,
    };
    socket.emit("newUser", user);
    usermodel.reset();
});