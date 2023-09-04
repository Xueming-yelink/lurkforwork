function Router(routes, defaultRoute) {
    var othis = this;

    routes && othis.init(routes, defaultRoute);

    window.addEventListener("hashchange", function() {
        let route = location.hash.slice(1) || "";
        othis.oldRoute = othis.currentRoute;
        othis.currentRoute = route;
        othis.changePage(route);
        this.window.location.reload()
    });
}

Router.prototype.init = function(routes, defaultRoute) {
    if (!routes || !routes.length) {
        console.error("Router init fail：routes error！");
        return;
    }
    this.routes = routes;
    this.currentRoute = location.hash.slice(1) || defaultRoute || routes[0].id;
    if(this.currentRoute.includes('=')){
        this.currentRoute = this.currentRoute.split("=")[0]
    }
    this.oldRoute = "";
    location.hash || history.replaceState(null, null, '#' + this.currentRoute);
    this.changePage(this.currentRoute);
    this.oldRoute = location.hash.slice(1);
}

Router.prototype.push = function(route, callback) {
    switch (typeof(route)) {
        case "string":
            break;
        case "number":
            route = this.routes[route] || "";
            break;
        case "object":
            route = route.id || "";
            break;
        case "undefined":
        default:
            route = location.hash.slice(1) || "";
            break;
    }
    location.hash = route;
}

Router.prototype.changePage = function(route) {
    if (!this.routes || !this.routes.length) {
        return;
    }
    for (let i = 0; i < this.routes.length; i++) {
        let e = document.getElementById(routes[i].id);
        if (routes[i].id == route) {
            e && (e.style.display = "block");
            (typeof(routes[i].title) === "string") && routes[i].title && (document.title = routes[i].title);
            (typeof(routes[i].handler) === "function") && routes[i].handler();
        } else {
            e && (e.style.display = "none");
        }
    }
}