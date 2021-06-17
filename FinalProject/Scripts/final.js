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

//window.addEventListener('load', () => {
//    // Request employees and stores
//    populateSelect('employeeSelect', 'employees');
//    populateSelect('storeSelect', 'stores');
//});

/**
 * Populates the select options of the given select ID.
 * 
 * @param {string} selectId - The DOM ID of the select to populate with options.
 * @param {string} controllerName - The name of the controller to call.
 */
const populateSelect = async (selectId, controllerName) => {
    const { data } = await getData(`api/${controllerName}`);

    if (Array.isArray(data)) {
        const select = document.getElementById(selectId);

        for (const item of data) {
            select.options[select.options.length] = new Option(item);
        }
    }
}

//document.getElementById('getMarkups').addEventListener('click', async ev => {

//    const successEl = document.getElementById('markupsMessage');
//    const errorEl = document.getElementById('markupsError');

//    try {
//        const { stores } = await getData(`api/markups`);

//        if (stores) {
//            // Clear the previous list items so we don't continue
//            // to get duplicates with each click of the button.
//            successEl.innerHTML = '';
//            stores.forEach(function (store) {
//                const li = document.createElement('li');
//                li.innerHTML = "City: " + store.city + ", Count: " + store.total;
//                successEl.appendChild(li);
//            });
//            successEl.style.visibility = 'visible';
//            errorEl.style.visibility = 'hidden';
//        } else {
//            successEl.style.visibility = 'hidden';
//            errorEl.style.visibility = 'visible';
//        }
//    } catch (e) {
//        successEl.style.visibility = 'hidden';
//        errorEl.style.visibility = 'visible';
//    }
//});

document.getElementById('queryOne').addEventListener('submit', async ev => {
    ev.preventDefault();

    const successEl = document.getElementById('queryOneMessage');
    const errorEl = document.getElementById('queryOneError');
    const year = new FormData(ev.target).get('year')

    try {
        const data = await getData(`api/queries/one?year=${year}`);

        if (data) {
            //document.getElementById('employeePerformanceAmount').innerHTML = sum;
            successEl.style.visibility = 'visible';
            errorEl.style.visibility = 'hidden';
        } else {
            successEl.style.visibility = 'hidden';
            errorEl.style.visibility = 'visible';
        }
    } catch (e) {
        successEl.style.visibility = 'hidden';
        errorEl.style.visibility = 'visible';
    }
});

//document.getElementById('storePerformance').addEventListener('submit', async ev => {
//    ev.preventDefault();

//    const successEl = document.getElementById('storePerformanceMessage');
//    const errorEl = document.getElementById('storeError');
//    const city = new FormData(ev.target).get('store');

//    try {
//        const { sum } = await getData(`api/stores?city=${city}`);

//        if (sum) {
//            document.getElementById('storePerformanceAmount').innerHTML = sum;
//            successEl.style.visibility = 'visible';
//            errorEl.style.visibility = 'hidden';
//        } else {

//            successEl.style.visibility = 'hidden';
//            errorEl.style.visibility = 'visible';
//        }
//    } catch (e) {
//        successEl.style.visibility = 'hidden';
//        errorEl.style.visibility = 'visible';
//    }
//});