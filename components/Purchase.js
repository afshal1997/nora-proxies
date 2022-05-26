import React, { useEffect } from "react";
import PurchaseCard from "./PurchaseCard";

const Purchase = ({ products }) => {
  useEffect(() => {}, [products]);

  return (
    <div className="pricing-area home-intoduction">
      <div className="container">
        <div className="row mb-5">
          <div className="col-lg-12 text-center">
            <div className="area-title">
              <h3 className="gradient-text mt-lg-4 my-sm-2 fw-bold">PLANS AND PRICING</h3>
            </div>
          </div>
        </div>
        <div className="row">
          {products.length > 0
            ? products.map((product, i) => (
                <PurchaseCard key={i} product={product} />
              ))
            : ""}
        </div>
      </div>
    </div>
  );
};

export default Purchase;
