document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    });
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = 'calculator.html';
        } else {
            alert(data.message);
        }
    });
});

document.getElementById('gradeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const subject = document.getElementById('subject').value;
    const grade = document.getElementById('grade').value;
    
    fetch('/addGrade', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subject, grade })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const gradeList = document.getElementById('gradeList');
            const li = document.createElement('li');
            li.textContent = `Subject: ${subject}, Grade: ${grade}`;
            gradeList.appendChild(li);
        } else {
            alert(data.message);
        }
    });
});
