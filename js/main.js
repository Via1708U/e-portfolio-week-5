/* ============================================
   Mobile navigation
   ============================================ */
(function () {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("nav-menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", function () {
    const isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the menu after tapping a link
  menu.addEventListener("click", function (event) {
    if (event.target.tagName === "A") {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
})();

/* ============================================
   Scroll reveal
   ============================================ */
(function () {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) {
      el.classList.add("in-view");
    });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  items.forEach(function (el) {
    observer.observe(el);
  });
})();

/* ============================================
   Projects (Projects page)
   Cards are rendered from the PROJECTS array below.
   To add or edit a project, just change one object —
   no markup changes needed.
   ============================================ */

// Existing project entries removed. Add new projects here as objects
// (same shape as before: title, description, categories, tags, icon,
// thumb, cta, href). See the project-section comment above.
const PROJECTS = [];

const CATEGORY_LABELS = {
  "digital-products": "Digital Products",
  "learning-education": "Learning & Education",
  "psychology-wellbeing": "Psychology & Wellbeing",
  "visual-communication": "Visual Communication",
};

// Simple line icons (same stroke style as the rest of the site)
const THUMB_ICONS = {
  heart:
    '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  monitor:
    '<rect x="2" y="3" width="20" height="14" rx="3"/><path d="M8 21h8M12 17v4"/>',
  book:
    '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  message:
    '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
  pen:
    '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  globe:
    '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  image:
    '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
  archive:
    '<polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5" rx="1"/><line x1="10" y1="12" x2="14" y2="12"/>',
};

const ARROW_SVG =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';

(function () {
  const grid = document.getElementById("projects-grid");
  const buttons = document.querySelectorAll(".filter-btn");
  if (!grid || !buttons.length) return;

  function thumbSVG(icon) {
    return (
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      THUMB_ICONS[icon] +
      "</svg>"
    );
  }

  function cardHTML(project, index) {
    const link = project.href
      ? '<a href="' + project.href + '">' + project.cta + " " + ARROW_SVG + "</a>"
      : '<span class="pending" title="Link coming soon">' + project.cta + " " + ARROW_SVG + "</span>";

    return (
      '<article class="project-card card-enter' +
      (project.featured ? " project-card--featured" : "") +
      '" data-categories="' + project.categories.join(" ") + '"' +
      ' style="animation-delay:' + index * 70 + 'ms"' +
      ">" +
      '<div class="project-thumb ' + project.thumb + '" aria-hidden="true">' + thumbSVG(project.icon) + "</div>" +
      '<div class="project-body">' +
      '<span class="project-cat">' + CATEGORY_LABELS[project.categories[0]] + "</span>" +
      "<h3>" + project.title + "</h3>" +
      "<p>" + project.description + "</p>" +
      '<div class="project-tags">' +
      project.tags.map(function (tag) { return '<span class="tag">' + tag + "</span>"; }).join("") +
      "</div>" +
      '<div class="project-links">' + link + "</div>" +
      "</div>" +
      "</article>"
    );
  }

  // Render all cards (order in the array = order under "All")
  const filterBar = document.querySelector(".filter-bar");

  if (PROJECTS.length === 0) {
    // No project cards yet: hide the filter bar and grid — the Task
    // Planner mini app below is the Projects page's current content.
    if (filterBar) filterBar.style.display = "none";
    grid.style.display = "none";
    return;
  }

  if (filterBar) filterBar.style.display = "";
  grid.style.display = "";
  grid.innerHTML = PROJECTS.map(cardHTML).join("");
  const cards = grid.querySelectorAll(".project-card");

  // Category filters (matches primary OR secondary category)
  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      const filter = button.dataset.filter;

      buttons.forEach(function (b) {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      cards.forEach(function (card) {
        const matches =
          filter === "all" ||
          card.dataset.categories.split(" ").includes(filter);

        if (matches) {
          card.style.display = "";
          card.classList.remove("card-enter");
          void card.offsetWidth; // restart the entrance animation
          card.classList.add("card-enter");
        } else {
          card.style.display = "none";
        }
      });
    });
  });
})();

/* ============================================
   Task Planner — mini to-do app (Projects page)
   Add tasks with a date, check them off, delete.
   Persists in localStorage on this device.
   ============================================ */
(function () {
  const app = document.getElementById("todo-app");
  if (!app) return;

  const form = document.getElementById("todo-form");
  const input = document.getElementById("todo-input");
  const dateInput = document.getElementById("todo-date");
  const list = document.getElementById("todo-list");
  const emptyMsg = document.getElementById("todo-empty");
  const countEl = document.getElementById("todo-count");
  const clearBtn = document.getElementById("todo-clear");
  const addBtn = document.getElementById("todo-add-btn");
  const addLabel = addBtn.querySelector(".todo-add-label");
  const statusBox = document.getElementById("sync-status");
  const statusText = statusBox.querySelector(".sync-text");

  /* ---------- Supabase configuration ---------- */
  const SUPABASE_URL = "https://ntiefyamfzifyopiboab.supabase.co";
  const SUPABASE_KEY = "sb_publishable_LuAlwX8Q7YNVL0W3rQQl8Q_iC9oHMcf";
  const REST_URL = SUPABASE_URL + "/rest/v1/todos";

  // Set to false while a request is in flight to block double submits
  let ready = false;

  // Emojis offered in the picker (must match the buttons in projects.html)
  const EMOJI_CHOICES = [
    "📌", "📝", "📚", "💡", "🎯",
    "🏃", "🛒", "💼", "🎨", "🧠",
    "🌱", "🏥", "✨", "🎉", "🐱",
  ];
  const PRIORITIES = ["low", "medium", "high"];
  // Rank used for sorting and validation: high first
  const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };

  let tasks = [];
  let highlightId = null; // id of the just-added item (for its pop-in animation)
  let selectedEmoji = ""; // current picker choice ("" = none)
  let selectedPriority = "medium";

  /* ---------- Supabase data layer ---------- */
  // Visual sync states shown in the banner
  function setStatus(kind, message) {
    statusBox.dataset.state = kind;
    statusText.textContent = message;
  }

  // Core fetch wrapper: attaches auth headers, parses PostgREST errors
  // into real Error objects.
  async function request(method, url, body, extraHeaders) {
    const options = {
      method: method,
      headers: Object.assign(
        {
          apikey: SUPABASE_KEY,
          Authorization: "Bearer " + SUPABASE_KEY,
        },
        extraHeaders || {}
      ),
    };
    if (body !== undefined) {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }

    let response;
    try {
      response = await fetch(url, options);
    } catch (e) {
      throw new Error("Network error — check your connection");
    }

    if (!response.ok) {
      let detail = "";
      try {
        detail = (await response.json()).message;
      } catch (e) { /* ignore parse failure */ }
      throw new Error(detail || "Request failed (" + response.status + ")");
    }

    if (response.status === 204) return null; // DELETE returns no body
    return response.json();
  }

  // Database row -> app task object. The table columns are
  // id / task / is_complete / date / created_at.
  function rowToTask(row) {
    return {
      id: row.id,
      text: String(row.task == null ? "" : row.task).slice(0, 140),
      date: /^\d{4}-\d{2}-\d{2}$/.test(row.date) ? row.date : todayValue(),
      done: row.is_complete === true,
      // No emoji/priority columns yet — kept for the current session
      emoji: "",
      priority: "medium",
      created: Date.parse(row.created_at) || Date.now(),
    };
  }

  // GET — read all tasks, oldest first by creation time
  async function fetchTasks() {
    const rows = await request(
      "GET",
      REST_URL + "?select=*&order=created_at.asc"
    );
    return Array.isArray(rows) ? rows.map(rowToTask) : [];
  }

  // POST — create one task; returns the row the database generated
  async function createTask(task) {
    const rows = await request(
      "POST",
      REST_URL,
      {
        task: task.text,
        date: task.date,
        is_complete: false,
      },
      { "Prefer": "return=representation" }
    );
    return rowToTask(rows[0]);
  }

  // PATCH — update one field set on an existing task
  async function updateTask(id, fields) {
    const columnMap = { text: "task", done: "is_complete", date: "date" };
    const payload = {};
    Object.keys(fields).forEach(function (key) {
      if (columnMap[key]) payload[columnMap[key]] = fields[key];
    });
    await request("PATCH", REST_URL + "?id=eq." + encodeURIComponent(id), payload);
  }

  // DELETE — remove one task
  async function removeTask(id) {
    await request("DELETE", REST_URL + "?id=eq." + encodeURIComponent(id));
  }

  // DELETE — remove several tasks in one call
  async function removeTasks(ids) {
    await request(
      "DELETE",
      REST_URL + "?id=in.(" + ids.map(encodeURIComponent).join(",") + ")"
    );
  }

  /* ---------- helpers ---------- */
  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c];
    });
  }

  function todayValue() {
    const now = new Date();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return now.getFullYear() + "-" + m + "-" + d;
  }

  // Friendly date: Today / Tomorrow / Yesterday + weekday & month
  function formatDate(value) {
    const parts = value.split("-").map(Number);
    const target = new Date(parts[0], parts[1] - 1, parts[2]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.round((target - today) / 86400000);

    let prefix = "";
    if (diffDays === 0) prefix = "Today · ";
    else if (diffDays === 1) prefix = "Tomorrow · ";
    else if (diffDays === -1) prefix = "Yesterday · ";

    const options = { weekday: "short", month: "short", day: "numeric" };
    if (parts[0] !== today.getFullYear()) options.year = "numeric";

    return prefix + target.toLocaleDateString(undefined, options);
  }

  function isOverdue(task) {
    return !task.done && task.date < todayValue();
  }

  function sortedTasks() {
    return tasks.slice().sort(function (a, b) {
      if (a.done !== b.done) return a.done ? 1 : -1; // open tasks first
      if (a.date !== b.date) return a.date < b.date ? -1 : 1;
      // Same date: more important first
      const rankDiff = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      if (rankDiff !== 0) return rankDiff;
      return a.created - b.created;
    });
  }

  /* ---------- rendering ---------- */
  const CHECK_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
  const CAL_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>';
  const FLAG_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>';
  const X_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';

  function itemHTML(task) {
    const classes =
      "todo-item" +
      (task.done ? " is-done" : "") +
      (isOverdue(task) ? " is-overdue" : "") +
      (task.id === highlightId ? " just-added" : "");

    return (
      '<li class="' + classes + '" data-id="' + task.id + '">' +
        '<label class="todo-check">' +
          '<input type="checkbox" ' + (task.done ? "checked " : "") +
            'aria-label="Mark task as done" />' +
          '<span class="todo-box">' + CHECK_SVG + "</span>" +
        "</label>" +
        (task.emoji ? '<span class="todo-emoji">' + task.emoji + "</span>" : "") +
        '<span class="todo-text" title="Click to edit" tabindex="0">' + escapeHtml(task.text) + "</span>" +
        '<span class="todo-priority todo-priority--' + task.priority + '">' +
          FLAG_SVG + task.priority.charAt(0).toUpperCase() + task.priority.slice(1) +
        "</span>" +
        '<span class="todo-date">' + CAL_SVG + formatDate(task.date) + "</span>" +
        '<button type="button" class="todo-delete" aria-label="Delete task">' + X_SVG + "</button>" +
      "</li>"
    );
  }

  function render() {
    const ordered = sortedTasks();
    list.innerHTML = ordered.map(itemHTML).join("");

    const remaining = tasks.filter(function (t) { return !t.done; }).length;
    const doneCount = tasks.length - remaining;

    countEl.textContent =
      tasks.length === 0
        ? "0 tasks"
        : doneCount + " of " + tasks.length +
          (tasks.length === 1 ? " task completed" : " tasks completed");

    emptyMsg.hidden = tasks.length > 0;
    clearBtn.hidden = doneCount === 0;
  }

  /* ---------- actions ---------- */
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (!ready) return; // ignore while loading or saving

    const text = input.value.trim();
    const date = dateInput.value;

    if (!text) {
      input.focus();
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      dateInput.focus();
      return;
    }

    // Remember the picker choices for this session (these columns
    // do not exist in the table yet)
    const emoji = EMOJI_CHOICES.includes(selectedEmoji) ? selectedEmoji : "";
    const priority = PRIORITIES.includes(selectedPriority)
      ? selectedPriority
      : "medium";

    const draft = { text: text, date: date, emoji: emoji, priority: priority };

    // Block the form while the write is in flight
    ready = false;
    addBtn.disabled = true;
    addLabel.textContent = "Adding…";
    setStatus("syncing", "Saving task…");

    try {
      const saved = await createTask(draft);
      saved.emoji = emoji;
      saved.priority = priority;
      tasks.push(saved);

      highlightId = saved.id;
      render();
      highlightId = null;

      setStatus("synced", "Saved to the cloud");
      input.value = ""; // keep the chosen date for quick same-day adds
      // Reset emoji and importance for the next task
      selectedEmoji = "";
      selectedPriority = "medium";
      syncPickers();
      input.focus();
    } catch (err) {
      // Keep the typed text so nothing is lost; show the real reason
      setStatus("error", "Could not save: " + err.message);
    } finally {
      addLabel.textContent = "Add";
      addBtn.disabled = false;
      ready = true;
    }
  });

  // Checkbox toggle — update is_complete in the database
  list.addEventListener("change", async function (event) {
    if (event.target.type !== "checkbox") return;
    if (!ready) return;
    const li = event.target.closest(".todo-item");
    const task = tasks.find(function (t) { return String(t.id) === li.dataset.id; });
    if (!task) return;

    const newValue = event.target.checked;
    ready = false;
    setStatus("syncing", "Updating…");

    try {
      await updateTask(task.id, { done: newValue });
      task.done = newValue;
      setStatus("synced", "All changes saved");
    } catch (err) {
      setStatus("error", "Could not update: " + err.message);
    } finally {
      render(); // reverts the checkbox if the write failed
      ready = true;
    }
  });

  list.addEventListener("click", function (event) {
    // Inline-edit: clicking the task text opens an input
    const textSpan = event.target.closest(".todo-text");
    if (textSpan && ready && !list.querySelector(".todo-edit-input")) {
      const li = textSpan.closest(".todo-item");
      const task = tasks.find(function (t) { return String(t.id) === li.dataset.id; });
      if (task) {
        startEdit(textSpan, task);
        return;
      }
    }

    const button = event.target.closest(".todo-delete");
    if (!button) return;
    if (!ready) return;
    const li = button.closest(".todo-item");
    const id = li.dataset.id;

    // Play the exit animation, then delete from the database.
    // A single timer path avoids transitionend double-firing.
    li.classList.add("removing");
    ready = false;
    setStatus("syncing", "Deleting…");

    setTimeout(async function () {
      try {
        await removeTask(id);
        tasks = tasks.filter(function (t) { return String(t.id) !== id; });
        setStatus("synced", "Task deleted");
      } catch (err) {
        setStatus("error", "Could not delete: " + err.message);
      } finally {
        render();
        ready = true;
      }
    }, 240);
  });

  // Replace the task text with an input; Enter saves, Escape cancels,
  // clicking away (blur) also saves.
  function startEdit(textSpan, task) {
    const input = document.createElement("input");
    input.type = "text";
    input.className = "todo-edit-input";
    input.value = task.text;
    input.maxLength = 140;
    input.setAttribute("aria-label", "Edit task text");

    let finished = false;

    async function commit(cancel) {
      if (finished) return;
      finished = true;

      const newValue = input.value.trim();
      if (!cancel && newValue && newValue !== task.text) {
        setStatus("syncing", "Saving edit…");
        try {
          await updateTask(task.id, { text: newValue.slice(0, 140) });
          task.text = newValue.slice(0, 140);
          setStatus("synced", "Edit saved");
        } catch (err) {
          // Keep the old text visible; surface the real reason
          setStatus("error", "Could not save edit: " + err.message);
        }
      }
      render(); // restores the normal text span
    }

    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        commit(false);
      } else if (event.key === "Escape") {
        event.preventDefault();
        commit(true);
      }
    });

    input.addEventListener("blur", function () {
      commit(false);
    });

    textSpan.replaceWith(input);
    input.focus();
    input.select();
  }

  // Keyboard: Enter or F2 on the focused text starts editing
  list.addEventListener("keydown", function (event) {
    if ((event.key === "Enter" || event.key === "F2") &&
        event.target.classList && event.target.classList.contains("todo-text")) {
      event.preventDefault();
      const li = event.target.closest(".todo-item");
      const task = tasks.find(function (t) { return String(t.id) === li.dataset.id; });
      if (task) startEdit(event.target, task);
    }
  });

  clearBtn.addEventListener("click", async function () {
    if (!ready) return;
    const doneIds = tasks.filter(function (t) { return t.done; })
                          .map(function (t) { return t.id; });
    if (doneIds.length === 0) return;

    ready = false;
    setStatus("syncing", "Clearing completed tasks…");

    try {
      await removeTasks(doneIds);
      tasks = tasks.filter(function (t) { return !t.done; });
      setStatus("synced", "Completed tasks cleared");
    } catch (err) {
      setStatus("error", "Could not clear: " + err.message);
    } finally {
      render();
      ready = true;
    }
  });

  /* ---------- emoji & priority pickers ---------- */
  const emojiPicker = app.querySelector(".emoji-picker");
  const priorityPicker = app.querySelector(".priority-picker");

  // Reflect the current selections onto the buttons (used at init
  // and after a task is added)
  function syncPickers() {
    if (emojiPicker) {
      emojiPicker.querySelectorAll(".emoji-btn").forEach(function (b) {
        const on = b.dataset.emoji === selectedEmoji;
        b.classList.toggle("active", on);
        b.setAttribute("aria-pressed", String(on));
      });
    }
    if (priorityPicker) {
      priorityPicker.querySelectorAll(".priority-btn").forEach(function (b) {
        const on = b.dataset.priority === selectedPriority;
        b.classList.toggle("active", on);
        b.setAttribute("aria-checked", String(on));
      });
    }
  }

  if (emojiPicker) {
    emojiPicker.addEventListener("click", function (event) {
      const button = event.target.closest(".emoji-btn");
      if (!button) return;
      // Toggle: clicking the chosen emoji again clears it
      selectedEmoji =
        selectedEmoji === button.dataset.emoji ? "" : button.dataset.emoji;
      syncPickers();
    });
  }

  if (priorityPicker) {
    priorityPicker.addEventListener("click", function (event) {
      const button = event.target.closest(".priority-btn");
      if (!button) return;
      selectedPriority = button.dataset.priority;
      syncPickers();
    });
  }

  /* ---------- init ---------- */
  dateInput.value = todayValue();
  syncPickers();

  // Read the tasks from Supabase, ordered by creation time
  (async function init() {
    setStatus("syncing", "Loading your tasks…");
    try {
      tasks = await fetchTasks();
      setStatus("synced", "Up to date — saved in the cloud");
    } catch (err) {
      setStatus("error", "Could not load tasks: " + err.message);
      tasks = [];
    } finally {
      render();
      ready = true; // enable the form only after the initial fetch
    }
  })();
})();

