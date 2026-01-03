"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const bozin = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] as const;
const lidija = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] as const;
const operatori = ["Minus", "Plus", "Po"] as const;

type OperatorKey = (typeof operatori)[number];

export default function RandomAudio() {
  const [currentText, setCurrentText] = useState("");
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [finalImages, setFinalImages] = useState<string[]>([]);
  const [containerSize, setContainerSize] = useState(200); // exact size for both images
  const [isPlaying, setIsPlaying] = useState(false);

  // Calculate responsive size for both images
  useEffect(() => {
    const updateSize = () => {
      const maxWidth = window.innerWidth;
      const size = Math.min(200, Math.floor((maxWidth - 32 - 12) / 2));
      // 32px padding, 12px gap between two images
      setContainerSize(size);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleClick = async () => {
    if (isPlaying) return;
    setIsPlaying(true);

    setCurrentText("");
    setCurrentImage(null);
    setFinalImages([]);

    const bozinBrojka = bozin[Math.floor(Math.random() * bozin.length)];
    const lidijaBrojka = lidija[Math.floor(Math.random() * lidija.length)];
    const operatoriZvuk = operatori[
      Math.floor(Math.random() * operatori.length)
    ] as OperatorKey;

    const operatorMap: Record<OperatorKey, string> = {
      Plus: "+",
      Minus: "-",
      Po: "×",
    };

    const operatorTransform = operatorMap[operatoriZvuk] ?? "*";

    const firstIsBozin = Math.random() < 0.5;

    const bozinImg = "/images/bozin.jpg";
    const lidijaImg = "/images/lidija.jpg";

    const steps = firstIsBozin
      ? [
          {
            text: `${bozinBrojka}`,
            src: `/sounds/brojki-bozin/${bozinBrojka}.m4a`,
            image: bozinImg,
            isSpeaker: true,
          },
          {
            text: `${bozinBrojka} ${operatorTransform}`,
            src: `/sounds/operatori/${operatoriZvuk}.m4a`,
            image: bozinImg,
            isSpeaker: false,
          },
          {
            text: `${bozinBrojka} ${operatorTransform} ${lidijaBrojka} = ?`,
            src: `/sounds/brojki-lidija/${lidijaBrojka}.m4a`,
            image: lidijaImg,
            isSpeaker: true,
          },
        ]
      : [
          {
            text: `${lidijaBrojka}`,
            src: `/sounds/brojki-lidija/${lidijaBrojka}.m4a`,
            image: lidijaImg,
            isSpeaker: true,
          },
          {
            text: `${lidijaBrojka} ${operatorTransform}`,
            src: `/sounds/operatori/${operatoriZvuk}.m4a`,
            image: lidijaImg,
            isSpeaker: false,
          },
          {
            text: `${lidijaBrojka} ${operatorTransform} ${bozinBrojka} = ?`,
            src: `/sounds/brojki-bozin/${bozinBrojka}.m4a`,
            image: bozinImg,
            isSpeaker: true,
          },
        ];

    for (const step of steps) {
      setCurrentText(step.text);
      setCurrentImage(step.image);

      if (step.isSpeaker) {
        setFinalImages((prev) =>
          prev.includes(step.image) ? prev : [...prev, step.image]
        );
      }

      const audio = new Audio(step.src);
      try {
        await audio.play();
      } catch (err) {
        console.warn("play failed", err);
      }

      await new Promise((resolve) => {
        audio.onended = resolve;
      });
    }

    setIsPlaying(false);
  };

  const imageStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    borderRadius: 12,
  };

  return (
    <div style={{ textAlign: "center", marginTop: 50, padding: 16 }}>
      {/* Title / Caption */}
      <h2
        style={{
          fontSize: "28px",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          flexWrap: "wrap", // wrap if very narrow
        }}
      >
        Аритметички квиз со Божин и Лидија{" "}
        <span style={{ color: "red" }}>❤️</span>
      </h2>

      {/* Current text */}
      <h1 style={{ fontSize: "36px", marginBottom: "24px" }}>{currentText}</h1>

      {/* Images */}
      <div
        style={{
          marginBottom: 30,
          display: "flex",
          gap: 12,
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap", // prevent stacking
          padding: 8,
          overflowX: "auto", // allow horizontal scroll if screen is too narrow
        }}
      >
        {finalImages.length === 2 ? (
          finalImages.map((img, index) => (
            <div
              key={index}
              style={{
                width: containerSize,
                height: containerSize,
                flex: "0 0 auto",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                borderRadius: 12,
                background: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <Image
                src={img}
                alt={`speaker-${index}`}
                width={containerSize}
                height={containerSize}
                style={imageStyle}
              />
            </div>
          ))
        ) : currentImage ? (
          <div
            style={{
              width: containerSize,
              height: containerSize,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              borderRadius: 12,
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <Image
              src={currentImage}
              alt="speaker"
              width={containerSize}
              height={containerSize}
              style={imageStyle}
            />
          </div>
        ) : (
          <div style={{ width: containerSize, height: containerSize }} />
        )}
      </div>

      {/* Button */}
      <button
        onClick={handleClick}
        disabled={isPlaying}
        style={{
          fontSize: "28px",
          padding: "20px 40px",
          borderRadius: "12px",
          cursor: isPlaying ? "not-allowed" : "pointer",
          opacity: isPlaying ? 0.6 : 1,
        }}
      >
        Генерирај
      </button>
    </div>
  );
}
