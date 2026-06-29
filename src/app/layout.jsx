import '../index.css';
import '../App.css';

export const metadata = {
  title: 'Hotel Arca | Luxury Beachfront Resort in Indonesia',
  description: "Experience premium luxury beachfront lodging at Hotel Arca. Featuring private pool villas, infinity swimming pools, local spa wellness, and world-class dining overlooking the turquoise sea.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
}
