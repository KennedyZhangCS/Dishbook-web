// console.log("JS loaded");

// document.addEventListener("DOMContentLoaded", function () {
//     const form = document.getElementById("comment-form");

//     if (!form) return; // prevents errors on other pages

//     form.addEventListener("submit", function (e) {
//     console.log("Form submitted");

//     e.preventDefault();

//     const content = document.getElementById("comment-content").value;

//     const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

//     fetch(window.location.href, {
//     method: "POST",
//     headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//         "X-CSRFToken": csrfToken
//     },
//     body: `content=${encodeURIComponent(content)}`
// })
// .then(response => {
//     console.log("HTTP status:", response.status);
//     return response.json();   // IMPORTANT: revert back now
// })
// .then(data => {
//     console.log("Server response:", data);

//     const commentSection = document.getElementById("comments-section");

//     const newComment = document.createElement("div");
//     newComment.classList.add("comment");

//     newComment.innerHTML = `
//         <strong>${data.username}</strong>
//         <p>${data.content}</p>
//         <small>${data.created_at}</small>
//     `;

//     commentSection.prepend(newComment);

//     document.getElementById("comment-content").value = "";
// })
// .catch(err => {
//     console.log("ERROR:", err);
// });
//     });});
console.log("JS loaded");

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("comment-form");
    const commentSection = document.getElementById("comments-section");

    if (!form || !commentSection) return;

    form.addEventListener("submit", function (e) {
        console.log("Form submitted");

        e.preventDefault();

        const content = document.getElementById("comment-content").value;
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        fetch(window.location.href, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-CSRFToken": csrfToken
            },
            body: `content=${encodeURIComponent(content)}`
        })
        .then(response => {
            console.log("HTTP status:", response.status);
            return response.json();
        })
        .then(data => {
            console.log("Server response:", data);

            if (data.error) {
                console.log("Error from server:", data.error);
                return;
            }

            // Create new comment element
            const newComment = document.createElement("div");
            newComment.classList.add("comment");

            newComment.innerHTML = `
                <strong>${data.username}</strong>
                <p>${data.content}</p>
                <small>${data.created_at}</small>
            `;

            // Add to top
            commentSection.prepend(newComment);

            // Remove "No comments yet" if it exists
            const emptyMsg = document.getElementById("no-comments");
            if (emptyMsg) {
                emptyMsg.remove();
            }

            // Clear input
            document.getElementById("comment-content").value = "";
        })
        .catch(err => {
            console.log("ERROR:", err);
        });
    });
});