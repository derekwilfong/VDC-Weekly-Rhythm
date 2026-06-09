const STORAGE_PREFIX = "vdcPlannerTasks_";
const LEGACY_STORAGE_KEY = "vdc-weekly-planner-tasks";
const LEGACY_MIGRATION_KEY = "vdcPlannerLegacyMigrationComplete";

const days = [
  { id: "mon", name: "Mon", label: "Model Health + Planning", focus: "ORIENT & SYNC" },
  { id: "tue", name: "Tue", label: "Trade Coordination", focus: "RESOLVE CLASHES" },
  { id: "wed", name: "Wed", label: "Thursday Prep", focus: "PACKAGE & PRESENT" },
  { id: "thu", name: "Thu", label: "Coordination Meeting", focus: "ALIGN ALL TRADES" },
  { id: "fri", name: "Fri", label: "Closeout + Momentum", focus: "CLOSE WEEK CLEAN" }
];

const projects = ["Internal", "NTT HI3", "PHX", "Hillsboro", "Personal"];
const statuses = ["Not Started", "In Progress", "Waiting", "Complete"];
const timeOptions = createTimeOptions();
const today = new Date();
let currentWeekStart = getMonday(today);

const defaultTasks = [
  {
    id: "task-001",
    day: "mon",
    startTime: "7:30 AM",
    endTime: "8:00 AM",
    title: "Weekly Kickoff Review",
    detail: "Review open RFIs, submittals, and outstanding coordination items from prior week. Reprioritize backlog.",
    priority: "med",
    category: "coord",
    project: "Internal",
    status: "Not Started"
  },
  {
    id: "task-002",
    day: "mon",
    startTime: "8:00 AM",
    endTime: "10:00 AM",
    title: "BIM Model Audit",
    detail: "Run Navisworks clash detection. Review new model uploads from trade partners. Flag unresolved clashes for Thursday agenda.",
    priority: "high",
    category: "bim",
    project: "PHX",
    status: "In Progress"
  },
  {
    id: "task-003",
    day: "mon",
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    title: "ACC / Build Triage",
    detail: "Review Autodesk Build issues dashboard. Update issue status, assign owners, check overdue items for PHX projects.",
    priority: "med",
    category: "acc",
    project: "PHX",
    status: "Waiting"
  },
  {
    id: "task-004",
    day: "mon",
    startTime: "1:00 PM",
    endTime: "3:00 PM",
    title: "Submittal Log Review",
    detail: "Check submittal register for MEP, structural, and long-lead equipment. Flag items pending engineer review or resubmittal.",
    priority: "low",
    category: "doc",
    project: "NTT HI3",
    status: "Not Started"
  },
  {
    id: "task-005",
    day: "mon",
    startTime: "3:00 PM",
    endTime: "4:30 PM",
    title: "Zone Coordination Prep",
    detail: "Review trade zone assignments and spatial sequences. Identify potential congestion areas in critical MEP corridors and white space.",
    priority: "low",
    category: "bim",
    project: "Hillsboro",
    status: "Not Started"
  },
  {
    id: "task-006",
    day: "tue",
    startTime: "8:00 AM",
    endTime: "9:30 AM",
    title: "MEP Clash Review",
    detail: "Work through high-priority clash groups - mechanical vs. electrical, structural penetrations, pipe/conduit routing in raised floor zones.",
    priority: "high",
    category: "bim",
    project: "NTT HI3",
    status: "In Progress"
  },
  {
    id: "task-007",
    day: "tue",
    startTime: "9:30 AM",
    endTime: "11:00 AM",
    title: "RFI Drafting & Response",
    detail: "Draft RFIs for unresolvable coordination conflicts. Route to GC/EOR. Review incoming RFI responses and update model accordingly.",
    priority: "high",
    category: "rfi",
    project: "PHX",
    status: "Waiting"
  },
  {
    id: "task-008",
    day: "tue",
    startTime: "11:00 AM",
    endTime: "12:00 PM",
    title: "Trade Partner Check-ins",
    detail: "Bilateral calls with electrical, mechanical, or plumbing subs. Confirm model update schedule. Address blockers before Thursday.",
    priority: "med",
    category: "coord",
    project: "Hillsboro",
    status: "Not Started"
  },
  {
    id: "task-009",
    day: "tue",
    startTime: "1:00 PM",
    endTime: "3:00 PM",
    title: "Spec vs. Model QC",
    detail: "Cross-check BIM elements against current spec set and approved submittals. Flag discrepancies in equipment sizing, clearances, or routing.",
    priority: "med",
    category: "doc",
    project: "NTT HI3",
    status: "Not Started"
  },
  {
    id: "task-010",
    day: "tue",
    startTime: "3:00 PM",
    endTime: "4:30 PM",
    title: "4D Sequence Check",
    detail: "Review construction sequencing against schedule milestones. Confirm structural steel, rough-in, and equipment delivery alignment.",
    priority: "low",
    category: "bim",
    project: "Internal",
    status: "Not Started"
  },
  {
    id: "task-011",
    day: "wed",
    startTime: "8:00 AM",
    endTime: "9:30 AM",
    title: "Clash Report Packaging",
    detail: "Export clean clash reports from Navisworks. Capture annotated screenshots. Organize by trade package and system priority for meeting deck.",
    priority: "high",
    category: "bim",
    project: "PHX",
    status: "In Progress"
  },
  {
    id: "task-012",
    day: "wed",
    startTime: "9:30 AM",
    endTime: "11:00 AM",
    title: "Coordination Issue Log",
    detail: "Update master coordination log in ACC/Build. Assign statuses: open, in review, resolved, on hold. Ensure all items have owners and due dates.",
    priority: "high",
    category: "acc",
    project: "NTT HI3",
    status: "Waiting"
  },
  {
    id: "task-013",
    day: "wed",
    startTime: "11:00 AM",
    endTime: "12:00 PM",
    title: "Meeting Agenda Build",
    detail: "Draft Thursday agenda. Prioritize: open clashes, RFI status, model update deadlines, field-to-model conflicts, schedule risk items.",
    priority: "high",
    category: "coord",
    project: "Internal",
    status: "Not Started"
  },
  {
    id: "task-014",
    day: "wed",
    startTime: "1:00 PM",
    endTime: "2:30 PM",
    title: "Field Walkdown Review",
    detail: "Review field observation reports and photos. Check installed conditions vs. coordinated model. Document deviations for as-built tracking.",
    priority: "med",
    category: "field",
    project: "Hillsboro",
    status: "Not Started"
  },
  {
    id: "task-015",
    day: "wed",
    startTime: "2:30 PM",
    endTime: "4:30 PM",
    title: "Coordination Deck / Visuals",
    detail: "Prepare Navisworks viewpoints, 3D sections, and annotated plan views for meeting presentation. Ensure all attendees have pre-read access in ACC.",
    priority: "med",
    category: "doc",
    project: "Internal",
    status: "Not Started"
  },
  {
    id: "task-016",
    day: "thu",
    startTime: "7:30 AM",
    endTime: "8:00 AM",
    title: "Pre-Meeting Setup",
    detail: "Final model sync. Confirm all trades have uploaded latest files. Load Navisworks federated model. Test screen share and viewpoints.",
    priority: "high",
    category: "bim",
    project: "Internal",
    status: "Not Started"
  },
  {
    id: "task-017",
    day: "thu",
    startTime: "8:00 AM",
    endTime: "10:30 AM",
    title: "VDC Coordination Meeting",
    detail: "All-trades coordination session. Work through agenda: clash resolution, RFI status, model update commitments, schedule impacts, field conflicts.",
    priority: "meeting",
    category: "coord",
    project: "NTT HI3",
    status: "In Progress"
  },
  {
    id: "task-018",
    day: "thu",
    startTime: "10:30 AM",
    endTime: "11:30 AM",
    title: "Meeting Minutes + Action Log",
    detail: "Publish meeting minutes within 1-2 hours. Update action item log with owners and deadlines. Distribute via ACC/email to all trades.",
    priority: "high",
    category: "doc",
    project: "Internal",
    status: "Not Started"
  },
  {
    id: "task-019",
    day: "thu",
    startTime: "1:00 PM",
    endTime: "2:30 PM",
    title: "Post-Meeting Model Updates",
    detail: "Implement immediate resolutions from meeting. Update clash waivers, issue statuses, and model notes while decisions are fresh.",
    priority: "med",
    category: "bim",
    project: "PHX",
    status: "Not Started"
  },
  {
    id: "task-020",
    day: "thu",
    startTime: "2:30 PM",
    endTime: "4:00 PM",
    title: "RFI / Submittal Follow-Up",
    detail: "Send follow-up on any RFIs or submittals discussed in meeting. Escalate items flagged as schedule-critical to PM/superintendent.",
    priority: "low",
    category: "rfi",
    project: "Hillsboro",
    status: "Waiting"
  },
  {
    id: "task-021",
    day: "fri",
    startTime: "8:00 AM",
    endTime: "9:30 AM",
    title: "Model Update Verification",
    detail: "Confirm all trade model updates committed on Thursday have been uploaded to ACC. Re-run clash detection on updated files.",
    priority: "high",
    category: "bim",
    project: "NTT HI3",
    status: "Not Started"
  },
  {
    id: "task-022",
    day: "fri",
    startTime: "9:30 AM",
    endTime: "11:00 AM",
    title: "Action Item Tracking",
    detail: "Review open action items from Thursday's log. Chase any overdue items. Update ACC issue board with current statuses.",
    priority: "med",
    category: "acc",
    project: "PHX",
    status: "In Progress"
  },
  {
    id: "task-023",
    day: "fri",
    startTime: "11:00 AM",
    endTime: "12:00 PM",
    title: "Field Coordination",
    detail: "Coordinate with superintendent on upcoming installation sequences. Confirm model sections and spool drawings are available for crew use.",
    priority: "med",
    category: "field",
    project: "Hillsboro",
    status: "Not Started"
  },
  {
    id: "task-024",
    day: "fri",
    startTime: "1:00 PM",
    endTime: "2:30 PM",
    title: "Weekly Progress Report",
    detail: "Compile VDC weekly metrics: clashes resolved, RFIs opened/closed, submittal status, model coverage percentage. Push to PM.",
    priority: "low",
    category: "doc",
    project: "Internal",
    status: "Not Started"
  },
  {
    id: "task-025",
    day: "fri",
    startTime: "2:30 PM",
    endTime: "4:00 PM",
    title: "Next Week Pre-Plan",
    detail: "Review upcoming milestones, delivery dates, and trade activities. Seed Monday's backlog. Identify early-week coordination priorities.",
    priority: "low",
    category: "coord",
    project: "Personal",
    status: "Not Started"
  }
];

