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

//-----------------------------------------שאלונים---------------------------------

console.log("script.js loaded");

const TEMP_KEY = "CurrentAnswers";
const HISTORY_KEY = "MoodHistory";

function saveSliderAndGo(qNumber, nextPage) {
  const slider = document.getElementById(`mood-slider${qNumber}`);
  if (!slider) {
    console.error("Slider not found:", `mood-slider${qNumber}`);
    return;
  }

  const value = Number(slider.value);
  const temp = JSON.parse(localStorage.getItem(TEMP_KEY)) || {};
  temp[`Q${qNumber}`] = value; 
  localStorage.setItem(TEMP_KEY, JSON.stringify(temp));

  window.location.href = nextPage;
}


// ----------------------------- Q5: finish ----------------------------------
function finishSurvey() {
  const temp = JSON.parse(localStorage.getItem(TEMP_KEY)) || {};

  const Q1 = Number(temp.Q1);
  const Q2 = Number(temp.Q2);
  const Q3 = Number(temp.Q3);
  const Q4 = Number(temp.Q4);

  if ([Q1, Q2, Q3, Q4].some((v) => Number.isNaN(v))) {
    alert("חסרות תשובות לשאלון (Q1–Q4). חזרי והשלימי את השאלות.");
    return;
  }

  const noteEl = document.getElementById("daily-text");
  const note = noteEl ? String(noteEl.value || "").trim() : "";

  const entry = {
    date: new Date().toLocaleDateString("he-IL"),
    answers: { Q1, Q2, Q3, Q4 },
    note
  };

  const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  history.push(entry);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  localStorage.removeItem(TEMP_KEY);

  const lowCount = [Q1, Q2, Q3, Q4].filter((v) => v < 2).length;
  window.location.href = (lowCount > 1) ? "alert.html" : "summary_page.html";
}

// --------------------------------------------- helpers -------------------------------
function getAnswer(a, key) {
  const upper = a?.[key];
  const lower = a?.[key.toLowerCase()];
  const val = (upper !== undefined) ? upper : lower;
  return Number(val);
}

// --------------------------------------------- chart ----------------------------------
function drawCurrentStateChart() {
  const canvas = document.getElementById("currentChart");
  if (!canvas) return;

  // sync canvas with CSS size (big + sharp)
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);

  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const W = rect.width;
  const H = rect.height;

  const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  ctx.clearRect(0, 0, W, H);

  if (history.length === 0) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.font = "18px sans-serif";
    ctx.fillText("אין נתונים להצגה.", 20, 40);
    const insight = document.getElementById("insight-text");
    if (insight) insight.textContent = "אין נתונים להצגה.";
    return;
  }

  const last = history[history.length - 1];
  const a = last.answers || {};

  const Q1 = getAnswer(a, "Q1");
  const Q2 = getAnswer(a, "Q2");
  const Q3 = getAnswer(a, "Q3");
  const Q4 = getAnswer(a, "Q4");

  if ([Q1, Q2, Q3, Q4].some((v) => Number.isNaN(v))) return;

  const pad = { left: 70, right: 30, top: 40, bottom: 90 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;
  const yAt = (v) => pad.top + (10 - v) * (plotH / 10);

  // grid
  ctx.strokeStyle = "rgba(0,0,0,0.12)";
  ctx.lineWidth = 1;
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.font = "14px sans-serif";
  for (let y = 0; y <= 10; y += 2) {
    const yy = yAt(y);
    ctx.beginPath();
    ctx.moveTo(pad.left, yy);
    ctx.lineTo(W - pad.right, yy);
    ctx.stroke();
    ctx.fillText(String(y), 30, yy + 5);
  }

  const data = [
    { label: "מצב רוח", value: Q1 },
    { label: "אנרגיה", value: Q2 },
    { label: "לחץ", value: Q3 },
    { label: "שינה", value: Q4 },
  ];

  const colors = ["#2F6DA8", "#4FA3A5", "#7C8DB5", "#5B7FA6"];
  const gap = 22;
  const barW = (plotW - gap * (data.length - 1)) / data.length;

  ctx.textAlign = "center";
  ctx.direction = "rtl";

  data.forEach((d, i) => {
    const x = pad.left + i * (barW + gap);
    const y = yAt(d.value);
    const h = (H - pad.bottom) - y;

    ctx.fillStyle = (d.value < 2) ? "#D64545" : colors[i];
    ctx.fillRect(x, y, barW, h);

    ctx.fillStyle = "rgba(0,0,0,0.85)";
    ctx.font = "16px sans-serif";
    ctx.fillText(String(d.value), x + barW / 2, y - 10);

    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.font = "15px sans-serif";
    ctx.fillText(d.label, x + barW / 2, H - pad.bottom + 35);
  });

  const insight = document.getElementById("insight-text");
  if (insight) {
    const avg = (Q1 + Q2 + Q3 + Q4) / 4;
    if (avg < 3) insight.textContent = "היום נראה מאתגר יותר מהרגיל. מומלץ לשים לב למה שעוזר לך ולהיעזר אם צריך.";
    else if (avg < 7) insight.textContent = "נראית יציבות כללית במצב הנוכחי, עם מקום לשיפור בחלק מהמדדים.";
    else insight.textContent = "נראה שמצבך הכללי היום טוב יחסית. המשכ/י לשמור על שגרה שתומכת בך.";
  }
}

// run chart only on summary page
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".summary_page")) {
    drawCurrentStateChart();
  }
});

