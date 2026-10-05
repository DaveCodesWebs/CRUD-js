const API_URL = "http://localhost:3000/iphones";

const tableBody = document.getElementById("table-body");
const iphoneForm = document.getElementById("iphone-form");
const pagination = document.getElementById("pagination");
const modal = new bootstrap.Modal(document.getElementById("modal"));

const fields = {
  name: document.getElementById("name"),
  storage: document.getElementById("storage"),
  ram: document.getElementById("ram"),
  refreshRate: document.getElementById("refresh-rate"),
  price: document.getElementById("price"),
};

const state = {
  phones: [],
  selectedPhones: new Set(),
  currentPage: 1,
  itemsPerPage: 5,
  editingPhoneId: null,
  currentSearch: "",
  totalPages: 1,
  totalItems: 0,
};

const clearForm = () => iphoneForm.reset();

const getFormData = () => ({
  name: fields.name.value,
  storage: fields.storage.value,
  ram: fields.ram.value,
  refreshRate: fields.refreshRate.value,
  price: Number(fields.price.value),
});

async function fetchPhones() {
  let url =
    `${API_URL}?_page=${state.currentPage}` +
    `&_per_page=${state.itemsPerPage}`;

  if (state.currentSearch) {
    const whereObj = {
      or: [
        { name: { contains: state.currentSearch } },
        { storage: { contains: state.currentSearch } },
        { ram: { contains: state.currentSearch } },
      ],
    };

    url += `&_where=${encodeURIComponent(JSON.stringify(whereObj))}`;
  }

  const response = await fetch(url);
  const result = await response.json();

  state.phones = result.data || [];
  state.totalPages = result.pages || 1;
  state.totalItems = result.items || 0;

  renderPhones();
}

function updateBulkActionsVisibility() {
  const deleteSelectedBtn = document.getElementById(
    "delete-selected-btn",
  );

  const bulkEditBtn = document.getElementById("bulk-edit-btn");

  const hasEnoughSelected = state.selectedPhones.size >= 1;

  deleteSelectedBtn.classList.toggle("d-none", !hasEnoughSelected);

  bulkEditBtn.classList.toggle("d-none", !hasEnoughSelected);
}

function renderPhones() {
  tableBody.innerHTML = state.phones
    .map(
      (phone) => `
      <tr>
        <td>
          <input
            type="checkbox"
            class="row-checkbox"
            ${state.selectedPhones.has(phone.id) ? "checked" : ""}
            onchange="
              this.checked
                ? state.selectedPhones.add('${phone.id}')
                : state.selectedPhones.delete('${phone.id}');

              updateSelectAllState();
              updateBulkActionsVisibility();
            "
          />
        </td>

        <td>${phone.id}</td>
        <td>${phone.name}</td>
        <td>${phone.storage}</td>
        <td>${phone.ram}</td>
        <td>${phone.refreshRate}</td>
        <td>$${phone.price}</td>

        <td class="d-flex gap-2">
          <button
            class="btn btn-sm btn-primary"
            onclick="
              loadPhoneIntoForm('${phone.id}')
            "
          >
            Edit
          </button>

          <button
            class="btn btn-sm btn-danger"
            onclick="
              deletePhone('${phone.id}')
            "
          >
            Delete
          </button>
        </td>
      </tr>
    `,
    )
    .join("");

  document.getElementById("total-count").textContent = state.totalItems;

  renderPagination();

  updateSelectAllState();

  updateBulkActionsVisibility();
}

function renderPagination() {
  pagination.innerHTML = "";

  for (let i = 1; i <= state.totalPages; i++) {
    pagination.innerHTML += `
      <button
        class="btn border ${
          state.currentPage === i ? "btn-dark text-white" : ""
        }"
        onclick="changePage(${i})"
      >
        ${i}
      </button>
    `;
  }
}

function updateSelectAllState() {
  const selectAll = document.getElementById("select-all");

  selectAll.checked =
    state.phones.length > 0 &&
    state.phones.every((phone) => state.selectedPhones.has(phone.id));
}

