import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import Navbar from "../components/Navbar";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    api
      .get("/api/notes/")
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
        console.log(data);
      })
      .catch((error) => alert(error));
  };

  const deleteNote = (id) => {
    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) {
          console.log("Note deleted successfully");
          setNotes(notes.filter((note) => note.id !== id));
          getNotes();
        } else {
          console.log("Error deleting note");
        }
      })
      .catch((error) => alert(error));
  };

  const createNote = (e) => {
    e.preventDefault();
    api
      .post("/api/notes/", { content, title })
      .then((res) => {
        if (res.status === 201) {
          console.log("Note created successfully");
          setNotes([...notes, { content, title }]); // Zobaczyć czy to działa
          getNotes();
        } else {
          console.log("wyjebała się notatka");
        }
      })
      .catch((error) => alert(error));

    setContent("");
    setTitle("");
  };

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div>
        <h2>Library page (not yet)</h2>
      </div>
      <h2>Create a note</h2>
      <form onSubmit={createNote}>
        <label htmlFor="title">Title:</label>
        <br />
        <input
          type="text"
          id="title"
          name="title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <label htmlFor="content">Content:</label>
        <br />
        <textarea
          id="content"
          name="content"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <br />
        <input type="submit" value="Submit" />
      </form>
      <div>
        <h3>My notes 🫠</h3>
        <div>
          {notes.map((note) => (
            <Note key={note.id} note={note} onDelete={deleteNote} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
