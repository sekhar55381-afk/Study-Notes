const searchInput = document.getElementById("searchInput");
const classFilter = document.getElementById("classFilter");
const subjectFilter = document.getElementById("subjectFilter");
const typeFilter = document.getElementById("typeFilter");

const noteCards = document.querySelectorAll(".note-card");
const emptyMessage = document.getElementById("emptyMessage");

function filterNotes() {
  const search = searchInput.value.trim().toLowerCase();
  const selectedClass = classFilter.value;
  const selectedSubject = subjectFilter.value;
  const selectedType = typeFilter.value;

  let visibleCount = 0;

  noteCards.forEach((card) => {
    const text = card.textContent.toLowerCase();

    const matchesSearch = text.includes(search);

    const matchesClass =
      selectedClass === "all" ||
      card.dataset.class === selectedClass;

    const matchesSubject =
      selectedSubject === "all" ||
      card.dataset.subject === selectedSubject;

    const matchesType =
      selectedType === "all" ||
      card.dataset.type === selectedType;

    const visible =
      matchesSearch &&
      matchesClass &&
      matchesSubject &&
      matchesType;

    card.style.display = visible ? "" : "none";

    if (visible) {
      visibleCount++;
    }
  });

  emptyMessage.style.display =
    visibleCount === 0 ? "block" : "none";
}

searchInput.addEventListener("input", filterNotes);
classFilter.addEventListener("change", filterNotes);
subjectFilter.addEventListener("change", filterNotes);
typeFilter.addEventListener("change", filterNotes);

document.querySelectorAll("[data-note]").forEach((button) => {
  button.addEventListener("click", () => {
    const noteName = button.dataset.note;

    alert(
      noteName +
      "\n\nNotes PDF abhi upload nahi ki gayi hai. " +
      "PDF aur download feature agle step mein add karenge."
    );
  });
});

filterNotes();
