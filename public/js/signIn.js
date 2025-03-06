document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();
  
    const formData = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };
  
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
      if (response.ok) {
        alert("Login successful");
        window.location.href = "/dashboard"; // Redirige tras login exitoso
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed");
    }
  });