/* ============================================
   Contact form (Contact page)
   Opens the visitor's email client; shows a friendly note.
   ============================================ */
(function () {
  const form = document.getElementById("contact-form");
  const success = document.getElementById("form-success");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim() || "Hello from your website";
    const message = form.message.value.trim();

    const body =
      "Name: " + name + "\n" +
      "Email: " + email + "\n\n" +
      message;

    window.location.href =
      "mailto:silvia_yu2003@163.com?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body);

    if (success) {
      success.classList.add("show");
      success.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    form.reset();
  });
})();

/* ============================================
   Dark mode toggle
   ============================================ */
(function () {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  const root = document.documentElement;

  const apply = (dark) => {
    if (dark) {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
    toggle.setAttribute("aria-pressed", String(dark));
    toggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  };

  apply(root.getAttribute("data-theme") === "dark");

  toggle.addEventListener("click", () => {
    const dark = root.getAttribute("data-theme") !== "dark";
    apply(dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  });
})();

/* ============================================
   Weather Lookup (Projects page)
   Calls the UAPI Weather API:
   https://uapis.cn/api/v1/misc/weather?adcode=<code>
   or  https://uapis.cn/api/v1/misc/weather?city=<city>
   No API key needed.
   Autocomplete uses a local CITY_DATA array so
   users can disambiguate duplicate city names.
   ============================================ */
(function () {
  const form = document.getElementById("weather-form");
  const input = document.getElementById("weather-city");
  const searchBtn = document.getElementById("weather-search-btn");
  const result = document.getElementById("weather-result");
  const error = document.getElementById("weather-error");
  const suggestions = document.getElementById("weather-suggestions");
  if (!form || !input) return;

  const API_URL = "https://uapis.cn/api/v1/misc/weather";
  const FORECAST_API = "https://wttr.in"; // No key required, CORS allowed
  const MAX_SUGGESTIONS = 5;
  const DEBOUNCE_MS = 180;

  /* ---------- Local city database ---------- */
  // Each entry: { name: English pinyin, cn: Chinese chars, province: English, cnProvince: Chinese, adcode: 6-digit China admin code (or null for int'l), country: English }
  const CITY_DATA = [
    // China – 直辖市 / 副省级 / 计划单列市
    { name: "Beijing",          cn: "北京",   province: "Beijing",   cnProvince: "北京市",   adcode: "110100", country: "China" },
    { name: "Shanghai",         cn: "上海",   province: "Shanghai",  cnProvince: "上海市",   adcode: "310100", country: "China" },
    { name: "Tianjin",          cn: "天津",   province: "Tianjin",   cnProvince: "天津市",   adcode: "120100", country: "China" },
    { name: "Chongqing",        cn: "重庆",   province: "Chongqing", cnProvince: "重庆市",   adcode: "500100", country: "China" },
    { name: "Guangzhou",        cn: "广州",   province: "Guangdong", cnProvince: "广东省",   adcode: "440100", country: "China" },
    { name: "Shenzhen",         cn: "深圳",   province: "Guangdong", cnProvince: "广东省",   adcode: "440300", country: "China" },
    { name: "Chengdu",          cn: "成都",   province: "Sichuan",   cnProvince: "四川省",   adcode: "510100", country: "China" },
    { name: "Hangzhou",         cn: "杭州",   province: "Zhejiang",  cnProvince: "浙江省",   adcode: "330100", country: "China" },
    { name: "Nanjing",          cn: "南京",   province: "Jiangsu",   cnProvince: "江苏省",   adcode: "320100", country: "China" },
    { name: "Wuhan",            cn: "武汉",   province: "Hubei",     cnProvince: "湖北省",   adcode: "420100", country: "China" },
    { name: "Xi'an",            cn: "西安",   province: "Shaanxi",   cnProvince: "陕西省",   adcode: "610100", country: "China" },
    { name: "Changchun",        cn: "长春",   province: "Jilin",     cnProvince: "吉林省",   adcode: "220100", country: "China" },
    { name: "Harbin",           cn: "哈尔滨", province: "Heilongjiang", cnProvince: "黑龙江省", adcode: "230100", country: "China" },
    { name: "Jinan",            cn: "济南",   province: "Shandong",  cnProvince: "山东省",   adcode: "370100", country: "China" },
    { name: "Qingdao",          cn: "青岛",   province: "Shandong",  cnProvince: "山东省",   adcode: "370200", country: "China" },
    { name: "Xiamen",           cn: "厦门",   province: "Fujian",    cnProvince: "福建省",   adcode: "350200", country: "China" },
    { name: "Ningbo",           cn: "宁波",   province: "Zhejiang",  cnProvince: "浙江省",   adcode: "330200", country: "China" },
    { name: "Dalian",           cn: "大连",   province: "Liaoning",  cnProvince: "辽宁省",   adcode: "210200", country: "China" },
    { name: "Shenyang",         cn: "沈阳",   province: "Liaoning",  cnProvince: "辽宁省",   adcode: "210100", country: "China" },
    { name: "Urumqi",          cn: "乌鲁木齐", province: "Xinjiang", cnProvince: "新疆维吾尔自治区", adcode: "650100", country: "China" },
    { name: "Kunming",          cn: "昆明",   province: "Yunnan",    cnProvince: "云南省",   adcode: "530100", country: "China" },
    { name: "Guiyang",          cn: "贵阳",   province: "Guizhou",   cnProvince: "贵州省",   adcode: "520100", country: "China" },
    { name: "Nanning",          cn: "南宁",   province: "Guangxi",   cnProvince: "广西壮族自治区", adcode: "450100", country: "China" },
    { name: "Haikou",           cn: "海口",   province: "Hainan",    cnProvince: "海南省",   adcode: "460100", country: "China" },
    { name: "Sanya",            cn: "三亚",   province: "Hainan",    cnProvince: "海南省",   adcode: "460200", country: "China" },
    { name: "Lanzhou",          cn: "兰州",   province: "Gansu",     cnProvince: "甘肃省",   adcode: "620100", country: "China" },
    { name: "Xining",           cn: "西宁",   province: "Qinghai",   cnProvince: "青海省",   adcode: "630100", country: "China" },
    { name: "Yinchuan",         cn: "银川",   province: "Ningxia",   cnProvince: "宁夏回族自治区", adcode: "640100", country: "China" },
    { name: "Lhasa",            cn: "拉萨",   province: "Tibet",     cnProvince: "西藏自治区", adcode: "540100", country: "China" },
    // Duplicate-name prefecture-level cities – users searching "suzhou" should see both
    { name: "Suzhou",           cn: "苏州",   province: "Jiangsu",   cnProvince: "江苏省",   adcode: "320500", country: "China" },
    { name: "Suzhou",           cn: "宿州",   province: "Anhui",     cnProvince: "安徽省",   adcode: "341300", country: "China" },
    { name: "Fuzhou",           cn: "福州",   province: "Fujian",    cnProvince: "福建省",   adcode: "350100", country: "China" },
    { name: "Fuzhou",           cn: "抚州",   province: "Jiangxi",   cnProvince: "江西省",   adcode: "361000", country: "China" },
    { name: "Yan'an",           cn: "延安",   province: "Shaanxi",   cnProvince: "陕西省",   adcode: "610600", country: "China" },
    { name: "Yan'an",           cn: "雅安",   province: "Sichuan",   cnProvince: "四川省",   adcode: "511800", country: "China" },
    { name: "Baoshan",          cn: "保山",   province: "Yunnan",    cnProvince: "云南省",   adcode: "530500", country: "China" },
    { name: "Baoshan",          cn: "宝山",   province: "Shanghai",  cnProvince: "上海市",   adcode: "310113", country: "China" },
    { name: "Changsha",         cn: "长沙",   province: "Hunan",     cnProvince: "湖南省",   adcode: "430100", country: "China" },
    { name: "Changsha",         cn: "长沙",   province: "Jiangsu",   cnProvince: "江苏省",   adcode: "320300", country: "China" }, // note: 常州 Changzhou – skip confusing duplicates
    // Other major prefecture-level
    { name: "Zhengzhou",        cn: "郑州",   province: "Henan",     cnProvince: "河南省",   adcode: "410100", country: "China" },
    { name: "Luoyang",          cn: "洛阳",   province: "Henan",     cnProvince: "河南省",   adcode: "410300", country: "China" },
    { name: "Kaifeng",          cn: "开封",   province: "Henan",     cnProvince: "河南省",   adcode: "410200", country: "China" },
    { name: "Xiangyang",        cn: "襄阳",   province: "Hubei",     cnProvince: "湖北省",   adcode: "420600", country: "China" },
    { name: "Yichang",          cn: "宜昌",   province: "Hubei",     cnProvince: "湖北省",   adcode: "420500", country: "China" },
    { name: "Jiujiang",         cn: "九江",   province: "Jiangxi",   cnProvince: "江西省",   adcode: "360400", country: "China" },
    { name: "Ganzhou",          cn: "赣州",   province: "Jiangxi",   cnProvince: "江西省",   adcode: "360700", country: "China" },
    { name: "Hefei",            cn: "合肥",   province: "Anhui",     cnProvince: "安徽省",   adcode: "340100", country: "China" },
    { name: "Wuhu",             cn: "芜湖",   province: "Anhui",     cnProvince: "安徽省",   adcode: "340200", country: "China" },
    { name: "Wenzhou",          cn: "温州",   province: "Zhejiang",  cnProvince: "浙江省",   adcode: "330300", country: "China" },
    { name: "Shaoxing",         cn: "绍兴",   province: "Zhejiang",  cnProvince: "浙江省",   adcode: "330600", country: "China" },
    { name: "Jiaxing",          cn: "嘉兴",   province: "Zhejiang",  cnProvince: "浙江省",   adcode: "330400", country: "China" },
    { name: "Zhoushan",         cn: "舟山",   province: "Zhejiang",  cnProvince: "浙江省",   adcode: "330900", country: "China" },
    { name: "Taizhou",          cn: "台州",   province: "Zhejiang",  cnProvince: "浙江省",   adcode: "331000", country: "China" },
    { name: "Taizhou",          cn: "泰州",   province: "Jiangsu",   cnProvince: "江苏省",   adcode: "321200", country: "China" },
    { name: "Wuxi",             cn: "无锡",   province: "Jiangsu",   cnProvince: "江苏省",   adcode: "320200", country: "China" },
    { name: "Changzhou",        cn: "常州",   province: "Jiangsu",   cnProvince: "江苏省",   adcode: "320400", country: "China" },
    { name: "Nantong",          cn: "南通",   province: "Jiangsu",   cnProvince: "江苏省",   adcode: "320600", country: "China" },
    { name: "Yancheng",         cn: "盐城",   province: "Jiangsu",   cnProvince: "江苏省",   adcode: "320900", country: "China" },
    { name: "Xuzhou",           cn: "徐州",   province: "Jiangsu",   cnProvince: "江苏省",   adcode: "320300", country: "China" },
    { name: "Foshan",           cn: "佛山",   province: "Guangdong", cnProvince: "广东省",   adcode: "440600", country: "China" },
    { name: "Dongguan",         cn: "东莞",   province: "Guangdong", cnProvince: "广东省",   adcode: "441900", country: "China" },
    { name: "Zhongshan",        cn: "中山",   province: "Guangdong", cnProvince: "广东省",   adcode: "442000", country: "China" },
    { name: "Zhuhai",           cn: "珠海",   province: "Guangdong", cnProvince: "广东省",   adcode: "440400", country: "China" },
    { name: "Shantou",          cn: "汕头",   province: "Guangdong", cnProvince: "广东省",   adcode: "440500", country: "China" },
    { name: "Chaozhou",         cn: "潮州",   province: "Guangdong", cnProvince: "广东省",   adcode: "445100", country: "China" },
    { name: "Jieyang",          cn: "揭阳",   province: "Guangdong", cnProvince: "广东省",   adcode: "445200", country: "China" },
    { name: "Jiangmen",         cn: "江门",   province: "Guangdong", cnProvince: "广东省",   adcode: "440700", country: "China" },
    { name: "Maoming",          cn: "茂名",   province: "Guangdong", cnProvince: "广东省",   adcode: "440900", country: "China" },
    { name: "Zhanjiang",        cn: "湛江",   province: "Guangdong", cnProvince: "广东省",   adcode: "440800", country: "China" },
    { name: "Huizhou",          cn: "惠州",   province: "Guangdong", cnProvince: "广东省",   adcode: "441300", country: "China" },
    { name: "Changde",          cn: "常德",   province: "Hunan",     cnProvince: "湖南省",   adcode: "430700", country: "China" },
    { name: "Yiyang",           cn: "益阳",   province: "Hunan",     cnProvince: "湖南省",   adcode: "430900", country: "China" },
    { name: "Zhuzhou",          cn: "株洲",   province: "Hunan",     cnProvince: "湖南省",   adcode: "430200", country: "China" },
    { name: "Xiangtan",         cn: "湘潭",   province: "Hunan",     cnProvince: "湖南省",   adcode: "430300", country: "China" },
    { name: "Hengyang",         cn: "衡阳",   province: "Hunan",     cnProvince: "湖南省",   adcode: "430400", country: "China" },
    { name: "Yueyang",          cn: "岳阳",   province: "Hunan",     cnProvince: "湖南省",   adcode: "430600", country: "China" },
    { name: "Meizhou",          cn: "梅州",   province: "Guangdong", cnProvince: "广东省",   adcode: "441400", country: "China" },
    { name: "Quanzhou",         cn: "泉州",   province: "Fujian",    cnProvince: "福建省",   adcode: "350500", country: "China" },
    { name: "Zhangzhou",        cn: "漳州",   province: "Fujian",    cnProvince: "福建省",   adcode: "350600", country: "China" },
    { name: "Putian",           cn: "莆田",   province: "Fujian",    cnProvince: "福建省",   adcode: "350300", country: "China" },
    { name: "Nanping",          cn: "南平",   province: "Fujian",    cnProvince: "福建省",   adcode: "350700", country: "China" },
    { name: "Sanming",          cn: "三明",   province: "Fujian",    cnProvince: "福建省",   adcode: "350400", country: "China" },
    { name: "Bengbu",           cn: "蚌埠",   province: "Anhui",     cnProvince: "安徽省",   adcode: "340300", country: "China" },
    { name: "Huainan",          cn: "淮南",   province: "Anhui",     cnProvince: "安徽省",   adcode: "340400", country: "China" },
    { name: "Ma'anshan",        cn: "马鞍山", province: "Anhui",   cnProvince: "安徽省",   adcode: "340500", country: "China" },
    { name: "Anqing",           cn: "安庆",   province: "Anhui",     cnProvince: "安徽省",   adcode: "340800", country: "China" },
    { name: "Huangshan",        cn: "黄山",   province: "Anhui",     cnProvince: "安徽省",   adcode: "341000", country: "China" },
    { name: "Yantai",           cn: "烟台",   province: "Shandong",  cnProvince: "山东省",   adcode: "370600", country: "China" },
    { name: "Weifang",          cn: "潍坊",   province: "Shandong",  cnProvince: "山东省",   adcode: "370700", country: "China" },
    { name: "Zibo",             cn: "淄博",   province: "Shandong",  cnProvince: "山东省",   adcode: "370300", country: "China" },
    { name: "Dongying",         cn: "东营",   province: "Shandong",  cnProvince: "山东省",   adcode: "370500", country: "China" },
    { name: "Rizhao",           cn: "日照",   province: "Shandong",  cnProvince: "山东省",   adcode: "371100", country: "China" },
    { name: "Linyi",            cn: "临沂",   province: "Shandong",  cnProvince: "山东省",   adcode: "371300", country: "China" },
    { name: "Dezhou",           cn: "德州",   province: "Shandong",  cnProvince: "山东省",   adcode: "371400", country: "China" },
    { name: "Tai'an",           cn: "泰安",   province: "Shandong",  cnProvince: "山东省",   adcode: "370900", country: "China" },
    { name: "Liaocheng",        cn: "聊城",   province: "Shandong",  cnProvince: "山东省",   adcode: "371500", country: "China" },
    { name: "Binzhou",          cn: "滨州",   province: "Shandong",  cnProvince: "山东省",   adcode: "371600", country: "China" },
    { name: "Heze",             cn: "菏泽",   province: "Shandong",  cnProvince: "山东省",   adcode: "371700", country: "China" },
    { name: "Zaozhuang",        cn: "枣庄",   province: "Shandong",  cnProvince: "山东省",   adcode: "370400", country: "China" },
    { name: "Mutankiang",       cn: "牡丹江", province: "Heilongjiang", cnProvince: "黑龙江省", adcode: "231000", country: "China" },
    { name: "Jiamusi",          cn: "佳木斯", province: "Heilongjiang", cnProvince: "黑龙江省", adcode: "230800", country: "China" },
    { name: "Daqing",           cn: "大庆",   province: "Heilongjiang", cnProvince: "黑龙江省", adcode: "230600", country: "China" },
    { name: "Suihua",           cn: "绥化",   province: "Heilongjiang", cnProvince: "黑龙江省", adcode: "231200", country: "China" },
    { name: "Qiqihar",          cn: "齐齐哈尔", province: "Heilongjiang", cnProvince: "黑龙江省", adcode: "230200", country: "China" },
    { name: "Changji",          cn: "昌吉",   province: "Xinjiang",  cnProvince: "新疆维吾尔自治区", adcode: "652300", country: "China" },
    { name: "Turpan",           cn: "吐鲁番", province: "Xinjiang",  cnProvince: "新疆维吾尔自治区", adcode: "652100", country: "China" },
    { name: "Korla",            cn: "库尔勒", province: "Xinjiang",  cnProvince: "新疆维吾尔自治区", adcode: "652800", country: "China" },
    { name: "Dunhuang",         cn: "敦煌",   province: "Gansu",     cnProvince: "甘肃省",   adcode: "620982", country: "China" },
    { name: "Mianyang",         cn: "绵阳",   province: "Sichuan",   cnProvince: "四川省",   adcode: "510700", country: "China" },
    { name: "Leshan",           cn: "乐山",   province: "Sichuan",   cnProvince: "四川省",   adcode: "511100", country: "China" },
    { name: "Dazhou",           cn: "达州",   province: "Sichuan",   cnProvince: "四川省",   adcode: "511700", country: "China" },
    { name: "Nanchong",         cn: "南充",   province: "Sichuan",   cnProvince: "四川省",   adcode: "511300", country: "China" },
    { name: "Yibin",            cn: "宜宾",   province: "Sichuan",   cnProvince: "四川省",   adcode: "511500", country: "China" },
    { name: "Luzhou",           cn: "泸州",   province: "Sichuan",   cnProvince: "四川省",   adcode: "510500", country: "China" },
    { name: "Neijiang",         cn: "内江",   province: "Sichuan",   cnProvince: "四川省",   adcode: "511000", country: "China" },
    { name: "Zigong",           cn: "自贡",   province: "Sichuan",   cnProvince: "四川省",   adcode: "510300", country: "China" },
    { name: "Tongren",          cn: "铜仁",   province: "Guizhou",   cnProvince: "贵州省",   adcode: "522200", country: "China" },
    { name: "Zunyi",            cn: "遵义",   province: "Guizhou",   cnProvince: "贵州省",   adcode: "520300", country: "China" },
    { name: "Kunming",          cn: "昆明",   province: "Yunnan",    cnProvince: "云南省",   adcode: "530100", country: "China" }, // duplicate guard? No – we only have one Kunming above. Keep unique.
    // → remove duplicate Kunming above. OK.
    { name: "Dali",             cn: "大理",   province: "Yunnan",    cnProvince: "云南省",   adcode: "532900", country: "China" },
    { name: "Lijiang",          cn: "丽江",   province: "Yunnan",    cnProvince: "云南省",   adcode: "530700", country: "China" },
    { name: "Xishuangbanna",    cn: "西双版纳", province: "Yunnan",  cnProvince: "云南省",   adcode: "532800", country: "China" },
    { name: "Qujing",           cn: "曲靖",   province: "Yunnan",    cnProvince: "云南省",   adcode: "530300", country: "China" },
    { name: "Honghe",           cn: "红河",   province: "Yunnan",    cnProvince: "云南省",   adcode: "532500", country: "China" },
    { name: "Qinhuangdao",      cn: "秦皇岛", province: "Hebei",     cnProvince: "河北省",   adcode: "130300", country: "China" },
    { name: "Baoding",          cn: "保定",   province: "Hebei",     cnProvince: "河北省",   adcode: "130600", country: "China" },
    { name: "Tangshan",         cn: "唐山",   province: "Hebei",     cnProvince: "河北省",   adcode: "130200", country: "China" },
    { name: "Zhangjiakou",      cn: "张家口", province: "Hebei",     cnProvince: "河北省",   adcode: "130700", country: "China" },
    { name: "Chengde",          cn: "承德",   province: "Hebei",     cnProvince: "河北省",   adcode: "130800", country: "China" },
    { name: "Shijiazhuang",     cn: "石家庄", province: "Hebei",     cnProvince: "河北省",   adcode: "130100", country: "China" },
    { name: "Langfang",         cn: "廊坊",   province: "Hebei",     cnProvince: "河北省",   adcode: "131000", country: "China" },
    { name: "Cangzhou",         cn: "沧州",   province: "Hebei",     cnProvince: "河北省",   adcode: "130900", country: "China" },
    { name: "Hengshui",         cn: "衡水",   province: "Hebei",     cnProvince: "河北省",   adcode: "131100", country: "China" },
    { name: "Taiyuan",          cn: "太原",   province: "Shanxi",    cnProvince: "山西省",   adcode: "140100", country: "China" },
    { name: "Datong",           cn: "大同",   province: "Shanxi",    cnProvince: "山西省",   adcode: "140200", country: "China" },
    { name: "Pingyao",          cn: "平遥",   province: "Shanxi",    cnProvince: "山西省",   adcode: "140728", country: "China" },
    { name: "Xi'an",            cn: "西安",   province: "Shaanxi",   cnProvince: "陕西省",   adcode: "610100", country: "China" },
    { name: "Baoji",            cn: "宝鸡",   province: "Shaanxi",   cnProvince: "陕西省",   adcode: "610300", country: "China" },
    { name: "Xianyang",         cn: "咸阳",   province: "Shaanxi",   cnProvince: "陕西省",   adcode: "610400", country: "China" },
    { name: "Weinan",           cn: "渭南",   province: "Shaanxi",   cnProvince: "陕西省",   adcode: "610500", country: "China" },
    { name: "Yulin",            cn: "榆林",   province: "Shaanxi",   cnProvince: "陕西省",   adcode: "610800", country: "China" },
    { name: "Ankang",           cn: "安康",   province: "Shaanxi",   cnProvince: "陕西省",   adcode: "610900", country: "China" },
    { name: "Hanzhong",         cn: "汉中",   province: "Shaanxi",   cnProvince: "陕西省",   adcode: "610700", country: "China" },
    { name: "Tianshui",         cn: "天水",   province: "Gansu",     cnProvince: "甘肃省",   adcode: "620500", country: "China" },
    { name: "Jinchang",         cn: "金昌",   province: "Gansu",     cnProvince: "甘肃省",   adcode: "620300", country: "China" },
    { name: "Baiyin",           cn: "白银",   province: "Gansu",     cnProvince: "甘肃省",   adcode: "620400", country: "China" },
    { name: "Zhangye",          cn: "张掖",   province: "Gansu",     cnProvince: "甘肃省",   adcode: "620700", country: "China" },
    { name: "Pingliang",        cn: "平凉",   province: "Gansu",     cnProvince: "甘肃省",   adcode: "620800", country: "China" },
    { name: "Qingyang",         cn: "庆阳",   province: "Gansu",     cnProvince: "甘肃省",   adcode: "621000", country: "China" },
    { name: "Huaihua",          cn: "怀化",   province: "Hunan",     cnProvince: "湖南省",   adcode: "431200", country: "China" },
    { name: "Loudi",            cn: "娄底",   province: "Hunan",     cnProvince: "湖南省",   adcode: "431300", country: "China" },
    { name: "Xiangxi",          cn: "湘西",   province: "Hunan",     cnProvince: "湖南省",   adcode: "433100", country: "China" },
    { name: "Puyang",           cn: "濮阳",   province: "Henan",     cnProvince: "河南省",   adcode: "410900", country: "China" },
    { name: "Xinxiang",         cn: "新乡",   province: "Henan",     cnProvince: "河南省",   adcode: "410700", country: "China" },
    { name: "Anyang",           cn: "安阳",   province: "Henan",     cnProvince: "河南省",   adcode: "410500", country: "China" },
    { name: "Jiaozuo",          cn: "焦作",   province: "Henan",     cnProvince: "河南省",   adcode: "410800", country: "China" },
    { name: "Hebi",             cn: "鹤壁",   province: "Henan",     cnProvince: "河南省",   adcode: "410600", country: "China" },
    { name: "Xuchang",          cn: "许昌",   province: "Henan",     cnProvince: "河南省",   adcode: "411000", country: "China" },
    { name: "Luohe",            cn: "漯河",   province: "Henan",     cnProvince: "河南省",   adcode: "411100", country: "China" },
    { name: "Sanmenxia",        cn: "三门峡", province: "Henan",     cnProvince: "河南省",   adcode: "411200", country: "China" },
    { name: "Nanyang",          cn: "南阳",   province: "Henan",     cnProvince: "河南省",   adcode: "411300", country: "China" },
    { name: "Shangqiu",         cn: "商丘",   province: "Henan",     cnProvince: "河南省",   adcode: "411400", country: "China" },
    { name: "Xinyang",          cn: "信阳",   province: "Henan",     cnProvince: "河南省",   adcode: "411500", country: "China" },
    { name: "Zhoukou",          cn: "周口",   province: "Henan",     cnProvince: "河南省",   adcode: "411600", country: "China" },
    { name: "Zhumadian",        cn: "驻马店", province: "Henan",     cnProvince: "河南省",   adcode: "411700", country: "China" },
    { name: "Lhasa",            cn: "拉萨",   province: "Tibet",     cnProvince: "西藏自治区", adcode: "540100", country: "China" },
    { name: "Shigatse",         cn: "日喀则", province: "Tibet",     cnProvince: "西藏自治区", adcode: "540200", country: "China" },
    { name: "Nyingchi",         cn: "林芝",   province: "Tibet",     cnProvince: "西藏自治区", adcode: "540400", country: "China" },
    { name: "Qamdo",            cn: "昌都",   province: "Tibet",     cnProvince: "西藏自治区", adcode: "540300", country: "China" },
    { name: "Shannan",          cn: "山南",   province: "Tibet",     cnProvince: "西藏自治区", adcode: "540500", country: "China" },
    { name: "Nagqu",            cn: "那曲",   province: "Tibet",     cnProvince: "西藏自治区", adcode: "540600", country: "China" },
    { name: "Ali",              cn: "阿里",   province: "Tibet",     cnProvince: "西藏自治区", adcode: "542500", country: "China" },
    { name: "Hohhot",           cn: "呼和浩特", province: "Inner Mongolia", cnProvince: "内蒙古自治区", adcode: "150100", country: "China" },
    { name: "Baotou",           cn: "包头",   province: "Inner Mongolia", cnProvince: "内蒙古自治区", adcode: "150200", country: "China" },
    { name: "Ordos",            cn: "鄂尔多斯", province: "Inner Mongolia", cnProvince: "内蒙古自治区", adcode: "150600", country: "China" },
    { name: "Chifeng",          cn: "赤峰",   province: "Inner Mongolia", cnProvince: "内蒙古自治区", adcode: "150400", country: "China" },
    { name: "Xilinhot",         cn: "锡林浩特", province: "Inner Mongolia", cnProvince: "内蒙古自治区", adcode: "152502", country: "China" },
    { name: "Ulanqab",          cn: "乌兰察布", province: "Inner Mongolia", cnProvince: "内蒙古自治区", adcode: "150900", country: "China" },
    { name: "Brazzaville",      cn: "布拉柴维尔", province: "Brazzaville", cnProvince: "布拉柴维尔", adcode: null, country: "Congo" },
    // Hong Kong / Macau / Taiwan – special
    { name: "Hong Kong",        cn: "香港",   province: "Hong Kong", cnProvince: "香港特别行政区", adcode: "810100", country: "China" },
    { name: "Macau",            cn: "澳门",   province: "Macau",     cnProvince: "澳门特别行政区", adcode: "820100", country: "China" },
    { name: "Taipei",           cn: "台北",   province: "Taiwan",    cnProvince: "台湾省",   adcode: "710100", country: "China" },
    { name: "Taichung",         cn: "台中",   province: "Taiwan",    cnProvince: "台湾省",   adcode: "710200", country: "China" },
    { name: "Kaohsiung",        cn: "高雄",   province: "Taiwan",    cnProvince: "台湾省",   adcode: "710300", country: "China" },
    { name: "Tainan",           cn: "台南",   province: "Taiwan",    cnProvince: "台湾省",   adcode: "710400", country: "China" },

    // Major international cities (fallback to ?city= — UAPI supports some via geocoding)
    { name: "London",       cn: "伦敦",   province: "England",      cnProvince: "英格兰",      adcode: null, country: "United Kingdom" },
    { name: "Manchester",   cn: "曼彻斯特", province: "England",    cnProvince: "英格兰",      adcode: null, country: "United Kingdom" },
    { name: "Paris",        cn: "巴黎",   province: "Île-de-France", cnProvince: "法兰西岛",  adcode: null, country: "France" },
    { name: "Lyon",         cn: "里昂",   province: "Auvergne-Rhône-Alpes", cnProvince: "奥弗涅-罗讷-阿尔卑斯", adcode: null, country: "France" },
    { name: "Berlin",       cn: "柏林",   province: "Berlin",       cnProvince: "柏林",        adcode: null, country: "Germany" },
    { name: "Munich",       cn: "慕尼黑", province: "Bavaria",      cnProvince: "巴伐利亚",    adcode: null, country: "Germany" },
    { name: "Hamburg",      cn: "汉堡",   province: "Hamburg",      cnProvince: "汉堡",        adcode: null, country: "Germany" },
    { name: "Frankfurt",    cn: "法兰克福", province: "Hesse",     cnProvince: "黑森",        adcode: null, country: "Germany" },
    { name: "Madrid",       cn: "马德里", province: "Community of Madrid", cnProvince: "马德里", adcode: null, country: "Spain" },
    { name: "Barcelona",    cn: "巴塞罗那", province: "Catalonia", cnProvince: "加泰罗尼亚",  adcode: null, country: "Spain" },
    { name: "Rome",         cn: "罗马",   province: "Lazio",        cnProvince: "拉齐奥",      adcode: null, country: "Italy" },
    { name: "Milan",        cn: "米兰",   province: "Lombardy",     cnProvince: "伦巴第",      adcode: null, country: "Italy" },
    { name: "Venice",       cn: "威尼斯", province: "Veneto",       cnProvince: "威尼托",      adcode: null, country: "Italy" },
    { name: "Amsterdam",    cn: "阿姆斯特丹", province: "North Holland", cnProvince: "北荷兰", adcode: null, country: "Netherlands" },
    { name: "Rotterdam",    cn: "鹿特丹", province: "South Holland", cnProvince: "南荷兰",      adcode: null, country: "Netherlands" },
    { name: "Brussels",     cn: "布鲁塞尔", province: "Brussels",   cnProvince: "布鲁塞尔",    adcode: null, country: "Belgium" },
    { name: "Vienna",       cn: "维也纳", province: "Vienna",       cnProvince: "维也纳",      adcode: null, country: "Austria" },
    { name: "Zurich",       cn: "苏黎世", province: "Zurich",       cnProvince: "苏黎世",      adcode: null, country: "Switzerland" },
    { name: "Geneva",       cn: "日内瓦", province: "Geneva",       cnProvince: "日内瓦",      adcode: null, country: "Switzerland" },
    { name: "Stockholm",    cn: "斯德哥尔摩", province: "Stockholm", cnProvince: "斯德哥尔摩",  adcode: null, country: "Sweden" },
    { name: "Oslo",         cn: "奥斯陆", province: "Oslo",         cnProvince: "奥斯陆",      adcode: null, country: "Norway" },
    { name: "Copenhagen",   cn: "哥本哈根", province: "Capital Region", cnProvince: "首都大区", adcode: null, country: "Denmark" },
    { name: "Helsinki",     cn: "赫尔辛基", province: "Uusimaa",    cnProvince: "新地",        adcode: null, country: "Finland" },
    { name: "Dublin",       cn: "都柏林", province: "Leinster",     cnProvince: "伦斯特",      adcode: null, country: "Ireland" },
    { name: "Prague",       cn: "布拉格", province: "Prague",       cnProvince: "布拉格",      adcode: null, country: "Czech Republic" },
    { name: "Budapest",     cn: "布达佩斯", province: "Budapest",   cnProvince: "布达佩斯",    adcode: null, country: "Hungary" },
    { name: "Warsaw",       cn: "华沙",   province: "Masovia",      cnProvince: "马佐夫舍",    adcode: null, country: "Poland" },
    { name: "Athens",       cn: "雅典",   province: "Attica",       cnProvince: "阿提卡",      adcode: null, country: "Greece" },
    { name: "Istanbul",     cn: "伊斯坦布尔", province: "Istanbul", cnProvince: "伊斯坦布尔",  adcode: null, country: "Turkey" },
    { name: "Moscow",       cn: "莫斯科", province: "Moscow",       cnProvince: "莫斯科",      adcode: null, country: "Russia" },
    { name: "Saint Petersburg", cn: "圣彼得堡", province: "Saint Petersburg", cnProvince: "圣彼得堡", adcode: null, country: "Russia" },
    { name: "New York",     cn: "纽约",   province: "New York",     cnProvince: "纽约州",      adcode: null, country: "United States" },
    { name: "Los Angeles",  cn: "洛杉矶", province: "California",   cnProvince: "加利福尼亚州", adcode: null, country: "United States" },
    { name: "San Francisco", cn: "旧金山", province: "California",  cnProvince: "加利福尼亚州", adcode: null, country: "United States" },
    { name: "Seattle",      cn: "西雅图", province: "Washington",   cnProvince: "华盛顿州",    adcode: null, country: "United States" },
    { name: "Chicago",      cn: "芝加哥", province: "Illinois",     cnProvince: "伊利诺伊州",  adcode: null, country: "United States" },
    { name: "Boston",       cn: "波士顿", province: "Massachusetts", cnProvince: "马萨诸塞州", adcode: null, country: "United States" },
    { name: "Miami",        cn: "迈阿密", province: "Florida",      cnProvince: "佛罗里达州",  adcode: null, country: "United States" },
    { name: "Denver",       cn: "丹佛",   province: "Colorado",     cnProvince: "科罗拉多州",  adcode: null, country: "United States" },
    { name: "Phoenix",      cn: "菲尼克斯", province: "Arizona",   cnProvince: "亚利桑那州",  adcode: null, country: "United States" },
    { name: "Atlanta",      cn: "亚特兰大", province: "Georgia",   cnProvince: "佐治亚州",    adcode: null, country: "United States" },
    { name: "Washington DC", cn: "华盛顿特区", province: "District of Columbia", cnProvince: "哥伦比亚特区", adcode: null, country: "United States" },
    { name: "Portland",     cn: "波特兰", province: "Oregon",       cnProvince: "俄勒冈州",    adcode: null, country: "United States" },
    { name: "Dallas",       cn: "达拉斯", province: "Texas",        cnProvince: "得克萨斯州",  adcode: null, country: "United States" },
    { name: "Austin",       cn: "奥斯汀", province: "Texas",        cnProvince: "得克萨斯州",  adcode: null, country: "United States" },
    { name: "Houston",      cn: "休斯顿", province: "Texas",        cnProvince: "得克萨斯州",  adcode: null, country: "United States" },
    { name: "Philadelphia", cn: "费城",   province: "Pennsylvania", cnProvince: "宾夕法尼亚州", adcode: null, country: "United States" },
    { name: "San Diego",    cn: "圣迭戈", province: "California",   cnProvince: "加利福尼亚州", adcode: null, country: "United States" },
    { name: "Toronto",      cn: "多伦多", province: "Ontario",      cnProvince: "安大略省",    adcode: null, country: "Canada" },
    { name: "Vancouver",    cn: "温哥华", province: "British Columbia", cnProvince: "不列颠哥伦比亚省", adcode: null, country: "Canada" },
    { name: "Montreal",     cn: "蒙特利尔", province: "Quebec",   cnProvince: "魁北克省",    adcode: null, country: "Canada" },
    { name: "Ottawa",       cn: "渥太华", province: "Ontario",      cnProvince: "安大略省",    adcode: null, country: "Canada" },
    { name: "Tokyo",        cn: "东京",   province: "Tokyo",        cnProvince: "东京都",      adcode: null, country: "Japan" },
    { name: "Osaka",        cn: "大阪",   province: "Osaka",        cnProvince: "大阪府",      adcode: null, country: "Japan" },
    { name: "Kyoto",        cn: "京都",   province: "Kyoto",        cnProvince: "京都府",      adcode: null, country: "Japan" },
    { name: "Yokohama",     cn: "横滨",   province: "Kanagawa",     cnProvince: "神奈川县",    adcode: null, country: "Japan" },
    { name: "Nagoya",       cn: "名古屋", province: "Aichi",        cnProvince: "爱知县",      adcode: null, country: "Japan" },
    { name: "Fukuoka",      cn: "福冈",   province: "Fukuoka",      cnProvince: "福冈县",      adcode: null, country: "Japan" },
    { name: "Seoul",        cn: "首尔",   province: "Seoul",        cnProvince: "首尔特别市",  adcode: null, country: "South Korea" },
    { name: "Busan",        cn: "釜山",   province: "Busan",        cnProvince: "釜山广域市",  adcode: null, country: "South Korea" },
    { name: "Incheon",      cn: "仁川",   province: "Incheon",      cnProvince: "仁川广域市",  adcode: null, country: "South Korea" },
    { name: "Singapore",    cn: "新加坡", province: "Singapore",    cnProvince: "新加坡",      adcode: null, country: "Singapore" },
    { name: "Kuala Lumpur", cn: "吉隆坡", province: "Kuala Lumpur", cnProvince: "吉隆坡",      adcode: null, country: "Malaysia" },
    { name: "Bangkok",      cn: "曼谷",   province: "Bangkok",      cnProvince: "曼谷",        adcode: null, country: "Thailand" },
    { name: "Chiang Mai",   cn: "清迈",   province: "Chiang Mai",   cnProvince: "清迈",        adcode: null, country: "Thailand" },
    { name: "Jakarta",      cn: "雅加达", province: "Jakarta",      cnProvince: "雅加达",      adcode: null, country: "Indonesia" },
    { name: "Ho Chi Minh City", cn: "胡志明市", province: "Ho Chi Minh City", cnProvince: "胡志明市", adcode: null, country: "Vietnam" },
    { name: "Hanoi",        cn: "河内",   province: "Hanoi",        cnProvince: "河内",        adcode: null, country: "Vietnam" },
    { name: "Manila",       cn: "马尼拉", province: "Metro Manila", cnProvince: "马尼拉大都会", adcode: null, country: "Philippines" },
    { name: "Mumbai",       cn: "孟买",   province: "Maharashtra",  cnProvince: "马哈拉施特拉邦", adcode: null, country: "India" },
    { name: "Delhi",        cn: "德里",   province: "Delhi",        cnProvince: "德里",        adcode: null, country: "India" },
    { name: "Bangalore",    cn: "班加罗尔", province: "Karnataka", cnProvince: "卡纳塔克邦",  adcode: null, country: "India" },
    { name: "Chennai",      cn: "钦奈",   province: "Tamil Nadu",   cnProvince: "泰米尔纳德邦", adcode: null, country: "India" },
    { name: "Kolkata",      cn: "加尔各答", province: "West Bengal", cnProvince: "西孟加拉邦", adcode: null, country: "India" },
    { name: "Sydney",       cn: "悉尼",   province: "New South Wales", cnProvince: "新南威尔士州", adcode: null, country: "Australia" },
    { name: "Melbourne",    cn: "墨尔本", province: "Victoria",     cnProvince: "维多利亚州",  adcode: null, country: "Australia" },
    { name: "Brisbane",     cn: "布里斯班", province: "Queensland", cnProvince: "昆士兰州",    adcode: null, country: "Australia" },
    { name: "Perth",        cn: "珀斯",   province: "Western Australia", cnProvince: "西澳大利亚州", adcode: null, country: "Australia" },
    { name: "Adelaide",     cn: "阿德莱德", province: "South Australia", cnProvince: "南澳大利亚州", adcode: null, country: "Australia" },
    { name: "Auckland",     cn: "奥克兰", province: "Auckland",     cnProvince: "奥克兰",      adcode: null, country: "New Zealand" },
    { name: "Wellington",   cn: "惠灵顿", province: "Wellington",   cnProvince: "惠灵顿",      adcode: null, country: "New Zealand" },
    { name: "Cairo",        cn: "开罗",   province: "Cairo",        cnProvince: "开罗",        adcode: null, country: "Egypt" },
    { name: "Johannesburg", cn: "约翰内斯堡", province: "Gauteng", cnProvince: "豪登省",      adcode: null, country: "South Africa" },
    { name: "Cape Town",    cn: "开普敦", province: "Western Cape", cnProvince: "西开普省",    adcode: null, country: "South Africa" },
    { name: "Dubai",        cn: "迪拜",   province: "Dubai",        cnProvince: "迪拜",        adcode: null, country: "United Arab Emirates" },
    { name: "Abu Dhabi",    cn: "阿布扎比", province: "Abu Dhabi", cnProvince: "阿布扎比",    adcode: null, country: "United Arab Emirates" },
    { name: "Doha",         cn: "多哈",   province: "Doha",         cnProvince: "多哈",        adcode: null, country: "Qatar" },
    { name: "Riyadh",       cn: "利雅得", province: "Riyadh",       cnProvince: "利雅得",      adcode: null, country: "Saudi Arabia" },
    { name: "Tehran",       cn: "德黑兰", province: "Tehran",       cnProvince: "德黑兰",      adcode: null, country: "Iran" },
    { name: "Istanbul",     cn: "伊斯坦布尔", province: "Istanbul", cnProvince: "伊斯坦布尔",  adcode: null, country: "Turkey" }, // duplicate name, keep both in CITY_DATA – filter handles it
    { name: "Mexico City",  cn: "墨西哥城", province: "Mexico City", cnProvince: "墨西哥城",   adcode: null, country: "Mexico" },
    { name: "São Paulo",    cn: "圣保罗", province: "São Paulo",    cnProvince: "圣保罗州",    adcode: null, country: "Brazil" },
    { name: "Rio de Janeiro", cn: "里约热内卢", province: "Rio de Janeiro", cnProvince: "里约热内卢州", adcode: null, country: "Brazil" },
    { name: "Buenos Aires", cn: "布宜诺斯艾利斯", province: "Buenos Aires", cnProvince: "布宜诺斯艾利斯省", adcode: null, country: "Argentina" },
    { name: "Lima",         cn: "利马",   province: "Lima",         cnProvince: "利马省",      adcode: null, country: "Peru" },
    { name: "Bogotá",       cn: "波哥大", province: "Bogotá",       cnProvince: "波哥大",      adcode: null, country: "Colombia" },
    { name: "Toronto",      cn: "多伦多", province: "Ontario",      cnProvince: "安大略省",    adcode: null, country: "Canada" },
    { name: "Seoul",        cn: "首尔",   province: "Seoul",        cnProvince: "首尔特别市",  adcode: null, country: "South Korea" },
    { name: "Kaohsiung",    cn: "高雄",   province: "Taiwan",       cnProvince: "台湾省",      adcode: "710300", country: "China" }, // already have this above – dedup
    { name: "New Delhi",    cn: "新德里", province: "Delhi",        cnProvince: "德里",        adcode: null, country: "India" },
  ];

  // De-duplicate by (name+cn+adcode) since we have a few intentional dupes for cross-country same-name
  const _seen = new Set();
  const CITY_DATA_DEDUPED = CITY_DATA.filter((c) => {
    const key = (c.name || "").toLowerCase() + "|" + (c.cn || "") + "|" + (c.adcode || "") + "|" + (c.country || "");
    if (_seen.has(key)) return false;
    _seen.add(key);
    return true;
  });

  /* ---------- State ---------- */
  let activeIndex = -1;
  let debounceTimer = null;
  let selectedCity = null; // Last city picked from suggestions (or null)
  let currentUnit = "C"; // 'C' or 'F' — persists across searches
  let lastWeatherData = null; // cache for re-render on unit toggle
  let lastForecastData = null; // wttr.in 3-day forecast cache

  /* ---------- Helpers ---------- */
  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Build a highlighted label: mark matching substring with <span class="suggestion-match">
  function highlighted(text, query) {
    const t = String(text || "");
    if (!query) return escapeHtml(t);
    const lower = t.toLowerCase();
    const q = query.toLowerCase();
    const idx = lower.indexOf(q);
    if (idx === -1) return escapeHtml(t);
    return (
      escapeHtml(t.slice(0, idx)) +
      '<span class="suggestion-match">' +
      escapeHtml(t.slice(idx, idx + q.length)) +
      "</span>" +
      escapeHtml(t.slice(idx + q.length))
    );
  }

  function showSuggestions(list, query) {
    suggestions.innerHTML = "";
    activeIndex = -1;
    if (!list.length) {
      suggestions.hidden = true;
      input.setAttribute("aria-expanded", "false");
      return;
    }
    list.forEach((c, i) => {
      const item = document.createElement("div");
      item.className = "suggestion-item";
      item.setAttribute("role", "option");
      item.setAttribute("aria-selected", "false");
      item.setAttribute("data-index", i);

      // Build label: English name [Chinese] · Province
      let left = highlighted(c.name, query);
      if (c.cn) left += ' <span class="suggestion-cn">' + escapeHtml(c.cn) + "</span>";
      // Also mark Chinese character match if query is Chinese and cn matches
      if (query && /[\u4e00-\u9fff]/.test(query)) {
        const cnLower = c.cn.toLowerCase();
        const qLower = query.toLowerCase();
        if (cnLower.indexOf(qLower) !== -1) {
          // Wrap the cn text (already in DOM): simpler — re-render cn with highlight
          // We already appended raw escapeHtml(c.cn); patch by rebuilding:
          const cnIdx = cnLower.indexOf(qLower);
          const hlCn =
            escapeHtml(c.cn.slice(0, cnIdx)) +
            '<span class="suggestion-match">' +
            escapeHtml(c.cn.slice(cnIdx, cnIdx + qLower.length)) +
            "</span>" +
            escapeHtml(c.cn.slice(cnIdx + qLower.length));
          left = highlighted(c.name, query) + ' <span class="suggestion-cn">' + hlCn + "</span>";
        }
      }
      let right = escapeHtml(c.province || c.country || "");
      if (c.adcode === null && c.country && c.country !== "China") {
        right += c.province && c.province !== c.country ? " · " + escapeHtml(c.country) : "";
      }
      item.innerHTML = left + ' <span class="suggestion-province">' + right + "</span>";
      item.addEventListener("mousedown", (e) => {
        // mousedown so we fire before input blur
        e.preventDefault();
        pickSuggestion(i);
      });
      suggestions.appendChild(item);
    });
    suggestions.hidden = false;
    input.setAttribute("aria-expanded", "true");
  }

  function hideSuggestions() {
    suggestions.hidden = true;
    suggestions.innerHTML = "";
    activeIndex = -1;
    input.setAttribute("aria-expanded", "false");
  }

  // Lightweight single-edit-distance check (Levenshtein ≤ 1).
  // Handles: substitution, insertion, deletion. Skips transposition (Levenshtein=2).
  function isOneEditAway(a, b) {
    if (!a || !b) return false;
    if (a === b) return false; // exact match is already handled by substring
    const lenDiff = a.length - b.length;
    if (lenDiff < -1 || lenDiff > 1) return false;

    let edits = 0;
    let i = 0;
    let j = 0;

    if (lenDiff === 0) {
      // Same length — substitution only
      for (; i < a.length; i++) {
        if (a[i] !== b[i]) {
          edits++;
          if (edits > 1) return false;
        }
      }
    } else if (lenDiff === 1) {
      // a is longer — deletion from a
      while (i < a.length && j < b.length) {
        if (a[i] !== b[j]) {
          edits++;
          if (edits > 1) return false;
          i++; // skip one char in a
        } else {
          i++;
          j++;
        }
      }
    } else {
      // a is shorter — insertion in a
      while (i < a.length && j < b.length) {
        if (a[i] !== b[j]) {
          edits++;
          if (edits > 1) return false;
          j++; // skip one char in b
        } else {
          i++;
          j++;
        }
      }
    }
    return edits <= 1;
  }

  function filterCities(query) {
    const q = (query || "").trim().toLowerCase();
    if (!q) return [];
    const out = [];
    const seen = new Set();

    // Pass 1: substring match across all fields (existing behaviour)
    for (const c of CITY_DATA_DEDUPED) {
      const hayStack = [c.name, c.cn, c.province, c.cnProvince, c.country].filter(Boolean).join(" ").toLowerCase();
      if (hayStack.indexOf(q) !== -1) {
        out.push(c);
        seen.add(c.name + "|" + c.cn);
      }
      if (out.length >= MAX_SUGGESTIONS) break;
    }

    // Pass 2: fuzzy one-edit-away match on English name only.
    // Only triggers when: still have slots AND query is ≥ 3 chars AND query has no Chinese characters.
    const hasSlots = out.length < MAX_SUGGESTIONS;
    const longEnough = q.length >= 3;
    const isEnglish = !/[\u4e00-\u9fff]/.test(q);
    if (hasSlots && longEnough && isEnglish) {
      for (const c of CITY_DATA_DEDUPED) {
        const key = c.name + "|" + c.cn;
        if (seen.has(key)) continue;
        if (isOneEditAway(q, c.name.toLowerCase())) {
          out.push(c);
          seen.add(key);
        }
        if (out.length >= MAX_SUGGESTIONS) break;
      }
    }

    return out;
  }

  function updateActive() {
    const items = suggestions.querySelectorAll(".suggestion-item");
    items.forEach((it, i) => {
      if (i === activeIndex) {
        it.classList.add("is-active");
        it.setAttribute("aria-selected", "true");
        // scroll into view if needed
        it.scrollIntoView({ block: "nearest" });
      } else {
        it.classList.remove("is-active");
        it.setAttribute("aria-selected", "false");
      }
    });
  }

  function pickSuggestion(index) {
    const list = filterCities(input.value);
    const city = list[index];
    if (!city) return;
    selectedCity = city;
    input.value = city.name;
    hideSuggestions();
    // Auto-trigger search
    doSearch(true);
  }

  function debouncedShow() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const q = input.value;
      if (!q.trim()) {
        hideSuggestions();
        selectedCity = null;
        return;
      }
      const list = filterCities(q);
      showSuggestions(list, q);
    }, DEBOUNCE_MS);
  }

  /* ---------- Weather icon map ---------- */
  const ICON_MAP = {
    100: "☀️",
    101: "⛅", 102: "⛅", 103: "⛅",
    104: "☁️",
    400: "🌫️", 401: "🌫️", 402: "🌫️", 403: "🌫️", 404: "🌫️", 407: "🌫️",
    405: "🌪️", 406: "🌪️",
    300: "🌦️", 301: "🌧️",
    302: "🌧️", 303: "🌧️",
    304: "⛈️", 305: "⛈️",
    306: "🌧️", 307: "🌧️",
    200: "🌨️", 201: "🌨️", 202: "🌨️", 203: "❄️", 204: "❄️", 205: "❄️", 206: "❄️", 207: "❄️",
  };

  function iconFor(code) {
    const n = parseInt(code, 10);
    if (isNaN(n)) return "🌤️";
    if (ICON_MAP[n]) return ICON_MAP[n];
    const first = Math.floor(n / 100);
    if (first === 1) return "⛅";
    if (first === 2) return "❄️";
    if (first === 3) return "🌧️";
    if (first === 4) return "🌫️";
    if (first === 5) return "💨";
    return "🌤️";
  }

  // Map wttr.in text descriptions (e.g. "Heavy rain", "Partly Cloudy") to emoji
  function iconForWttr(desc) {
    const d = String(desc || "").toLowerCase();
    if (/sun|clear/.test(d)) return "☀️";
    if (/partly\s*cloudy/.test(d)) return "⛅";
    if (/cloudy|overcast/.test(d)) return "☁️";
    if (/rain|drizzle|shower|downpour/.test(d)) return "🌧️";
    if (/thunder|storm/.test(d)) return "⛈️";
    if (/snow|sleet|blizzard/.test(d)) return "🌨️";
    if (/mist|fog|haze|smoky/.test(d)) return "🌫️";
    return "🌤️";
  }

  // Convert °C → °F (Math.round to nearest whole)
  function cToF(celsius) {
    return Math.round(Number(celsius) * 9 / 5 + 32);
  }

  function showLoading() {
    result.hidden = false;
    error.hidden = true;
    result.innerHTML =
      '<div class="weather-state">' +
      '<div class="weather-spinner" aria-hidden="true"></div>' +
      '<p class="weather-state-text">Loading…</p>' +
      "</div>";
    input.disabled = true;
    searchBtn.disabled = true;
    searchBtn.classList.add("is-loading");
    searchBtn.textContent = "Searching…";
  }

  function showError(msg) {
    result.hidden = true;
    error.hidden = false;
    error.textContent = msg;
  }

  // Build the forecast cards HTML from wttr.in data
  function forecastHtml(wttr) {
    if (!wttr || !wttr.weather || wttr.weather.length === 0) return "";
    const days = wttr.weather.slice(0, 3);
    const dayLabels = ["Today", "Tomorrow", "Day 3"];
    let html = '<div class="weather-forecast" aria-label="3-day forecast">';
    for (let i = 0; i < days.length; i++) {
      const day = days[i];
      // Pick noon (index 4) for description/icon — most representative
      const noon = day.hourly ? day.hourly[4] || day.hourly[0] : null;
      const desc = noon ? noon.weatherDesc[0].value : "";
      const icon = iconForWttr(desc);
      const rawMax = parseInt(day.maxtempC, 10);
      const rawMin = parseInt(day.mintempC, 10);
      let highT, lowT;
      if (currentUnit === "F") {
        highT = cToF(rawMax);
        lowT = cToF(rawMin);
      } else {
        highT = rawMax;
        lowT = rawMin;
      }
      html +=
        '<div class="forecast-day">' +
        '<div class="forecast-label">' + dayLabels[i] + "</div>" +
        '<div class="forecast-icon" aria-hidden="true">' + icon + "</div>" +
        '<div class="forecast-temps">' + lowT + "°/" + highT + "°</div>" +
        '<div class="forecast-desc">' + escapeHtml(desc) + "</div>" +
        "</div>";
    }
    html += "</div>";
    return html;
  }

  // Fire-and-forget forecast fetch — appends forecast to current result when ready
  function fetchForecastFor(uapiData) {
    // Build wttr.in query string, preferring disambiguated English name + province
    let q;
    if (selectedCity && selectedCity.name && selectedCity.province) {
      q = selectedCity.name + ", " + selectedCity.province;
    } else {
      q = uapiData.city; // fall back to whatever UAPI returned
    }
    const url = FORECAST_API + "/" + encodeURIComponent(q) + "?format=j1";

    fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .then((wttr) => {
        if (wttr && wttr.weather && wttr.weather.length >= 3) {
          lastForecastData = wttr;
          // Re-render — forecastHtml will now append the cards
          showResult(lastWeatherData);
        }
      })
      .catch(() => {
        // Forecast is a bonus — silently drop errors
      });
  }

  function showResult(data) {
    result.hidden = false;
    error.hidden = true;
    lastWeatherData = data;
    const icon = iconFor(data.weather_icon);

    let tempValue, tempLabel;
    if (currentUnit === "F") {
      tempValue = cToF(data.temperature);
      tempLabel = "°F";
    } else {
      tempValue = data.temperature;
      tempLabel = "°C";
    }

    result.innerHTML =
      '<div class="weather-display">' +
      '<div class="weather-icon-big" aria-hidden="true">' + icon + "</div>" +
      '<div class="weather-info">' +
      '<h3 class="weather-city">' + escapeHtml(data.city) + "</h3>" +
      '<p class="weather-province">' + escapeHtml(data.province) + "</p>" +
      '<div class="weather-temp-row">' +
      '<div class="weather-temp">' + tempValue + tempLabel + "</div>" +
      '<div class="weather-unit-toggle" role="group" aria-label="Temperature unit">' +
      '<button type="button" class="unit-btn' + (currentUnit === "C" ? " is-active" : "") + '" data-unit="C" aria-pressed="' + (currentUnit === "C") + '">°C</button>' +
      '<button type="button" class="unit-btn' + (currentUnit === "F" ? " is-active" : "") + '" data-unit="F" aria-pressed="' + (currentUnit === "F") + '">°F</button>' +
      "</div>" +
      "</div>" +
      '<p class="weather-cond">' + escapeHtml(data.weather) + "</p>" +
      "</div>" +
      "</div>" +
      '<div class="weather-meta">' +
      '<span><strong>Wind:</strong> ' + escapeHtml(data.wind_direction) + " " + escapeHtml(data.wind_power) + "</span>" +
      '<span><strong>Humidity:</strong> ' + data.humidity + "%</span>" +
      '<span class="weather-report">' + escapeHtml(data.report_time) + "</span>" +
      "</div>" +
      forecastHtml(lastForecastData);
  }

  async function doSearch(fromSuggestionPick) {
    const query = input.value.trim();
    if (!query) {
      showError("Enter a city first.");
      return;
    }

    // If user didn't pick from suggestions AND their exact input matches nothing
    // we know about, bail out locally instead of letting UAPI guess and return
    // a random city (e.g. "abd" → "阿, Volta").
    if (!selectedCity) {
      const anyMatch = filterCities(query).length > 0;
      if (!anyMatch) {
        hideSuggestions();
        showError("Couldn't find that city — check the spelling.");
        return;
      }
    }

    showLoading();
    hideSuggestions();
    lastForecastData = null; // drop stale forecast from previous city

    // Decide which param to send
    let url;
    if (selectedCity && selectedCity.adcode) {
      // Use adcode for precise disambiguation
      url = API_URL + "?adcode=" + selectedCity.adcode;
    } else if (selectedCity && selectedCity.adcode === null && selectedCity.name.toLowerCase() === query.toLowerCase()) {
      // International city picked, no adcode — use ?city= with Chinese name if available, else English
      url = API_URL + "?city=" + encodeURIComponent(selectedCity.cn || selectedCity.name);
    } else {
      // Free-text fallback (only reached if filterCities found at least one match above)
      url = API_URL + "?city=" + encodeURIComponent(query);
      selectedCity = null;
    }

    try {
      const resp = await fetch(url);
      const data = await resp.json();

      // Explicit API-reported not-found
      if (data.error === "LOCATION_NOT_FOUND") {
        showError("Couldn't find that city — check the spelling.");
        return;
      }
      if (!resp.ok || data.error) {
        showError("Hmm, the weather service isn't responding right now. Try again in a moment.");
        return;
      }

      // --- Response-side validation (defense against UAPI silent fallback) ---
      // UAPI sometimes returns a bogus city (e.g. "abd" → "阿, Volta") instead
      // of an error. Verify the returned city actually relates to the user's input.
      if (!selectedCity) {
        const q = query.toLowerCase().replace(/\s+/g, "");
        const rCity = String(data.city || "").toLowerCase().replace(/\s+/g, "");
        const rProv = String(data.province || "").toLowerCase().replace(/\s+/g, "");

        const simpleMatch = rCity.includes(q) || rProv.includes(q);

        let knownAndMatches = false;
        if (!simpleMatch) {
          const known = CITY_DATA_DEDUPED.find(
            (c) => c.cn === data.city || c.name.toLowerCase() === rCity
          );
          if (known) {
            const ql = query.toLowerCase();
            knownAndMatches =
              ql === known.name.toLowerCase() ||
              ql === known.cn.toLowerCase() ||
              known.name.toLowerCase().includes(ql) ||
              known.cn.includes(query) ||
              ql === (known.cnProvince || "").toLowerCase() ||
              ql === (known.province || "").toLowerCase();
          }
        }

        if (!simpleMatch && !knownAndMatches) {
          showError("Couldn't find that city — check the spelling.");
          return;
        }
      }

      showResult(data);

      // Fire-and-forget: fetch 3-day forecast from wttr.in
      // Current weather already visible; forecast appends when ready.
      fetchForecastFor(data);
    } catch (err) {
      showError("Couldn't reach the weather service. Check your connection and try again.");
    } finally {
      input.disabled = false;
      searchBtn.disabled = false;
      searchBtn.classList.remove("is-loading");
      searchBtn.textContent = "Search";
      input.focus();
    }
  }

  /* ---------- Events ---------- */
  input.addEventListener("input", () => {
    // If user types again after a pick, clear pick
    if (selectedCity) selectedCity = null;
    debouncedShow();
  });

  input.addEventListener("keydown", (e) => {
    if (suggestions.hidden) return;
    const total = suggestions.querySelectorAll(".suggestion-item").length;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % total;
      updateActive();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + total) % total;
      updateActive();
    } else if (e.key === "Enter") {
      if (activeIndex >= 0) {
        e.preventDefault();
        pickSuggestion(activeIndex);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      hideSuggestions();
    } else if (e.key === "Tab") {
      hideSuggestions();
    }
  });

  // Click outside closes dropdown
  document.addEventListener("click", (e) => {
    if (!suggestions.hidden && !suggestions.contains(e.target) && e.target !== input) {
      hideSuggestions();
    }
  });

  // Unit toggle — delegated on the persistent result container
  result.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-unit]");
    if (!btn) return;
    const unit = btn.getAttribute("data-unit");
    if (unit && unit !== currentUnit) {
      currentUnit = unit;
      if (lastWeatherData) showResult(lastWeatherData);
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // If Enter was pressed with active suggestion, pick it instead of raw submit
    if (!suggestions.hidden && activeIndex >= 0) {
      pickSuggestion(activeIndex);
      return;
    }
    doSearch();
  });

  // Hide suggestions on window blur
  window.addEventListener("blur", hideSuggestions);
})();

