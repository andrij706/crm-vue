const pluginMessage = {
  install(app) {
    const messagePlugin = (html) => {
      M.toast({ html });
    };
    app.config.globalProperties.$messagePlugin = messagePlugin;
    app.provide("messagePlugin", messagePlugin);
  },
};

const pluginErrorMessage = {
  install(app) {
    const errorPlugin = (html) => {
      M.toast({ html: `[Помилка]: ${html}` });
    };
    app.config.globalProperties.$errorPlugin = errorPlugin;
    app.provide("errorPlugin", errorPlugin);
  },
};

export { pluginMessage, pluginErrorMessage };