let tasks = loadTasks();
let draggedTaskId = null;

const weekGrid = document.querySelector("#weekGrid");
const weekSelector = document.querySelector("#weekSelector");
const weekRange = document.querySelector("#weekRange");
const createWeekButton = document.querySelector("#createWeekButton");
const copyLastWeekButton = document.querySelector("#copyLastWeekButton");
const resetTemplateButton = document.querySelector("#resetTemplateButton");
const taskModal = document.querySelector("#taskModal");
const modalTitle = document.querySelector("#modalTitle");
const taskForm = document.querySelector("#taskForm");
const formError = document.querySelector("#formError");
const newTaskButton = document.querySelector("#newTaskButton");
const closeModalButton = document.querySelector("#closeModalButton");
const cancelModalButton = document.querySelector("#cancelModalButton");

const taskIdInput = document.querySelector("#taskId");
const taskDayInput = document.querySelector("#taskDay");
const taskStartTimeInput = document.querySelector("#taskStartTime");
const taskEndTimeInput = document.querySelector("#taskEndTime");
const taskTitleInput = document.querySelector("#taskTitle");
const taskDetailInput = document.querySelector("#taskDetail");
const taskPriorityInput = document.querySelector("#taskPriority");
const taskCategoryInput = document.querySelector("#taskCategory");
const taskProjectInput = document.querySelector("#taskProject");
const taskStatusInput = document.querySelector("#taskStatus");

