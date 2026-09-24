let employees = JSON.parse(localStorage.getItem("employees")) || [];
let editIndex = -1;

showEmployees();

function saveEmployee() {
    let name = document.getElementById("employee").value;
    let month = document.getElementById("month").value;
    let basic = Number(document.getElementById("basic").value);
    let overtime = Number(document.getElementById("overtime").value);
    let bonus = Number(document.getElementById("bonus").value);
    let deduction = Number(document.getElementById("deduction").value);

    if (name === "") {
        alert("Employee Name লিখুন");
        return;
    }

    let employee = {
        name, month, basic, overtime, bonus, deduction,
        netSalary: basic + overtime + bonus - deduction
    };

    if (editIndex === -1) {
        employees.push(employee);
    } else {
        employees[editIndex] = employee;
        editIndex = -1;
        document.getElementById("saveButton").innerText = "Save Employee";
    }

    localStorage.setItem("employees", JSON.stringify(employees));
    clearForm();
    showEmployees();
}

function showEmployees() {
    let list = document.getElementById("employeeList");
    let searchText = document.getElementById("search").value.toLowerCase();
    list.innerHTML = "";
    let total = 0;

    employees.forEach(function(employee, index) {
        if (employee.name.toLowerCase().includes(searchText)) {
            total += employee.netSalary;

            list.innerHTML += `
                <div class="employee-card">
                    <strong>${employee.name}</strong><br>
                    Month: ${employee.month}<br>
                    Basic: ${employee.basic} টাকা<br>
                    Overtime: ${employee.overtime} টাকা<br>
                    Bonus: ${employee.bonus} টাকা<br>
                    Deduction: ${employee.deduction} টাকা<br>
                    <strong>Net Salary: ${employee.netSalary} টাকা</strong>

                    <button class="edit-btn" onclick="editEmployee(${index})">Edit</button>
                    <button class="delete-btn" onclick="deleteEmployee(${index})">Delete</button>
                    <button class="print-btn" onclick="printSalary(${index})">Print Salary</button>
                </div>`;
        }
    });

    document.getElementById("totalSalary").innerText = total;
}

function editEmployee(index) {
    let employee = employees[index];

    document.getElementById("employee").value = employee.name;
    document.getElementById("month").value = employee.month;
    document.getElementById("basic").value = employee.basic;
    document.getElementById("overtime").value = employee.overtime;
    document.getElementById("bonus").value = employee.bonus;
    document.getElementById("deduction").value = employee.deduction;

    editIndex = index;
    document.getElementById("saveButton").innerText = "Update Employee";
    window.scrollTo(0, 0);
}

function deleteEmployee(index) {
    employees.splice(index, 1);
    localStorage.setItem("employees", JSON.stringify(employees));
    showEmployees();
}

function clearForm() {
    document.getElementById("employee").value = "";
    document.getElementById("month").value = "";
    document.getElementById("basic").value = "";
    document.getElementById("overtime").value = "";
    document.getElementById("bonus").value = "";
    document.getElementById("deduction").value = "";
}

function printSalary(index) {
    let employee = employees[index];

    let salarySheet = `
    <html>
    <head>
        <title>Salary Sheet</title>
        <style>
            body { font-family: Arial; padding: 30px; }
            .sheet { max-width: 600px; margin: auto; border: 2px solid #000; padding: 25px; }
            h1 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            td { border: 1px solid #000; padding: 10px; }
            .net { font-weight: bold; font-size: 20px; }
        </style>
    </head>
    <body>
        <div class="sheet">
            <h1>Salary Sheet</h1>
            <p><strong>Employee:</strong> ${employee.name}</p>
            <p><strong>Month:</strong> ${employee.month}</p>
            <table>
                <tr><td>Basic Salary</td><td>${employee.basic} টাকা</td></tr>
                <tr><td>Overtime</td><td>${employee.overtime} টাকা</td></tr>
                <tr><td>Bonus</td><td>${employee.bonus} টাকা</td></tr>
                <tr><td>Deduction</td><td>${employee.deduction} টাকা</td></tr>
                <tr class="net"><td>Net Salary</td><td>${employee.netSalary} টাকা</td></tr>
            </table>
        </div>
        <script>window.print();<\/script>
    </body>
    </html>`;

    let printWindow = window.open("", "_blank");

    if (!printWindow) {
        alert("Print window খুলতে পারেনি। Browser-এর popup permission চালু করুন।");
        return;
    }

    printWindow.document.write(salarySheet);
    printWindow.document.close();
}