import { useEffect, useState } from "react";

export default function FeedbackPrompt({
  formUrl,
  delayMs = 3500,
  storageKey = "feedback_prompt_dismissed_v1",
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!formUrl) return;

    // nie pokazuj, jeśli user już zamknął
    const dismissed = localStorage.getItem(storageKey);
    if (dismissed === "1") return;

    const t = setTimeout(() => setVisible(true), delayMs);
    return () => clearTimeout(t);
  }, [formUrl, delayMs, storageKey]);

  const close = () => {
    localStorage.setItem(storageKey, "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="feedback-toast" role="dialog" aria-live="polite">
      <div className="feedback-toast__inner">
        <div className="feedback-toast__title">Did you enjoy this questionnaire?</div>
        <div className="feedback-toast__text">
          Please leave quick feedback — it helps us improve the project.
        </div>

        <div className="feedback-toast__actions">
          <a
            className="btn-primary small"
            href={formUrl}
            target="_blank"
            rel="noreferrer"
          >
            Leave feedback
          </a>
          <button className="btn-ghost small" onClick={close} type="button">
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}