populateTimeSelects();
renderWeekSelector();
updateWeekRange();
renderBoard();

newTaskButton.addEventListener("click", () => openTaskModal());
createWeekButton.addEventListener("click", createNewWeek);
copyLastWeekButton.addEventListener("click", copyLastWeek);
resetTemplateButton.addEventListener("click", resetToTemplate);
weekSelector.addEventListener("change", () => {
  saveTasks();
  currentWeekStart = parseDateKey(weekSelector.value);
  tasks = loadTasks();
  renderWeekSelector();
  updateWeekRange();
  renderBoard();
});
closeModalButton.addEventListener("click", closeTaskModal);
cancelModalButton.addEventListener("click", closeTaskModal);
taskModal.addEventListener("click", (event) => {
  if (event.target === taskModal) {
    closeTaskModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !taskModal.hidden) {
    closeTaskModal();
  }
});

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearFormError();

  if (!isEndTimeLater(taskStartTimeInput.value, taskEndTimeInput.value)) {
    showFormError("End time must be later than start time.");
    taskEndTimeInput.focus();
    return;
  }

  const formTask = {
    id: taskIdInput.value || createTaskId(),
    day: taskDayInput.value,
    startTime: taskStartTimeInput.value,
    endTime: taskEndTimeInput.value,
    title: taskTitleInput.value.trim(),
    detail: taskDetailInput.value.trim(),
    priority: taskPriorityInput.value,
    category: taskCategoryInput.value,
    project: taskProjectInput.value,
    status: taskStatusInput.value
  };

  const existingTaskIndex = tasks.findIndex((task) => task.id === formTask.id);

  if (existingTaskIndex >= 0) {
    tasks[existingTaskIndex] = formTask;
  } else {
    tasks.push(formTask);
  }

  saveTasks();
  renderBoard();
  closeTaskModal();
});

