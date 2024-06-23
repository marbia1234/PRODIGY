function includeHTML() {
    var z, i, elmnt, file, xhttp;
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        file = elmnt.getAttribute("w3-include-html");
        if (file) {
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) { elmnt.innerHTML = this.responseText; }
                    if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
                    elmnt.removeAttribute("w3-include-html");
                    includeHTML();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            return;
        }
    }
}

includeHTML();

window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');
    const links = navbar.querySelectorAll('a');


    let scrollPos = window.scrollY;

    let maxScroll = document.body.scrollHeight - window.innerHeight;

    let scrollPercentage = Math.min(scrollPos / maxScroll, 1);

    let startColor = [0, 51, 102, 0.9];
    let endColor = [255, 255, 255, 0.9];

    let currentColor = startColor.map((start, index) => {
        return start + (endColor[index] - start) * scrollPercentage;
    });

    let backgroundColor = `rgba(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]}, ${currentColor[3]})`;
    navbar.style.backgroundColor = backgroundColor;

    let startTextColor = [255, 255, 255];
    let endTextColor = [0, 0, 0];

    let currentTextColor = startTextColor.map((start, index) => {
        return start + (endTextColor[index] - start) * scrollPercentage;
    });

    let textColor = `rgb(${currentTextColor[0]}, ${currentTextColor[1]}, ${currentTextColor[2]})`;
    links.forEach(link => {
        link.style.color = textColor;
    });
});
