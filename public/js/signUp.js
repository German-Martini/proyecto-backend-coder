document.getElementById("registerForm").addEventListener("submit", async function(event) {
    event.preventDefault();
  
    const formData = {
      first_name: document.getElementById("first_name").value,
      last_name: document.getElementById("last_name").value,
      email: document.getElementById("email").value,
      age: parseInt(document.getElementById("age").value),
      password: document.getElementById("password").value,
    };
  
    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
     
      window.location.href = "http://localhost:5000/signIn"; 

      console.log(result);
      

    } catch (error) {
      console.error("Error during registration:", error);

    }
  });