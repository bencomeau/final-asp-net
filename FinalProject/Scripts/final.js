const COLORS = {
    RED: 'rgba(255, 99, 132, 1)',
    RED_OPAQUE: 'rgba(255, 99, 132, 0.2',
    BLUE: 'rgba(54, 162, 235, 1)',
    BLUE_OPAQUE: 'rgba(54, 162, 235, 0.2)'
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

    const successEl = document.getElementById('queryOneMessage');
    const errorEl = document.getElementById('queryOneError');
    const year = new FormData(ev.target).get('year')

    
});

document.getElementById('queryTwo').addEventListener('submit', async ev => {
    ev.preventDefault();

    const errorEl = document.getElementById('queryTwoError');

    try {
        const { data } = await getData('api/queries/two');

        if (data) {
            const ctx = document.getElementById('queryTwoGraph').getContext('2d');

            const chartData = {
                labels: data.map(d => d.reportDate),
                datasets: [
                    {
                        label: 'DOW Open',
                        data: data.map(d => Math.round(d.dowOpen)),
                        backgroundColor: COLORS.RED,
                        borderColor: COLORS.RED_OPAQUE,
                        trends: data.map(d => d.dowTrend.trim())
                    },
                    {
                        label: 'DOW Close',
                        data: data.map(d => Math.round(d.dowClose)),
                        backgroundColor: COLORS.BLUE,
                        borderColor: COLORS.BLUE_OPAQUE
                    }
                ]
            };

            new Chart(ctx, {
                type: 'line',
                data: chartData,
                options: {
                    interaction: {
                        intersect: false,
                        mode: 'index',
                    },
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
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

            errorEl.style.visibility = 'hidden';
        } else {
            
            errorEl.style.visibility = 'visible';
        }
    } catch (e) {
        
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
            const ctx = document.getElementById('queryThreeGraph').getContext('2d');
            data.map(d => {
                console.log(d.dowOpen, d.dowClose, d.dowClose - d.dowOpen)
            })

            const chartData = {
                labels: data.map(d => d.reportDate),
                datasets: [
                    {
                        label: 'DOW Interval',
                        data: data.map(d => d.dowClose - d.dowOpen),
                        backgroundColor: COLORS.RED,
                        borderColor: COLORS.RED_OPAQUE
                    },
                ]
            };

            new Chart(ctx, {
                type: 'bar',
                data: chartData,
                options: {
                    interaction: {
                        intersect: false,
                        mode: 'index',
                    },
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: `ADI ${trend} trend with DOW interval value`
                        },
                        legend: {
                            position: 'top'
                        },
                    },
                }
            });

            errorEl.style.visibility = 'hidden';
        } else {

            errorEl.style.visibility = 'visible';
        }
    } catch (e) {

        errorEl.style.visibility = 'visible';
    }
});