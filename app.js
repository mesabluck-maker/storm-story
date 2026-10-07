// ==========================================
// STORM STUDIO - APP.JS
// Version 0.2
// Character Studio Upgrade
// ==========================================

const STORAGE_KEY = "stormStudioProject";

const state = {
  project: {
    name: "Untitled Project",
    type: "trailer"
  },

  characters: [],
  scenes: []
};


// ==========================================
// DOM HELPERS
// ==========================================

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => document.querySelectorAll(selector);


// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

  loadProject();

  setupNavigation();
  setupProjectControls();
  setupModals();
  setupCharacterControls();
  setupSceneControls();
  setupQuickCards();

  renderCharacters();
  renderScenes();
  renderTimeline();

  updateProjectUI();

});


// ==========================================
// ID GENERATOR
// ==========================================

function createId(prefix) {

  return `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 8)}`;

}


// ==========================================
// NAVIGATION
// ==========================================

function setupNavigation() {

  const navItems = $$(".nav-item");

  navItems.forEach((item) => {

    item.addEventListener("click", () => {

      const section = item.dataset.section;

      if (section) {
        navigateTo(section);
      }

    });

  });

}


function navigateTo(sectionName) {

  $$(".page-section").forEach((section) => {

    section.classList.toggle(
      "active",
      section.id === sectionName
    );

  });


  $$(".nav-item").forEach((item) => {

    item.classList.toggle(
      "active",
      item.dataset.section === sectionName
    );

  });

}


// ==========================================
// QUICK CARDS
// ==========================================

function setupQuickCards() {

  $$(".quick-card").forEach((card) => {

    card.addEventListener("click", () => {

      const target =
        card.dataset.sectionTarget;

      if (target) {
        navigateTo(target);
      }

    });

  });

}


// ==========================================
// PROJECT CONTROLS
// ==========================================

function setupProjectControls() {

  const projectName =
    $("#projectName");

  if (projectName) {

    projectName.addEventListener(
      "input",
      () => {

        state.project.name =
          projectName.value.trim() ||
          "Untitled Project";

        updateProjectUI();

      }
    );

  }


  const projectType =
    $("#projectType");

  if (projectType) {

    projectType.addEventListener(
      "change",
      () => {

        state.project.type =
          projectType.value;

      }
    );

  }


  const saveButton =
    $("#saveProjectBtn");

  if (saveButton) {

    saveButton.addEventListener(
      "click",
      saveProject
    );

  }


  const newButton =
    $("#newProjectBtn");

  if (newButton) {

    newButton.addEventListener(
      "click",
      createNewProject
    );

  }


  const createSceneButton =
    $("#createSceneBtn");

  if (createSceneButton) {

    createSceneButton.addEventListener(
      "click",
      openSceneModal
    );

  }

}


// ==========================================
// SAVE PROJECT
// ==========================================

function saveProject() {

  try {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(state)
    );

    updateProjectStatus("Saved");

    showNotification(
      "Project saved successfully."
    );

  } catch (error) {

    console.error(error);

    showNotification(
      "Project save nahi ho saka.",
      true
    );

  }

}


// ==========================================
// LOAD PROJECT
// ==========================================

function loadProject() {

  try {

    const saved =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!saved) return;

    const parsed =
      JSON.parse(saved);


    if (parsed.project) {

      state.project = {
        ...state.project,
        ...parsed.project
      };

    }


    if (
      Array.isArray(
        parsed.characters
      )
    ) {

      state.characters =
        parsed.characters;

    }


    if (
      Array.isArray(
        parsed.scenes
      )
    ) {

      state.scenes =
        parsed.scenes;

    }

  } catch (error) {

    console.error(
      "Project load error:",
      error
    );

  }

}


// ==========================================
// NEW PROJECT
// ==========================================

function createNewProject() {

  const confirmed =
    confirm(
      "Create a new project? Current saved data will be replaced."
    );

  if (!confirmed) return;


  state.project = {
    name: "Untitled Project",
    type: "trailer"
  };

  state.characters = [];
  state.scenes = [];


  localStorage.removeItem(
    STORAGE_KEY
  );


  renderCharacters();
  renderScenes();
  renderTimeline();

  updateProjectUI();

  navigateTo("dashboard");

  showNotification(
    "New project created."
  );

}


// ==========================================
// PROJECT UI
// ==========================================

function updateProjectUI() {

  const nameInput =
    $("#projectName");

  const nameDisplay =
    $("#projectNameDisplay");


  if (nameInput) {

    nameInput.value =
      state.project.name;

  }


  if (nameDisplay) {

    nameDisplay.textContent =
      state.project.name;

  }


  const projectType =
    $("#projectType");

  if (projectType) {

    projectType.value =
      state.project.type;

  }


  updateProjectStatus("Ready");

}


