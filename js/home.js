/** @typedef {{id:number,title:string,message:string,shortMessage:string,timestamp?:Date,icon?:string}} Broadcast */

let feed = document.querySelector(".feed .item-list .s-edge-feed");

/**
 * Creates a post from a broadcast
 * @param {Broadcast} broadcast 
 */
function postFromBroadcast(broadcast) {
    let element = createElement("li", ["splus-broadcast-post"], { id: `broadcast${broadcast.id}`, timestamp: (broadcast.timestamp ? new Date(broadcast.timestamp).getTime() : Date.now()) / 1000 }, [
        createElement("div", ["s-edge-type-update-post", "sUpdate-processed"], {}, [
            createElement("div", ["edge-item"], {}, [
                createElement("div", ["edge-left"], {}, [
                    createElement("div", ["picture"], {}, [
                        createElement("a", ["sExtlink-processed"], { href: "", title: "Schoology Plus Broadcast" }, [
                            createElement("div", ["profile-picture-wrapper"], {}, [
                                createElement("div", ["profile-picture"], {}, [
                                    createElement("img", ["imagecache", "imagecache-profile_sm"], { src: chrome.runtime.getURL("imgs/icon@128.png"), alt: "Schoology Plus Logo" })
                                ])
                            ])
                        ])
                    ])
                ]),
                createElement("div", ["edge-main-wrapper"], {}, [
                    createElement("span", ["edge-sentence"], {}, [
                        createElement("div", ["update-sentence-inner"], {}, [
                            createElement("a", ["sExtlink-processed"], { textContent: "SCHOOLOGY PLUS" }),
                            createElement("span", ["blue-arrow-right"], {}, [
                                createElement("span", ["visually-hidden"], { textContent: "posted to" })
                            ]),
                            createElement("a", ["sExtlink-processed"], { textContent: "Schoology Plus Announcements" }),
                            createElement("span", ["splus-broadcast-close"], { textContent: "×", title: "Dismiss notification" }),
                            createElement("span", ["update-body", "s-rte"], {}, [
                                createElement("p", [], {}, [
                                    createElement("strong", [], { textContent: broadcast.title })
                                ]),
                                createElement("p", [], { innerHTML: broadcast.message })
                            ])
                        ])
                    ]),
                    createElement("span", ["edge-main"], {}, [
                        createElement("div", ["post-body"])
                    ]),
                    createElement("div", ["edge-footer"], {}, [
                        createElement("div", ["created"], {}, [
                            createElement("span", ["small", "gray"], { textContent: `${formatDateAsString(new Date(broadcast.timestamp || undefined))} | This post is pinned to the top` })
                        ])
                    ])
                ])
            ])
        ])
    ]);

    let arrow = element.querySelector(".blue-arrow-right");
    arrow.insertAdjacentText("beforebegin", " ");
    arrow.insertAdjacentText("afterend", " ");

    let closeButton = element.querySelector(".splus-broadcast-close");
    closeButton.dataset.broadcastId = broadcast.id;
    closeButton.addEventListener("click", dismissNotification);

    return element;
}

function dismissNotification(event) {
    let id = event.target.dataset.broadcastId;
    let unreadBroadcasts = storage.unreadBroadcasts;
    unreadBroadcasts.splice(unreadBroadcasts.findIndex(x => x.id == id), 1);
    storage.unreadBroadcasts = unreadBroadcasts;
    chrome.storage.sync.set({ unreadBroadcasts: unreadBroadcasts });
    document.getElementById(`broadcast${id}`).outerHTML = "";
}

function formatDateAsString(date) {
    return `${date.toLocaleString("en-US", { weekday: "short" })} ${date.toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric" })} at ${date.toLocaleString("en-US", { hour: "numeric", minute: "2-digit" }).toLowerCase()}`;
}

if (storage.broadcasts !== "disabled") {
    for (let broadcast of storage.unreadBroadcasts || []) {
        feed.insertAdjacentElement("afterbegin", postFromBroadcast(broadcast));
    }
}
