
// constant vars 
const BASE_URL = `http://localhost:8001/todos`
const todosSection = document.getElementById("todos-section")
const singleTodoSection = document.getElementById("single-todo-section")
const updateForm = document.getElementById("update-form")
const updateTitleInput = document.getElementById("update-title")

// view todos func
async function fetchAndDisplayTodos() {
    // end result => Promise 
    const response = await fetch(BASE_URL, {
        method: "GET",
        headers: {}
    })

    // check of the request was successfull
    if (response.ok) {
        // return out list of todos from the api
        const result = await response.json()
        // add fetched list of todos in the html page as a list
        let ul = document.createElement('ul');

        for (let i = 0; i < result.length; i++) {
            const li = document.createElement('li')
            li.innerText = result[i].title

            // create a button that gonna load more details anout the todo
            const viewMoreButton = document.createElement('button')
            viewMoreButton.innerText = "View More Details"
            viewMoreButton.addEventListener('click', () => {
                fetchAndDisplaySingleTodo(result[i])
            })

            li.appendChild(viewMoreButton)
            ul.appendChild(li)
        }
        todosSection.appendChild(ul)
    }
}

// view a single todo
async function fetchAndDisplaySingleTodo(todoItem) {
  const response = await fetch(`${BASE_URL}/${todoItem.id}`, {
      method: "GET"
  })
  
  if (response.ok) {
    const result = await response.json()

    // display the single todo item details upon click 
    singleTodoSection.innerText = JSON.stringify(result, null, 2)
    singleTodoSection.style.border = "2px solid red"
    singleTodoSection.style.padding = "2rem"
    singleTodoSection.style.margin = "1rem"

    // prepare the form for updating the todo item
    updateTitleInput.value = result.title
    updateForm.onsubmit = async (event) => {
        event.preventDefault() // overwriting the reload reaction
        const updatedTitle = updateTitleInput.value
        // updating the todo body
        await fetchAndUpdateTodo({
            // spread operator
            ...todoItem,
            title: updatedTitle
        })
    }
  }
}

// update existing todo information
async function fetchAndUpdateTodo(todoItem) {
    const response = await fetch(`${BASE_URL}/${todoItem.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(todoItem)
    })

    if (response.ok) {
        const result = await response.json()
        alert(`Todo updated successfully: ${JSON.stringify(result, null, 2)}`)
        fetchAndDisplayTodos()
    } else {
        alert(`Failed to update todo: ${response.statusText}`)
    }
}

fetchAndDisplayTodos()