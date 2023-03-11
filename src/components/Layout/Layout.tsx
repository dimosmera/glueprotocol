import AppFooter from "components/AppFooter";
import AppHeader from "components/AppHeader";
import PageHead from "components/PageHead";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <PageHead />

      <AppHeader />

      {children}

      <AppFooter />
    </>
  );
};

export default Layout;
