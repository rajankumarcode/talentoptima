const pageRoutes = {
  Dashboard: "dashboard.html",
  Employees: "employee.html",
  Projects: "projects.html",
  Assignments: "assignments.html",
  Reports: "reports.html",
};

document.querySelectorAll("[data-page]").forEach(button => {
  button.addEventListener("click", () => {
    const destination = pageRoutes[button.dataset.page];

    if (destination) {
      window.location.href = destination;
    }
  });
});
