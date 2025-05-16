function populateUsersTable(page = 1) {
    fetch(`https://reqres.in/api/users?page=${page}`)
      .then(res => res.json())
      .then(data => {
        const tbody = document.querySelector('#usersTable tbody');
        tbody.innerHTML = ''; 
        data.data.forEach(user => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.first_name}</td>
            <td>${user.last_name}</td>
            <td>${user.email}</td>
            <td><img src="${user.avatar}" alt="Avatar" style="width:50px; border-radius:50%"/></td>
          `;
          tbody.appendChild(tr);
        });
  
        const pageInput = document.getElementById('pageInput');
        if (pageInput) pageInput.value = data.page;
  
        window.totalPages = data.total_pages;
      })
      .catch(() => alert('Failed to fetch users'));
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    populateUsersTable(1);
  
    const searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const pageInput = document.getElementById('pageInput');
      let page = Number(pageInput.value);
  
      if (page < 1) page = 1;
      if (window.totalPages && page > window.totalPages) page = window.totalPages;
  
      populateUsersTable(page);
    });
  });
  