function updateProjectStatus(status) {

  const element =
    $("#projectStatus");

  if (element) {

    element.textContent =
      status;

  }

}


// ==========================================
// MODALS
// ==========================================

function setupModals() {

  $$("[data-close-modal]")
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          closeModal(
            button.dataset.closeModal
          );

        }
      );

    });


  $$(".modal-overlay")
    .forEach((overlay) => {

      overlay.addEventListener(
        "click",
        (event) => {

          if (
            event.target === overlay
          ) {

            closeModal(
              overlay.id
            );

          }

        }
      );

    });

}


function openModal(id) {

  const modal =
    document.getElementById(id);

  if (!modal) return;

  modal.classList.add("active");

}


function closeModal(id) {

  const modal =
    document.getElementById(id);

  if (!modal) return;

  modal.classList.remove("active");

}


// ==========================================
// CHARACTER CONTROLS
// ==========================================

function setupCharacterControls() {

  const addButton =
    $("#addCharacterBtn");

  const emptyButton =
    $("#emptyAddCharacterBtn");

  const saveButton =
    $("#saveCharacterBtn");


  if (addButton) {

    addButton.addEventListener(
      "click",
      openCharacterModal
    );

  }


  if (emptyButton) {

    emptyButton.addEventListener(
      "click",
      openCharacterModal
    );

  }


  if (saveButton) {

    saveButton.addEventListener(
      "click",
      saveCharacter
    );

  }

}


// ==========================================
// OPEN CHARACTER MODAL
// ==========================================

function openCharacterModal() {

  const fields = [

    "characterName",
    "characterAppearance",
    "characterClothing",
    "characterBody",
    "characterPersonality",
    "characterDescription"

  ];


  fields.forEach((id) => {

    const field =
      document.getElementById(id);

    if (field) {
      field.value = "";
    }

  });


  const image =
    $("#characterImage");

  if (image) {
    image.value = "";
  }


  const lock =
    $("#characterLock");

  if (lock) {
    lock.checked = true;
  }


  openModal(
    "characterModal"
  );

}


// ==========================================
// SAVE CHARACTER
// ==========================================

function saveCharacter() {

  const name =
    $("#characterName")?.value.trim();


  if (!name) {

    alert(
      "Character name enter karein."
    );

    return;

  }


  const appearance =
    $("#characterAppearance")
      ?.value.trim() || "";


  const clothing =
    $("#characterClothing")
      ?.value.trim() || "";


  const body =
    $("#characterBody")
      ?.value.trim() || "";


  const personality =
    $("#characterPersonality")
      ?.value.trim() || "";


  const description =
    $("#characterDescription")
      ?.value.trim() || "";


  const characterLock =
    $("#characterLock")
      ?.checked ?? true;


  const imageInput =
    $("#characterImage");


  if (
    imageInput &&
    imageInput.files &&
    imageInput.files.length > 0
  ) {

    const file =
      imageInput.files[0];

    const reader =
      new FileReader();


    reader.onload = (event) => {

      createCharacter(
        name,
        appearance,
        clothing,
        body,
        personality,
        description,
        characterLock,
        event.target.result
      );

    };


    reader.readAsDataURL(file);

  } else {

    createCharacter(
      name,
      appearance,
      clothing,
      body,
      personality,
      description,
      characterLock,
      ""
    );

  }

}


// ==========================================
// CREATE CHARACTER
// ==========================================

function createCharacter(
  name,
  appearance,
  clothing,
  body,
  personality,
  description,
  characterLock,
  image
) {

  const character = {

    id: createId("CHAR"),

    name,

    appearance,

    clothing,

    body,

    personality,

    description,

    image,

    locked: characterLock,

    createdAt:
      new Date().toISOString()

  };


  state.characters.push(
    character
  );


  saveProject();

  renderCharacters();

  closeModal(
    "characterModal"
  );


  showNotification(
    `${name} character added.`
  );

}


// ==========================================
// RENDER CHARACTERS
// ==========================================

