import "./globals.css";

export const metadata = {
  title: "Avais Ahmed Mehdi | Full Stack Developer & CS Student Portfolio",
  description: "Portfolio of Avais Ahmed Mehdi - B.Sc. Computer Science student, Full Stack Developer, specializing in React, Node.js, and modern web applications.",
  keywords: ["Avais Ahmed Mehdi", "Full Stack Developer", "Portfolio", "MERN Stack", "Urdu University Karachi", "Web Developer Karachi", "React Developer"],
  authors: [{ name: "Avais Ahmed Mehdi" }],
  creator: "Avais Ahmed Mehdi",
  openGraph: {
    title: "Avais Ahmed Mehdi | Full Stack Portfolio",
    description: "Personal portfolio website of Avais Ahmed Mehdi, showcasing skills, timeline, and web development projects.",
    url: "https://github.com/avais0",
    siteName: "Avais Ahmed Mehdi Portfolio",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