function renderBoard() {
  weekGrid.innerHTML = "";

  days.forEach((day) => {
    const dayColumn = document.createElement("section");
    dayColumn.className = "day-col";
    dayColumn.dataset.day = day.id;

    dayColumn.innerHTML = `
      <div class="day-header">
        <div class="day-name">${escapeHtml(day.name)}</div>
        <div class="day-label">${escapeHtml(day.label)}</div>
      </div>
      <div class="day-focus">${escapeHtml(day.focus)}</div>
      <div class="task-list" data-day="${day.id}" aria-label="${escapeHtml(day.name)} tasks"></div>
    `;

    const taskList = dayColumn.querySelector(".task-list");
    getTasksForDay(day.id).forEach((task) => {
      taskList.appendChild(createTaskCard(task));
    });

    attachListDragEvents(taskList);
    weekGrid.appendChild(dayColumn);
  });

  renderEmptyStates();
  updateMeetingDayStyles();
}

function getTasksForDay(dayId) {
  return tasks.filter((task) => task.day === dayId);
}

function createTaskCard(task) {
  const card = document.createElement("article");
  card.className = `task-block priority-${task.priority}`;
  card.dataset.taskId = task.id;
  card.draggable = true;

  card.innerHTML = `
    <div class="task-time">${escapeHtml(task.startTime)} &ndash; ${escapeHtml(task.endTime)}</div>
    <div class="task-title">${escapeHtml(task.title)}</div>
    <div class="task-detail">${escapeHtml(task.detail)}</div>
    <div class="task-meta">
      <span>${escapeHtml(task.project)}</span>
      <span>${escapeHtml(task.status)}</span>
    </div>
    <div class="task-footer">
      <span class="tag tag-${escapeHtml(task.category)}">${escapeHtml(getCategoryLabel(task.category))}</span>
      <div class="task-actions">
        <button class="task-action edit" type="button" data-action="edit">Edit</button>
        <button class="task-action delete" type="button" data-action="delete">Delete</button>
      </div>
    </div>
  `;

  card.addEventListener("dragstart", () => {
    draggedTaskId = task.id;
    card.classList.add("dragging");
  });

  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");
    document.querySelectorAll(".task-list").forEach((list) => list.classList.remove("drag-over"));
    syncTasksFromDom();
    draggedTaskId = null;
  });

  card.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const action = button.dataset.action;

    if (action === "edit") {
      openTaskModal(task.id);
    }

    if (action === "delete") {
      deleteTask(task.id);
    }
  });

  return card;
}

