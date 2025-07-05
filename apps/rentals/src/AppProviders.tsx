import { Toaster } from "@/components/ui/toaster";

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
};

export default AppProviders;
