export default function AboutPage() {
  return (
    <main className="container about-page">
      <h1>About Sommy Wears</h1>
      
      <div className="about-content">
        <div className="about-text">
          <h2>Your Style, Our Passion</h2>
          <p>
            At Sommy Wears, we believe that style is more than just clothing, 
            it's about confidence, self-expression, and putting your best foot 
            forward every day.
          </p>
          <p>
            We bring you premium men's fashion. From classic polos and casual 
            shorts to tailored trousers and matching sets. Every piece is 
            handpicked for quality, comfort, and timeless style.
          </p>
          <p>
            Because looking good shouldn't be complicated.
          </p>
        </div>
        <div className="about-image">
          <img 
            src="/images/logo 3.jpeg"
            alt="Sommy Wears fashion" 
          />
        </div>
      </div>

      <div className="about-values">
        <div className="value-card">
          <h3> Quality</h3>
          <p>We select only the finest materials for lasting comfort and style.</p>
        </div>
        <div className="value-card">
          <h3> Style</h3>
          <p>Timeless designs that never go out of fashion.</p>
        </div>
        <div className="value-card">
          <h3> Trust</h3>
          <p>Your satisfaction is our priority — guaranteed.</p>
        </div>
      </div>
    </main>
  )
}