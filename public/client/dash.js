function AddCard(classname, subtitle, id, image, color) {
    const start = document.getElementById('courses')
    var cardback = `background-image:url('${image}');`
    if (image == null) { cardback = ''}
    const course = `<div class="course-card" onclick="view(2); infomore(${id}, '${classname}')"><div class="course-card__image" style="${cardback}"><div class="course-card__fore"></div></div><div class="course-card__meta"><p class="course-card__title">${classname}</p><p class="course-card__subtitle">${subtitle}</p></div></div>`
    start.insertAdjacentHTML('beforeend', course)

}
function message() { return("It's about time for a failure again. Or maybe it'll be a yes. I sure do hope for the latter. The choice is yours though.")};
async function FetchDashCards() {
    try {
        const response = await fetch("/api/v1/dashboard/dashboard_cards")
        if (response.status != 200) {document.getElementById('courses').insertAdjacentText('beforebegin', 'Error: ' + response.status + response.statusText); return;}
        const cards = await response.json()
        return cards;
    } catch (error) {
        console.error(error)
        return null
    }
}
async function getNotifs(id) {
    return [{"title":"notifname", "p":"ooh a p element", "sup":"woah you so good you get 18463/3"}, {"title":":3c", "p":"how mind blowing", "sup":"woah you so BAD you get -1/3 points"}]
}
async function infomore(id, shortname) {
    updateCourseinfo(shortname, 'Loading...', '...', '...', id)
    const response = await fetch('/api/v1/courses/' + id)
    if (!response.ok) { return }
    const data = await response.json()
    await updateCourseinfo(shortname, data.course_code, data.enrollments[0].computed_current_score, 1, data.id)
}

async function updateCourseinfo(shortName, fullName, grade, assignmentsMissing, id) {
    var missingText = 'Assignments Missing';
    if (assignmentsMissing == 1) { missingText = 'Assignment Missing' };
    const stuff = [
        {"id":"classname","value":shortName},
        {"id":"fullname","value":fullName},
        {"id":"percent","value":grade + '%'},
        {"id":"missingNum","value":assignmentsMissing},
        {"id":"missingTxt","value":missingText}
    ]
    stuff.forEach(element => {
        document.getElementById(element.id).innerText = element.value
    });
    const morestuff = await getNotifs(id)
    var i = 1
    morestuff.forEach(idiot => {
        document.getElementById('notif' + i + 'title').innerText = idiot.title.toString()
        document.getElementById('notif' + i +'p').innerText = idiot.p
        document.getElementById('notif' + i +'sup').innerText = idiot.sup
        i++
    })
}
async function LoadDash() {
    changeBack()
    const cards = await FetchDashCards()
    if (cards == null) {return}
    cards.forEach(element => {
        AddCard(element.shortName, element.subtitle, element.id, element.image)
    });
    toggleLoader()
}
function changeBack() {
    document.body.style.backgroundImage = "linear-gradient(45deg, #669BBC, #003049)"
}
function toggleLoader() {
    document.getElementById('loader').style.display = 'none'
}
function view(num) {
    if (num == 1) {
        document.getElementById('right').style.display = 'none'
        document.getElementById('left').style.width = '100%'
        setTimeout(() => {
            document.getElementById('courseinfo').style.opacity = '0'
        }, 500);
    }
    if (num == 2) {
        document.getElementById('right').style.display = 'flex'
        document.getElementById('left').style.width = '50%'
        setTimeout(() => {
            document.getElementById('courseinfo').style.opacity = '1'
        }, 500);
    }
}
view(1)

LoadDash()

updateCourseinfo('shortName', 'fullName', 25, 3, 123456)