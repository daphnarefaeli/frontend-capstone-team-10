window.addEventListener('load', function() {
    
    const regForm = document.getElementById('registrationForm');
    
    if (regForm) {
        regForm.addEventListener('submit', function(event) {
            event.preventDefault(); 

            const fName = document.getElementById('firstName').value;
            const lName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert("נא להזין כתובת אימייל תקינה.");
                return; 
            }

            if (password.length < 6) {
                alert("הסיסמה חייבת להכיל לפחות 6 תווים");
                return;
            }

            const user = {
                firstName: fName,
                lastName: lName,
                email: email
            };
            
            localStorage.setItem('registeredUser', JSON.stringify(user));

            console.log("משתמש נשמר בהצלחה:", user);

            alert(`נרשמת בהצלחה, ${fName}!`);
            window.location.href = "homepage.html";
        });
    }

    const welcomeArea = document.getElementById('welcomeArea');
    const savedUser = localStorage.getItem('registeredUser');

    if (welcomeArea) {
        if (savedUser) {
            const user = JSON.parse(savedUser);
            welcomeArea.textContent = `שלום, ${user.firstName} ${user.lastName}! טוב לראות אותך`;
        } else {
            welcomeArea.textContent = "שלום, אורח! נשמח אם תירשם למערכת";
        }
    }
});