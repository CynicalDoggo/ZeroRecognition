import React, { useState } from "react";
import { supabase } from '../supabaseclient';
import {useNavigate } from "react-router-dom";

const AdminLogin = ({setToken}) => {
    let navigate = useNavigate()

    const [formData, setFormData] =useState ({
      email:'',password:''
    })

    console.log(formData)
    const [error, setError] = useState(null); // Initialize error state

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
          // Use Supabase's signIn method directly
          const { data, error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          });
          
          if (error) throw error; // Handle error if sign-in fails

          console.log("Login successful:", data);

          const userId = data.user.id;

          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single(); // Ensure only one result is returned

          if (profileError) {
            throw profileError;
          }

          // If the role is 'admin', allow login
          if (profileData && profileData.role === 'admin') {
            console.log("Staff login successful");

            // Store user data or token in state or local storage
            setToken(data); // Assuming user contains necessary info
            navigate('/AdminHomepage');
          } else {
            alert("You are not authorized to access this page.");
          }
  
      } catch (error) {
        console.error("Error during login:", error);
        setError(error.message || "An error occurred during login.");
      }
  }
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-md shadow-md w-96"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
        <div className="mb-4">
          <input
            placeholder="email"
            name="email"
            type="text"
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
      </form>
    </div>    
    )
}
export default AdminLogin;