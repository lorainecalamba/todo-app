
//select elements in DOM
const form = document.querySelector("#itemForm");
const itemInput = document.querySelector("#itemInput");
const itemsList = document.querySelector("#itemsList");
const filters = document.querySelectorAll(".nav-item");
const alertDiv = document.querySelector("#message");


// create an empty item list
let todoItems = [];

const alertMessage = function (message, className) {
  alertDiv.innerHTML = message;
  alertDiv.classList.add(className, "show");
  alertDiv.classList.remove("hide");
  setTimeout(() => {
    alertDiv.classList.add("hide");
    alertDiv.classList.remove("show");
  }, 3000)
}

//filter items
const getItemsFilter = function (type) {
  let filterItems = [];
  switch (type) {
    case "todo":
      filterItems = todoItems.filter((item) => !item.isDone);
      break;
    case "done":
      filterItems = todoItems.filter((item) => item.isDone);
      break;
    default:
      filterItems = todoItems;
  }
  getList(filterItems);
}

//delete item
const removeItem = function (item) {
  const removeIndex = todoItems.indexOf(item);
  todoItems.splice(removeIndex, 1);
}

//update function
const updateItem = function (currentItemIndex, value) {
  const newItem = todoItems[currentItemIndex];
  newItem.name = value;
  todoItems.splice(currentItemIndex, 1, newItem);
  setLocalStorage(todoItems);
}

//handle events on action buttons
const handleItem = function (itemData) {
  const items = document.querySelectorAll(".list-group-item");
  items.forEach((item) => {


    //done
    if (item.querySelector(".title").getAttribute('data-time') == itemData.addedAt) {
      item.querySelector('[data-done]').addEventListener('click', function (e) {
        e.preventDefault();

        const itemIndex = todoItems.indexOf(itemData);
        const currentItem = todoItems[itemIndex];

        const currentClass = currentItem.isDone
          ? "bi-check-circle-fill"
          : "bi-check-circle";

        currentItem.isDone = currentItem.isDone ? false : true;
        todoItems.splice(itemIndex, 1, currentItem);
        setLocalStorage(todoItems);

        const iconClass = currentItem.isDone
          ? "bi-check-circle-fill"
          : "bi-check-circle";

        this.firstElementChild.classList.replace(currentClass, iconClass);
        const filterType = document.querySelector("#tabValue").value;
        getItemsFilter(filterType);
      });


      //edit
      item.querySelector("[data-edit]").addEventListener("click", function (e) {
        e.preventDefault();
        itemInput.value = itemData.name;
        document.querySelector("#objIndex").value = todoItems.indexOf(itemData);
      });

      //delete
      item.querySelector("[data-delete]").addEventListener("click", function (e) {
        e.preventDefault();
        if (confirm("Are you sure you want to remove this item?")) {
          itemsList.removeChild(item);
          removeItem(item);
          setLocalStorage(todoItems);
          alertMessage("Item has been deleted", "alert-success");
          return todoItems.filter((item) => item != itemData);
        }
      });
    }
  })
};


//get list of Items
const getList = function (todoItems) {
  itemsList.innerHTML = "";
  if (todoItems.length > 0) {
    todoItems.forEach((item) => {

      const iconClass = item.isDone
        ? "bi-check-circle-fill"
        : "bi-check-circle";

      let liTag = `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                   <span class="title" data-time=${item.addedAt}>${item.name}</span>
                   <span>
                       <a href="#" data-done><i class="bi ${iconClass}  green"></i></a>
                       <a href="#" data-edit><i class="bi bi-pencil-square blue"></i></a>
                       <a href="#" data-delete><i class="bi bi-x-circle red"></i></a>
                   </span>
            </li>`;
      itemsList.insertAdjacentHTML("beforeend", liTag);
      handleItem(item);
    });
  } else {
    let liTag = `
        <li class="list-group-item d-flex justify-content-between align-items-center">
               <span>No Records Found.</span>
        </li>`;
    itemsList.insertAdjacentHTML("beforeend", liTag);
  }
}

//get items from LocalStorage
const getLocalStorage = function () {
  const todoStorage = localStorage.getItem("todoItems");
  if (todoStorage === "undefined" || todoStorage === null) {
    todoItems = [];
  }
  else {
    todoItems = JSON.parse(todoStorage);
  }

  console.log("items", todoItems);
  getList(todoItems);
}


//set in local storage
const setLocalStorage = function (todoItems) {
  localStorage.setItem("todoItems", JSON.stringify(todoItems));
}

document.addEventListener("DOMContentLoaded", () => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const itemName = itemInput.value.trim();
    if (itemName.length === 0) {
      alertMessage("Please enter name", "alert-danger");
    }
    else {

      const currentItemIndex = document.querySelector("#objIndex").value;
      if (currentItemIndex) {
        //update
        updateItem(currentItemIndex, itemName);
        document.querySelector("#objIndex").value = "";
        alertMessage("Item has been updated", "alert-success");
      }
      else {
        const itemObj = {
          name: itemName,
          isDone: false,
          addedAt: new Date().getTime()
        };
        todoItems.push(itemObj);
        setLocalStorage(todoItems);
        alertMessage("New Item has been added", "alert-success");
      }
      getList(todoItems);
    }
    itemInput.value = "";

  });


  //filter tabs
  filters.forEach((tab) => {
    tab.addEventListener('click', function (e) {
      e.preventDefault();
      const tabType = this.getAttribute("data-type");
      document.querySelectorAll(".nav-link").forEach((nav) => {
        nav.classList.remove("active");
      });
      this.firstElementChild.classList.add("active");
      getItemsFilter(tabType);
      document.querySelector("#tabValue").value = tabType;
    })
  })
  //load items
  getLocalStorage();
});