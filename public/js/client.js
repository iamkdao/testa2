// FRONT-END (CLIENT) JAVASCRIPT HERE


window.onload = function () {
    const big_button = document.querySelector(".big-button");
    if (big_button) {
        big_button.onclick = function () {
            window.location.href = "/add"
        }
    }

    const button = document.querySelector(".submit-btn");
    if (button) {
        button.onclick = async function (event) {
            const form = document.querySelector("#todo-form");
            if (!form.checkValidity()) {
                return;
            }
            event.preventDefault()
            await submit(event)
            window.location.href = "/"
        }
    }

    const todoList = document.querySelector("#todo-list");
    if (todoList) {
        loadTodos();
    }
}


const submit = async function (event) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    event.preventDefault()

    const task = document.querySelector("#task").value
    const priority = document.querySelector("#priority").value
    const desc = document.querySelector("#description").value
    const deadline = document.querySelector("#deadline").value
    const date = new Date().toLocaleString()

    const response = await fetch("/api/data", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ task, desc, priority, deadline, date })
    })

    const text = await response.text()
    console.log("text:", text)
}

const loadTodos = async function () {
    const response = await fetch("/api/data");
    const todos = await response.json();

    const list = document.querySelector("#todo-list");
    list.innerHTML = "";

    todos.forEach(todo => {
        const main = document.createElement("div");
        main.className = "todo-content-main";
        const content = document.createElement("div");
        content.className = "todo-content-others";

        const txt = document.createElement("span")
        txt.textContent = todo.task
        txt.className = "text graffiti"

        const desc = document.createElement("span")
        desc.textContent = todo.desc
        desc.className = "desc"

        const createDate = document.createElement("span")
        const date = new Date(todo.date).toLocaleString()
        createDate.textContent = `Created on ${date}`
        createDate.className = "createDate"

        const deadline = document.createElement("span")
        deadline.textContent = `Deadline in ${todo.deadline} days`
        deadline.className = "deadline"

        const priority = document.createElement("span")
        priority.textContent = `Priority: ${todo.priority}`
        priority.className = "priority"

        main.appendChild(txt)
        main.appendChild(desc)
        content.appendChild(priority)
        content.appendChild(deadline)
        content.appendChild(createDate)

        const li = document.createElement("li");

        const btn = document.createElement("button");
        btn.className = "button-53 graffiti"
        btn.textContent = "Delete";
        btn.onclick = () => deleteTodo(todo.id);

        li.append(main)
        li.append(content)
        li.appendChild(btn);
        list.appendChild(li);
    });
};

const deleteTodo = async function (id) {
    await fetch(`/api/data/${id}`, { method: "DELETE" });
    loadTodos();
};