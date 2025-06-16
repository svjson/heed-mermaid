(function() {
  class MermaidDiagramBlock extends Heed.AbstractContentSection {
    constructor(section, slide) {
      super(section, slide);
    }

    renderTo(el) {
      const [main, namespace] = this.createMainElement('div', {
        class: 'mermaid',
      })

      el.appendChild(main);

      const contentPromise = this.section.source
        ? Heed.loadResource(`${this.slide.path}${this.section.source}`)
        : Promise.resolve(this.section.content)

      contentPromise.then(content => {
        main.textContent = content;
        queueMicrotask(async () => {

          await window.mermaid.init(undefined, `#${this.section.id}`);

          if (Heed.plugins.mermaid.themeCss) {
            const styleBlock = main.querySelector('svg').querySelector('style');
            styleBlock.textContent += Heed.plugins.mermaid.themeCss

            const hideLabelsWithPrefix = Heed.plugins.mermaid.config?.hideLabelsWithPrefix;

            if (hideLabelsWithPrefix) {
              main.querySelectorAll('text.commit-label').forEach(label => {
                if (label.textContent.startsWith(hideLabelsWithPrefix)) {
                  label.parentNode.style.display = 'none';
                }
              });
            }
          }
        });
      });

      this.applyCommonProperties(main);

      return namespace;
    }
  }

  window.Heed.ContentSectionRegistry.register('mermaid:diagram', MermaidDiagramBlock);
})();
