import { Link } from "react-router-dom";
import image from "../../assets/alexandra-gold--1arfQkE9IQ-unsplash.jpg";

export default function Header() {
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage: `url(${image})`,
      }}
    >
      <div className="hero-overlay "></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md">
          <h1 className="mb-5 text-6xl font-bold">ศูนย์นันทนาการ ดอนเมือง</h1>
          {/* <p className="mb-5">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p> */}
          <Link to="/activities">
            <button className="btn btn-primary">เลือกดูกิจกรรม</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
