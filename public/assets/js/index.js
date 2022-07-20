let titleNote;
let noteTxt;
let btnsvNote;
let btnnewNote;
let listNote;

if (window.location.pathname === '/notes') {
  titleNote = document.querySelector('.title-note');
  noteTxt = document.querySelector('.note-txt');
  btnsvNote = document.querySelector('.svnt');
  btnnewNote = document.querySelector('.note-new');
  listNote = document.querySelectorAll('.cont-list .grp-list');
}

// Show
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide
const hide = (elem) => {
  elem.style.display = 'none';
};

// tracks note in textarea
let noteAct = {};

const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const rendernoteAct = () => {
  hide(btnsvNote);

  if (noteAct.id) {
    titleNote.setAttribute('readonly', true);
    noteTxt.setAttribute('readonly', true);
    titleNote.value = noteAct.title;
    noteTxt.value = noteAct.text;
  } else {
    titleNote.removeAttribute('readonly');
    noteTxt.removeAttribute('readonly');
    titleNote.value = '';
    noteTxt.value = '';
  }
};

const handleNoteSave = () => {
  const newNote = {
    title: titleNote.value,
    text: noteTxt.value,
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    rendernoteAct();
  });
};

// DELETES a clicked note
const handleNoteDelete = (e) => {

  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (noteAct.id === noteId) {
    noteAct = {};
  }

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    rendernoteAct();
  });
};

// noteAct set
const handleNoteView = (e) => {
  e.preventDefault();
  noteAct = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  rendernoteAct();
};

// allows user to enter new note
const handleNewNoteView = (e) => {
  noteAct = {};
  rendernoteAct();
};

const handleRenderSaveBtn = () => {
  if (!titleNote.value.trim() || !noteTxt.value.trim()) {
    hide(btnsvNote);
  } else {
    show(btnsvNote);
  }
};

// renders note titles
const renderlistNote = async (notes) => {
  let noteJson = await notes.json();
  if (window.location.pathname === '/notes') {
    listNote.forEach((el) => (el.innerHTML = ''));
  }

  let noteitemList = [];

  // return HTML element
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (noteJson.length === 0) {
    noteitemList.push(createLi('No saved Notes', false));
  }

  noteJson.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteitemList.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteitemList.forEach((note) => listNote[0].append(note));
  }
};

// gets notes from the db.json
const getAndRenderNotes = () => getNotes().then(renderlistNote);

if (window.location.pathname === '/notes') {
  btnsvNote.addEventListener('click', handleNoteSave);
  btnnewNote.addEventListener('click', handleNewNoteView);
  titleNote.addEventListener('keyup', handleRenderSaveBtn);
  noteTxt.addEventListener('keyup', handleRenderSaveBtn);
}

getAndRenderNotes();