function renderCharacters() {

  const grid =
    $("#characterGrid");

  const emptyState =
    $("#characterEmptyState");


  if (!grid) return;


  grid.innerHTML = "";


  if (
    state.characters.length === 0
  ) {

    if (emptyState) {

      emptyState.style.display =
        "";

    }

    return;

  }


  if (emptyState) {

    emptyState.style.display =
      "none";

  }


  state.characters.forEach(
    (character) => {

      const card =
        document.createElement(
          "div"
        );


      card.className =
        "character-card";


      const imageHTML =
        character.image

          ? `
            <img
              src="${character.image}"
              alt="${escapeHTML(
                character.name
              )}"
            >
          `

          : `
            <div class="character-placeholder">
              ${escapeHTML(
                character.name
                  .charAt(0)
                  .toUpperCase()
              )}
            </div>
          `;


      const lockBadge =
        character.locked

          ? `
            <span class="character-lock-badge">
              🔒 Locked
            </span>
          `

          : `
            <span class="character-lock-badge unlocked">
              🔓 Unlocked
            </span>
          `;


      card.innerHTML = `

        <div class="character-image">

          ${imageHTML}

        </div>


        <div class="character-info">

          <div class="character-title-row">

            <h3>
              ${escapeHTML(
                character.name
              )}
            </h3>

            ${lockBadge}

          </div>


          <p>
            ${escapeHTML(
              character.description ||
              character.appearance ||
              "No description added."
            )}
          </p>


          <div class="character-meta">

            <span>
              ID:
              ${escapeHTML(
                character.id
              )}
            </span>

          </div>


          <div class="card-actions">

            <button
              class="danger-btn"
              data-delete-character="${character.id}"
              type="button"
            >
              Delete
            </button>

          </div>

        </div>

      `;


      grid.appendChild(card);

    }
  );


  $$("[data-delete-character]")
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          deleteCharacter(
            button.dataset
              .deleteCharacter
          );

        }
      );

    });

}


// ==========================================
// DELETE CHARACTER
// ==========================================

function deleteCharacter(id) {

  const character =
    state.characters.find(
      (item) =>
        item.id === id
    );


  if (!character) return;


  const confirmed =
    confirm(
      `Delete ${character.name}?`
    );


  if (!confirmed) return;


  state.characters =
    state.characters.filter(
      (item) =>
        item.id !== id
    );


  saveProject();

  renderCharacters();


  showNotification(
    "Character deleted."
  );

}


// ==========================================
// SCENE CONTROLS
// ==========================================

function setupSceneControls() {

  const addButton =
    $("#addSceneBtn");

  const emptyButton =
    $("#emptyAddSceneBtn");

  const saveButton =
    $("#saveSceneBtn");


  if (addButton) {

    addButton.addEventListener(
      "click",
      openSceneModal
    );

  }


  if (emptyButton) {

    emptyButton.addEventListener(
      "click",
      openSceneModal
    );

  }


  if (saveButton) {

    saveButton.addEventListener(
      "click",
      saveScene
    );

  }

}


// ==========================================
// OPEN SCENE MODAL
// ==========================================

function openSceneModal() {

  const name =
    $("#sceneName");

  const duration =
    $("#sceneDuration");

  const prompt =
    $("#scenePrompt");


  if (name) {
    name.value = "";
  }


  if (duration) {

    const defaultDuration =
      $("#defaultDuration")
        ?.value || "10";

    duration.value =
      defaultDuration;

  }


  if (prompt) {
    prompt.value = "";
  }


  openModal(
    "sceneModal"
  );

}


// ==========================================
// SAVE SCENE
// ==========================================

function saveScene() {

  const name =
    $("#sceneName")
      ?.value.trim();


  const duration =
    Number(
      $("#sceneDuration")
        ?.value
    ) || 10;


  const prompt =
    $("#scenePrompt")
      ?.value.trim() || "";


  const camera =
    $("#cameraStyle")
      ?.value || "Cinematic";


  const mood =
    $("#sceneMood")
      ?.value || "Epic";


  if (!name) {

    alert(
      "Scene name enter karein."
    );

    return;

  }


  if (!prompt) {

    alert(
      "Scene prompt enter karein."
    );

    return;

  }


  const scene = {

    id: createId("SCENE"),

    name,

    duration,

    prompt,

    camera,

    mood,

    createdAt:
      new Date().toISOString()

  };


  state.scenes.push(
    scene
  );


  saveProject();

  renderScenes();

  renderTimeline();

  closeModal(
    "sceneModal"
  );


  showNotification(
    `${name} scene added.`
  );

}


// ==========================================
// RENDER SCENES
// ==========================================