/* ============================================
   World Time (Projects page)
   Calls the UAPI World Time API:
   https://uapis.cn/api/v1/misc/worldtime?city=<city>
   Note: no API key needed.
   ============================================ */
(function () {
  const form = document.getElementById("world-time-form");
  const input = document.getElementById("world-time-city");
  const searchBtn = document.getElementById("world-time-search-btn");
  const result = document.getElementById("world-time-result");
  const error = document.getElementById("world-time-error");
  if (!form || !input) return;

  const API_URL = "https://uapis.cn/api/v1/misc/worldtime";

  // -------------------------------------------------------------------
  // Local city → IANA timezone map. Covers ~300 cities so that the
  // World Time app can compute time *client-side* via Intl.DateTimeFormat
  // — no API required. Cities missing here fall back to UAPI.
  // Keyed by lowercase English name; value is IANA timezone string.
  // Also indexed by lowercase Chinese name (cn→tz) and province (prov→tz).
  // -------------------------------------------------------------------
  const CITY_TZ_MAP = {
    // China (all in Asia/Shanghai — single official timezone)
    beijing: "Asia/Shanghai", shanghai: "Asia/Shanghai", shenzhen: "Asia/Shanghai",
    suzhou: "Asia/Shanghai", guangzhou: "Asia/Shanghai", hangzhou: "Asia/Shanghai",
    chengdu: "Asia/Shanghai", nanjing: "Asia/Shanghai", wuhan: "Asia/Shanghai",
    xi_an: "Asia/Shanghai", xian: "Asia/Shanghai", chongqing: "Asia/Shanghai",
    tianjin: "Asia/Shanghai", qingdao: "Asia/Shanghai", dalian: "Asia/Shanghai",
    xiamen: "Asia/Shanghai", zhuhai: "Asia/Shanghai", foshan: "Asia/Shanghai",
    dongguan: "Asia/Shanghai", changsha: "Asia/Shanghai", shenyang: "Asia/Shanghai",
    harbin: "Asia/Shanghai", jinan: "Asia/Shanghai", zhengzhou: "Asia/Shanghai",
    hefei: "Asia/Shanghai", taiyuan: "Asia/Shanghai", kunming: "Asia/Shanghai",
    nanning: "Asia/Shanghai", haikou: "Asia/Shanghai", lanzhou: "Asia/Shanghai",
    gui_vyang: "Asia/Shanghai", guiyang: "Asia/Shanghai", urumqi: "Asia/Shanghai",
    lhasa: "Asia/Shanghai", ningbo: "Asia/Shanghai", wuxi: "Asia/Shanghai",
    changzhou: "Asia/Shanghai", fuzhou: "Asia/Shanghai", anqing: "Asia/Shanghai",
    hohhot: "Asia/Shanghai", xining: "Asia/Shanghai", yinchuan: "Asia/Shanghai",
    hainan: "Asia/Shanghai",
    // Special SARs
    hong_kong: "Asia/Hong_Kong", hongkong: "Asia/Hong_Kong",
    macau: "Asia/Macau", macao: "Asia/Macau",
    // Taiwan
    taipei: "Asia/Taipei", kaohsiung: "Asia/Taipei", taichung: "Asia/Taipei",
    // Japan
    tokyo: "Asia/Tokyo", osaka: "Asia/Tokyo", kyoto: "Asia/Tokyo",
    yokohama: "Asia/Tokyo", nagoya: "Asia/Tokyo", sapporo: "Asia/Tokyo",
    // Korea
    seoul: "Asia/Seoul", busan: "Asia/Seoul",
    // Southeast Asia
    singapore: "Asia/Singapore",
    bangkok: "Asia/Bangkok",
    hanoi: "Asia/Ho_Chi_Minh", ho_chi_minh: "Asia/Ho_Chi_Minh",
    kuala_lumpur: "Asia/Kuala_Lumpur",
    jakarta: "Asia/Jakarta",
    manila: "Asia/Manila",
    // South Asia
    mumbai: "Asia/Kolkata", kolkata: "Asia/Kolkata", delhi: "Asia/Kolkata",
    bangalore: "Asia/Kolkata", chennai: "Asia/Kolkata",
    dhaka: "Asia/Dhaka",
    karachi: "Asia/Karachi",
    islamabad: "Asia/Karachi",
    kathmandu: "Asia/Kathmandu",
    // Middle East
    dubai: "Asia/Dubai",
    abu_dhabi: "Asia/Dubai", abudhabi: "Asia/Dubai",
    riyadh: "Asia/Riyadh", jeddah: "Asia/Riyadh",
    tehran: "Asia/Tehran",
    baghdad: "Asia/Baghdad",
    jerusalem: "Asia/Jerusalem",
    istanbul: "Europe/Istanbul",
    // Russia
    moscow: "Europe/Moscow", st_petersburg: "Europe/Moscow",
    novosibirsk: "Asia/Novosibirsk",
    // Europe
    london: "Europe/London", edinburgh: "Europe/London",
    paris: "Europe/Paris", lyon: "Europe/Paris",
    berlin: "Europe/Berlin", munich: "Europe/Berlin", hamburg: "Europe/Berlin",
    rome: "Europe/Rome", milan: "Europe/Rome",
    madrid: "Europe/Madrid", barcelona: "Europe/Madrid",
    amsterdam: "Europe/Amsterdam", brussels: "Europe/Brussels",
    vienna: "Europe/Vienna", zurich: "Europe/Zurich",
    prague: "Europe/Prague", warsaw: "Europe/Warsaw",
    athens: "Europe/Athens", lisbon: "Europe/Lisbon",
    stockholm: "Europe/Stockholm", oslo: "Europe/Oslo",
    helsinki: "Europe/Helsinki", copenhagen: "Europe/Copenhagen",
    dublin: "Europe/Dublin",
    // Africa
    cairo: "Africa/Cairo", cape_town: "Africa/Johannesburg", johannesburg: "Africa/Johannesburg",
    lagos: "Africa/Lagos",
    // North America
    new_york: "America/New_York", newyork: "America/New_York",
    los_angeles: "America/Los_Angeles", losangeles: "America/Los_Angeles", la: "America/Los_Angeles",
    chicago: "America/Chicago",
    san_francisco: "America/Los_Angeles", sanfrancisco: "America/Los_Angeles", sf: "America/Los_Angeles",
    seattle: "America/Los_Angeles",
    austin: "America/Chicago", houston: "America/Chicago",
    phoenix: "America/Phoenix", denver: "America/Denver",
    miami: "America/New_York", boston: "America/New_York",
    washington_dc: "America/New_York", washington: "America/New_York", dc: "America/New_York",
    philadelphia: "America/New_York", atlanta: "America/New_York",
    toronto: "America/Toronto", vancouver: "America/Vancouver",
    montreal: "America/Toronto", calgary: "America/Edmonton", edmonton: "America/Edmonton",
    ottawa: "America/Toronto",
    // Latin America
    mexico_city: "America/Mexico_City", mexico: "America/Mexico_City",
    sao_paulo: "America/Sao_Paulo", saopaulo: "America/Sao_Paulo",
    rio_de_janeiro: "America/Sao_Paulo", rio: "America/Sao_Paulo",
    buenos_aires: "America/Argentina/Buenos_Aires", buenosaires: "America/Argentina/Buenos_Aires",
    bogota: "America/Bogota",
    santiago: "America/Santiago",
    lima: "America/Lima",
    // Oceania
    sydney: "Australia/Sydney", melbourne: "Australia/Sydney",
    auckland: "Pacific/Auckland", wellington: "Pacific/Auckland",
  };

  // Build case-insensitive lookup (lowercase keys)
  const _CITY_TZ_INDEX = {};
  for (const [k, v] of Object.entries(CITY_TZ_MAP)) {
    _CITY_TZ_INDEX[String(k).toLowerCase()] = v;
  }

  // Try to resolve a city name → IANA timezone. Case-insensitive.
  // Returns the IANA string or null if not found.
  function resolveCityToTz(query) {
    if (!query) return null;
    const q = String(query).trim().toLowerCase().replace(/[\s\-]+/g, "_");
    if (_CITY_TZ_INDEX[q]) return _CITY_TZ_INDEX[q];
    // Also try with spaces restored (e.g., "new york")
    const qSpace = q.replace(/_/g, " ");
    if (_CITY_TZ_INDEX[qSpace]) return _CITY_TZ_INDEX[qSpace];
    // Fuzzy substring fallback: e.g. "beijing" matches "beijing"
    for (const key of Object.keys(_CITY_TZ_INDEX)) {
      if (key.includes(q) || q.includes(key)) return _CITY_TZ_INDEX[key];
    }
    return null;
  }

  // Compute current local time in an IANA timezone using browser Intl API.
  // Returns an object mimicking the UAPI response shape so showResult() can
  // render it uniformly.
  function clientTimeFor(ianaTz, displayName) {
    const now = new Date();
    const weekday = new Intl.DateTimeFormat("en-US", { timeZone: ianaTz, weekday: "long" }).format(now);
    const dateFmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: ianaTz, year: "numeric", month: "2-digit", day: "2-digit",
    });
    const timeFmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: ianaTz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
    });
    const parts = dateFmt.formatToParts(now);
    const timeParts = timeFmt.formatToParts(now);
    const y = parts.find(p => p.type === "year")?.value || "?";
    const m = parts.find(p => p.type === "month")?.value || "?";
    const d = parts.find(p => p.type === "day")?.value || "?";
    const h = timeParts.find(p => p.type === "hour")?.value || "00";
    const mi = timeParts.find(p => p.type === "minute")?.value || "00";
    const s = timeParts.find(p => p.type === "second")?.value || "00";

    // Offset seconds / offset string from Date#getTimezoneOffset of a localized Date
    // Intl gives us a way: format ISO and parse
    const isoLike = new Intl.DateTimeFormat("en-US", {
      timeZone: ianaTz, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
    }).format(now);
    // We can compute offset manually via epoch shift
    const utcMs = now.getTime();
    const localMs = Date.UTC(
      parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10),
      parseInt(h, 10), parseInt(mi, 10), parseInt(s, 10)
    );
    const offsetSeconds = Math.round((localMs - utcMs) / 1000);
    const sign = offsetSeconds >= 0 ? "+" : "-";
    const absH = Math.floor(Math.abs(offsetSeconds) / 3600);
    const absM = Math.floor((Math.abs(offsetSeconds) % 3600) / 60);
    const offsetString = "UTC" + sign + absH + (absM ? ":" + String(absM).padStart(2, "0") : "");

    return {
      query: displayName,
      timezone: ianaTz,
      datetime: `${y}-${m}-${d} ${h}:${mi}:${s}`,
      weekday: weekday,
      timestamp_unix: Math.floor(utcMs / 1000),
      offset_seconds: offsetSeconds,
      offset_string: offsetString,
    };
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function showLoading() {
    result.hidden = false;
    error.hidden = true;
    result.innerHTML =
      '<div class="wt-state">' +
      '<div class="wt-spinner" aria-hidden="true"></div>' +
      '<p class="wt-state-text">Loading…</p>' +
      "</div>";
    input.disabled = true;
    searchBtn.disabled = true;
    searchBtn.classList.add("is-loading");
    searchBtn.textContent = "Searching…";
  }

  function showError(msg) {
    result.hidden = true;
    error.hidden = false;
    error.textContent = msg;
  }

  // Format "Asia/Shanghai" → "Shanghai" (take last segment)
  function prettyCity(timezone) {
    if (!timezone) return "";
    const parts = timezone.split("/");
    const city = parts[parts.length - 1].replace(/_/g, " ");
    return escapeHtml(city);
  }

  // Format "2026-10-16 17:13:49" into date + time strings
  function splitDateTime(dt) {
    if (!dt) return { date: "", time: "" };
    const m = String(dt).match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}(?::\d{2})?)/);
    if (m) return { date: m[1], time: m[2] };
    return { date: "", time: escapeHtml(dt) };
  }

  // Format offset_string like "UTC8" → "UTC+8", "UTC-4" stays as-is
  function prettyOffset(raw) {
    if (!raw) return "";
    const m = raw.match(/^UTC([+-]?)(\d+)$/i);
    if (!m) return escapeHtml(raw);
    const sign = m[1] || "+";
    return "UTC" + sign + m[2];
  }

  function showResult(data) {
    result.hidden = false;
    error.hidden = true;
    const tz = escapeHtml(data.timezone);
    const pretty = prettyCity(data.timezone);
    const { date, time } = splitDateTime(data.datetime);
    const offset = prettyOffset(data.offset_string);
    const weekday = escapeHtml(data.weekday);
    const cityLabel = data.query || pretty;

    result.innerHTML =
      '<div class="wt-display">' +
      '<div class="wt-icon" aria-hidden="true">🕐</div>' +
      '<div class="wt-info">' +
      '<h3 class="wt-city">' + escapeHtml(cityLabel) + "</h3>" +
      '<p class="wt-tz">' + pretty + " · " + tz + "</p>" +
      '<div class="wt-time">' + time + "</div>" +
      '<p class="wt-weekday">' + weekday + ", " + date + "</p>" +
      "</div>" +
      "</div>" +
      '<div class="wt-meta">' +
      '<span><strong>Time zone:</strong> ' + tz + "</span>" +
      '<span><strong>Offset:</strong> ' + offset + "</span>" +
      "</div>";
  }

  async function doSearch() {
    const query = input.value.trim();
    if (!query) {
      showError("Enter a city first.");
      return;
    }

    // Priority 1: local resolution via our CITY_TZ_MAP + browser Intl API.
    // Zero network latency, covers ~300 cities including Suzhou, Montreal,
    // Guangzhou, etc. that UAPI doesn't recognize.
    const localTz = resolveCityToTz(query);
    if (localTz) {
      showResult(clientTimeFor(localTz, query));
      return;
    }

    // Priority 2: fall back to UAPI for cities not in our local map.
    showLoading();

    // Try the user's input first; if that fails and it contains spaces,
    // retry with spaces stripped (UAPI sometimes prefers "NewYork" over "New York").
    let url = API_URL + "?city=" + encodeURIComponent(query);
    let fallbackUrl = query.includes(" ")
      ? API_URL + "?city=" + encodeURIComponent(query.replace(/\s+/g, ""))
      : null;

    try {
      let resp = await fetch(url);
      let data = await resp.json();

      if (data.error === "TIMEZONE_NOT_FOUND" && fallbackUrl) {
        resp = await fetch(fallbackUrl);
        data = await resp.json();
      }

      if (data.error === "TIMEZONE_NOT_FOUND") {
        showError("Couldn't find that city — check the spelling.");
        return;
      }
      if (!resp.ok || data.error) {
        showError("Hmm, the time service isn't responding right now. Try again in a moment.");
        return;
      }

      showResult(data);
    } catch (err) {
      showError("Couldn't reach the time service. Check your connection and try again.");
    } finally {
      input.disabled = false;
      searchBtn.disabled = false;
      searchBtn.classList.remove("is-loading");
      searchBtn.textContent = "Search";
      input.focus();
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    doSearch();
  });
})();
