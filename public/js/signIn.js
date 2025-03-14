document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();
  
    const formData = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };
  
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
      
      window.location.href = "http://localhost:5000/api/users/profile"; 

    } catch (error) {
      console.error("Error during login:", error);
    }
  });