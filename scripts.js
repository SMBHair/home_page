function save() {
    localStorage.setItem("localdata", document.getElementById("data").value);
    raw = localStorage.getItem("localdata");
    if (raw != null) organize();
}

function organize() {
    while (todo.firstChild) {
        todo.removeChild(todo.firstChild);
    }

    var today = new Date();
    var tasks = [];

    class task {
        constructor(title, date, description, highlight, id) {
            this.title = title;
            this.date = date;
            this.description = description;
            this.highlight = highlight;
            this.id = "container" + id;
        }

        date_time = Date.parse(date);

        convertDate() {
            let x = new Date(this.date_time);
            x = new Date(x.getTime() - x.getTimezoneOffset() * -60000); // credit to @tpartee on stackoverflow
            this.date = weekdays[x.getDay()] + " " + (x.getMonth() + 1)+ "-" + x.getDate();
        }   

        createContainer() {
            let x = document.createElement("div");
            x.setAttribute("id", this.id);
            document.getElementById("todo").appendChild(x);
        }

        displayDate() {
            let x = document.createElement("div");
            x.setAttribute("class", "date");
            x.innerHTML = this.date;
            document.getElementById(this.id).appendChild(x);
        }

        displayTitle() {
            let x = document.createElement("div");
            x.setAttribute("class", "title");
            x.innerHTML = this.title;
            document.getElementById(this.id).appendChild(x);
        }

        displayDescription() {
            var x = document.createElement("div");
            var y = document.createElement("span");
            x.setAttribute("class", "description");
            y.innerHTML = this.description;
            if (this.highlight) {
                y.setAttribute("class", "description highlight");
            }
            document.getElementById(this.id).appendChild(x);
            x.appendChild(y);
        }
    }

    /* find arrows */
    var arrows = []; 
    for (let i = 0; i < raw.length; i++) {
        if (raw[i] == "-" && raw[i + 1] == "-" && raw[i + 2] == ">") arrows.push(i);
    }

    for (let i = 0; i < arrows.length; i++) {
        var title, date, description, highlight, id;
        highlight = false;
        id = i;

        /* descriptions */
        if (raw.lastIndexOf("\n", arrows[i]) > 0) {
            description = raw.substring(raw.lastIndexOf("\n", arrows[i]) + 1, arrows[i]);
        }
        else {
            description = raw.substring(0, arrows[i]);
        }

        /* dates */
        if (raw.indexOf("\n", arrows[i] + 3) > 0) {
            date = raw.substring(arrows[i] + 3, raw.indexOf("\n", arrows[i] + 3)).trim();
        }
        else {
            date = raw.substring(arrows[i] + 3, raw.length).trim();
        }
    
        let y = date.substring(0, date.indexOf("-"));
        if (y.length > 0) {
            if (y >= today.getMonth() + 1) {
                date = today.getFullYear() + "-" + date;
            }
            else if (y < today.getMonth() + 1) {
                date = today.getFullYear() + 1 + "-" + date;
            }
        }

        /* if date has hashtag @ end, remove hashtag + highlight */
        if (date.substring(date.length - 1, date.length) == "#") {
            date = date.substring(0, date.length-1).trim();
            highlight = true;
        }

        /* titles */
        if (raw.lastIndexOf("//", arrows[i]) >= 0) {
                title = raw.substring(raw.lastIndexOf("//", arrows[i]) + 2, raw.indexOf("\n", raw.lastIndexOf("//", arrows[i])));
        }

        const x = new task(title, date, description, highlight, id);
        tasks.push(x);
    }

    /* tasks list reorganize */
    for (i = 0; i < tasks.length; i++) {
        if (!(tasks[i].date_time > -1)) {
            tasks.splice(i, 1);
        }
    }
    tasks = tasks.sort(function(a, b) {
        return a.date_time - b.date_time;
    });

    /* creating tasks */
    for (i = 0; i < tasks.length; i++) {
        tasks[i].createContainer();
        tasks[i].convertDate();
        if (i == 0) {
            tasks[0].displayDate();
        } else if (tasks[i].date != tasks[i - 1].date) {
            tasks[i].displayDate();
        }
        tasks[i].displayTitle();
        tasks[i].displayDescription();
    }
}

function time() {
    let x = document.getElementById("current_time")
    y = new Date();
    z = y.getHours() + ":" + y.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2}) + ":" + y.getSeconds().toLocaleString('en-US', {minimumIntegerDigits: 2}) + "AM";
    if (y.getHours() > 12) {
        z = y.getHours() - 12 + ":" + y.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2}) + ":" + y.getSeconds().toLocaleString('en-US', {minimumIntegerDigits: 2}) + "PM";
    }
    if (y.getHours() == 0) {
        z = "12:"+ y.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2}) + ":" + y.getSeconds().toLocaleString('en-US', {minimumIntegerDigits: 2}) + "AM";
    }
    x.innerHTML = weekdays[y.getDay()] + " " + (y.getMonth() + 1) + "-" + y.getDate() + "-" + y.getFullYear() + " " + z;
}

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var raw = localStorage.getItem("localdata");
document.getElementById("data").value = raw;

if (raw != null) organize();
time();

document.getElementById("data").addEventListener("input", (e) => {save()});

setInterval(time, 1000);