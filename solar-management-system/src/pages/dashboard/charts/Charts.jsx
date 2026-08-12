import "./Charts.css";

import ProductionChart from "../../../components/dashboard/charts/ProductionChart";
import BatteryChart from "../../../components/dashboard/charts/BatteryChart";
import BillChart from "../../../components/dashboard/charts/BillChart";
import AIChart from "../../../components/dashboard/charts/AIChart";

function Charts() {

    return (

        <section className="charts-page">

            <div className="charts-header">

                <h1>

                    Charts & Analytics

                </h1>

                <p>

                    Monitor solar production, battery health, WAPDA bills and AI analytics.

                </p>

            </div>

            <div className="charts-grid">

                <ProductionChart />

                <BatteryChart />

                <BillChart />

                <AIChart />

            </div>

        </section>

    );

}

export default Charts;