 import { useState } from "react";

 export default function StoryMaker() {
   const [name, setName] = useState("");
   const [age, setAge] = useState("");
   const [theme, setTheme] = useState("");
   const [story, setStory] = useState("");
   const [image, setImage] = useState("");
   const [loading, setLoading] = useState(false);

   const registerUser = async () => {
     try {
       const res = await fetch("http://localhost:4000/api/user", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ name, age }),
       });
       const data = await res.json();
       console.log("User registered:", data);
     } catch (err) {
       console.error("Error registering user:", err);
     }
   };

   const generateStory = async () => {
     setLoading(true);
     try {
       // Register user first
       await registerUser();

       // Generate story
       const res = await fetch("http://localhost:4000/api/story", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ theme }),
       });
       const data = await res.json();
       setStory(data.story);

       // Generate image
       const imgRes = await fetch("http://localhost:4000/api/image", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ prompt: `Illustration of: ${theme}` }),
       });
       const imgData = await imgRes.json();
       setImage(imgData.image);
     } catch (err) {
       console.error("Error:", err);
     }
     setLoading(false);
   };

   return (
     <div className="min-h-screen bg-amber-50 flex flex-col items-center p-8">
       <h1 className="text-4xl font-bold text-amber-800 mb-6">
         🌳 Children's Story Maker
       </h1>

       {/* User Info */}
       <input
         type="text"
         placeholder="Enter your name"
         value={name}
         onChange={(e) => setName(e.target.value)}
         className="px-4 py-2 rounded-xl border border-amber-300 w-full max-w-md mb-4"
       />
       <input
         type="number"
         placeholder="Enter your age"
         value={age}
         onChange={(e) => setAge(e.target.value)}
         className="px-4 py-2 rounded-xl border border-amber-300 w-full max-w-md mb-4"
       />

       {/* Story Theme */}
       <input
         type="text"
         placeholder="Enter story theme (e.g. jungle, friendship)"
         value={theme}
         onChange={(e) => setTheme(e.target.value)}
         className="px-4 py-2 rounded-xl border border-amber-300 w-full max-w-md mb-4"
       />

       <button
         onClick={generateStory}
         disabled={loading || !theme || !name || !age}
         className="bg-amber-600 text-white px-6 py-3 rounded-xl text-lg"
       >
         {loading ? "Generating..." : "Generate Story"}
       </button>

       {story && (
         <div className="mt-8 bg-white shadow-xl rounded-2xl p-6 max-w-xl text-center">
           <h2 className="text-2xl font-bold text-amber-700 mb-4">📖 Story</h2>
           <p className="text-lg text-gray-800 whitespace-pre-line">{story}</p>
           {image && (
             <img
               src={image}
               alt="Story illustration"
               className="mt-6 rounded-xl w-full"
             />
           )}
         </div>
       )}
     </div>
   );
 }
