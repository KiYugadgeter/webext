const token = "OF*PuHPelnuk1V(8Rh78tw))"
const key = "lym6kc*SoC)ppQE*sRvAcg(("
const page = 1;
const pagesize = 100;
let registered_sites = {
    stackoverflow: {
        user_id: "5138909",
        api_site_param: "stackoverflow"

    },
    stackoverflow_ja: {
        user_id: "5246",
        api_site_param: "ja.stackoverflow"
    },
    ask_ubuntu: {
        user_id: "562632",
        api_site_param: "askubuntu"
    },
    ask_different: {
        user_id: "156755",
        api_site_param: "apple"
    }
}

function buildRequest(site_name) {
    let site = registered_sites[site_name];
    if (!site) console.error("You didn't register " + site_name);
    let url = `https://api.stackexchange.com/2.2/users/${site.user_id}/inbox/unread?key=${key}&site=${site.api_site_param}&page=${page}&pagesize=${pagesize}&access_token=${token}&filter=withbody`
    let req = new Request(url, {mode: "cors"});
    return req;
}



browser.browserAction.onClicked.addListener(() => {
    let site_names = Object.keys(registered_sites);
    items = [];
    for (v of site_names) {
        let req = buildRequest(v);
        fetch(req).then((res) => {
            return res.json()
        }).then((res) => {
            if (res.items.length !== 0)
                for (w of res.items) {
                    items.push({"site": w.site.name, "title": w.title, "body": w.body, "link": w.link});
                    console.table(w);
                }
        })
    }

}) 