function attachListDragEvents(taskList) {
  taskList.addEventListener("dragover", (event) => {
    event.preventDefault();

    const draggingCard = document.querySelector(".task-block.dragging");
    if (!draggingCard) return;

    taskList.classList.add("drag-over");

    const afterElement = getDragAfterElement(taskList, event.clientY);
    const emptyState = taskList.querySelector(".empty-day");

    if (emptyState) {
      emptyState.remove();
    }

    if (!afterElement) {
      taskList.appendChild(draggingCard);
    } else {
      taskList.insertBefore(draggingCard, afterElement);
    }
  });

  taskList.addEventListener("dragleave", () => {
    taskList.classList.remove("drag-over");
  });

  taskList.addEventListener("drop", (event) => {
    event.preventDefault();
    taskList.classList.remove("drag-over");
    syncTasksFromDom();
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".task-block:not(.dragging)")
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      }

      return closest;
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

function syncTasksFromDom() {
  const taskById = new Map(tasks.map((task) => [task.id, task]));
  const orderedTasks = [];

  document.querySelectorAll(".task-list").forEach((taskList) => {
    const day = taskList.dataset.day;

    taskList.querySelectorAll(".task-block").forEach((card) => {
      const task = taskById.get(card.dataset.taskId);

      if (task) {
        orderedTasks.push({
          ...task,
          day
        });
      }
    });
  });

  tasks = orderedTasks;
  saveTasks();
  renderEmptyStates();
  updateMeetingDayStyles();
}

function updateMeetingDayStyles() {
  document.querySelectorAll(".day-col").forEach((dayColumn) => {
    const day = dayColumn.dataset.day;
    const dayHeader = dayColumn.querySelector(".day-header");
    const existingBadge = dayHeader.querySelector(".meeting-badge");
    const hasMeetingTask = tasks.some((task) => task.day === day && isMeetingPriority(task.priority));

    dayHeader.classList.toggle("is-meeting", hasMeetingTask);

    if (hasMeetingTask && !existingBadge) {
      const meetingBadge = document.createElement("div");
      meetingBadge.className = "meeting-badge";
      meetingBadge.textContent = "⬡ MEETING DAY";
      dayHeader.appendChild(meetingBadge);
    }

    if (!hasMeetingTask && existingBadge) {
      existingBadge.remove();
    }
  });
}

function renderEmptyStates() {
  document.querySelectorAll(".task-list").forEach((taskList) => {
    const existingEmptyState = taskList.querySelector(".empty-day");
    const hasCards = taskList.querySelector(".task-block");

    if (existingEmptyState && hasCards) {
      existingEmptyState.remove();
    }

    if (!existingEmptyState && !hasCards) {
      const emptyState = document.createElement("div");
      emptyState.className = "empty-day";
      emptyState.textContent = "Drop task here";
      taskList.appendChild(emptyState);
    }
  });
}

function renderWeekSelector() {
  const weekKeys = getSelectableWeekKeys();

  weekSelector.innerHTML = weekKeys
    .map((weekKey) => {
      const selected = weekKey === formatDateKey(currentWeekStart) ? " selected" : "";
      return `<option value="${weekKey}"${selected}>${escapeHtml(formatWeekRange(parseDateKey(weekKey)))}</option>`;
    })
    .join("");
}

function updateWeekRange() {
  weekRange.textContent = formatWeekRange(currentWeekStart);
}

function getSelectableWeekKeys() {
  const weekKeys = new Set(getSavedWeekKeys());
  const currentKey = formatDateKey(currentWeekStart);

  weekKeys.add(currentKey);

  for (let offset = -4; offset <= 8; offset += 1) {
    weekKeys.add(formatDateKey(addDays(currentWeekStart, offset * 7)));
  }

  return [...weekKeys].sort();
}

function getSavedWeekKeys() {
  const keys = [];

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);

    if (key?.startsWith(STORAGE_PREFIX)) {
      keys.push(key.replace(STORAGE_PREFIX, ""));
    }
  }

  return keys.filter(isDateKey);
}

