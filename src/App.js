import React, { Component } from 'react';
import './App.css';
import Nav from './components/Nav';
import List from './components/List';
import Note from './components/Note';
import axios from 'axios';
import urlFor from './helpers/urlFor';

class App extends Component {
  constructor() {
    super();
    this.state = {
      showNote: false,
      notes: [],
      note: {},
      newTag: false
    };
  }

  toggleNote = () => {
    this.setState({
      showNote: ! this.state.showNote,
      note: {}
    });
  }

  showTagform = () => {
    this.setState({
      newTag: true
    });
  }

  closeTagForm = () => {
    this.setState({
      newTag: false
    });
  }

  submitTag = (data, noteId) => {
    axios.post(urlFor(`notes/${noteId}/tags`), data)
    .then((res) => this.getNote(noteId) )
    .catch((err) => console.log(err.response.data) );
  }

  getNotes = () => {
    axios.get(urlFor('notes'))
    .then((res) => this.setState({ notes: res.data }) )
    .catch((err) => console.log(err.response.data) );
  }

  getNote = (id) => {
    axios.get(urlFor(`notes/${id}`))
    .then((res) => this.setState({ note: res.data, showNote: true }) )
    .catch((err) => console.log(err.response.data) );
  }

  performSubmissionRequest = (data, id) => {
    if (id) {
      // TODO: perform update request
      return axios.patch(urlFor(`notes/${id}`), data);
    } else {
      return axios.post(urlFor('notes'), data);
    }
  }

  submitNote = (data, id) => {
    this.performSubmissionRequest(data, id)
    .then((res) => this.setState({ showNote: false }) )
    .catch((err) => console.log(err.response.data) );
  }

  deleteNote = (id) => {
    const newNotesState = this.state.notes.filter((note) => note.id !== id);
    axios.delete(urlFor(`notes/${id}`) )
    .then((res) => this.setState({ notes: newNotesState }) )
    .catch((err) => console.log(err.response.data) );
  }

  render() {
    const { showNote, notes, note, newTag } = this.state;
    return (
      <div className="App">
        <Nav toggleNote={this.toggleNote} showNote={showNote} />
        { showNote ? 
          < Note 
            note={note}
            submitNote={this.submitNote}
            showTagForm={this.showTagform}
            newTag={newTag}
            closeTagForm={this.closeTagForm}
            submitTag={this.submitTag}
          /> 
          : 
          < List 
            getNotes={this.getNotes} 
            notes={notes} 
            getNote={this.getNote}
            deleteNote={this.deleteNote}
          />
        }
      </div>
    );
  }
}

export default App;
