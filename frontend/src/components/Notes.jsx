import React from "react";

function Notes({ note, onDelte }) {
  return (
    <div className="note-card">
      <h3 className="note-title">{note.title}</h3>
      <p className="note-content">{note.content}</p>
      <div className="note-actions">
        <button 
          className="note-btn note-btn-delete" 
          onClick={() => onDelte(note.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default Notes;