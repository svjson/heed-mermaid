(function() {

  class MermaidInitHook {

    constructor(cfg) {
      this.cfg = cfg;
      this.config = cfg?.presentation?.getPluginConfig('mermaid') ?? {};
    }

    async applyHook() {
      Heed.plugins.mermaid.themeCss = this.config?.themeCssFile
       ? await Heed.loadResource(this.config.themeCssFile)
       : null;

      window.mermaid.initialize({
        theme: this.config?.theme ?? 'default',
        themeVariables: this.config?.themeVariables ?? {},
        startOnLoad: false
      });
    }
  };

  Heed.HookRegistry.register('mermaid:init', MermaidInitHook, ['init']);

})();
