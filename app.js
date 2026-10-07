// ==========================================
// STORM STUDIO - APP.JS
// Version 0.1
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
// UNIQUE ID
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
      const sectionName = item.dataset.section;

      if (!sectionName) return;

      navigateTo(sectionName);
    });
  });
}


function navigateTo(sectionName) {
  const sections = $$(".page-section");
  const navItems = $$(".nav-item");

  sections.forEach((section) => {
    section.classList.remove("active");

    if (section.id === sectionName) {
      section.classList.add("active");
    }
  });

  navItems.forEach((item) => {
    item.classList.remove("active");

    if (item.dataset.section === sectionName) {
      item.classList.add("active");
    }
  });
}


// ==========================================
// QUICK CARDS
// ==========================================

function setupQuickCards() {
  const cards = $$(".quick-card");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const target = card.dataset.sectionTarget;

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
  const projectNameInput = $("#projectName");
  const projectNameDisplay = $("#projectNameDisplay");

  if (projectNameInput) {
    projectNameInput.addEventListener("input", () => {
      const name =
        projectNameInput.value.trim() || "Untitled Project";

      state.project.name = name;

      if (projectNameDisplay) {
        projectNameDisplay.textContent = name;
      }
    });
  }

  const saveButton = $("#saveProjectBtn");

  if (saveButton) {
    saveButton.addEventListener("click", saveProject);
  }

  const newButton = $("#newProjectBtn");

  if (newButton) {
    newButton.addEventListener("click", createNewProject);
  }

  const createSceneButton = $("#createSceneBtn");

  if (createSceneButton) {
    createSceneButton.addEventListener("click", () => {
      openSceneModal();
    });
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

    showNotification("Project saved successfully.");
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
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return;

    const parsed = JSON.parse(saved);

    if (parsed.project) {
      state.project = {
        ...state.project,
        ...parsed.project
      };
    }

    if (Array.isArray(parsed.characters)) {
      state.characters = parsed.characters;
    }

    if (Array.isArray(parsed.scenes)) {
      state.scenes = parsed.scenes;
    }

  } catch (error) {
    console.error("Project load error:", error);
  }
}


// ==========================================
// NEW PROJECT
// ==========================================

function createNewProject() {
  const confirmed = confirm(
    "Create a new project? Current unsaved data will be replaced."
  );

  if (!confirmed) return;

  state.project = {
    name: "Untitled Project",
    type: "trailer"
  };

  state.characters = [];
  state.scenes = [];

  localStorage.removeItem(STORAGE_KEY);

  updateProjectUI();

  renderCharacters();
  renderScenes();
  renderTimeline();

  navigateTo("dashboard");

  showNotification("New project created.");
}


// ==========================================
// PROJECT UI
// ==========================================

function updateProjectUI() {
  const projectNameInput = $("#projectName");
  const projectNameDisplay = $("#projectNameDisplay");

  if (projectNameInput) {
    projectNameInput.value = state.project.name;
  }

  if (projectNameDisplay) {
    projectNameDisplay.textContent = state.project.name;
  }

  const projectType = $("#projectType");

  if (projectType) {
    projectType.value = state.project.type;
  }

  updateProjectStatus("Ready");
}


function updateProjectStatus(status) {
  const statusElement = $("#projectStatus");

  if (statusElement) {
    statusElement.textContent = status;
  }
}


// ==========================================
// MODALS
// ==========================================

function setupModals() {
  $$("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      const modalId = button.dataset.closeModal;

      closeModal(modalId);
    });
  });

  $$(".modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal(modal.id);
      }
    });
  });
}


function openModal(modalId) {
  const modal = document.getElementById(modalId);

  if (!modal) return;

  modal.classList.add("active");
}


function closeModal(modalId) {
  const modal = document.getElementById(modalId);

  if (!modal) return;

  modal.classList.remove("active");
}


// ==========================================
// CHARACTER CONTROLS
// ==========================================

function setupCharacterControls() {
  const addButton = $("#addCharacterBtn");
  const emptyButton = $("#emptyAddCharacterBtn");
  const saveButton = $("#saveCharacterBtn");

  if (addButton) {
    addButton.addEventListener("click", openCharacterModal);
  }

  if (emptyButton) {
    emptyButton.addEventListener("click", openCharacterModal);
  }

  if (saveButton) {
    saveButton.addEventListener(
      "click",
      saveCharacter
    );
  }
}


