import React, { useState } from "react";

const RoomPreferences = () => {
    const [preferences, setPreferences] = useState({
        bedType: "",
        roomView: "",
        floorPreference: "",
        additionalFeatures: {
            extraPillows: false,
            extraBeds: false,
            extraTowels: false,
            earlyCheckIn: false,
        },
    });

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        if (type === "checkbox") {
            setPreferences((prev) => ({
                ...prev,
                additionalFeatures: {
                    ...prev.additionalFeatures,
                    [name]: checked,
                },
            }));
        } else if (type === "radio") {
            setPreferences((prev) => ({
                ...prev,
                [name]: prev[name] === value ? "" : value,
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted Preferences:", preferences);
        alert("Preferences saved successfully!");
    };

    return (
        <div className="bg-white p-6 shadow-md rounded-md">
            <h2 className="text-xl font-bold mb-4">Set Your Room Preferences</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Bed Types */}
                <div>
                    <p className="text-sm font-semibold mb-2">Bed Type</p>
                    <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="bedType"
                                value="King"
                                checked={preferences.bedType === "King"}
                                onChange={handleChange}
                            />
                            <span>King</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="bedType"
                                value="Queen"
                                checked={preferences.bedType === "Queen"}
                                onChange={handleChange}
                            />
                            <span>Queen</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="bedType"
                                value="Single"
                                checked={preferences.bedType === "Single"}
                                onChange={handleChange}
                            />
                            <span>Single</span>
                        </label>
                    </div>
                </div>

                {/* Room View */}
                <div>
                    <p className="text-sm font-semibold mb-2">Room View</p>
                    <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="roomView"
                                value="City"
                                checked={preferences.roomView === "City"}
                                onChange={handleChange}
                            />
                            <span>City</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="roomView"
                                value="Garden"
                                checked={preferences.roomView === "Garden"}
                                onChange={handleChange}
                            />
                            <span>Garden</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="roomView"
                                value="Pool"
                                checked={preferences.roomView === "Pool"}
                                onChange={handleChange}
                            />
                            <span>Pool</span>
                        </label>
                    </div>
                </div>

                {/* Floor Preferences */}
                <div>
                    <p className="text-sm font-semibold mb-2">Floor Preference</p>
                    <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="floorPreference"
                                value="Low"
                                checked={preferences.floorPreference === "Low"}
                                onChange={handleChange}
                            />
                            <span>Low</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="floorPreference"
                                value="Middle"
                                checked={preferences.floorPreference === "Middle"}
                                onChange={handleChange}
                            />
                            <span>Middle</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="floorPreference"
                                value="High"
                                checked={preferences.floorPreference === "High"}
                                onChange={handleChange}
                            />
                            <span>High</span>
                        </label>
                    </div>
                </div>

                {/* Additional Features */}
                <div>
                    <p className="text-sm font-semibold mb-2">Additional Room Features</p>
                    <div className="space-y-2">
                        {Object.keys(preferences.additionalFeatures).map((feature) => (
                            <label key={feature} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name={feature}
                                    checked={preferences.additionalFeatures[feature]}
                                    onChange={handleChange}
                                />
                                <span>
                                    {feature
                                        .replace(/([A-Z])/g, " $1")
                                        .replace(/^./, (str) => str.toUpperCase())}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Save Preferences
                </button>
            </form>
        </div>
    );
};

export default RoomPreferences;
