import type { PropsWithChildren, ReactNode } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps extends PropsWithChildren {
  header: ReactNode;
  toolbar?: ReactNode;
}

const Layout = ({ header, toolbar, children }: LayoutProps) => {
  return (
    <div className="flex h-screen bg-background text-text-primary">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="border-b border-border-subtle bg-white">
          <div className="flex flex-col px-8 py-6">
            {header}
            {toolbar}
          </div>
        </header>
        <main className="flex-1 overflow-hidden bg-background">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
