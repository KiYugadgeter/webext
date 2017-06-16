const token = "dummy_token"
const key = "example_key"
const page = 1;
const pagesize = 100;
const container = document.getElementById("container");
const ul = document.querySelector("ul");
function buildRequest(site_domain) {
    let url = `https://api.stackexchange.com/2.2/me/inbox/unread?key=${key}&site=${site_domain}&page=${page}&pagesize=${pagesize}&access_token=${token}&filter=withbody`
    let req = new Request(url, {mode: "cors"});
    return req;
}
function activateTemplate(site, title, icon_url, body, link) {
    let t = document.getElementById("mytemplate");
    t.content.querySelector("a.link").href = link;
    t.content.querySelector("img").src = icon_url;
    t.content.querySelector("div.title").textContent = title;
    t.content.querySelector("div.content").textContent = body;
    let clone = document.importNode(t.content, true);
    return clone;

}
function display_nothing_message() {
    ul.style.display = "none";
    const nothing = document.getElementById("nothing");
    container.classList.add("flexize");
    const body = document.querySelector("body");
    body.classList.add("set_height_250")
    nothing.style.display = "block";
}
let items = [];
let req = buildRequest("stackoverflow.com");
fetch(req).then((res) => {
    return res.json()
}).then((res) => {
    if (res.items.length !== 0) {
        for (let w of res.items) {
            let data = {"site": w.site.name, "title": w.title, "body": w.body, "link": w.link, "item_type": w.item_type, "icon_url": w.site.icon_url};
            console.log(data);
            const node = activateTemplate(data.site, data.title, data.icon_url, data.body, data.link)
            ul.appendChild(node);
        }
    }
    else if (res.items.length === 0){
        display_nothing_message();
    }
}).catch(() => { display_nothing_message() })
document.addEventListener("click", (e) => {
    if (e.target.tagName == "li" && e.target.dataset.link) {
        let executing = browser.tabs.executeScript(null, {"file": "content_scripts/content.js"})
        executing.then((res) => {
            return browser.tabs.query({"active": true, "currentWindow": true});
        }).then((tabs) => {
            return browser.tabs.sendMessage(tabs[0].id, {"link": e.target.dataset.link})
        }).then((response) => {
            console.table(response);
        });

    }
}, false)
