import type { Metadata } from 'next';
import ThemeRegistry from './components/ThemeRegistry';
import ReduxProvider from './components/ReduxProvider';

export const metadata: Metadata = {
  title: 'Dynamic Data Table Manager',
  description: 'Next.js data table with Redux and Material UI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <ReduxProvider>
            {children}
          </ReduxProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