function renderScenes() {

  const grid =
    $("#sceneGrid");


  if (!grid) return;


  grid.innerHTML = "";


  if (
    state.scenes.length === 0
  ) {

    grid.innerHTML = `

      <div class="empty-state">

        <div class="empty-icon">
          🎥
        </div>

        <h3>
          No scenes created
        </h3>

        <p>
          Create your first cinematic scene.
        </p>

        <button
          class="btn btn-primary"
          id="emptyAddSceneBtn"
          type="button"
        >
          Create Scene
        </button>

      </div>

    `;


    const button =
      $("#emptyAddSceneBtn");

    if (button) {

      button.addEventListener(
        "click",
        openSceneModal
      );

    }


    return;

  }


  state.scenes.forEach(
    (scene, index) => {

      const card =
        document.createElement(
          "div"
        );


      card.className =
        "scene-card";


      card.innerHTML = `

        <div class="scene-number">
          ${String(index + 1).padStart(
            2,
            "0"
          )}
        </div>


        <div class="scene-content">

          <h3>
            ${escapeHTML(
              scene.name
            )}
          </h3>


          <p>
            ${escapeHTML(
              scene.prompt
            )}
          </p>


          <div class="scene-meta">

            <span>
              ${scene.duration}s
            </span>

            <span>
              ${escapeHTML(
                scene.camera
              )}
            </span>

            <span>
              ${escapeHTML(
                scene.mood
              )}
            </span>

          </div>


          <div class="card-actions">

            <button
              class="danger-btn"
              data-delete-scene="${scene.id}"
              type="button"
            >
              Delete
            </button>

          </div>

        </div>

      `;


      grid.appendChild(card);

    }
  );


  $$("[data-delete-scene]")
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          deleteScene(
            button.dataset
              .deleteScene
          );

        }
      );

    });

}


// ==========================================
// DELETE SCENE
// ==========================================

function deleteScene(id) {

  const scene =
    state.scenes.find(
      (item) =>
        item.id === id
    );


  if (!scene) return;


  const confirmed =
    confirm(
      `Delete ${scene.name}?`
    );


  if (!confirmed) return;


  state.scenes =
    state.scenes.filter(
      (item) =>
        item.id !== id
    );


  saveProject();

  renderScenes();

  renderTimeline();


  showNotification(
    "Scene deleted."
  );

}


// ==========================================
// TIMELINE
// ==========================================

function renderTimeline() {

  const container =
    $("#timelineContainer");

  const totalElement =
    $("#totalDuration");


  if (!container) return;


  container.innerHTML = "";


  if (
    state.scenes.length === 0
  ) {

    container.innerHTML = `

      <div class="timeline-empty">

        <span>
          🎞️
        </span>

        <h3>
          Timeline is empty
        </h3>

        <p>
          Your generated scenes will appear here.
        </p>

      </div>

    `;

    if (totalElement) {
      totalElement.textContent =
        "00:00";
    }

    return;

  }


  let totalSeconds = 0;


  state.scenes.forEach(
    (scene, index) => {

      totalSeconds +=
        Number(scene.duration) || 0;


      const item =
        document.createElement(
          "div"
        );


      item.className =
        "timeline-item";


      item.innerHTML = `

        <div class="timeline-index">
          ${index + 1}
        </div>


        <div class="timeline-info">

          <strong>
            ${escapeHTML(
              scene.name
            )}
          </strong>

          <span>
            ${scene.duration}s
          </span>

        </div>


        <div class="timeline-prompt">

          ${escapeHTML(
            scene.prompt
          )}

        </div>

      `;


      container.appendChild(item);

    }
  );


  if (totalElement) {

    const minutes =
      Math.floor(
        totalSeconds / 60
      );

    const seconds =
      totalSeconds % 60;


    totalElement.textContent =
      `${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(
        2,
        "0"
      )}`;

  }

}


// ==========================================
// NOTIFICATION
// ==========================================

function showNotification(
  message,
  isError = false
) {

  const old =
    document.querySelector(
      ".storm-notification"
    );


  if (old) {
    old.remove();
  }


  const notification =
    document.createElement(
      "div"
    );


  notification.className =
    "storm-notification";


  notification.textContent =
    message;


  Object.assign(
    notification.style,
    {

      position: "fixed",

      right: "24px",

      bottom: "24px",

      zIndex: "9999",

      padding: "14px 20px",

      borderRadius: "10px",

      background: "#111827",

      color: "#ffffff",

      border:
        isError
          ? "1px solid #ff4d6d"
          : "1px solid #334155",

      boxShadow:
        "0 10px 30px rgba(0,0,0,.35)",

      fontSize: "14px"

    }
  );


  document.body.appendChild(
    notification
  );


  setTimeout(() => {

    notification.remove();

  }, 2500);

}


// ==========================================
// HTML ESCAPE
// ==========================================

function escapeHTML(value) {

  return String(value)

    .replaceAll(
      "&",
      "&amp;"
    )

    .replaceAll(
      "<",
      "&lt;"
    )

    .replaceAll(
      ">",
      "&gt;"
    )

    .replaceAll(
      '"',
      "&quot;"
    )

    .replaceAll(
      "'",
      "&#039;"
    );

}


// ==========================================
// AUTO SAVE
// ==========================================

window.addEventListener(
  "beforeunload",
  () => {

    try {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
      );

    } catch (error) {

      console.error(error);

    }

  }
);
