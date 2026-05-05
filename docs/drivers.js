document.addEventListener("DOMContentLoaded", function () {

  const waitingState = document.getElementById("waitingState");
  const listState = document.getElementById("listState");
  const actionBtn = document.getElementById("actionBtn");

  // STATE 1 → STATE 2 (functions shows up after a while)
  setTimeout(function () {
    waitingState.classList.add("d-none");
    listState.classList.remove("d-none");
    actionBtn.classList.remove("d-none");
  }, 4000);

  // STATE 2 → STATE 3
  actionBtn.addEventListener("click", function () {

    if (actionBtn.classList.contains("btn-success")) {
      actionBtn.classList.remove("btn-success");
      actionBtn.classList.add("btn-danger");
      actionBtn.innerText = "Ολοκλήρωση δρομολογίου";
    } else if (actionBtn.classList.contains("btn-danger")) {
      actionBtn.classList.remove("btn-danger");
      actionBtn.classList.add("btn-secondary");
      actionBtn.innerText = "Ολοκληρώθηκε";
      actionBtn.disabled = true;
    }

  });

});

function markAbsent(button) {
  const row = button.closest(".passenger-row");
  const actions = row.querySelector(".actions");

  row.classList.add("absent-passenger-row");

  actions.style.display = "none";
}