function loadTasksForWeek(weekStart) {
  const savedTasks = localStorage.getItem(getWeekStorageKey(weekStart));

  if (!savedTasks) {
    return null;
  }

  try {
    const parsedTasks = JSON.parse(savedTasks);

    if (!Array.isArray(parsedTasks)) {
      return null;
    }

    const migratedTasks = parsedTasks.map(normalizeTask);

    return migratedTasks.every(isValidTask) ? migratedTasks : null;
  } catch (error) {
    console.warn("Could not load saved VDC planner tasks.", error);
    return null;
  }
}

function openTaskModal(taskId) {
  const task = tasks.find((item) => item.id === taskId);

  clearFormError();
  modalTitle.textContent = task ? "Edit Task" : "New Task";
  taskIdInput.value = task?.id || "";
  taskDayInput.value = task?.day || "mon";
  taskStartTimeInput.value = task?.startTime || "8:00 AM";
  taskEndTimeInput.value = task?.endTime || "8:30 AM";
  taskTitleInput.value = task?.title || "";
  taskDetailInput.value = task?.detail || "";
  taskPriorityInput.value = task?.priority || "med";
  taskCategoryInput.value = task?.category || "bim";
  taskProjectInput.value = task?.project || "Internal";
  taskStatusInput.value = task?.status || "Not Started";

  taskModal.hidden = false;
  taskTitleInput.focus();
}

function closeTaskModal() {
  taskModal.hidden = true;
  taskForm.reset();
  taskIdInput.value = "";
  clearFormError();
}

function deleteTask(taskId) {
  const task = tasks.find((item) => item.id === taskId);
  if (!task) return;

  const shouldDelete = window.confirm(`Delete "${task.title}"?`);
  if (!shouldDelete) return;

  tasks = tasks.filter((item) => item.id !== taskId);
  saveTasks();
  renderBoard();
}

function loadTasks() {
  migrateLegacyTasksToCurrentWeek();

  const savedTasks = localStorage.getItem(getWeekStorageKey(currentWeekStart));

  if (!savedTasks) {
    return cloneTemplateTasks();
  }

  try {
    const parsedTasks = JSON.parse(savedTasks);

    if (!Array.isArray(parsedTasks)) {
      return cloneTemplateTasks();
    }

    const migratedTasks = parsedTasks.map(normalizeTask);
    const isValidTaskList = migratedTasks.every(isValidTask);

    if (isValidTaskList) {
      localStorage.setItem(getWeekStorageKey(currentWeekStart), JSON.stringify(migratedTasks));
      return migratedTasks;
    }

    return cloneTemplateTasks();
  } catch (error) {
    console.warn("Could not load saved VDC planner tasks.", error);
    return cloneTemplateTasks();
  }
}

