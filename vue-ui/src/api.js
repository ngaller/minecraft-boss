function call(path, body = null, method = null) {
  const options = {
    method: method || (body ? "POST" : "GET"),
    body
  };
  return fetch("/api" + path, options).then(response => {
    if (!response.ok) {
      // server returned a response, but there was an error.
      // parse and return the details if we can, or a generic error.
      return response.text().then(text => {
        try {
          const r = JSON.parse(text);
          if (r.details) {
            return Promise.reject(r.details);
          }
        } catch (e) {
          // parse error, ignore
        }
        window.console.warn("Unknown error from the server", text);
        return Promise.reject("Server is not available right now");
      });
    }
    return response.text().then(text => text && JSON.parse(text));
  });
}

export default {
  getServers() {
    return call("/servers");
  },
  controlServer(serverName, operation) {
    return call(
      `/servers/${encodeURIComponent(serverName)}/${encodeURIComponent(
        operation
      )}`,
      {}
    );
  },
  removeMod(serverName, mod) {
    return call(
      `/servers/${encodeURIComponent(serverName)}/mods/${encodeURIComponent(
        mod
      )}`,
      null,
      "DELETE"
    );
  },
  addMod(serverName, file) {
    const form = new FormData();
    form.append("file", file);
    return call(`/servers/${encodeURIComponent(serverName)}/mods`, form);
  }
};
