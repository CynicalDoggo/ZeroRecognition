import React, { useState } from "react";
import { supabase } from "../../supabaseclient";

const AuthForm = ({ mode }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleAuth = async () => {
        if (mode === "login") {
            const { error } = await supabase.auth.signInWithPassword({
                email: username,
                password,
            });
            if (error) alert(error.message);
            else alert("Login successful!");
        } else {
            const { error } = await supabase.auth.signUp({
                email: username,
                password,
            });
            if (error) alert(error.message);
            else alert("Sign-up successful!");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-96 bg-white p-6 rounded shadow">
                <h2 className="text-2xl font-bold text-center mb-6">
                    {mode === "login" ? "Login" : "Sign Up"}
                </h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full mb-4 p-2 border rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-4 p-2 border rounded"
                />
                <button
                    onClick={handleAuth}
                    className="w-full py-2 bg-blue-500 text-white rounded"
                >
                    {mode === "login" ? "Login" : "Sign Up"}
                </button>
            </div>
        </div>
    );
};

export default AuthForm;