function createNewWeek() {
  saveTasks();

  const nextWeekStart = getNextAvailableWeekStart();
  currentWeekStart = nextWeekStart;
  tasks = cloneTemplateTasks();
  saveTasks();
  renderWeekSelector();
  updateWeekRange();
  renderBoard();
}

function copyLastWeek() {
  saveTasks();

  const previousWeekStart = addDays(currentWeekStart, -7);
  const previousWeekTasks = loadTasksForWeek(previousWeekStart);

  if (!previousWeekTasks) {
    window.alert("No saved tasks were found for the previous week.");
    return;
  }

  tasks = previousWeekTasks.map((task) => ({ ...task }));
  saveTasks();
  renderWeekSelector();
  updateWeekRange();
  renderBoard();
}

function resetToTemplate() {
  const shouldReset = window.confirm("Replace this week with the default VDC template?");

  if (!shouldReset) {
    return;
  }

  tasks = cloneTemplateTasks();
  saveTasks();
  renderBoard();
}

function cloneTemplateTasks() {
  return defaultTasks.map((task) => ({ ...task }));
}

function migrateLegacyTasksToCurrentWeek() {
  const currentWeekKey = getWeekStorageKey(currentWeekStart);
  const legacyTasks = localStorage.getItem(LEGACY_STORAGE_KEY);

  if (localStorage.getItem(LEGACY_MIGRATION_KEY) || !legacyTasks) {
    return;
  }

  if (localStorage.getItem(currentWeekKey)) {
    localStorage.setItem(LEGACY_MIGRATION_KEY, "true");
    return;
  }

  localStorage.setItem(currentWeekKey, legacyTasks);
  localStorage.setItem(LEGACY_MIGRATION_KEY, "true");
}

function getNextAvailableWeekStart() {
  const savedWeekStarts = getSavedWeekKeys().map(parseDateKey);
  const latestSavedWeekStart = savedWeekStarts.length
    ? savedWeekStarts.reduce((latest, weekStart) => weekStart > latest ? weekStart : latest, savedWeekStarts[0])
    : currentWeekStart;

  let nextWeekStart = addDays(latestSavedWeekStart > currentWeekStart ? latestSavedWeekStart : currentWeekStart, 7);

  while (localStorage.getItem(getWeekStorageKey(nextWeekStart))) {
    nextWeekStart = addDays(nextWeekStart, 7);
  }

  return nextWeekStart;
}

function getWeekStorageKey(weekStart) {
  return `${STORAGE_PREFIX}${formatDateKey(weekStart)}`;
}

function getMonday(date) {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = monday.getDay();
  const distanceFromMonday = day === 0 ? -6 : 1 - day;

  monday.setDate(monday.getDate() + distanceFromMonday);
  monday.setHours(0, 0, 0, 0);

  return monday;
}

function addDays(date, daysToAdd) {
  const nextDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  nextDate.setDate(nextDate.getDate() + daysToAdd);
  nextDate.setHours(0, 0, 0, 0);

  return nextDate;
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function isDateKey(dateKey) {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateKey);
}

function formatWeekRange(weekStart) {
  const weekEnd = addDays(weekStart, 4);
  const startMonth = weekStart.toLocaleString("en-US", { month: "long" });
  const endMonth = weekEnd.toLocaleString("en-US", { month: "long" });
  const startDay = weekStart.getDate();
  const endDay = weekEnd.getDate();
  const endYear = weekEnd.getFullYear();
  const separator = " \u2013 ";

  if (startMonth === endMonth && weekStart.getFullYear() === endYear) {
    return `${startMonth} ${startDay}${separator}${endDay}, ${endYear}`;
  }

  return `${startMonth} ${startDay}, ${weekStart.getFullYear()}${separator}${endMonth} ${endDay}, ${endYear}`;
}

