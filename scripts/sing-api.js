
class SingAPI {
    constructor(token, baseUrl="https://api.singaicloud.com") {
        this.baseUrl = baseUrl;
        this.token = token;
    }
    updateToken(token) {
        this.token = token;
    }
    async fetch(path, data = {}, options = {}, redirect = true) {
        const url = `${this.baseUrl}${path}`;
        console.log(`fetching ${url}`);
        const headers = {
            "Authorization": this.token ? `Bearer ${this.token}` : undefined,
        };
        var response;
        if (data) {
            headers["Content-Type"] = "application/json";
            response = await fetch(url, { ...options, headers, body: JSON.stringify(data) });
        } else {
            response = await fetch(url, { ...options, headers });
        }
        if (response.status === 401) {
            if (redirect) {
                window.location.href = "/login.html";
            };
            return;
        }
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    }
    get(path, options = {}) {
        return this.fetch(path, null, {...options, method: "GET" });
    }
    post(path, data, options = {}) {
        return this.fetch(path, data, {...options, method: "POST" });
    }
    async login(username, password) {
        const response = await this.fetch("/login", 
            {hash: username, password},
            {method: "POST"},
            false,
        );
        if (response && response.token) {
            this.updateToken(response.token);
            // set cookie with 1 year expiration
            document.cookie = `token=${response.token};max-age=31536000;path=/`;
            return true;
        } 
        return false;
    }
}

// read token from cookie
const token = document.cookie.split(";").find((c) => c.startsWith("token="))?.split("=")[1];
var api = new SingAPI(token);