function openAddModal() {
  state.editingPhoneId = null;

  document.getElementById("modal-title").textContent = "Add Phone";

  clearForm();
  modal.show();
}

async function addPhone(phoneData) {
  const response = await fetch(API_URL);
  const allPhones = await response.json();

  const maxId = allPhones.reduce(
    (max, phone) => Math.max(max, Number(phone.id) || 0),
    0,
  );

  await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: String(maxId + 1),
      ...phoneData,
    }),
  });

  modal.hide();
  fetchPhones();
}

async function updatePhone(updatedData) {
  await fetch(`${API_URL}/${state.editingPhoneId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });

  state.editingPhoneId = null;

  modal.hide();
  fetchPhones();
}

async function deletePhone(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  state.selectedPhones.delete(id);

  if (state.phones.length === 1 && state.currentPage > 1) {
    state.currentPage--;
  }

  fetchPhones();
}

async function deleteSelectedPhones() {
  await Promise.all(
    [...state.selectedPhones].map((id) =>
      fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      }),
    ),
  );

  state.selectedPhones.clear();

  fetchPhones();
}

function loadPhoneIntoForm(id) {
  const phone = state.phones.find((phone) => phone.id === id);

  if (!phone) return;

  fields.name.value = phone.name;
  fields.storage.value = phone.storage;
  fields.ram.value = phone.ram;
  fields.refreshRate.value = phone.refreshRate;
  fields.price.value = phone.price;

  state.editingPhoneId = id;

  document.getElementById("modal-title").textContent = "Edit Phone";

  modal.show();
}

function getBulkFormData() {
  const data = {};

  if (fields.name.value.trim()) {
    data.name = fields.name.value;
  }

  if (fields.storage.value.trim()) {
    data.storage = fields.storage.value;
  }

  if (fields.ram.value.trim()) {
    data.ram = fields.ram.value;
  }

  if (fields.refreshRate.value.trim()) {
    data.refreshRate = fields.refreshRate.value;
  }

  if (fields.price.value) {
    data.price = Number(fields.price.value);
  }

  return data;
}

async function bulkUpdatePhones(updatedData) {
  await Promise.all(
    [...state.selectedPhones].map((id) =>
      fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      }),
    ),
  );

  state.selectedPhones.clear();

  modal.hide();
  fetchPhones();
}

function openBulkEditModal() {
  if (state.selectedPhones.size < 2) {
    alert("Select at least two phones.");
    return;
  }

  state.editingPhoneId = "bulk";

  document.getElementById("modal-title").textContent = "Bulk Edit Selected";

  clearForm();
  modal.show();
}

function handleFormSubmit(event) {
  event.preventDefault();

  if (state.editingPhoneId === "bulk") {
    bulkUpdatePhones(getBulkFormData());
    return;
  }

  const formData = getFormData();

  state.editingPhoneId ? updatePhone(formData) : addPhone(formData);
}

function handleSearch(event) {
  state.currentSearch = event.target.value.toLowerCase();
  state.currentPage = 1;

  fetchPhones();
}

function handleSelectAll(event) {
  state.phones.forEach((phone) => {
    event.target.checked
      ? state.selectedPhones.add(phone.id)
      : state.selectedPhones.delete(phone.id);
  });

  renderPhones();

  updateBulkActionsVisibility();
}

function handleItemsPerPage(event) {
  state.itemsPerPage = Number(event.target.value);
  state.currentPage = 1;

  fetchPhones();
}

function changePage(page) {
  state.currentPage = page;
  fetchPhones();
}

function goToPrevPage() {
  if (state.currentPage > 1) {
    state.currentPage--;
    fetchPhones();
  }
}

function goToNextPage() {
  if (state.currentPage < state.totalPages) {
    state.currentPage++;
    fetchPhones();
  }
}

function init() {
  fetchPhones();
}

init();