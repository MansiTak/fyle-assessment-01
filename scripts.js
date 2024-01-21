const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const reposPerPage = document.getElementById('repos-per-page');
const reposContainer = document.getElementById('repos-container');
const profileContainer = document.getElementById('profile-container');

let profileElement = '';
// Function to fetch repositories
async function fetchRepositories(username, page = 1, perPage = 10) {
    const response = await fetch(`https://api.github.com/users/${username}/repos?page=${page}&per_page=${perPage}`);
    const profile_response = await fetch(`https://api.github.com/users/${username}`);
    const data = await response.json();
    const profile_data = await profile_response.json();
    profileElement = `<div class="card mb-3" style="width:100%;height:300px">
                        <div class="row mt-5 ml-3" style="justify-content: center">
                        <div class= "col-3">
                        <img class="rounded-circle" style="width:180px;height:180px position: absolute;" alt="avatar" src="${profile_data.avatar_url}" /><br>
                        <a href="${profile_data.url}" style="font-size:10px; color:black">${profile_data.url}</a>
                        </div>
                        <div class= "col-6">
                        <h2>${username}</h2>
                        <span>Bio: ${profile_data.bio}</span>
                        </div></div></div>`;
    profileContainer.innerHTML = profileElement;
    return data;
}

// Function to display repositories
function displayRepositories(repositories) {
    console.log(repositories)
    reposContainer.innerHTML = '';
    if (repositories.length === 0) {
        reposContainer.innerHTML = '<p>No repositories found.</p>';
        return;
    }

    let repoElement = '';

    repoElement += `<h2 class="text-center mb-4">Repositories</h2><div class="row row-cols-2 g-3">`
    repositories.forEach(function (repo, index) {
        repoElement += `<div class="col"><div class="card mb-3 h-100">
        <div class="card-body">
        <h5 class="card-title">${repo.name}</h5>
        <p class="card-text">${repo.description || ''}</p>`;

        repo.topics.forEach(function (topic, value) {
            if (value < 5) {
                repoElement += `<a href = "#" class="btn btn-primary" style="margin:5px"> ${topic}</a >`;
            }
        });
        repoElement += `</div></div></div>`;
    });
    repoElement += `</div>`;

    reposContainer.innerHTML = repoElement;
}

// Function to handle search form submission
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = searchInput.value.trim();
    if (!username) return;

    // Show loader
    const loader = document.createElement('div');
    loader.classList.add('d-flex', 'justify-content-center', 'my-5');
    loader.innerHTML = `
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            `;
    reposContainer.parentNode.insertBefore(loader, reposContainer);

    try {
        const repositories = await fetchRepositories(username);
        displayRepositories(repositories);

        // Remove loader
        loader.remove();
    } catch (error) {
        reposContainer.innerHTML = '<p>Error fetching repositories. Please try again.</p>';

        // Remove loader
        loader.remove();
    }
});

// Function to handle repos per page change
reposPerPage.addEventListener('change', async () => {
    const username = searchInput.value.trim();
    if (!username) return;

    // Show loader
    const loader = document.createElement('div');
    loader.classList.add('d-flex', 'justify-content-center', 'my-5');
    loader.innerHTML = `<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>`;
    reposContainer.parentNode.insertBefore(loader, reposContainer);

    try {
        const repositories = await fetchRepositories(username, 1, reposPerPage.value);
        displayRepositories(repositories);
    } catch (error) {
        reposContainer.innerHTML = '<p>Error fetching repositories. Please try again.</p>';
    }

    // Remove loader after a short delay
    setTimeout(() => {
        loader.remove();
    }, 500);
});
