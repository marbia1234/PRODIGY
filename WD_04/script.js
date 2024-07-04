let i = 0;
let txt = 'Marbia Sohail'; 
let speed = 150;
let direction = 1;

function typeWriter() {
    if (direction === 1 && i < txt.length) {
        document.getElementById("typing").innerHTML += txt.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    } else if (direction === -1 && i > 0) {
        document.getElementById("typing").innerHTML = txt.substring(0, i - 1);
        i--;
        setTimeout(typeWriter, speed);
    } else if (i === txt.length) {
        direction = -1;
        setTimeout(typeWriter, 1000);
    } else if (i === 0) {
        direction = 1;
        setTimeout(typeWriter, 500);
    }
}

typeWriter();

function toggleMenu() {
    const sideMenu = document.getElementById('side-menu');
    if (sideMenu.style.left === '-250px') {
        sideMenu.style.left = '0';
    } else {
        sideMenu.style.left = '-250px';
    }
}
