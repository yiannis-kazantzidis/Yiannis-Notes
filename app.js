class App {
    constructor() {
      this.notes = JSON.parse(localStorage.getItem("notes")) || [];
      this.title = "";
      this.text = "";
      this.id = "";

      this.$placeholder = document.querySelector('#placeholder');
      this.$form = document.querySelector("#form");
      this.$note = document.querySelector("#notes");
      this.$noteTitle = document.getElementById("note-title");
      this.$noteText = document.getElementById("note-text");
      this.$modal = document.querySelector(".modal");
      this.$modalTitle = document.querySelector(".modal-title");
      this.$modalText = document.querySelector(".modal-text");
      this.$modalCloseButton = document.getElementById("modal_close");
      this.$modalDeleteNoteButton = document.getElementById("modal_delete");
      this.$modalSaveButton = document.getElementById("modal_save");
      this.$colorTooltip = document.querySelector("#color-tooltip")

      this.$formButtons = document.querySelector("#form-buttons");
      this.$formCloseButton = document.querySelector('#form-close-button');

      this.displayNotes()
      this.addEventListeners();
    }
  
    addEventListeners() {
      document.body.addEventListener("click", event => {
        this.handleFormClick(event);
        this.openModal(event);
      });

      document.body.addEventListener("mouseover", event => {
        this.openTooltip(event);
      });

      document.body.addEventListener("mouseout", event => {
        this.closeTooltip(event);
      });

      this.$colorTooltip.addEventListener("mouseover", function() {
        this.style.display = "flex";
      })

      this.$colorTooltip.addEventListener("mouseout", function() {
        this.style.display = "none";
      })

      this.$colorTooltip.addEventListener('click', event => {
        const color = event.target.dataset.color; 
        if (color) {
          this.editNoteColor(color);  
        }
     })
      
      this.$form.addEventListener('submit', event => {
        event.preventDefault();
        if (this.$noteTitle.value && this.$noteText.value) {
            this.addNote({
                title: this.$noteTitle.value,
                text: this.$noteText.value,
            });
        };
      });

      this.$formCloseButton.addEventListener("click", (event) => {
        event.stopPropagation(); 
        this.closeForm(); 
      });

      
      this.$modalCloseButton.addEventListener("click", (event) => {
        this.$modal.classList.toggle('open-modal');  
      })

      this.$modalSaveButton.addEventListener("click", (event) => {
        this.SaveModal(event)      
      })

      this.$modalDeleteNoteButton.addEventListener("click", (event) => {
        this.deleteNote(this.id)
      })
    }
  
    handleFormClick(event) {
      const isFormClicked = this.$form.contains(event.target);
  
      if (isFormClicked) {
        this.openForm();
      } else if (this.$noteTitle.value || this.$noteText.value) {
        this.addNote({
            title: this.$noteTitle.value,
            text: this.$noteText.value,
        });
      }  else {
        this.closeForm();

      }
    }
  
    openForm() {
      this.$form.classList.add("form-open");
      this.$noteTitle.style.display = "block";
      this.$formButtons.style.display = "block";
    }
  
    closeForm() {
      this.$form.classList.remove("form-open");
      this.$noteTitle.style.display = "none";
      this.$formButtons.style.display = "none";
      this.$noteTitle.value = "";
      this.$noteText.value = "";
    }

    openModal(event) {
        if (event.target.closest(".note")) {
            console.log("hello world")
            const $selectedNote = event.target.closest(".note");

            const [$noteTitle, $noteText] = $selectedNote.children;

            this.title = $noteTitle.innerText;
            this.text = $noteText.innerText;
            this.id = this.id = $selectedNote.dataset.id;

            this.$modal.classList.toggle('open-modal');  
            this.$modalTitle.value = this.title;
            this.$modalText.value = this.text;
        }
    }

    saveNotes() {
      localStorage.setItem("notes", JSON.stringify(this.notes))
    }

    displayNotes() {
        this.saveNotes()
        const hasNotes = this.notes.length > 0;
        this.$placeholder.style.display = hasNotes ? 'none' : 'flex';

        this.$note.innerHTML = this.notes.map(note => `
            <div style="background: ${note.color};" class="note" data-id="${note.id}">
            <div class="${note.title && 'note-title'}">${note.title}</div>
            <div class="note-text">${note.text}</div>
            <div class="toolbar-container">
                <div class="toolbar">
                <img class="toolbar-color" data-id=${note.id} src="https://icon.now.sh/palette">
                <img class="toolbar-delete" src="https://icon.now.sh/delete">
                </div>
            </div>
            </div>
        `).join("");
    }

    editNote() {
        const title = this.$modalTitle.value;
        const text = this.$modalText.value;
        this.notes = this.notes.map(note => 
          note.id === Number(this.id) ? { ...note, title, text } : note
        );
        this.displayNotes();
    }

    editNoteColor(color) {
      this.notes = this.notes.map(note =>
        note.id === Number(this.id) ? { ...note, color } : note
      );

      console.log(this.id)
      this.displayNotes();
    }

    closeModal(event) {
        this.$modal.classList.toggle('open-modal');  
    }

    openTooltip(event) {
      if (!event.target.matches(".toolbar-color")) return;
      this.id = event.target.dataset.id; 
      const noteCoords = event.target.getBoundingClientRect();
      const horizontal = noteCoords.left + window.scrollX;
      const vertical = noteCoords.top + window.scrollY;

      this.$colorTooltip.style.transform = `translate(${horizontal}px, ${vertical}px)`;
      this.$colorTooltip.style.display = "flex";
    }

    closeTooltip(event) {
      if (!event.target.matches(".toolbar-color")) return;
      this.$colorTooltip.style.display = "none";

    }

    SaveModal(event) {
        this.editNote();
        this.$modal.classList.toggle('open-modal');  
    }

    addNote(note) {
        const newNote = {
            title: note.title,
            text: note.text,
            color: "white",
            id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1
        }

        this.notes.push(newNote)

        this.displayNotes();
        this.closeForm();
    }

    deleteNote(event) {
        this.notes = this.notes.filter(note => 
            note.id !== Number(this.id)
        );

        console.log(this.notes);
        this.displayNotes();
        this.$modal.classList.toggle('open-modal');  
    }
  }
  
  new App();
  