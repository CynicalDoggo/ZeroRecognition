import React, { useState } from "react";
import { supabase } from '../supabaseclient';
import { Link, useNavigate } from "react-router-dom";

const Login = ({setToken}) => {
    let navigate = useNavigate()

    const [formData, setFormData] =useState ({
        email:'',password:''
    })

    console.log(formData)

    function handleChange(event) {
      setFormData((prevFormData)=>{
        return{
          ...prevFormData,
          [event.target.name]:event.target.value
        }
      })
    }

    async function handleSubmit(e) {
      e.preventDefault();
      try {
      // Use GET with URL-encoded email
          const checkBlacklist = await fetch(
            `https://facialrecbackend.onrender.com/check_blacklist?email=${encodeURIComponent(formData.email)}`,
            { method: "GET" }
          );

          if (!checkBlacklist.ok) throw new Error("Failed to check blacklist status.");
          
          const { is_blacklisted } = await checkBlacklist.json();
          if (is_blacklisted) {
              alert("Account blacklisted.");
              return;
          }
          // Use Supabase's signIn method directly
          const { data, error } = await supabase.auth.signInWithPassword({
              email: formData.email,
              password: formData.password,
          });
          
          if (error) throw error; // Handle error if sign-in fails
  
          console.log("Login successful:", data);

          // Extract the user ID and store it 
          const userId = data.user.id; 
          sessionStorage.setItem("user_id", userId);

          const { data: profileData, error: profileError} = await supabase
            .from("profiles")
            .select("role")
            .eq("id", userId)
            .single();
          
          if (profileError) {
            console.error("Error fetching profile:", profileError);
            alert("Error fetching profile.");
            return;
          }

          if (!profileData || profileData.role !== 'guest') {
            // If the user is not a guest, show an error or redirect
            alert("You are not a guest user.");
            return;
          }

          // Log the login activity by calling your backend endpoint
          await fetch("https://facialrecbackend.onrender.com/logIn_activity", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                user_id: userId,
                email: profileData.email, 
              }),
          });
  
          // Store user data or token in state or local storage
          setToken(data); // Assuming user contains necessary info
          navigate('/Homepage');
  
      } catch (error) {
          console.error("Error during login:", error);
          alert(error.message);
      }
   }
   
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-md shadow-md w-96"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <div className="mb-4">
          <input
            placeholder="Email"
            name="email"
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <input
            placeholder="Password"
            name="password"
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Login
        </button>
        <p className="mt-4 text-sm text-center">
          Don't have an account?{" "}
          <Link to="/Registration" className="text-blue-500 underline">
            Register Here
          </Link>
        </p>
      </form>
    </div>    
    )
}
export default Login;