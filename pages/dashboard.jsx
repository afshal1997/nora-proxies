import Dashboard from "@components/Dashboard";
import Head from "next/head";

const UserDashboard = ({ products, proCountries, eliteCountries }) => {
  return (
    <>
      <Head>
        <title>Nora Proxies - Dashboard</title>
      </Head>
      <Dashboard
        products={products}
        proCountries={proCountries}
        eliteCountries={eliteCountries}
      />
    </>
  );
};

export const getServerSideProps = async () => {
  const products = require("../products.json");
  const proCountries = require("../proCountries.json");
  const eliteCountries = require("../eliteCounties.json");

  return {
    props: {
      products,
      proCountries,
      eliteCountries,
    },
    //revalidate: 3600, // every hour
  };
};

export default UserDashboard;
