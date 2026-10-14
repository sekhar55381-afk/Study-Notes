"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const notesGrid = document.getElementById("notesGrid");
  const emptyState = document.getElementById("emptyState");
  const resultsMessage = document.getElementById("resultsMessage");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const noteCards = Array.from(
    document.querySelectorAll(".note-card")
  );

  const menuToggle = document.getElementById("menuToggle");
  const navigation = document.getElementById("navigation");
  const currentYear = document.getElementById("currentYear");
  const classLinks = document.querySelectorAll("[data-class-link]");

  let activeFilter = "all";
  let activeClass = "all";

  if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
  }

  // MOBILE NAVIGATION

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", function () {
      const isOpen = navigation.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    navigation.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navigation.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
      });
    });
  }

  // NOTES FILTER AND SEARCH

  function updateNotes() {
    const query = searchInput
      ? searchInput.value.trim().toLowerCase()
      : "";

    let visibleCount = 0;

    noteCards.forEach(function (card) {
      const type = card.dataset.type || "";
      const className = card.dataset.class || "";
      const searchableText = (
        (card.dataset.search || "") + " " +
        card.textContent
      ).toLowerCase();

      const matchesFilter =
        activeFilter === "all" || type === activeFilter;

      const matchesClass =
        activeClass === "all" || className === activeClass;

      const matchesSearch =
        query === "" || searchableText.includes(query);

      const shouldShow =
        matchesFilter && matchesClass && matchesSearch;

      card.hidden = !shouldShow;

      if (shouldShow) {
        visibleCount++;
      }
    });

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }

    if (resultsMessage) {
      resultsMessage.textContent =
        visibleCount + (visibleCount === 1
          ? " note found"
          : " notes found");
    }
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activeFilter = button.dataset.filter || "all";

      filterButtons.forEach(function (item) {
        const selected = item === button;

        item.classList.toggle("active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });

      updateNotes();
    });

    button.setAttribute(
      "aria-pressed",
      String(button.classList.contains("active"))
    );
  });

  if (searchInput) {
    searchInput.addEventListener("input", updateNotes);
  }

  if (searchForm) {
    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();

      updateNotes();

      const notesSection = document.getElementById("notes");

      if (notesSection) {
        notesSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  }

  // CLASS SELECTION

  classLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      activeClass = link.dataset.classLink || "all";

      activeFilter = "all";

      filterButtons.forEach(function (button) {
        const selected = button.dataset.filter === "all";

        button.classList.toggle("active", selected);
        button.setAttribute("aria-pressed", String(selected));
      });

      updateNotes();
    });
  });

  // INITIAL DISPLAY

  updateNotes();

  console.log("Study Notes Hub homepage initialized successfully.");
});
