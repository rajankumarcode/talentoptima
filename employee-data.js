(() => {
  const storageKey = "skillAssignEmployees";
  const migrationKey = "skillAssignEmployeesDemoCleanupV1";
  const demoRecords = new Map([
    ["EMP-001", { name: "Sarah Jenkins", role: "Frontend Developer", skills: ["React", "TypeScript", "Tailwind CSS"] }],
    ["EMP-002", { name: "Michael Chen", role: "UI/UX Designer", skills: ["Figma", "Prototyping", "User Research"] }],
    ["EMP-003", { name: "Amina Al-Mansoor", role: "Backend Engineer", skills: ["Python", "Django", "PostgreSQL"] }],
    ["EMP-004", { name: "Elena Rostova", role: "DevOps Engineer", skills: ["Docker", "Kubernetes", "AWS"] }],
    ["EMP-005", { name: "Marcus Brody", role: "Data Scientist", skills: ["Python", "R", "Machine Learning"] }]
  ]);

  function isDemoRecord(employee) {
    const demo = demoRecords.get(employee.id);
    return Boolean(demo && employee.name === demo.name && employee.role === demo.role &&
      Array.isArray(employee.skills) &&
      employee.skills.length === demo.skills.length &&
      employee.skills.every((skill, index) => skill === demo.skills[index]));
  }

  function migrateDemoRecords() {
    if (localStorage.getItem(migrationKey) === "complete") return;

    const stored = localStorage.getItem(storageKey);
    if (stored !== null) {
      const employees = JSON.parse(stored);
      if (!Array.isArray(employees)) {
        throw new Error("Saved employee data is invalid.");
      }

      const remainingEmployees = employees.filter(employee => !isDemoRecord(employee));
      if (remainingEmployees.length !== employees.length) {
        localStorage.setItem(storageKey, JSON.stringify(remainingEmployees));
      }
    } else {
      localStorage.setItem(storageKey, JSON.stringify([]));
    }

    localStorage.setItem(migrationKey, "complete");
  }

  function getAll() {
    migrateDemoRecords();
    const stored = localStorage.getItem(storageKey);
    if (stored === null) {
      localStorage.setItem(storageKey, JSON.stringify([]));
      return [];
    }

    const employees = JSON.parse(stored);
    if (!Array.isArray(employees)) {
      throw new Error("Saved employee data is invalid.");
    }
    return employees;
  }

  function save(employees) {
    localStorage.setItem(storageKey, JSON.stringify(employees));
  }

  function syncWorkloads(assignments) {
    if (!Array.isArray(assignments)) {
      throw new Error("Saved assignment data is invalid.");
    }

    const allocations = new Map();
    assignments.filter(assignment => assignment.status === "Active").forEach(assignment => {
      const allocation = Number(assignment.allocation);
      if (!assignment.employeeId || !Number.isFinite(allocation) || allocation < 0) {
        throw new Error("An active assignment has invalid workload data.");
      }
      allocations.set(assignment.employeeId, (allocations.get(assignment.employeeId) || 0) + allocation);
    });

    const employees = getAll();
    const updatedEmployees = employees.map(employee => {
      const allocatedWorkload = allocations.get(employee.id) || 0;
      return {
        ...employee,
        allocatedWorkload,
        availableWorkload: Math.max(0, 100 - allocatedWorkload),
        status: allocatedWorkload >= 100 ? "Allocated" : "Available"
      };
    });
    if (updatedEmployees.some((employee, index) =>
      employee.status !== employees[index].status ||
      employee.allocatedWorkload !== employees[index].allocatedWorkload ||
      employee.availableWorkload !== employees[index].availableWorkload
    )) {
      save(updatedEmployees);
    }
    return updatedEmployees;
  }

  window.SkillAssignEmployeeStore = { getAll, save, syncWorkloads };
})();
