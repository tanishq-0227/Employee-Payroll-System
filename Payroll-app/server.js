const express = require("express");
const app = express();
const PORT = 3000;

const fileHandler = require("./modules/fileHandler");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Dashboard
app.get("/", async (req, res) => {
    const employees = await fileHandler.read();
    res.render("index", { employees });
});

// Open Add page
app.get("/add", (req, res) => {
    res.render("add");
});

// Add Employee
app.post("/add", async (req, res) => {
    let employees = await fileHandler.read();

    const { name, department, salary } = req.body;

    // Validation
    if (!name || !department || salary < 0) {
        return res.redirect("/add");
    }

    const newEmployee = {
        id: Date.now(),
        name,
        department,
        salary: Number(salary)
    };

    employees.push(newEmployee);
    await fileHandler.write(employees);

    res.redirect("/");
});

// Open Edit page
app.get("/edit/:id", async (req, res) => {
    const employees = await fileHandler.read();
    const employee = employees.find(e => e.id == req.params.id);
    res.render("edit", { employee });
});

// Update Employee
app.post("/edit/:id", async (req, res) => {
    let employees = await fileHandler.read();

    employees = employees.map(e => {
        if (e.id == req.params.id) {
            return {
                ...e,
                name: req.body.name,
                department: req.body.department,
                salary: Number(req.body.salary)
            };
        }
        return e;
    });

    await fileHandler.write(employees);
    res.redirect("/");
});

// Delete Employee
app.get("/delete/:id", async (req, res) => {
    let employees = await fileHandler.read();
    employees = employees.filter(e => e.id != req.params.id);
    await fileHandler.write(employees);
    res.redirect("/");
});

// Start server (ONLY ONCE)
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