function normalizeTask(task) {
  const [startTime, endTime] = splitLegacyTime(task.time);

  return {
    id: String(task.id || createTaskId()),
    day: days.some((day) => day.id === task.day) ? task.day : "mon",
    startTime: normalizeTimeOption(task.startTime || startTime || "8:00 AM"),
    endTime: normalizeTimeOption(task.endTime || endTime || "8:30 AM"),
    title: String(task.title || "Untitled Task"),
    detail: String(task.detail || ""),
    priority: String(task.priority || "standard").toLowerCase(),
    category: String(task.category || "bim"),
    project: projects.includes(task.project) ? task.project : "Internal",
    status: statuses.includes(task.status) ? task.status : "Not Started"
  };
}

function saveTasks() {
  localStorage.setItem(getWeekStorageKey(currentWeekStart), JSON.stringify(tasks));
}

function isValidTask(task) {
  return task
    && typeof task.id === "string"
    && typeof task.day === "string"
    && typeof task.startTime === "string"
    && typeof task.endTime === "string"
    && typeof task.title === "string"
    && typeof task.detail === "string"
    && typeof task.priority === "string"
    && typeof task.category === "string"
    && typeof task.project === "string"
    && typeof task.status === "string"
    && isEndTimeLater(task.startTime, task.endTime);
}

function isMeetingPriority(priority) {
  return String(priority).toLowerCase() === "meeting";
}

function populateTimeSelects() {
  const optionsHtml = timeOptions
    .map((time) => `<option value="${escapeHtml(time)}">${escapeHtml(time)}</option>`)
    .join("");

  taskStartTimeInput.innerHTML = optionsHtml;
  taskEndTimeInput.innerHTML = optionsHtml;
}

function createTimeOptions() {
  const options = [];
  const startMinutes = 6 * 60;
  const endMinutes = 18 * 60;

  for (let minutes = startMinutes; minutes <= endMinutes; minutes += 30) {
    options.push(formatMinutesAsTime(minutes));
  }

  return options;
}

function formatMinutesAsTime(totalMinutes) {
  const hour24 = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;

  return `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function parseTimeToMinutes(time) {
  const match = String(time).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (!match) {
    return Number.NaN;
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const suffix = match[3].toUpperCase();

  if (suffix === "PM" && hours !== 12) {
    hours += 12;
  }

  if (suffix === "AM" && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
}

function isEndTimeLater(startTime, endTime) {
  return parseTimeToMinutes(endTime) > parseTimeToMinutes(startTime);
}

function splitLegacyTime(time) {
  if (typeof time !== "string") {
    return [];
  }

  const parts = time.split(/\s*[-\u2013]\s*/);
  return [toDisplayTime(parts[0]), toDisplayTime(parts[1])];
}

function toDisplayTime(time) {
  if (!time) {
    return "";
  }

  const trimmedTime = String(time).trim();
  const displayMatch = trimmedTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (displayMatch) {
    return formatMinutesAsTime(parseTimeToMinutes(trimmedTime));
  }

  const twentyFourHourMatch = trimmedTime.match(/^(\d{1,2}):(\d{2})$/);

  if (!twentyFourHourMatch) {
    return "";
  }

  return formatMinutesAsTime(Number(twentyFourHourMatch[1]) * 60 + Number(twentyFourHourMatch[2]));
}

function normalizeTimeOption(time) {
  const normalizedTime = toDisplayTime(time);

  return timeOptions.includes(normalizedTime) ? normalizedTime : "8:00 AM";
}

function showFormError(message) {
  formError.textContent = message;
}

function clearFormError() {
  formError.textContent = "";
}

function createTaskId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `task-${Date.now()}`;
}

function getCategoryLabel(category) {
  const labels = {
    bim: "BIM",
    coord: "Coord",
    rfi: "RFI",
    doc: "Doc",
    acc: "ACC",
    field: "Field"
  };

  return labels[category] || category;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
