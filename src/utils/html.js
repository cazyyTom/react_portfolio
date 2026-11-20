function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

// All section templates receive pre-escaped text for text nodes and quoted attributes.
export function escapeContent(content) {
  return JSON.parse(JSON.stringify(content), (_, value) =>
    typeof value === "string" ? escapeHtml(value) : value);
}

export function link({ href, label }, attributes = "") {
  return `<a href="${href}" ${attributes}>${label}</a>`;
}

export function list(items, renderItem) {
  return items.map(renderItem).join("\n");
}
