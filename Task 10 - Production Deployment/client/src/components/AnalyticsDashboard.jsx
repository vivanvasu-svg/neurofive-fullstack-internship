import { useState, useMemo } from 'react';
import styles from './AnalyticsDashboard.module.css';

function AnalyticsDashboard({ orders = [], coffees = [] }) {
    // 1. Filter state
    const [selectedCategory, setSelectedCategory] = useState('All');

    // 2. Map coffee names to their category for aggregation lookup
    const coffeeCategoryMap = useMemo(() => {
        const map = {};
        coffees.forEach((c) => {
            map[c.name.toLowerCase()] = c.category;
        });
        return map;
    }, [coffees]);

    const getCoffeeCategory = (coffeeName) => {
        return coffeeCategoryMap[coffeeName.toLowerCase()] || 'Specialty Brew';
    };

    // Get list of unique categories actually present in the menu
    const categoryOptions = useMemo(() => {
        const categories = new Set(coffees.map((c) => c.category));
        return ['All', ...Array.from(categories)];
    }, [coffees]);

    // 3. Filter orders based on category dropdown selection
    const filteredOrders = useMemo(() => {
        if (selectedCategory === 'All') return orders;
        return orders.filter(
            (o) => getCoffeeCategory(o.coffeeName) === selectedCategory
        );
    }, [orders, selectedCategory, coffeeCategoryMap]);

    // 4. Aggregations & Metrics
    const metrics = useMemo(() => {
        const totalOrders = filteredOrders.length;
        const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.totalPrice, 0);
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const completedCount = filteredOrders.filter((o) => o.status === 'completed').length;
        const pendingCount = totalOrders - completedCount;

        return {
            totalOrders,
            totalRevenue,
            avgOrderValue,
            completedCount,
            pendingCount,
        };
    }, [filteredOrders]);

    // 5. Data Chart 1: Revenue by Category (Bar Chart Data)
    const categoryChartData = useMemo(() => {
        const sums = {};
        // Initialize sums with categories to ensure all visual groups appear
        coffees.forEach((c) => {
            sums[c.category] = 0;
        });

        // Filter and aggregate orders
        filteredOrders.forEach((o) => {
            const cat = getCoffeeCategory(o.coffeeName);
            sums[cat] = (sums[cat] || 0) + o.totalPrice;
        });

        const dataArray = Object.keys(sums).map((cat) => ({
            category: cat,
            value: sums[cat],
        }));

        const maxVal = Math.max(...dataArray.map((d) => d.value), 1);

        return dataArray.map((d) => ({
            ...d,
            percentage: (d.value / maxVal) * 100,
        }));
    }, [filteredOrders, coffees, coffeeCategoryMap]);

    // 6. Data Chart 2: Daily Sales Timeline (Line Chart Data)
    const dailyChartData = useMemo(() => {
        const dailyMap = {};
        const dateRepresentationMap = {};

        filteredOrders.forEach((o) => {
            const dateObj = new Date(o.createdAt);
            const dateStr = dateObj.toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
            });
            dailyMap[dateStr] = (dailyMap[dateStr] || 0) + o.totalPrice;

            const timestamp = dateObj.getTime();
            if (!dateRepresentationMap[dateStr] || timestamp < dateRepresentationMap[dateStr]) {
                dateRepresentationMap[dateStr] = timestamp;
            }
        });

        // Get chronological unique list of dates based on their representative timestamps
        const sortedDates = Object.keys(dailyMap).sort((a, b) => {
            return dateRepresentationMap[a] - dateRepresentationMap[b];
        });

        const data = sortedDates.map((date) => ({
            date,
            value: dailyMap[date],
        }));

        const maxVal = Math.max(...data.map((d) => d.value), 1);

        return {
            points: data,
            maxVal,
        };
    }, [filteredOrders]);

    // Render helper for line chart path
    const lineChartPath = useMemo(() => {
        const pts = dailyChartData.points;
        if (pts.length < 2) return '';

        const width = 500;
        const height = 150;
        const padding = 25;
        const maxVal = dailyChartData.maxVal;

        const deltaX = (width - padding * 2) / (pts.length - 1);

        return pts.map((pt, i) => {
            const x = padding + i * deltaX;
            const y = height - padding - (pt.value / maxVal) * (height - padding * 2);
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');
    }, [dailyChartData]);

    const areaChartPath = useMemo(() => {
        const path = lineChartPath;
        if (!path) return '';
        const width = 500;
        const height = 150;
        const padding = 25;
        const pts = dailyChartData.points;
        const deltaX = (width - padding * 2) / (pts.length - 1);
        const lastX = padding + (pts.length - 1) * deltaX;

        return `${path} L ${lastX} ${height - padding} L ${padding} ${height - padding} Z`;
    }, [lineChartPath, dailyChartData]);

    // Donut configuration
    const donutPercentage = useMemo(() => {
        const total = metrics.totalOrders;
        if (total === 0) return 0;
        return (metrics.completedCount / total) * 100;
    }, [metrics]);

    const circumference = 2 * Math.PI * 35; // r = 35 -> 219.9
    const strokeDashoffset = circumference - (circumference * donutPercentage) / 100;

    return (
        <div className={styles.dashboard}>
            {/* Filter Section */}
            <div className={styles.controlsRow}>
                <h3 className={styles.sectionHeader}>Analytics Summary</h3>
                <div className={styles.filterGroup}>
                    <label htmlFor="category-filter" className={styles.filterLabel}>
                        Coffee Category Filter:
                    </label>
                    <select
                        id="category-filter"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className={styles.filterDropdown}
                    >
                        {categoryOptions.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Stat Cards */}
            <div className={styles.metricsGrid}>
                <div className={styles.statCard}>
                    <span className={styles.statIcon}>💰</span>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Total Sales</span>
                        <h4 className={styles.statValue}>${metrics.totalRevenue.toFixed(2)}</h4>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <span className={styles.statIcon}>📥</span>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Orders volume</span>
                        <h4 className={styles.statValue}>{metrics.totalOrders}</h4>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <span className={styles.statIcon}>📈</span>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Average Ticket</span>
                        <h4 className={styles.statValue}>${metrics.avgOrderValue.toFixed(2)}</h4>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <span className={styles.statIcon}>☕</span>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Catalog Size</span>
                        <h4 className={styles.statValue}>{coffees.length} Items</h4>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className={styles.chartsGrid}>
                {/* 1. Bar Chart: Revenue by Category */}
                <div className={styles.chartCard}>
                    <h4 className={styles.chartTitle}>Revenue Breakdown ($)</h4>
                    <div className={styles.barChartContainer}>
                        {categoryChartData.map((d) => (
                            <div key={d.category} className={styles.barRow}>
                                <div className={styles.barLabel}>{d.category}</div>
                                <div className={styles.barTrack}>
                                    <div
                                        className={styles.barFill}
                                        style={{ width: `${d.percentage}%` }}
                                    ></div>
                                </div>
                                <div className={styles.barValue}>${d.value.toFixed(2)}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Line Chart: Daily Volume */}
                <div className={styles.chartCard}>
                    <h4 className={styles.chartTitle}>Sales Timeline Trends ($)</h4>
                    {dailyChartData.points.length < 2 ? (
                        <div className={styles.emptyChart}>
                            <span>Not enough chronological data points to plot timeline trend.</span>
                        </div>
                    ) : (
                        <div className={styles.svgContainer}>
                            <svg className={styles.lineChartSvg} viewBox="0 0 500 150" width="100%" height="150" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="var(--color-secondary, #c89b6d)" stopOpacity="0.4" />
                                        <stop offset="100%" stopColor="var(--color-secondary, #c89b6d)" stopOpacity="0.0" />
                                    </linearGradient>
                                </defs>
                                {/* Grid ticks */}
                                <line x1="25" y1="25" x2="475" y2="25" stroke="rgba(111, 78, 55, 0.1)" strokeDasharray="3" />
                                <line x1="25" y1="75" x2="475" y2="75" stroke="rgba(111, 78, 55, 0.1)" strokeDasharray="3" />
                                <line x1="25" y1="125" x2="475" y2="125" stroke="rgba(111, 78, 55, 0.15)" />

                                {/* Area */}
                                <path d={areaChartPath} fill="url(#areaGradient)" />
                                {/* Line */}
                                <path d={lineChartPath} fill="none" stroke="var(--color-secondary, #c89b6d)" strokeWidth="3" strokeLinecap="round" />

                                {/* Interactive Data Nodes */}
                                {dailyChartData.points.map((pt, i) => {
                                    const width = 500;
                                    const height = 150;
                                    const padding = 25;
                                    const deltaX = (width - padding * 2) / (dailyChartData.points.length - 1);
                                    const x = padding + i * deltaX;
                                    const y = height - padding - (pt.value / dailyChartData.maxVal) * (height - padding * 2);

                                    return (
                                        <g key={`dot-${pt.date}-${i}`} className={styles.dotGroup}>
                                            <circle cx={x} cy={y} r="5" fill="var(--color-primary-dark, #543a29)" stroke="#ffffff" strokeWidth="2" />
                                            <text x={x} y={y - 10} textAnchor="middle" className={styles.nodeVal} fontSize="10">
                                                ${pt.value.toFixed(0)}
                                            </text>
                                            <text x={x} y={height - 5} textAnchor="middle" className={styles.axisLabel} fontSize="9">
                                                {pt.date}
                                            </text>
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                    )}
                </div>

                {/* 3. Donut Chart: Completion Status Ratio */}
                <div className={styles.chartCard}>
                    <h4 className={styles.chartTitle}>Completion Delivery Ratios</h4>
                    {metrics.totalOrders === 0 ? (
                        <div className={styles.emptyChart}>
                            <span>No orders placed inside this category.</span>
                        </div>
                    ) : (
                        <div className={styles.donutLayout}>
                            <div className={styles.donutSvgWrapper}>
                                <svg width="120" height="120" viewBox="0 0 100 100">
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="35"
                                        fill="transparent"
                                        stroke="rgba(111, 78, 55, 0.1)"
                                        strokeWidth="10"
                                    />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="35"
                                        fill="transparent"
                                        stroke="var(--color-secondary, #c89b6d)"
                                        strokeWidth="10"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={strokeDashoffset}
                                        strokeLinecap="round"
                                        transform="rotate(-90 50 50)"
                                        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                                    />
                                    <text x="50%" y="54%" textAnchor="middle" className={styles.donutCenter}>
                                        {donutPercentage.toFixed(0)}%
                                    </text>
                                </svg>
                            </div>
                            <div className={styles.donutLegend}>
                                <div className={styles.legendItem}>
                                    <span className={`${styles.dot} ${styles.dotCompleted}`}></span>
                                    <div className={styles.legendText}>
                                        <span>Completed</span>
                                        <strong>{metrics.completedCount} Orders</strong>
                                    </div>
                                </div>
                                <div className={styles.legendItem}>
                                    <span className={`${styles.dot} ${styles.dotPending}`}></span>
                                    <div className={styles.legendText}>
                                        <span>Pending</span>
                                        <strong>{metrics.pendingCount} Orders</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AnalyticsDashboard;
