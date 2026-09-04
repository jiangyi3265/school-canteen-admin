// Reuse the uni-app source in the web preview without maintaining a second UI.
export default function canteenWeb() {
  return {
    name: 'canteen-uni-web',
    enforce: 'pre',
    transform(code, id) {
      const normalized = id.replaceAll('\\', '/')
      if (!normalized.includes('/src/canteen-mobile/components/') || !id.endsWith('.vue')) return
      return code.replace(/<(\/?)(view|text|image)(?=[\s/>])/g, (_, closing, tag) => `<${closing}${{ view: 'div', text: 'span', image: 'img' }[tag]}`).replaceAll('/static/canteen/', '/canteen/')
    }
  }
}
