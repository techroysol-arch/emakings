import {
  Sparkles,
  ArrowUpRight,
  Heart,
  Gift,
  ChevronRight,
  Check,
  MoreHorizontal,
} from "lucide-react";
export function ProductPreview() {
  return (
    <div
      className="preview-scene"
      aria-label="Illustrative Emakings product preview"
    >
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="preview-window">
        <div className="window-bar">
          <div className="window-dots">
            <i />
            <i />
            <i />
          </div>
          <span>SAMPLE WORKSPACE · ILLUSTRATIVE PREVIEW</span>
          <MoreHorizontal size={15} />
        </div>
        <div className="preview-body">
          <div className="preview-greeting">
            <span className="tiny muted">
              A little thought goes a long way.
            </span>
            <h3>
              Good morning, Alex <span className="wave">✳</span>
            </h3>
            <p>Here’s who could use a little love today.</p>
          </div>
          <div className="occasion-preview">
            <span className="date-tile">
              <b>18</b>
              <small>NOV</small>
            </span>
            <div>
              <strong>Your anniversary with Jamie</strong>
              <p>3 years of little moments. Make this one special.</p>
            </div>
            <span className="pill">In 7 days</span>
          </div>
          <div className="assistant-preview">
            <div className="assistant-label">
              <span className="sparkle-box">
                <Sparkles size={17} />
              </span>
              <strong>A little inspiration, just for you</strong>
              <span className="tiny muted">EMAKINGS AI</span>
            </div>
            <p>
              Jamie loves books and quiet adventures. How about a bookshop date,
              followed by coffee at your favourite spot?
            </p>
            <div className="preview-chips">
              <span>
                <Gift size={12} /> A thoughtful gift
              </span>
              <span>
                <Heart size={12} /> A moment together
              </span>
            </div>
            <div className="preview-prompt">
              Help me find the right words…{" "}
              <span>
                <ArrowUpRight size={15} />
              </span>
            </div>
          </div>
          <div className="preview-bottom">
            <span>
              <i className="status-dot" /> A little closer, every day.
            </span>
            <span>
              View your space <ChevronRight size={12} />
            </span>
          </div>
        </div>
      </div>
      <div className="float-card message-float">
        <span className="float-icon pink">
          <Heart size={17} />
        </span>
        <div>
          <span className="eyebrow micro">THE RIGHT WORDS</span>
          <p>
            “Three years, a thousand little
            <br />
            moments. You’re still my favourite.”
          </p>
          <span className="tiny muted">
            <Sparkles size={10} /> A note that sounds like you
          </span>
        </div>
      </div>
      <div className="float-card insight-float">
        <span className="float-icon green">
          <Check size={18} />
        </span>
        <div>
          <strong>Small gestures. Real connection.</strong>
          <p>Make time for a moment together.</p>
        </div>
        <span className="mini-bars">
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>
      </div>
    </div>
  );
}
