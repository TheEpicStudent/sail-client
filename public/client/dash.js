function AddCard(classname, subtitle, href, image, color) {
    const start = document.getElementById('courses')
    var cardback = `background-image:url('${image}');`
    if (image == null) { cardback = ''}
    const course = `<div class="course-card"><div class="course-card__image" style="${cardback}"><div class="course-card__fore"></div></div><div class="course-card__meta"><p class="course-card__title">${classname}</p><p class="course-card__subtitle">${subtitle}</p></div></div>`
    start.insertAdjacentHTML('beforeend', course)

}
async function FetchDashCards() {
    try {
        const response = await fetch("/api/v1/dashboard/dashboard_cards")
        if (response.status != 200) {document.getElementById('courses').insertAdjacentText('beforebegin', 'Error: ' + response.status + response.statusText); return;}
        const cards = response.json()
        return cards;
    } catch (error) {
        
    }
}
async function LoadDash() {
    const cards = await FetchDashCards()
    if (cards == null) {return}
    cards.forEach(element => {
        AddCard(element.shortName, element.subtitle, element.href, element.image)
    });
    toggleLoader()
}
function toggleLoader() {
    document.getElementById('loader').style.display = 'none'
}
LoadDash()