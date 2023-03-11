import PageHead from "components/PageHead";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <PageHead />

      {children}
    </>
  );
};

export default Layout;
