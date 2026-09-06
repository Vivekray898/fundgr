'use client';

export function SingleProductCharging() {
  return (
    <section className="spch-section">
      <div className="container-main">
        <div className="spch-heading">
          <h2 className="spch-title">Charges fast And lasts</h2>
          <p className="spch-body">
            Power for hours with a smaller, more capable case.The streamlined charging case6 is more than 10
            percent smaller by volume than the previous generation,7 with no sacrifice to charging times. And
            AirPods 4 with Active Noise Cancellation feature a wireless charging case — the smallest in the industry
            with this capability — as well as a built-in speaker for Find My8 to help you keep track of it.
          </p>
        </div>
      </div>

      <style jsx>{`
        .spch-section {
          padding: 0;
          background: #fff;
        }
        .spch-heading {
          text-align: center;
          max-width: 780px;
          margin: 0 auto;
        }
        .spch-title {
          font-size: 32px;
          font-weight: 700;
          color: #111;
          margin: 0 0 22px;
        }
        .spch-body {
          font-size: 16px;
          color: rgb(17 17 17 / 75%);
          line-height: 1.75;
          margin: 0;
          text-align: center;
        }
      `}</style>
    </section>
  );
}
