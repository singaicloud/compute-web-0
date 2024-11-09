
class SingAPI {
    constructor(token, baseUrl="https://api.singaicloud.com") {
        this.baseUrl = baseUrl;
        this.token = token;
    }
    updateToken(token) {
        this.token = token;
    }
    async fetch(path, data, headers, options, redirect = true) {
        const url = `${this.baseUrl}${path}`;
        if (this.token) {       
            headers["Authorization"] = `Bearer ${this.token}`;
        }
        var response;
        if (data) {
            response = await fetch(url, { ...options, headers, body: data });
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
        return this.fetch(path, null, {}, {...options, method: "GET" });
    }
    post(path, data, options = {}) {
        return this.fetch(path, JSON.stringify(data), {"Content-Type": "application/json"}, {...options, method: "POST" });
    }
    postForm(path, data, options = {}) {
        return this.fetch(path, data, {}, {...options, method: "POST" });
    }
    download(path) {
        const url = `${this.baseUrl}${path}`;
        var headers = {};
        headers["Authorization"] = `Bearer ${this.token}`;
        fetch(url, {method: "GET", headers})
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.blob();  // Get the response as a blob
        })
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = path.split("/").pop();
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url); // Clean up the URL
        })
        .catch(error => {
          console.error(error);
        });

    }
    async login(username, password) {
        const response = await this.fetch("/login", 
            {hash: username, password},
            {"Content-Type": "application/json"},
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