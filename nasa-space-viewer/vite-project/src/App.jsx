import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./App.css";

function getRandomDate() {
  const start = new Date(1995, 5, 16);
  const end = new Date();
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().slice(0, 10);
}

export default function App() {
  const [data, setData] = useState(null);
  const [randomized, setRandomized] = useState(false);
  const [loading, setLoading] = useState(true);

  function fetchAPOD(date = null, isRandom = false) {
    setLoading(true);
    let url = `https://api.nasa.gov/planetary/apod?api_key=${import.meta.env.VITE_NASA_API_KEY}&thumbs=true`;
    if (date) url += `&date=${date}`;
    axios
      .get(url)
      .then(res => {
        if (
          (res.data.media_type === "image" && res.data.url) ||
          (res.data.media_type === "video" && res.data.url)
        ) {
          setData(res.data);
          setRandomized(isRandom);
          setLoading(false);
        } else if (!date) {
          fetchAPOD(getRandomDate(), true); /* If today's APOD is not image/video, get a random one */
        } else {
          fetchAPOD(getRandomDate(), true); /* If random date fails, try another random date */
        }
      })
      .catch(() => setLoading(false));
  }

  useEffect(() => {
    fetchAPOD();
  }, []);

  function handleRandomize() {
    fetchAPOD(getRandomDate(), true);
  }

  function renderMedia() {
    if (data.media_type === "image" && data.url) {
      return (
        <motion.img
          src={data.url}
          alt={data.title}
          className="apod-media"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        />
      );
    }
    if (data.media_type === "video" && data.url) {
      if (data.thumbnail_url) {
        return (
          <motion.img
            src={data.thumbnail_url}
            alt="Video thumbnail"
            className="apod-media"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          />
        );
      }
      return (
        <iframe
          title="nasa-video"
          src={data.url}
          width="80%"
          height="500px"
          allow="autoplay; encrypted-media"
          className="apod-media"
          style={{ borderRadius: "18px", marginTop: "20px", background: "rgba(0,0,0,0.6)" }}
        ></iframe>
      );
    }
    return (
      <p style={{ marginTop: "20px", color: "#888" }}>
        No image, animation, or video available.<br />
      </p>
    );
  }

  return (
    <div className="future-bg">
      <header className="future-header">
        <h2>
          <span className="logo-glow">🚀</span> NASA Space Viewer
        </h2>
        <p className="subtitle">Explore the cosmos, one day at a time</p>
      </header>
      <motion.div
        className="future-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        {loading ? (
          <p className="loading">Loading space wonders...</p>
        ) : (
          <>
            <motion.h1 initial={{ y: -50 }} animate={{ y: 0 }} transition={{ duration: 0.8 }}>
              {data.title}
            </motion.h1>
            {randomized && (
              <motion.p
                style={{ color: "#00ffe7", marginBottom: "10px", fontWeight: 600, letterSpacing: 1 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                Couldn't get today's matching image/video.<br/>Enjoy this random one from the archive!
              </motion.p>
            )}
            {renderMedia()}
            <motion.p
              style={{ maxWidth: "700px", margin: "20px auto", fontSize: "1.15em", color: "#e0e0e0" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            >
              {data.explanation}
            </motion.p>
            <button className="future-btn" onClick={handleRandomize}>
              Randomize from Archive
            </button>
          </>
        )}
      </motion.div>
      <footer className="future-footer">
        <span>
          Made with <span style={{ color: "#00ffe7" }}>React</span> & NASA API · {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  );
}


