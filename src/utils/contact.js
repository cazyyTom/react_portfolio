export function initContact(signal) {
  const email = document.querySelector("[data-email]");
  const button = document.querySelector("[data-copy]");
  if (!navigator.clipboard?.writeText) return;
  button.hidden = false;
  const address = email.textContent;
  for (const control of [email, button]) {
    const label = control.textContent;
    let timeout;
    control.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(address);
      } catch {
        return;
      }
      if (signal.aborted) return;
      control.textContent = control.dataset.copied;
      clearTimeout(timeout);
      timeout = setTimeout(() => { control.textContent = label; }, 2000);
    }, { signal });
    signal.addEventListener("abort", () => {
      clearTimeout(timeout);
      control.textContent = label;
    }, { once: true });
  }
}
