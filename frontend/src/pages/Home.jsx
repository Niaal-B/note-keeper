import { useState,useEffect } from "react"
import api from "../api"
import Notes from "../components/Notes"
import "../styles/Home.css"

function Home() {
    const [notes,setNotes] = useState([])
    const [content,setContent] = useState("")
    const [title,setTitle] = useState("")

    useEffect(()=>{
        getNote()
    },[])

    const getNote = () => {
        api.get("/api/notes")
        .then((res) => {
          console.log("Response:", res); 
          return res.data;
        })
        .then((data) => {
          console.log("Data:", data);
          setNotes(data);
        })
        .catch((err) => {
          console.error("Error:", err.response ? err.response.data : err.message);
          alert("Error fetching notes!");
        });
          }

          const deleteNote = (id) => {
            api.delete(`/api/notes/delete/${id}/`).then((res)=>{
                if(res.status === 204 ) alert("Note Deleted")
                else alert("Failed to Delete Note")
                getNote()
            }).catch((error) => alert(error))
            
          }
          

          const createNote = (e) => {
            e.preventDefault()
            api.post("/api/notes/",{content,title}).then((res)=>{
                if (res.status === 201) alert("Note Created")
                    else alert("Failed to Make Note")
                getNote()
                setContent("")
                setTitle("")
            }).catch((err) => alert(err))
          
          }

    return <div>
        
        <div>
            <h2>Notes</h2>
            {notes.map((note)=> <Notes note={note} onDelte={deleteNote} key={note.id}/>)}


        </div>
        <h2>Create a Note</h2>
          <form onSubmit={createNote}>
            <label htmlFor="title">Title : </label>
            <br />
            <input type="text" id="title"  value={title} name="title" required onChange={(e)=>setTitle(e.target.value)} />
            <label htmlFor="title">Content : </label>
            <textarea id="content" name="content" required value={content} id="" onChange={(e)=>setContent(e.target.value)}></textarea>
            <br />
            <input type="submit" value="submit"/>
          </form>
    </div>
    }
    
export default Home
    