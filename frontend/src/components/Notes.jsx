import React from "react";
import "../styles/Note.css"

function Note({note,onDelte}){
    const formattedDate = new Date(note.created_at).toLocaleDateString("en-US")


    return <div className="note-container">
        <p className="note-title">{note.title}</p>
        <p className="note-content">{note.content}</p>
        <p className="note-date">{formattedDate}</p>
        <button className="delete-button" onClick={()=>onDelte(note.id)}>
            Delete
        </button>
    </div>
}

export default Note