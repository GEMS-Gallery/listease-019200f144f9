import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
  const shoppingList = document.getElementById('shopping-list');
  const addItemForm = document.getElementById('add-item-form');
  const newItemInput = document.getElementById('new-item');

  // Function to render the shopping list
  async function renderShoppingList() {
    const items = await backend.getItems();
    shoppingList.innerHTML = '';
    items.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${item.description}</span>
        <button class="delete-btn"><i class="fas fa-trash"></i></button>
      `;
      li.dataset.id = item.id;
      if (item.completed) {
        li.classList.add('completed');
      }
      li.addEventListener('click', toggleItem);
      li.querySelector('.delete-btn').addEventListener('click', deleteItem);
      shoppingList.appendChild(li);
    });
  }

  // Function to add a new item
  async function addItem(e) {
    e.preventDefault();
    const description = newItemInput.value.trim();
    if (description) {
      await backend.addItem(description);
      newItemInput.value = '';
      renderShoppingList();
    }
  }

  // Function to toggle item completion
  async function toggleItem(e) {
    if (e.target.tagName === 'LI') {
      const id = parseInt(e.target.dataset.id);
      await backend.toggleItem(id);
      renderShoppingList();
    }
  }

  // Function to delete an item
  async function deleteItem(e) {
    e.stopPropagation();
    const li = e.target.closest('li');
    const id = parseInt(li.dataset.id);
    await backend.deleteItem(id);
    renderShoppingList();
  }

  // Event listeners
  addItemForm.addEventListener('submit', addItem);

  // Initial render
  renderShoppingList();
});
