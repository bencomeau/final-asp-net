const COLORS = {
    RED: 'rgba(255, 99, 132, 1)',
    RED_OPAQUE: 'rgba(255, 99, 132, 0.2',
    BLUE: 'rgba(54, 162, 235, 1)',
    BLUE_OPAQUE: 'rgba(54, 162, 235, 0.2)',
    PURPLE: 'rgb(153, 102, 255)',
    PURPLE_OPAQUE: 'rgb(153, 102, 255, 0.2)'
};

async function getData(url = '') {
    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
    });

    return response.json();
}

// Define the canvas chart instances
const queryOneCtx = document.getElementById('queryOneGraph').getContext('2d');
const queryOneChart = new Chart(queryOneCtx, {
    type: 'line',
    data: {},
    options: {
        interaction: {
            intersect: false,
            mode: 'index',
        },
        stacked: false,
        responsive: true,
        scales: {
            y: {
                type: 'linear',
                display: false,
                position: 'left',
            },
            y1: {
                type: 'linear',
                display: false,
                position: 'right',
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
        plugins: {
            title: {
                display: true,
                text: ''
            },
            legend: {
                position: 'top'
            },
            tooltip: {
                callbacks: {
                    footer: (tooltipItems) =>
                        `DOW Closing Direction: ${tooltipItems[0].dataset.closingDirections[tooltipItems[0].dataIndex] ? 'Up' : 'Down'}`
                }
            },
        },
    }
});

const queryTwoCtx = document.getElementById('queryTwoGraph').getContext('2d');
const queryTwoChart = new Chart(queryTwoCtx, {
    type: 'line',
    data: {},
    options: {
        interaction: {
            intersect: false,
            mode: 'index',
        },
        responsive: true,
        plugins: {
            title: {
                display: false,
                text: 'Open and Close values of the DOW with ADI trends'
            },
            legend: {
                position: 'top'
            },
            tooltip: {
                callbacks: {
                    footer: (tooltipItems) =>
                        `ADI Trend: ${tooltipItems[0].dataset.trends[tooltipItems[0].dataIndex]}`
                }
            }
        },
    }
});

const queryThreeCtx = document.getElementById('queryThreeGraph').getContext('2d');
const queryThreeChart = new Chart(queryThreeCtx, {
    type: 'bar',
    data: {},
    options: {
        interaction: {
            intersect: false,
            mode: 'index',
        },
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: ''
            },
            legend: {
                position: 'top'
            },
        },
    }
});

window.addEventListener('load', () => {
    // Request trends
    populateSelect('queryThreeSelect', 'queries/adi');
});

/**
 * Populates the select options of the given select ID.
 * 
 * @param {string} selectId - The DOM ID of the select to populate with options.
 * @param {string} endpoint - The name of the endpoint to call.
 */
const populateSelect = async (selectId, endpoint) => {
    const { data } = await getData(`api/${endpoint}`);

    if (Array.isArray(data)) {
        const select = document.getElementById(selectId);

        for (const item of data) {
            select.options[select.options.length] = new Option(item.trend);
        }
    }
}

document.getElementById('queryOne').addEventListener('submit', async ev => {
    ev.preventDefault();

    const errorEl = document.getElementById('queryOneError');
    const year = new FormData(ev.target).get('year')

    try {
        const { data } = await getData(`api/queries/one?year=${year}`);

        if (data) {
            const filteredData = data.filter(({ dowOpen, dowClose }) => dowOpen && dowClose);
            const closingDirections = filteredData.map(({ dowClosedHigher }) => dowClosedHigher);

            const chartData = {
                labels: filteredData.map(({ reportDate }) => reportDate),
                datasets: [
                    {
                        label: 'Dow Open',
                        data: filteredData.map(({ dowOpen }) => Math.round(dowOpen)),
                        backgroundColor: COLORS.RED,
                        borderColor: COLORS.RED_OPAQUE,
                        closingDirections,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Dow Close',
                        data: filteredData.map(({ dowClose }) => Math.round(dowClose)),
                        backgroundColor: COLORS.BLUE,
                        borderColor: COLORS.BLUE_OPAQUE,
                        closingDirections,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Unemployment Rate',
                        data: data.map(({ unemploymentRate }) => unemploymentRate),
                        backgroundColor: COLORS.PURPLE,
                        borderColor: COLORS.PURPLE_OPAQUE,
                        closingDirections,
                        yAxisID: 'y1'
                    }
                ]
            };

            queryOneChart.data = chartData;
            queryOneChart.options.scales.y.display = true;
            queryOneChart.options.scales.y1.display = true;
            queryOneChart.options.plugins.title.text = `Dow Open and Close with Unemployment Rate Overlay Starting ${year}`;
            queryOneChart.update();

            errorEl.style.visibility = 'hidden';
        } else {

            errorEl.style.visibility = 'visible';
        }
    } catch (e) {
        console.error(e)
        errorEl.style.visibility = 'visible';
    }    
});

document.getElementById('queryTwo').addEventListener('submit', async ev => {
    ev.preventDefault();

    const errorEl = document.getElementById('queryTwoError');

    try {
        const { data } = await getData('api/queries/two');

        if (data) {
            const trends = data.map(({ dowTrend }) => dowTrend.trim());
            const chartData = {
                labels: data.map(({ reportDate }) => reportDate),
                datasets: [
                    {
                        label: 'Dow Open',
                        data: data.map(({ dowOpen }) => Math.round(dowOpen)),
                        backgroundColor: COLORS.RED,
                        borderColor: COLORS.RED_OPAQUE,
                        trends
                    },
                    {
                        label: 'Dow Close',
                        data: data.map(({ dowClose }) => Math.round(dowClose)),
                        backgroundColor: COLORS.BLUE,
                        borderColor: COLORS.BLUE_OPAQUE,
                        trends
                    }
                ]
            };

            queryTwoChart.data = chartData;
            queryTwoChart.options.plugins.title.display = true;
            queryTwoChart.update();

            errorEl.style.visibility = 'hidden';
        } else {
            
            errorEl.style.visibility = 'visible';
        }
    } catch (e) {
        console.log(e);
        errorEl.style.visibility = 'visible';
    }
});

document.getElementById('queryThree').addEventListener('submit', async ev => {
    ev.preventDefault();

    const errorEl = document.getElementById('queryThreeError');
    const trend = new FormData(ev.target).get('trend')

    try {
        const { data } = await getData(`api/queries/three?trend=${trend}`);

        if (data) {
            const chartData = {
                labels: data.map(({ reportDate }) => reportDate),
                datasets: [
                    {
                        label: 'Dow Interval',
                        data: data.map(({ dowClose, dowOpen }) => dowClose - dowOpen),
                        backgroundColor: COLORS.RED,
                        borderColor: COLORS.RED_OPAQUE
                    },
                ]
            };

            queryThreeChart.data = chartData;
            queryThreeChart.options.plugins.title.text = `ADX ${trend} trend with Dow interval value`;
            queryThreeChart.update();

            errorEl.style.visibility = 'hidden';
        } else {

            errorEl.style.visibility = 'visible';
        }
    } catch (e) {
        console.error(e)
        errorEl.style.visibility = 'visible';
    }
});