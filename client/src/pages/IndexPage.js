import { useContext,useEffect,useState } from "react";
import Post from "../Post";


function IndexPage(){
   const [posts,setPosts] = useState([])
   useEffect(() => {
      fetch('http://localhost:4000/post')
        .then(response => response.json())
        .then(posts => {
          setPosts(posts);
          console.log(posts);
        })
        .catch(err => console.error("Fetch error:", err));
    }, []);
    
     return(
        <>
        {
         posts.length>0&&posts.map(post=>(
            <Post {...post}/>
         ))
        }
        </>
     )
}

export default IndexPage;