function openCharacterModal() {
  const name = $("#characterName");
  const description = $("#characterDescription");
  const image = $("#characterImage");

  if (name) name.value = "";
  if (description) description.value = "";
  if (image) image.value = "";

  openModal("characterModal");
}


function saveCharacter() {
  const nameInput = $("#characterName");
  const descriptionInput = $("#characterDescription");
  const imageInput = $("#characterImage");

  const name = nameInput?.value.trim();
  const description =
    descriptionInput?.value.trim() || "";

  if (!name) {
    alert("Character name enter karein.");
    return;
  }

  if (
    imageInput &&
    imageInput.files &&
    imageInput.files.length > 0
  ) {
    const file = imageInput.files[0];

    const reader = new FileReader();

    reader.onload = function (event) {
      addCharacter(
        name,
        description,
        event.target.result
      );
    };

    reader.readAsDataURL(file);
  } else {
    addCharacter(
      name,
      description,
      ""
    );
  }
}


function addCharacter(name, description, image) {
  const character = {
    id: createId("CHAR"),
    name,
    description,
    image,
    createdAt: new Date().toISOString()
  };

  state.characters.push(character);

  saveProject();

  renderCharacters();

  closeModal("characterModal");

  showNotification(
    `${name} character added.`
  );
}


// ==========================================
// RENDER CHARACTERS
// ==========================================

