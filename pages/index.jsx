import Head from "next/head";
import Header from "@components/Header";
import About from "@components/About";
import ProxyGenFeatures from "@components/ProxyGenFeatures";
import Purchase from "@components/Purchase";
import Footer from "@components/Footer";

const Index = ({ products }) => {
  return (
    <>
      <Head>
        <title>Nora Proxies - Home</title>
        <script src="https://embed.selly.io" />
      </Head>
      <div>
        <Header />
        <About />
        <Purchase products={products} />
        <ProxyGenFeatures />
        <Footer />
      </div>
    </>
  );
};

export const getServerSideProps = async () => {
  const products = require("../products.json");

  return {
    props: {
      products,
    },
  };
};

export default Index;
