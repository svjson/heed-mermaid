(function() {
  class MermaidDiagramBlock extends Heed.AbstractContentSection {

    static renderQueue = [];
    static isRendering = false;

    constructor(section, slide) {
      super(section, slide);
    }

    static enqueue(renderJob) {
      this.renderQueue.push(renderJob);
      this.attemptRender();
    }

    static async attemptRender() {
      if (this.isRendering) return;
      this.isRendering = true;

      try {
        while (this.renderQueue.length > 0) {
          const mermaidEl = this.renderQueue.shift();
          await window.mermaid.init(undefined, mermaidEl);
          this.postMermaidRender(mermaidEl);
        }
      } catch (e) {
        console.error('Mermaid render error: ', e);
      } finally {
        this.isRendering = false;
      }
    }

    static postMermaidRender(mermaidEl) {
      if (Heed.plugins.mermaid.themeCss) {
        const styleBlock = mermaidEl.querySelector('svg').querySelector('style');
        styleBlock.textContent += Heed.plugins.mermaid.themeCss
      }

      const hideLabelsWithPrefix = Heed.plugins.mermaid.config?.hideLabelsWithPrefix;
      if (hideLabelsWithPrefix) {
        mermaidEl.querySelectorAll('text.commit-label').forEach(label => {
          if (label.textContent.startsWith(hideLabelsWithPrefix)) {
            label.parentNode.style.display = 'none';
          }
        });
      }
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
        queueMicrotask(() => {
          MermaidDiagramBlock.enqueue(main);
        });
      });

      this.applyCommonProperties(main);

      return namespace;
    }
  }

  window.Heed.ContentSectionRegistry.register('mermaid:diagram', MermaidDiagramBlock);
})();
