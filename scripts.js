function save() {

    localStorage.setItem("localdata", document.getElementById("data").value);
    raw = localStorage.getItem("localdata");
    organize()

}

function organize() {
    while (todo.firstChild) {
        todo.removeChild(todo.firstChild);
    }

    var today = new Date();
    var tasks = [];

    class task {
        constructor(title, date, description) {
            this.title = title;
            this.date = date;
            this.description = description;
        }

        date_time = Date.parse(date);

        convertDate() {
            let x = new Date(this.date_time);
            x = new Date(x.getTime() - x.getTimezoneOffset() * -60000); // credit to @tpartee on stackoverflow
            this.date = weekdays[x.getDay()] + " " + (x.getMonth() + 1)+ "-" + x.getDate();
        }   

        displayDate() {
            let x = document.createElement("div");
            x.setAttribute("class", "date");
            x.innerHTML = this.date;
            document.getElementById("todo").appendChild(x);
        }

        displayTitle() {
            let x = document.createElement("div");
            x.setAttribute("class", "title");
            x.innerHTML = this.title;
            document.getElementById("todo").appendChild(x);
        }

        displayDescription() {
            var x = document.createElement("div");
            x.setAttribute("class", "description");
            x.innerHTML = this.description;
            document.getElementById("todo").appendChild(x);
        }
    }

    var arrows = []; 
    for (let i = 0; i < raw.length; i++) {
        if (raw[i] == "-" && raw[i + 1] == "-" && raw[i + 2] == ">") arrows.push(i);
    }

    for (let i = 0; i < arrows.length; i++) {
        var title, date, description;

        /* descriptions */
        if (raw.lastIndexOf("\n", arrows[i]) > 0) {
            description = raw.substring(raw.lastIndexOf("\n", arrows[i]) + 1, arrows[i]);
        }
        else {
            description = raw.substring(0, arrows[i]);
        }

        /* dates */
        if (raw.indexOf("\n", arrows[i] + 3) > 0) {
            date = raw.substring(arrows[i] + 3, raw.indexOf("\n", arrows[i] + 3));
        }
        else {
            date = raw.substring(arrows[i] + 3, raw.length);
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
        else {
            date = NaN;
        }

        /* titles */
        if (raw.lastIndexOf("//", arrows[i]) > 0) {
            title = raw.substring(raw.lastIndexOf("//", arrows[i]) + 2, raw.indexOf("\n", raw.lastIndexOf("//", arrows[i])));
        }
        else {
            title = undefined;
        }

        const x = new task(title, date, description);
        tasks.push(x);
    }

    for (i = 0; i < tasks.length; i++) {
        if (!(tasks[i].date_time > -1)) {
            tasks.splice(i, i);
            i--;
        }
    }
    tasks = tasks.sort(function(a, b) {
        return a.date_time - b.date_time;
    });

    for (i = 0; i < tasks.length; i++) {
        tasks[i].convertDate();
        if (i > 0) {
            if (tasks[i].date != tasks[i - 1].date) {
                tasks[i].displayDate();
            }
        } else {
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
    x.innerHTML = weekdays[y.getDay()] + " " + (y.getMonth() + 1) + "-" + y.getDate() + "-" + y.getFullYear() + " " + z;
}

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var raw = localStorage.getItem("localdata");
document.getElementById("data").value = raw;

organize();
time();

document.getElementById("data").addEventListener("input", (e) => {save()});

setInterval(time, 1000);