function renderCharacters() {
  const grid = $("#characterGrid");
  const emptyState = $("#characterEmptyState");

  if (!grid) return;

  grid.innerHTML = "";

  if (state.characters.length === 0) {
    if (emptyState) {
      emptyState.style.display = "";
    }

    return;
  }

  if (emptyState) {
    emptyState.style.display = "none";
  }

  state.characters.forEach((character) => {
    const card = document.createElement("div");

    card.className = "character-card";

    const imageHTML = character.image
      ? `<img src="${character.image}" alt="${escapeHTML(
          character.name
        )}">`
      : `
        <div class="character-placeholder">
          ${escapeHTML(
            character.name.charAt(0).toUpperCase()
          )}
        </div>
      `;

    card.innerHTML = `
      <div class="character-image">
        ${imageHTML}
      </div>

      <div class="character-info">
        <h3>${escapeHTML(character.name)}</h3>

        <p>
          ${escapeHTML(
            character.description ||
              "No description added."
          )}
        </p>

        <div class="card-actions">
          <button
            class="danger-btn"
            data-delete-character="${character.id}"
          >
            Delete
          </button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  $$("[data-delete-character]").forEach(
    (button) => {
      button.addEventListener("click", () => {
        deleteCharacter(
          button.dataset.deleteCharacter
        );
      });
    }
  );
}


// ==========================================
// DELETE CHARACTER
// ==========================================

function deleteCharacter(id) {
  const character = state.characters.find(
    (item) => item.id === id
  );

  if (!character) return;

  const confirmed = confirm(
    `Delete ${character.name}?`
  );

  if (!confirmed) return;

  state.characters =
    state.characters.filter(
      (item) => item.id !== id
    );

  saveProject();

  renderCharacters();

  showNotification("Character deleted.");
}


// ==========================================
// SCENE CONTROLS
// ==========================================

function setupSceneControls() {
  const addButton = $("#addSceneBtn");
  const emptyButton = $("#emptyAddSceneBtn");
  const saveButton = $("#saveSceneBtn");

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


function openSceneModal() {
  const name = $("#sceneName");
  const duration = $("#sceneDuration");
  const prompt = $("#scenePrompt");
  const camera = $("#cameraStyle");
  const mood = $("#sceneMood");

  if (name) name.value = "";

  if (duration) {
    const defaultDuration =
      $("#defaultDuration")?.value || 10;

    duration.value = defaultDuration;
  }

  if (prompt) prompt.value = "";

  if (camera) {
    camera.selectedIndex = 0;
  }

  if (mood) {
    mood.selectedIndex = 0;
  }

  openModal("sceneModal");
}


// ==========================================
// SAVE SCENE
// ==========================================

function saveScene() {
  const name = $("#sceneName")?.value.trim();
  const duration =
    Number($("#sceneDuration")?.value) || 10;
  const prompt =
    $("#scenePrompt")?.value.trim() || "";

  const camera =
    $("#cameraStyle")?.value || "Cinematic";

  const mood =
    $("#sceneMood")?.value || "Epic";

  if (!name) {
    alert("Scene name enter karein.");
    return;
  }

  if (!prompt) {
    alert("Scene prompt enter karein.");
    return;
  }

  const scene = {
    id: createId("SCENE"),
    name,
    duration,
    prompt,
    camera,
    mood,
    createdAt: new Date().toISOString()
  };

  state.scenes.push(scene);

  saveProject();

  renderScenes();
  renderTimeline();

  closeModal("sceneModal");

  showNotification(
    `${name} scene added.`
  );
}


// ==========================================
// RENDER SCENES
// ==========================================

function renderScenes() {
  const grid = $("#sceneGrid");

  if (!grid) return;

  grid.innerHTML = "";

  if (state.scenes.length === 0) {
    grid.innerHTML = `
      <div class="empty-message">
        No scenes created yet.
      </div>
    `;

    return;
  }

  state.scenes.forEach((scene, index) => {
    const card =
      document.createElement("div");

    card.className = "scene-card";

    card.innerHTML = `
      <div class="scene-number">
        ${String(index + 1).padStart(2, "0")}
      </div>

      <div class="scene-content">
        <h3>${escapeHTML(scene.name)}</h3>

        <p>
          ${escapeHTML(scene.prompt)}
        </p>

        <div class="scene-meta">
          <span>${scene.duration}s</span>
          <span>${escapeHTML(scene.camera)}</span>
          <span>${escapeHTML(scene.mood)}</span>
        </div>

        <div class="card-actions">
          <button
            class="danger-btn"
            data-delete-scene="${scene.id}"
          >
            Delete
          </button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  $$("[data-delete-scene]").forEach(
    (button) => {
      button.addEventListener("click", () => {
        deleteScene(
          button.dataset.deleteScene
        );
      });
    }
  );
}


// ==========================================
// DELETE SCENE
// ==========================================

function deleteScene(id) {
  const scene = state.scenes.find(
    (item) => item.id === id
  );

  if (!scene) return;

  const confirmed = confirm(
    `Delete ${scene.name}?`
  );

  if (!confirmed) return;

  state.scenes =
    state.scenes.filter(
      (item) => item.id !== id
    );

  saveProject();

  renderScenes();
  renderTimeline();

  showNotification("Scene deleted.");
}


// ==========================================
// TIMELINE
// ==========================================

function renderTimeline() {
  const container = $("#timelineContainer");
  const totalDurationElement =
    $("#totalDuration");

  if (!container) return;

  container.innerHTML = "";

  let totalDuration = 0;

  state.scenes.forEach((scene, index) => {
    totalDuration += Number(scene.duration) || 0;

    const item =
      document.createElement("div");

    item.className = "timeline-item";

    item.innerHTML = `
      <div class="timeline-index">
        ${index + 1}
      </div>

      <div class="timeline-info">
        <strong>
          ${escapeHTML(scene.name)}
        </strong>

        <span>
          ${scene.duration}s
        </span>
      </div>

      <div class="timeline-prompt">
        ${escapeHTML(scene.prompt)}
      </div>
    `;

    container.appendChild(item);
  });

  if (
    totalDurationElement
  ) {
    totalDurationElement.textContent =
      `${totalDuration}s`;
  }
}


// ==========================================
// NOTIFICATION
// ==========================================

function showNotification(
  message,
  isError = false
) {
  const existing =
    document.querySelector(
      ".storm-notification"
    );

  if (existing) {
    existing.remove();
  }

  const notification =
    document.createElement("div");

  notification.className =
    "storm-notification";

  notification.textContent = message;

  if (isError) {
    notification.style.borderColor =
      "#ff4d6d";
  }

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
      border: "1px solid #334155",
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
// SECURITY / HTML ESCAPE
// ==========================================

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


// ==========================================
// AUTO SAVE BEFORE LEAVING
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
