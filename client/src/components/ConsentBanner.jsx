// Asks before any analytics run. Hotjar starts only after "Allow".
export default function ConsentBanner({ onChoose }) {
  return (
    <div className="consent" role="dialog" aria-labelledby="consent-title" aria-describedby="consent-text">
      <div className="consent-copy">
        <strong id="consent-title">Can we watch how you play?</strong>
        <p id="consent-text">
          We use Hotjar to record clicks, scrolling and the copy you write in the game, so we can make it better.
          The game never asks for your name or email. You can change this anytime from the title screen.
        </p>
      </div>
      <div className="consent-actions">
        <button className="btn btn-ghost btn-sm" onClick={() => onChoose('denied')}>No thanks</button>
        <button className="btn btn-primary btn-sm" onClick={() => onChoose('granted')}>Allow</button>
      </div>
    </div>
  );
}
