from flask import Flask, request, jsonify
from supabase import create_client, Client
from flask_cors import CORS
import hashlib

# Supabase connection setup
url = "https://jbqkrihvwaurorcdagiw.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpicWtyaWh2d2F1cm9yY2RhZ2l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk5NzQ2ODUsImV4cCI6MjA0NTU1MDY4NX0.YKPc7TvBowLYKWVohA_5dsl9IfFMz7qr1fo4f7V3cY8"
supabase = create_client(url, key)

app = Flask(__name__)
CORS(app)

#Hash Function
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

@app.route("/register", methods=["POST"])
def register():
    try:
        # Get the data from the frontend
        data = request.get_json()
        
        # Debugging purposes (Delete later)
        print("Received data:", data)
        
        #Filling in variables
        first_name = data.get("firstName")
        last_name = data.get("lastName")
        mobile_number = data.get("phoneNum")
        email = data.get("email")
        password_hash = hash_password(data.get("password"))
        facialID_consent = False
        
        #creating user in supabase authentication 
        auth_response = supabase.auth.sign_up({
                "email": email,
                "password": data.get("password"),
                "options": {"data": 
                    {
                        "first_name": first_name, 
                        "last_name": last_name, 
                        "mobile_number": mobile_number
                    }
                }     
            }  
        )
        
        user_id = auth_response.user.id
        
        # No facial opt in
        if data.get("facialRecognitionOptIn") == False:
            #Inserting into guest table
            guest_response = supabase.table("guest").insert(
                {   
                    "user_id": user_id,
                    "first_name": first_name,
                    "last_name": last_name,
                    "email": email,
                    "mobile_number": mobile_number,
                    "password_hash": password_hash,
                    "facialid_consent": facialID_consent
                }
            ).execute()
            # Check response after insertion
            if guest_response.data:
                return jsonify({"success": True, "message": "Registration successful!"}), 200
            else:
                return jsonify({"success": False, "message": "Error inserting into guest table."}), 400
        
        # Facial opt in  
        elif data.get("optInFacialRecognition") == True:
            # Facial data insertion + Account registration
            return jsonify({"success": True, "message": "Facial recognition opted-in"}), 200
        
        #something went wrong
        else: 
            return jsonify({"success": False, "message": "Something Went wrong"}), 400
        
    except Exception as e:
        print("Error:", e)
        return jsonify({"success": False, "message": str(e)}), 400

@app.route("/get_user_data", methods=["GET"])
def get_user_data():
    try:
        user_id = request.args.get("user_id")
        if not user_id:
            return jsonify({"success": False, "message": "User ID is required"}), 400
        
        response = supabase.table("guest").select("*").eq("user_id", user_id).execute()
        if not response.data:
            return jsonify({"success": False, "message": "User not found"}), 404
        
        return jsonify({"success": True, "user_data": response.data[0]}), 200

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route("/change_password", methods=["post"])
def change_password():
    try:
        #Get data from request
        data = request.get_json()
        #Checking for data recieved
        print("Received Data: ", data)
        user_id = data.get("user_id")

        if not user_id:
            return jsonify({"success": False, "message": "User ID is required"}), 400

        current_pw = data.get("current_password")
        new_pw = data.get("new_password")

        # Validate input
        if not user_id or not current_pw or not new_pw:
            return jsonify({"success": False, "message": "Missing required fields"}), 400
        
        auth_user = supabase.auth.sign_in_with_password({
            "email": data.get("email"),
            "password": current_pw
        })

        if "error" in auth_user:
            return jsonify({"success": False, "message": "Invalid current password"}), 401

        # Update the user's password in Supabase Auth
        update_response = supabase.auth.update_user({"password": new_pw})

        if "error" in update_response:
            return jsonify({"success": False, "message": "Failed to update password in Supabase Auth"}), 500
        
        #Hash new passwordfor storage
        new_pw_hashed = hash_password(new_pw)

        #Updatenew password into database
        supabase.table("guest").update({"password_hash": new_pw_hashed}).eq("user_id", user_id).execute()

        return jsonify({"success": True, "message": "Password updated successfully"}), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({"success": False, "message": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
