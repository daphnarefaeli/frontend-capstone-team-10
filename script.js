window.addEventListener('load', function() {
    const savedUser = localStorage.getItem('registeredUser');
    const welcomeArea = document.getElementById('welcomeArea');
    
    const accountBtn = document.getElementById('accountBtn');
    const accountMenu = document.getElementById('accountMenu');
    const menuRegister = document.getElementById('menuRegister');
    const menuProfile = document.getElementById('menuProfile');
    const menuLogout = document.getElementById('menuLogout');

    if (savedUser) {
        if (menuRegister) menuRegister.style.display = 'none';
        if (menuProfile) menuProfile.style.display = 'block';
        if (menuLogout) menuLogout.style.display = 'block';

        const user = JSON.parse(savedUser);
        if (welcomeArea) welcomeArea.textContent = `שלום, ${user.firstName} ${user.lastName}! טוב לראות אותך`;
        
        const displayFirstName = document.getElementById('displayFirstName');
        const displayLastName = document.getElementById('displayLastName');
        const displayEmail = document.getElementById('displayEmail');

        if (displayFirstName) {
            displayFirstName.textContent = user.firstName;
            displayLastName.textContent = user.lastName;
            displayEmail.textContent = user.email;
        }
    } else {
        if (welcomeArea) welcomeArea.textContent = "שלום, אורח! נשמח אם תירשם למערכת";
    }


    if (accountBtn && accountMenu) {
        accountBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            accountMenu.classList.toggle('show');
        });
    }

    window.addEventListener('click', function() {
        if (accountMenu) accountMenu.classList.remove('show');
    });

    if (menuLogout) {
        menuLogout.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('registeredUser');
            alert("התנתקת בהצלחה!");
            window.location.href = "homepage.html";
        });
    }


    const regForm = document.getElementById('registrationForm');
    if (regForm) {
        regForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            const fName = document.getElementById('firstName').value;
            const lName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            
            const user = { firstName: fName, lastName: lName, email: email };
            localStorage.setItem('registeredUser', JSON.stringify(user));
            alert(`נרשמת בהצלחה, ${fName}!`);
            window.location.href = "homepage.html";
        });
    }
});



const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const senderName = document.getElementById('contactName').value;
        alert(`תודה ${senderName}, ההודעה שלך נשלחה בהצלחה! נחזור אליך בהקדם.`);
        contactForm.reset(); 
    });
}