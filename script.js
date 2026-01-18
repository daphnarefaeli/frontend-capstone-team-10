function saveMood () {
    const MoodValue1 = document.getElementById('mood-slider1').value;
    const MoodValue2 = document.getElementById('mood-slider2').value;
    const MoodValue3 = document.getElementById('mood-slider3').value;
    const MoodValue4 = document.getElementById('mood-slider4').value;


const entry = {
        date: new date().toLocaleDateString(),
        score: moodValue
    };

    let history = JSON.parse(localStorage.getItem('MoodHistory')) || [];

    History.push(entry);

    localStorage.setItem('MoodHistory',JSON.stringify(history));
}
