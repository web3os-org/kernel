/* global document */
const sanitizeName = (name) => {
  return name.toLowerCase().replace(/\ /g, '-').replace(/(\(|\))/g, '') // art or monstrosity, you decide
}

(function() {
  const listAnchors = Array.from(document.querySelectorAll('section.readme article li a')).filter(a => Boolean(a.href.split('#')[1]))
  for (const a of listAnchors) {
    const text = sanitizeName(a.innerText)
    const heading = Array.from(document.querySelectorAll(`h2`)).find(h => sanitizeName(h.innerText) === text)
    heading.id = text
  }
})();
